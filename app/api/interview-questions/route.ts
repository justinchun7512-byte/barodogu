import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

// Simple in-memory rate limiter (per IP, 10 requests per minute)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
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

const MAX_TEXT_LENGTH = 10000;

const SYSTEM_PROMPT = `당신은 10년 경력의 채용 면접관이자 HR 전문가입니다.
채용공고(JD)와 지원자의 이력서를 교차 분석하여, 실제 면접에서 물어볼 만한 질문을 생성합니다.

## 핵심 원칙

### 원칙 1: 면접관의 관점으로 사고
- 단순 키워드 매칭이 아니라, "이 이력서를 보고 면접관이 어떤 불확실성을 느끼는가"를 추론합니다.
- 이력서에서 과장되었을 수 있는 부분, 공백 기간, 직무 전환 사유 등을 파고듭니다.

### 원칙 2: 질문 카테고리 분류
모든 질문을 다음 4개 카테고리 중 하나로 분류합니다:
- "직무 역량": JD에서 요구하는 기술/역량 관련 질문
- "경험 검증": 이력서에 기재된 경험의 진위/깊이를 확인하는 질문
- "지원 동기 & 조직문화": 왜 이 회사/포지션에 지원했는지, 조직 적합성
- "돌발 & 압박": 예상하지 못한 각도의 질문, 스트레스 상황 대처

### 원칙 3: 빈도 등급 (면접에서 나올 가능성)
각 질문에 빈도 등급을 부여합니다:
- "높음": 거의 반드시 나오는 질문 (해당 직무 면접의 80% 이상에서 등장)
- "보통": 자주 나오는 질문 (50~80%)
- "낮음": 가끔 나오지만 대비하면 차별화되는 질문 (50% 미만)

### 원칙 4: 답변 힌트 구성
각 질문에 대한 답변 힌트를 제공합니다:
- 핵심 키워드 2~3개 (답변에 반드시 포함할 것)
- 이 지원자의 이력서에서 활용하면 좋은 경험 1가지를 구체적으로 연결
- 피해야 할 답변 패턴 1가지
- 자연스러운 문장체로 작성 (불릿 나열 금지)

### 원칙 5: 요약 분석
전체 질문을 생성한 후, 면접의 핵심 포인트를 요약합니다:
- 가장 집중적으로 질문이 나올 카테고리
- 이력서에서 면접관이 파고들 가능성이 있는 공백/약점 1~2개

## 응답 형식 (반드시 아래 JSON 형식으로만 응답. JSON 외 다른 텍스트 금지)

{
  "summary": {
    "totalQuestions": 질문 총 개수,
    "focusCategories": ["가장 많이 출현한 카테고리 1~2개"],
    "resumeGaps": ["면접관이 파고들 가능성 있는 이력서 공백/약점 1~2개 (한 줄씩)"]
  },
  "questions": [
    {
      "id": 순번,
      "category": "직무 역량" | "경험 검증" | "지원 동기 & 조직문화" | "돌발 & 압박",
      "frequency": "높음" | "보통" | "낮음",
      "question": "면접 질문 본문",
      "intent": "면접관이 이 질문으로 무엇을 확인하려는지 (한 줄)",
      "hint": "답변 방향 힌트. 핵심 키워드, 활용할 경험, 피해야 할 패턴을 자연스러운 문장으로 작성."
    }
  ]
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
    const { jdTasks, jdRequirements, jdPreferred, jdCulture, resumeText, questionCount, difficulty } = body;

    // 최소 하나의 JD 필드와 이력서가 있어야 함
    if (!jdTasks && !jdRequirements && !jdPreferred && !jdCulture) {
      return NextResponse.json(
        { error: "채용공고 항목을 최소 1개 이상 입력해주세요." },
        { status: 400 }
      );
    }

    if (!resumeText) {
      return NextResponse.json(
        { error: "이력서를 입력해주세요." },
        { status: 400 }
      );
    }

    if (
      (jdTasks && jdTasks.length > MAX_TEXT_LENGTH) ||
      (jdRequirements && jdRequirements.length > MAX_TEXT_LENGTH) ||
      (jdPreferred && jdPreferred.length > MAX_TEXT_LENGTH) ||
      (jdCulture && jdCulture.length > MAX_TEXT_LENGTH) ||
      resumeText.length > MAX_TEXT_LENGTH * 3
    ) {
      return NextResponse.json(
        { error: "입력 텍스트가 너무 깁니다. 각 항목은 10,000자, 이력서는 30,000자 이하로 입력해주세요." },
        { status: 400 }
      );
    }

    const count = questionCount || 15;
    const diff = difficulty || 'basic';

    const userMessage = `## 채용공고 (JD)

${jdTasks ? `### 담당업무\n${jdTasks}\n` : ""}
${jdRequirements ? `### 자격요건\n${jdRequirements}\n` : ""}
${jdPreferred ? `### 우대사항\n${jdPreferred}\n` : ""}
${jdCulture ? `### 조직문화\n${jdCulture}\n` : ""}

## 지원자 이력서
${resumeText}

---

위 채용공고와 이력서를 교차 분석하여 면접 질문을 생성해주세요.
질문 수: ${count}개
난이도: ${diff === 'advanced' ? '심화 (돌발 질문, 상황 기반 시나리오 질문 비율을 높여주세요)' : '기본'}
반드시 JSON 형식으로만 응답해주세요.`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        temperature: 0.75,
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      console.error("Groq API error:", res.status);
      return NextResponse.json(
        { error: "AI 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요." },
        { status: 502 }
      );
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "AI 응답이 비어있습니다." },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(content);

    // AI 응답 기본 스키마 검증
    if (
      !parsed.summary ||
      !Array.isArray(parsed.questions) ||
      parsed.questions.length === 0
    ) {
      console.error("Invalid AI response structure:", JSON.stringify(parsed).slice(0, 200));
      return NextResponse.json(
        { error: "AI 응답 형식이 올바르지 않습니다. 다시 시도해주세요." },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error: unknown) {
    console.error("Interview Questions API error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
