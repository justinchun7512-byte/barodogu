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

const SYSTEM_PROMPT = `당신은 한국어 맞춤법/문법 검사 전문가입니다.

## 언어 규칙 (최우선 - 반드시 준수)
- 모든 응답은 반드시 한국어(한글)로만 작성합니다.
- 한자(漢字) 절대 금지: 利益(X) → 이익(O), 構築(X) → 구축(O)
- 영어 혼용 금지: process(X) → 프로세스(O), communication(X) → 커뮤니케이션(O)
- 고유명사(회사명, 기술명 등)만 영어 허용: React, Excel, SQL 등
- 일본어, 중국어 문자 사용 금지

사용자가 입력한 텍스트의 맞춤법과 문법 오류를 찾아 교정해주세요.

응답 규칙:
1. 반드시 JSON 형식으로만 응답하세요.
2. 오류가 없으면 빈 배열을 반환하세요.
3. 각 교정 항목에는 원본(original), 교정(corrected), 이유(reason)를 포함하세요.
4. 띄어쓰기, 맞춤법, 문법, 조사 사용 등을 모두 검사하세요.
5. 문맥상 어색한 표현도 지적해주세요.

응답 형식:
{
  "corrections": [
    { "original": "틀린 부분", "corrected": "올바른 표현", "reason": "교정 이유" }
  ]
}`;

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: '요청이 너무 많습니다. 1분 후 다시 시도해주세요.' }, { status: 429 });
    }

    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ corrections: [] });
    }

    if (text.length > 2000) {
      return NextResponse.json({ error: '텍스트는 2,000자 이내로 입력해주세요.' }, { status: 400 });
    }

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `다음 텍스트의 맞춤법과 문법을 검사해주세요. JSON으로만 응답:\n\n${text}` },
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' },
      }),
    });

    if (!res.ok) {
      // AI 실패 시 기본 룰 기반 폴백
      return NextResponse.json({ corrections: fallbackCheck(text) });
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || '';

    try {
      const parsed = JSON.parse(content);
      return NextResponse.json({ corrections: parsed.corrections || [] });
    } catch {
      return NextResponse.json({ corrections: fallbackCheck(text) });
    }
  } catch {
    return NextResponse.json({ corrections: [] }, { status: 500 });
  }
}

// AI 실패 시 기본 룰 기반 폴백
function fallbackCheck(text: string) {
  const RULES: [RegExp, string, string][] = [
    [/되요/g, '돼요', '"되요"는 "돼요"가 올바른 표현이에요'],
    [/됬/g, '됐', '"됬"은 "됐"이 올바른 표현이에요'],
    [/안되/g, '안 되', '"안되"는 "안 되"로 띄어 써야 해요'],
    [/몇일/g, '며칠', '"몇일"은 "며칠"이 올바른 표현이에요'],
    [/할께/g, '할게', '"할께"는 "할게"가 올바른 표현이에요'],
    [/금새/g, '금세', '"금새"는 "금세"가 올바른 표현이에요'],
    [/일일히/g, '일일이', '"일일히"는 "일일이"가 올바른 표현이에요'],
    [/어의없/g, '어이없', '"어의없"은 "어이없"이 올바른 표현이에요'],
    [/깨끗히/g, '깨끗이', '"깨끗히"는 "깨끗이"가 올바른 표현이에요'],
    [/바램/g, '바람', '"바램"은 "바람"이 올바른 표현이에요'],
    [/설래/g, '설레', '"설래"는 "설레"가 올바른 표현이에요'],
    [/왠지/g, '웬지', '"왠지"는 "웬지"가 올바른 표현이에요 (왜인지의 줄임은 "왜인지")'],
  ];

  const corrections: { original: string; corrected: string; reason: string }[] = [];
  for (const [pattern, replacement, reason] of RULES) {
    const regex = new RegExp(pattern.source, 'g');
    let match;
    while ((match = regex.exec(text)) !== null) {
      corrections.push({ original: match[0], corrected: replacement, reason });
    }
  }
  return corrections;
}
