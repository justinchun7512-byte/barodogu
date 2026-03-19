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

const SIMPLE_PROMPT = `이미지에서 텍스트를 정확하게 읽어서 그대로 출력해주세요.
- 이미지에 있는 모든 텍스트를 빠짐없이 추출하세요.
- 줄바꿈과 구조를 최대한 유지하세요.
- JSON이 아닌 일반 텍스트로만 응답하세요.
- 추가 설명이나 해석 없이 이미지 속 텍스트만 출력하세요.`;

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
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [
          { role: 'system', content: SIMPLE_PROMPT },
          {
            role: 'user',
            content: [
              { type: 'text', text: '이 이미지에서 텍스트를 정확하게 읽어주세요.' },
              { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64Data}` } },
            ],
          },
        ],
        temperature: 0.1,
        max_tokens: 4096,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error('Groq Vision API error:', res.status, errBody);
      let detail = '';
      try { detail = JSON.parse(errBody)?.error?.message || errBody.slice(0, 200); } catch { detail = errBody.slice(0, 200); }
      return NextResponse.json({ error: `Groq API ${res.status}: ${detail}` }, { status: 502 });
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content?.trim() || '';

    if (!text) {
      return NextResponse.json({ error: '이미지에서 텍스트를 추출하지 못했습니다.' }, { status: 400 });
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error('OCR API error:', error);
    return NextResponse.json({ error: '이미지 처리 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
