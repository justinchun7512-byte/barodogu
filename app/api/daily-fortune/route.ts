import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

const SYSTEM_PROMPT = `당신은 30년 경력의 운세 전문가입니다. 사용자의 생년월일을 바탕으로 오늘의 운세를 재미있고 구체적으로 알려줍니다.

## 언어 규칙 (최우선)
- 모든 응답은 반드시 한국어(한글)로만 작성합니다.
- 한자, 영어 혼용 금지. 고유명사만 예외.
- 친근하고 따뜻한 어조로 작성합니다.

## 운세 작성 원칙
- 긍정적이고 건설적인 내용 위주 (부정적 내용은 조언 형태로 전환)
- 구체적인 상황 묘사 포함 (추상적 표현 금지)
- 각 운세는 2~3문장으로 작성
- 행운의 숫자는 1~45 범위, 색상은 한국어로

## 응답 형식 (반드시 JSON)
{
  "overall": "총운 (오늘 하루 전체 흐름, 2~3문장)",
  "money": "재운 (금전/투자/쇼핑 관련, 2~3문장)",
  "love": "애정운 (연애/인간관계 관련, 2~3문장)",
  "health": "건강운 (컨디션/운동/식단 관련, 2~3문장)",
  "luckyNumber": 행운의 숫자 (정수),
  "luckyColor": "행운의 색상 (한국어)",
  "advice": "오늘의 한마디 조언 (짧고 인상적인 한 문장)",
  "score": 오늘의 운세 점수 (60~99 범위 정수)
}`;

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "요청이 너무 많습니다. 1분 후 다시 시도해주세요." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { birthDate, name } = body;

    if (!birthDate) {
      return NextResponse.json(
        { error: "생년월일을 입력해주세요." },
        { status: 400 }
      );
    }

    const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });

    const userMessage = `오늘 날짜: ${today}
생년월일: ${birthDate}
${name ? `이름: ${name}` : ''}

위 정보를 바탕으로 오늘의 운세를 알려주세요. 반드시 JSON 형식으로만 응답해주세요.`;

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "AI 서비스가 설정되지 않았습니다." },
        { status: 503 }
      );
    }

    const models = ["llama-3.3-70b-versatile", "llama-3.1-70b-versatile"];
    let res: Response | null = null;

    for (const model of models) {
      res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userMessage },
          ],
          temperature: 0.9,
          response_format: { type: "json_object" },
        }),
      });

      if (res.ok) break;
      console.error(`Groq API error (${model}):`, res.status);
    }

    if (!res || !res.ok) {
      return NextResponse.json(
        { error: "AI 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요." },
        { status: 502 }
      );
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: "AI 응답이 비어있습니다." }, { status: 500 });
    }

    const parsed = JSON.parse(content);

    if (!parsed.overall || !parsed.money || !parsed.love || !parsed.health) {
      return NextResponse.json({ error: "AI 응답 형식이 올바르지 않습니다." }, { status: 500 });
    }

    return NextResponse.json(parsed);
  } catch (error: unknown) {
    console.error("Daily Fortune API error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
