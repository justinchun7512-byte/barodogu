import { NextRequest, NextResponse } from "next/server";
import { detectNonKoreanFields } from "@/lib/korean-text-guard";

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

## 언어 규칙 (최우선 - 위반 시 응답 무효)
- 출력은 오직 다음만 허용합니다: 한글, 숫자, 한국어 문장부호(. , ! ? ~ … 「」 ' "), 공백, 그리고 이모지.
- 위 허용 목록 외의 **어떤 외국 문자도 단 한 글자도 쓰지 마라.** 영어(financial 등), 한자(漢字), 일본어, 중국어, 러시아어/키릴문자(финансов 등), 베트남어(tiết kiệm 등), 그 외 모든 언어의 문자 전면 금지.
- 외국어 개념이 떠올라도 반드시 한국어로 번역해서 쓴다.
  올바른 예: 절약(O) / tiết kiệm(X), 금융(O) / финансов(X), 교류(O) / 交流(X), 성공(O) / success(X)
- 친근하고 따뜻한 어조. 문장은 자연스럽고 문법적으로 완결되어야 하며 조사 누락이 없어야 합니다.

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

interface Fortune {
  overall: string;
  money: string;
  love: string;
  health: string;
  luckyNumber: number;
  luckyColor: string;
  advice: string;
  score: number;
}

// 안전 폴백 운세 풀 (전부 순수 한국어 — 재생성 실패 시에도 이상한 문자 0 보장)
const SAFE_POOL = {
  overall: [
    "오늘은 새로운 시작에 어울리는 하루입니다. 미뤄두었던 일을 가볍게 시작해보면 의외로 술술 풀립니다. 주변의 작은 도움이 큰 힘이 되는 날입니다.",
    "차분하게 흐름을 따라가면 좋은 하루입니다. 서두르기보다 하나씩 정리하는 마음이 행운을 부릅니다. 익숙한 일에서 뜻밖의 기회가 보입니다.",
    "활기가 도는 하루입니다. 자신감을 가지고 먼저 인사를 건네면 분위기가 한층 부드러워집니다. 오늘의 노력은 가까운 시일에 결실로 돌아옵니다.",
  ],
  money: [
    "큰 지출보다는 작은 절약이 빛나는 날입니다. 불필요한 구매는 잠시 미루고, 꼭 필요한 곳에만 쓰면 마음이 가벼워집니다. 금전 관련 결정은 한 번 더 점검해보세요.",
    "재물운이 안정적인 하루입니다. 평소 관심 있던 절약 방법을 실천하기 좋은 때입니다. 충동구매만 피하면 무리 없이 흘러갑니다.",
    "예상치 못한 작은 이득이 생길 수 있는 날입니다. 다만 큰 투자나 대여는 신중하게 판단하세요. 가계부를 정리하면 의외의 여유가 보입니다.",
  ],
  love: [
    "따뜻한 마음을 표현하기 좋은 날입니다. 가까운 사람에게 진심을 담아 한마디 건네보세요. 솔직한 대화가 관계를 한층 깊게 만듭니다.",
    "새로운 만남이나 반가운 소식이 기다리는 하루입니다. 먼저 다가가는 용기가 좋은 인연을 부릅니다. 작은 배려가 큰 호감으로 돌아옵니다.",
    "오해가 있었다면 풀기 좋은 날입니다. 상대의 입장을 한 번 더 헤아리면 마음의 거리가 가까워집니다. 함께하는 시간이 즐거운 하루입니다.",
  ],
  health: [
    "몸의 신호에 귀 기울이기 좋은 날입니다. 피로하면 충분히 쉬고, 가벼운 산책으로 기분을 환기해보세요. 규칙적인 식사가 컨디션을 지켜줍니다.",
    "활력이 도는 하루입니다. 가벼운 운동으로 몸을 깨우면 하루가 더 상쾌해집니다. 수분을 자주 챙기면 좋습니다.",
    "마음의 안정이 중요한 날입니다. 깊게 숨을 고르고 충분한 휴식을 취하세요. 무리하지 않는 선에서 움직이면 건강이 따라옵니다.",
  ],
  advice: [
    "작은 일에도 정성을 다하면 큰 행운이 따라옵니다.",
    "서두르지 말고 한 걸음씩, 오늘의 나를 믿으세요.",
    "먼저 건네는 따뜻한 말 한마디가 하루를 바꿉니다.",
  ],
  luckyColor: ["파랑", "초록", "노랑", "주황", "보라", "하늘색"],
};

function safeFortune(seed: number, score: number): Fortune {
  const pick = <T,>(arr: T[]) => arr[Math.abs(seed) % arr.length];
  return {
    overall: pick(SAFE_POOL.overall),
    money: pick(SAFE_POOL.money),
    love: pick(SAFE_POOL.love),
    health: pick(SAFE_POOL.health),
    luckyNumber: (Math.abs(seed) % 45) + 1,
    luckyColor: pick(SAFE_POOL.luckyColor),
    advice: pick(SAFE_POOL.advice),
    score: score >= 60 && score <= 99 ? score : 60 + (Math.abs(seed) % 40),
  };
}

function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

async function callGroq(systemPrompt: string, userMessage: string, temperature: number): Promise<Fortune | null> {
  const models = ["llama-3.3-70b-versatile", "llama-3.1-70b-versatile"];
  for (const model of models) {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        temperature,
        response_format: { type: "json_object" },
      }),
    });
    if (!res.ok) {
      console.error(`Groq API error (${model}):`, res.status);
      continue;
    }
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) continue;
    try {
      const parsed = JSON.parse(content);
      if (parsed.overall && parsed.money && parsed.love && parsed.health) return parsed as Fortune;
    } catch {
      /* 다음 모델 시도 */
    }
  }
  return null;
}

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
      return NextResponse.json({ error: "생년월일을 입력해주세요." }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "AI 서비스가 설정되지 않았습니다." }, { status: 503 });
    }

    const today = new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" });
    const userMessage = `오늘 날짜: ${today}
생년월일: ${birthDate}
${name ? `이름: ${name}` : ""}

위 정보를 바탕으로 오늘의 운세를 알려주세요. 반드시 JSON 형식으로만 응답해주세요. 한글 외 외국 문자는 한 글자도 쓰지 마세요.`;

    // detect + regenerate: 오염되면 온도를 낮춰 최대 3회 재생성
    const attempts = [0.4, 0.25, 0.15];
    let lastParsed: Fortune | null = null;

    for (const temp of attempts) {
      const parsed = await callGroq(SYSTEM_PROMPT, userMessage, temp);
      if (!parsed) continue;
      lastParsed = parsed;
      const guard = detectNonKoreanFields(parsed as unknown as Record<string, unknown>);
      if (guard.clean) {
        return NextResponse.json(parsed);
      }
      console.warn(`[daily-fortune] 비한국어 감지 (temp=${temp}), 재생성. offenders=${guard.offenders.join(", ")}`);
    }

    // 모든 재생성이 오염 → 안전 템플릿 폴백 (이상한 문자 0 보장)
    const seed = hashSeed(`${birthDate}|${name ?? ""}|${today}`);
    const score = typeof lastParsed?.score === "number" ? lastParsed.score : 0;
    console.warn("[daily-fortune] 재생성 실패 → 안전 템플릿 폴백 사용");
    return NextResponse.json(safeFortune(seed, score));
  } catch (error: unknown) {
    console.error("Daily Fortune API error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
