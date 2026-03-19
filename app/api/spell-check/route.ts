import { NextRequest, NextResponse } from 'next/server';

// 간단한 한국어 맞춤법 규칙 (자주 틀리는 표현)
const RULES: [RegExp, string][] = [
  [/되요/g, '돼요'],
  [/됬/g, '됐'],
  [/안되/g, '안 되'],
  [/않되/g, '안 되'],
  [/몇일/g, '며칠'],
  [/어떻게 해야되/g, '어떻게 해야 되'],
  [/할께/g, '할게'],
  [/할수록/g, '할수록'],
  [/금새/g, '금세'],
  [/일일히/g, '일일이'],
  [/어의없/g, '어이없'],
  [/오랜만/g, '오랜만'],
  [/왠지/g, '웬지 (→ 왠지는 "왜인지"의 줄임)'],
  [/깨끗히/g, '깨끗이'],
  [/바램/g, '바람'],
  [/설래/g, '설레'],
  [/않돼/g, '안 돼'],
  [/데로/g, '대로'],
  [/로써/g, '로서 (자격) 또는 로써 (수단)'],
];

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ corrections: [] });
    }

    const corrections: { original: string; corrected: string; position: number }[] = [];

    for (const [pattern, replacement] of RULES) {
      let match;
      const regex = new RegExp(pattern.source, 'g');
      while ((match = regex.exec(text)) !== null) {
        corrections.push({
          original: match[0],
          corrected: replacement,
          position: match.index,
        });
      }
    }

    return NextResponse.json({ corrections });
  } catch {
    return NextResponse.json({ corrections: [] }, { status: 500 });
  }
}
