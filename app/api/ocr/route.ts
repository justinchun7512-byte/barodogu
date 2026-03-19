import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 30;

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60000 });
    return false;
  }
  entry.count++;
  return entry.count > 10;
}

const SYSTEM_PROMPT = `당신은 채용공고 이미지에서 텍스트를 추출하는 전문가입니다.

이미지에서 채용공고 내용을 정확하게 읽어서 아래 JSON 형식으로 구분하여 추출해주세요.
이미지에 있는 텍스트를 최대한 정확하게, 빠짐없이 추출하세요.

응답 형식 (반드시 JSON으로만 응답):
{
  "jdTasks": "업무내용/주요업무 텍스트 (없으면 빈 문자열)",
  "jdRequirements": "자격요건/필수요건 텍스트 (없으면 빈 문자열)",
  "jdPreferred": "우대사항 텍스트 (없으면 빈 문자열)",
  "jdCulture": "인재상/기업문화 텍스트 (없으면 빈 문자열)"
}

구분이 명확하지 않은 경우:
- 업무/직무 관련 → jdTasks
- 경력/학력/자격 요건 → jdRequirements
- 우대/가산점 → jdPreferred
- 기업문화/인재상/복지 → jdCulture
- 나머지 텍스트 → jdTasks에 포함`;

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: '요청이 너무 많습니다. 1분 후 다시 시도해주세요.' }, { status: 429 });
    }

    const { image } = await request.json();

    if (!image || typeof image !== 'string') {
      return NextResponse.json({ error: '이미지 데이터가 없습니다.' }, { status: 400 });
    }

    // base64 이미지에서 data URL prefix 제거
    const base64Data = image.includes(',') ? image.split(',')[1] : image;
    const mimeMatch = image.match(/data:(image\/\w+);/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.2-90b-vision-preview',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: [
              { type: 'text', text: '이 채용공고 이미지에서 텍스트를 추출해주세요. JSON 형식으로만 응답해주세요.' },
              { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64Data}` } },
            ],
          },
        ],
        temperature: 0.1,
        max_tokens: 4096,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Groq Vision API error:', res.status, errText);
      return NextResponse.json({ error: 'AI 이미지 인식 서비스에 문제가 발생했습니다.' }, { status: 502 });
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || '';

    // JSON 파싱 시도
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return NextResponse.json({
          jdTasks: parsed.jdTasks || '',
          jdRequirements: parsed.jdRequirements || '',
          jdPreferred: parsed.jdPreferred || '',
          jdCulture: parsed.jdCulture || '',
        });
      }
    } catch {
      // JSON 파싱 실패 시 전체 텍스트를 jdTasks에 넣기
    }

    return NextResponse.json({
      jdTasks: content,
      jdRequirements: '',
      jdPreferred: '',
      jdCulture: '',
    });
  } catch (error) {
    console.error('OCR API error:', error);
    return NextResponse.json({ error: '이미지 처리 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
