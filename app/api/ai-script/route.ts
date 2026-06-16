import { NextRequest, NextResponse } from "next/server";
import { generateGuardedKorean } from "@/lib/groq-korean";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 30;

// 분당 5회 (스크립트 생성은 비용이 높음)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  entry.count++;
  return entry.count > 5;
}

const CATEGORY_LABELS: Record<string, string> = {
  health: "건강·운동",
  food: "음식·요리",
  finance: "재테크·경제",
  lifestyle: "라이프스타일",
  barodogu: "바로도구 AI 도구 소개",
  custom: "자유 주제",
};

const SYSTEM_PROMPT = `당신은 유튜브 쇼츠 전문 대본 작가입니다. 60초 숏폼 영상 대본을 JSON으로 생성합니다.

## 언어 규칙 (최우선)
- 모든 text, tts_text, title, description, tags는 반드시 한국어(한글)로만 작성합니다.
- 한자(漢字) 절대 금지
- 영어 혼용 금지 (고유명사 제외)
- image_prompt 필드만 영어로 작성합니다 (이미지 AI 모델용)

## 대본 구성 (6씬 고정)
씬1 HOOK: 첫 3초 강력한 훅. "혹시 ~하시나요?" 또는 충격적 수치/사실로 시작.
씬2 공감: 시청자가 공감할 상황 묘사. 1인칭 경험처럼.
씬3 반전: 기존 상식과 다른 놀라운 정보 제시.
씬4 해결: 구체적 해결책 또는 핵심 정보 (가장 중요).
씬5 정보: 추가 팁 또는 근거/수치.
씬6 CTA: "저장하고", "구독하고", "댓글로" 등 행동 유도.

## 출력 형식 (JSON)
{
  "title": "제목 (20자 이내, 클릭 유도)",
  "description": "영상 설명 (100자 이내)",
  "tags": ["태그1", "태그2", "태그3", "태그4", "태그5"],
  "thumbnail_text": "썸네일 텍스트 (10자 이내, 임팩트)",
  "script": [
    {
      "section": "HOOK",
      "text": "화면에 표시될 텍스트 (30자 이내)",
      "tts_text": "음성으로 읽힐 전체 문장 (자연스러운 말투, 8-10초 분량)",
      "duration": 8,
      "image_prompt": "Photorealistic scene: [영어 이미지 설명, 세로 9:16 비율], Korean lifestyle video style, natural lighting"
    }
  ]
}`;

type Scene = {
  section: string;
  text: string;
  tts_text: string;
  duration: number;
  image_prompt: string;
};

type AiScript = {
  title: string;
  description: string;
  tags: string[];
  thumbnail_text: string;
  script: Scene[];
};

function isValidScript(obj: unknown): obj is { script: AiScript } {
  if (!obj || typeof obj !== "object") return false;
  const o = obj as Record<string, unknown>;
  if (!o.title || typeof o.title !== "string") return false;
  if (!Array.isArray(o.script) || o.script.length !== 6) return false;
  return o.script.every((s: unknown) => {
    if (!s || typeof s !== "object") return false;
    const sc = s as Record<string, unknown>;
    return (
      typeof sc.section === "string" &&
      typeof sc.text === "string" &&
      typeof sc.tts_text === "string" &&
      typeof sc.duration === "number" &&
      typeof sc.image_prompt === "string"
    );
  });
}

export async function POST(req: NextRequest) {
  // 인증 확인 — 미인증 시 Groq API 비용 노출 차단
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." }, { status: 429 });
  }

  let topic: string, channel: string;
  try {
    ({ topic, channel } = await req.json());
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  if (!topic || typeof topic !== "string" || topic.length > 500) {
    return NextResponse.json({ error: "주제를 입력해주세요." }, { status: 400 });
  }

  const categoryLabel = CATEGORY_LABELS[channel] ?? channel ?? "일반";
  const userPrompt = `카테고리: ${categoryLabel}
주제: ${topic}

위 주제로 60초 유튜브 쇼츠 대본을 JSON으로 생성해주세요.
- 6개 씬 (HOOK/공감/반전/해결/정보/CTA) 필수
- 각 씬 duration: 8초 (고정)
- tts_text는 8-10초에 읽힐 분량 (약 80-120자 한국어)
- image_prompt는 반드시 영어로 작성
- 전체 응답은 반드시 유효한 JSON`;

  const result = await generateGuardedKorean<AiScript>({
    system: SYSTEM_PROMPT,
    user: userPrompt,
    isValid: (obj) => isValidScript(obj),
    guardTexts: (obj) => [
      obj.title,
      obj.description,
      ...obj.script.map((s) => s.text),
      ...obj.script.map((s) => s.tts_text),
    ],
    allowLatin: false,
    temps: [0.7, 0.5, 0.3],
    models: ["llama-3.3-70b-versatile"],
  });

  if (!result.ok) {
    console.error("[ai-script] 생성 실패:", result.reason);
    return NextResponse.json(
      { error: "대본 생성에 실패했습니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }

  // duration 보정 (API가 다른 값 반환할 경우)
  const script: AiScript = {
    ...result.data,
    script: result.data.script.map((s) => ({ ...s, duration: 8 })),
  };

  return NextResponse.json({ script });
}
