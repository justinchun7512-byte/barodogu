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

const SYSTEM_PROMPT = `당신은 15년 경력의 HR 컨설턴트이자 조직문화 전문가입니다. 지원자의 성향/경력과 기업의 특성을 분석하여 궁합을 진단합니다.

## 언어 규칙 (최우선)
- 모든 응답은 반드시 한국어(한글)로만 작성합니다.
- 한자, 영어 혼용 금지. 고유명사(회사명, 기술명)만 예외.
- 전문적이면서도 친근한 어조로 작성합니다.

## 분석 원칙
- 기업의 공개된 조직문화, 업종 특성, 규모를 고려
- 지원자의 성향 키워드를 기반으로 적합도 분석
- 긍정적/건설적 조언 위주 (부정적 내용도 개선 가능한 방향으로)
- 궁합 점수는 40~95 범위 (극단적 점수 지양)

## 응답 형식 (반드시 JSON)
{
  "score": 궁합 점수 (40~95 정수),
  "grade": "천생직장" | "좋은 궁합" | "보통" | "노력 필요",
  "summary": "한 줄 요약 (20자 내외)",
  "analysis": {
    "culture": "조직문화 적합도 분석 (2~3문장)",
    "growth": "성장 가능성 분석 (2~3문장)",
    "workStyle": "업무 스타일 적합도 (2~3문장)"
  },
  "strengths": ["강점 1", "강점 2", "강점 3"],
  "cautions": ["주의점 1", "주의점 2"],
  "advice": "지원/이직 시 참고할 조언 (2~3문장)"
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
    const { companyName, personality, career, workStyle } = body;

    if (!companyName) {
      return NextResponse.json({ error: "기업명을 입력해주세요." }, { status: 400 });
    }

    if (!personality && !career && !workStyle) {
      return NextResponse.json({ error: "나의 성향을 최소 1개 이상 입력해주세요." }, { status: 400 });
    }

    const userMessage = `## 기업 정보
기업명: ${companyName}

## 지원자 정보
${personality ? `성격/성향: ${personality}` : ''}
${career ? `경력/직무: ${career}` : ''}
${workStyle ? `선호 업무 스타일: ${workStyle}` : ''}

위 정보를 바탕으로 나와 이 기업의 궁합을 분석해주세요. 반드시 JSON 형식으로만 응답해주세요.`;

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "AI 서비스가 설정되지 않았습니다." }, { status: 503 });
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
          temperature: 0.8,
          response_format: { type: "json_object" },
        }),
      });

      if (res.ok) break;
      console.error(`Groq API error (${model}):`, res.status);
    }

    if (!res || !res.ok) {
      return NextResponse.json(
        { error: "AI 서비스에 일시적인 문제가 발생했습니다." },
        { status: 502 }
      );
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: "AI 응답이 비어있습니다." }, { status: 500 });
    }

    const parsed = JSON.parse(content);

    if (!parsed.score || !parsed.analysis) {
      return NextResponse.json({ error: "AI 응답 형식이 올바르지 않습니다." }, { status: 500 });
    }

    // 한자/일본어/중국어 문자 강제 제거 + 제거 후 깨진 문법 복구
    const cleanText = (text: string) => {
      return text
        .replace(/[\u4E00-\u9FFF\u3400-\u4DBF\u3040-\u309F\u30A0-\u30FF]/g, '')
        .replace(/와\s+으로/g, '를 통해')
        .replace(/과\s+으로/g, '를 통해')
        .replace(/의\s+이\s/g, '의 ')
        .replace(/을\s+을/g, '을')
        .replace(/를\s+를/g, '를')
        .replace(/[,\s]+[,]/g, ',')
        .replace(/\.\s*\./g, '.')
        .replace(/\(\s*\)/g, '')
        .replace(/\s{2,}/g, ' ')
        .trim();
    };
    const cleanArr = (arr: string[]) => arr.map(cleanText);

    const cleaned = {
      ...parsed,
      summary: cleanText(parsed.summary || ''),
      analysis: {
        culture: cleanText(parsed.analysis.culture || ''),
        growth: cleanText(parsed.analysis.growth || ''),
        workStyle: cleanText(parsed.analysis.workStyle || ''),
      },
      strengths: cleanArr(parsed.strengths || []),
      cautions: cleanArr(parsed.cautions || []),
      advice: cleanText(parsed.advice || ''),
    };

    return NextResponse.json(cleaned);
  } catch (error: unknown) {
    console.error("Company Compatibility API error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
