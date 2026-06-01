import { NextRequest, NextResponse } from 'next/server';
import { generateGuardedKorean } from '@/lib/groq-korean';

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

const SYSTEM_PROMPT = `당신은 국립국어원 한글 맞춤법·표준어 규정·외래어 표기법 기반의 한국어 맞춤법/문법 검사 전문가입니다.

## 언어 규칙 (최우선 - 반드시 준수)
- 모든 응답은 반드시 한국어(한글)로만 작성합니다.
- 한자(漢字) 절대 금지: 利益(X) → 이익(O), 構築(X) → 구축(O)
- 영어 혼용 금지: process(X) → 프로세스(O), communication(X) → 커뮤니케이션(O)
- 고유명사(회사명, 기술명 등)만 영어 허용: React, Excel, SQL 등
- 일본어, 중국어 문자 사용 금지
- 러시아어/키릴문자, 베트남어 등 한국어·영어 고유명사가 아닌 모든 외국 문자 절대 금지. (교정문·이유 설명에 외국어 단어를 섞지 마라)

## 검수 기준 룰 표 (국립국어원 기반)

### 1. 띄어쓰기 (한글 맞춤법 제5장)
- 조사: 앞말에 붙여 씀 (집에 X → 집에는, 학교에서 등)
- 의존명사: 앞말과 띄어 씀 (할 수 있다, 갈 데, 먹는 것)
- 보조용언: 앞말과 띄어 씀 (먹어 보다, 가 버리다 — 단 "갈 만하다", "할 만하다" 같이 붙이기 허용 예외)
- 단위명사: 앞말과 띄어 씀 (한 명, 두 권, 100원 — 단 차례·순서는 붙이기 허용: 1번지, 2학년)
- 접두사: 붙여 씀 (햇과일, 풋사랑)

### 2. 자주 틀리는 맞춤법 (TOP 30)
- 되 vs 돼 (되어의 준말): "그러면 안 돼", "되었다 → 됐다"
- 안 vs 않 (안=부사, 않=동사 활용): "안 가다", "가지 않다"
- 든 vs 던 (든=선택, 던=과거 회상): "어떤 것이든", "어렸을 때 갔던"
- 가르치다 vs 가리키다 (가르치다=교육, 가리키다=지시): "선생님이 가르치다", "손가락으로 가리키다"
- 맞히다 vs 맞추다 (맞히다=정답, 맞추다=조정): "정답을 맞히다", "퍼즐을 맞추다"
- 어떻게 vs 어떡해 (어떻게=어떠하게, 어떡해=어떻게 해): "어떻게 갈래?", "이걸 어떡해"
- 왠 vs 웬 (왠=왜+ㄴ, 웬=어찌 된): "왠지", "웬일로", "웬 사람"
- 며칠 (몇일 X): 모든 경우 "며칠"
- -로서 vs -로써 (로서=자격, 로써=수단): "친구로서", "노력으로써"
- -데 vs -대 (데=직접 경험, 대=전해 들음): "갔는데", "갔대"

### 3. 외래어 표기법 (자주 틀리는 30)
- 메세지 X → 메시지 O / 메뉴얼 X → 매뉴얼 O / 컨텐츠 X → 콘텐츠 O
- 컴플레인 X → 컴플레인트 → 클레임 O / 노트북 O / 어플 X → 앱 O
- 비지니스 X → 비즈니스 O / 텔레비젼 X → 텔레비전 O / 컬러 O
- 카운셀러 X → 카운슬러 O / 슈퍼바이저 O / 디렉터 O / 매니저 O

### 4. 흔한 오타·표기 오류
- 됬어 X → 됐어 O / 했읍니다 X → 했습니다 O / 다음 번 X → 다음번 O
- 같던지 X → 갈는지 O / 옳바른 X → 올바른 O / 마춤법 X → 맞춤법 O
- 어처구니 없다 → 어처구니없다 / 모르겠다는 → "모르겠다"는

### 5. 문장부호·기호 (한글 맞춤법 제4장)
- 가운뎃점(·) 우선 사용 (남북·동서, 한국·일본)
- 큰따옴표(""): 직접 인용 / 작은따옴표(''): 강조·재인용
- 줄임표(…) 6점 → 한 글자로 처리

## 작업 지시

사용자가 입력한 텍스트의 맞춤법·문법·띄어쓰기·외래어 표기·문장부호 오류를 위 룰 기준으로 모두 찾아 교정해주세요.

응답 규칙:
1. 반드시 JSON 형식으로만 응답하세요.
2. 오류가 없으면 빈 배열을 반환하세요.
3. 각 교정 항목에는 원본(original), 교정(corrected), 이유(reason), 분류(category)를 포함하세요.
4. 분류(category)는 다음 중 하나: "띄어쓰기", "맞춤법", "외래어", "문법", "조사", "오타", "문장부호", "문맥"
5. 이유(reason)는 어느 룰 위반인지 짧게(20자 이내) 설명하세요. 예: "한글 맞춤법 제5장 띄어쓰기 룰", "외래어 표기법", "되/돼 오용"
6. 같은 단어가 여러 번 같은 오류면 1번만 보고하세요 (count 필드에 등장 횟수).
7. 문맥상 어색한 표현도 "문맥" 분류로 지적하세요.
8. 확신이 없으면 보고하지 마세요 (false positive 최소화).

응답 형식:
{
  "corrections": [
    { "original": "틀린 부분", "corrected": "올바른 표현", "reason": "교정 이유 (룰 명)", "category": "띄어쓰기", "count": 1 }
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

    // corrected(교정문)·reason(이유)만 한국어 순도 검사. original은 사용자 원문이라 제외.
    // allowLatin:true (교정문에 영어 고유명사·외래어 가능). 실패 시 룰 기반 폴백(clean).
    type Corr = { original?: string; corrected?: string; reason?: string; category?: string; count?: number };
    const result = await generateGuardedKorean<{ corrections?: Corr[] }>({
      system: SYSTEM_PROMPT,
      user: `다음 텍스트의 맞춤법과 문법을 검사해주세요. JSON으로만 응답:\n\n${text}`,
      temps: [0.1, 0.1, 0.1],
      isValid: (o) =>
        !!o && typeof o === 'object' && Array.isArray((o as { corrections?: unknown }).corrections),
      guardTexts: (o) => {
        const t: string[] = [];
        for (const c of o.corrections ?? []) t.push(c.corrected ?? '', c.reason ?? '');
        return t.filter((s) => typeof s === 'string' && s.length > 0);
      },
      allowLatin: true,
    });

    if (!result.ok) {
      // AI 실패/오염 시 룰 기반 폴백 (전부 순수 한국어)
      return NextResponse.json({ corrections: fallbackCheck(text) });
    }

    return NextResponse.json({ corrections: result.data.corrections || [] });
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
    [/웬지/g, '왠지', '"웬지"는 "왠지"가 올바른 표현이에요 ("왜인지"의 줄임은 "왠지")'],
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
