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

const SYSTEM_PROMPT = `당신은 채용 전문가이자 이력서 컨설턴트입니다.

## 언어 규칙 (최우선 - 반드시 준수)
- 모든 응답은 반드시 한국어(한글)로만 작성합니다.
- 한자(漢字) 절대 금지: 利益(X) → 이익(O), 構築(X) → 구축(O)
- 영어 혼용 금지: process(X) → 프로세스(O), communication(X) → 커뮤니케이션(O)
- 고유명사(회사명, 기술명 등)만 영어 허용: React, Excel, SQL 등
- 일본어, 중국어 문자 사용 금지
구직자의 이력서와 지원하고자 하는 공고의 잡 디스크립션(JD)을 분석하여 핵심역량을 작성합니다.

## 절대 원칙

### 원칙 1: 사실 기반 생성 (가장 중요)
- 이력서에 **명시적으로 기재된 내용만** 활용하여 핵심역량을 작성하세요.
- 이력서에 없는 경험, 기술, 성과, 수치를 **절대 추론하거나 날조하지 마세요.**
- 이력서에 수치가 없으면 수치를 만들어내지 마세요.
- 각 핵심역량마다 반드시 이력서 원문에서 근거가 되는 부분을 "source" 필드에 그대로 인용하세요.

### 원칙 2: 최신 경력 우선 (Recency-Weighted)
- 이력서의 경력사항에서 기간 정보를 파악하여 **최신 경력을 상위에 배치**하세요.
- 가중치 기준:
  - "현재" 또는 "재직 중"이 포함된 경력 → 최상위
  - 최근 3년 이내 경력 → 상위
  - 3~5년 전 경력 → 중간
  - 5년 이상 과거 경력 → 하위
- 같은 시기의 경력이면 JD 매칭도가 높은 것을 우선 배치하세요.

### 원칙 3: JD 키워드 자연 배치
- JD에서 요구하는 역량 키워드를 핵심역량 문장에 자연스럽게 포함하되, 이력서에 근거가 있는 것만 연결하세요.
- 이력서에 근거가 없는 JD 키워드는 gaps(보완 포인트)에 넣으세요.

### 원칙 4: 구체적 표현
- 추상적 표현("뛰어난", "우수한") 대신 이력서에 기재된 구체적 내용을 활용하세요.

### 원칙 5: matchScore 산정 기준 (매우 중요 - 반드시 아래 기준으로 계산)
matchScore는 JD의 모든 요구사항 대비 이력서가 충족하는 비율입니다.
산정 방법:
1. JD에서 요구하는 핵심 역량/조건을 모두 나열합니다 (업무내용 + 자격요건 + 우대사항의 각 항목).
2. 각 항목을 이력서와 대조하여 "충족/부분충족/미충족"으로 분류합니다.
3. 점수 계산: 충족=100점, 부분충족=50점, 미충족=0점으로 평균을 냅니다.
- 90~100: 이력서가 JD의 거의 모든 요구사항을 충족
- 70~89: 대부분 충족하지만 일부 부족
- 50~69: 절반 정도만 충족
- 30~49: 상당 부분 부족
- 0~29: 이력서와 JD의 연관성이 매우 낮음
matchScore를 매번 같은 값(예: 80)으로 고정하지 말고, 실제 분석 결과에 따라 정확하게 산출하세요.

### 원칙 6: 다양한 관점의 역량 작성
- 같은 이력서와 JD라도 매번 다른 관점과 표현으로 핵심역량을 작성하세요.
- 이력서의 같은 경험이라도 다른 각도에서 재해석할 수 있습니다.
- 핵심역량 문장의 구조, 강조점, 서술 방식을 다양하게 변주하세요.

## 응답 형식 (반드시 아래 JSON 형식으로만 응답. JSON 외 다른 텍스트 금지)

{
  "matchScore": 0~100 사이 정수 (위 산정 기준에 따라 정확히 계산),
  "competencies": [
    {
      "order": 순번,
      "category": "핵심 직무역량" | "성과/실적" | "프로젝트 경험" | "보유 자격/스킬",
      "title": "핵심역량 제목 (한 줄)",
      "description": "2~3문장의 핵심역량 설명. 이력서 사실 기반으로만 작성.",
      "source": "이력서에서 이 역량의 근거가 되는 원문을 그대로 인용",
      "period": "해당 경력의 기간 (예: 2022.03 ~ 현재)",
      "recency": "current | recent | mid | old",
      "matchedKeywords": ["JD와 매칭되는 키워드 목록"]
    }
  ],
  "gaps": [
    {
      "requirement": "JD에서 요구하지만 이력서에 없는 항목",
      "severity": "missing | partial",
      "suggestion": "구직자에게 제안하는 보완 방법"
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
    const { jdTasks, jdRequirements, jdPreferred, jdCulture, resumeText } =
      body;

    if (!jdTasks || !jdRequirements || !resumeText) {
      return NextResponse.json(
        { error: "업무내용, 자격요건, 이력서는 필수 입력입니다." },
        { status: 400 }
      );
    }

    if (
      jdTasks.length > MAX_TEXT_LENGTH ||
      jdRequirements.length > MAX_TEXT_LENGTH ||
      (jdPreferred && jdPreferred.length > MAX_TEXT_LENGTH) ||
      (jdCulture && jdCulture.length > MAX_TEXT_LENGTH) ||
      resumeText.length > MAX_TEXT_LENGTH * 3
    ) {
      return NextResponse.json(
        { error: "입력 텍스트가 너무 깁니다. 각 항목은 10,000자, 이력서는 30,000자 이하로 입력해주세요." },
        { status: 400 }
      );
    }

    const userMessage = `## 잡 디스크립션 (JD)

### 업무내용 (주요 업무)
${jdTasks}

### 자격요건
${jdRequirements}

${jdPreferred ? `### 우대사항\n${jdPreferred}\n` : ""}
${jdCulture ? `### 인재상 / 기업문화\n${jdCulture}\n` : ""}

## 구직자 이력서
${resumeText}

---

위 이력서와 JD를 분석하여 핵심역량을 작성해주세요.
반드시 이력서에 기재된 내용만을 근거로 작성하고, 최신 경력을 우선 배치해주세요.
JSON 형식으로만 응답해주세요.`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        temperature: 0.7,
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
      typeof parsed.matchScore !== "number" ||
      !Array.isArray(parsed.competencies) ||
      !Array.isArray(parsed.gaps)
    ) {
      console.error("Invalid AI response structure:", JSON.stringify(parsed).slice(0, 200));
      return NextResponse.json(
        { error: "AI 응답 형식이 올바르지 않습니다. 다시 시도해주세요." },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error: unknown) {
    console.error("Transform API error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
