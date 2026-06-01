/**
 * 한국어 텍스트 순도 가드 (BD-AI-LANG-001, 2026-06-01)
 *
 * 배경: AI(Groq LLM)가 한국어 생성 중 외국어를 섞는 code-switching 발생.
 *   실제 사고: 운세 재운에 "tiết kiệm"(베트남어), "финансов"(러시아어) 노출.
 *
 * 기존 cleanAiText는 CJK(한자·가나)만 strip → 키릴·베트남어·영어 통과 + 문법 파손.
 * 본 가드는 "제거"가 아니라 "감지"한다. 호출부는 오염 감지 시 재생성/폴백을 선택.
 *
 * 감지 대상 = 외국 문자(letter) 스크립트. 이모지·숫자·문장부호·통화기호·한글은 허용(오탐 방지).
 * ⚠️ 범위는 반드시 \u 이스케이프로만 작성한다. 리터럴 문자는 편집기/인코딩에 따라
 *    한글 영역(AC00-D7A3)을 잘못 포함해 거짓양성을 일으킨 전례가 있다(2026-06-01).
 */

// 외국 문자(글자) 유니코드 범위 — 한 글자라도 있으면 오염으로 본다.
// 한글(ᄀ-ᇿ, ㄰-㆏, 가-힣 등)은 의도적으로 미포함.
const FOREIGN_CLASS =
  '\\u0041-\\u005A\\u0061-\\u007A' + // 라틴 기본 (영어·베트남 기본자모)
  '\\u00C0-\\u024F' + // 라틴-1 보충 + 확장 A/B
  '\\u1E00-\\u1EFF' + // 라틴 확장 추가 (베트남어 성조 ế ệ ạ 등)
  '\\u0370-\\u03FF' + // 그리스
  '\\u0400-\\u04FF' + // 키릴 (러시아어)
  '\\u0530-\\u058F' + // 아르메니아
  '\\u0590-\\u05FF' + // 히브리
  '\\u0600-\\u06FF' + // 아랍
  '\\u0E00-\\u0E7F' + // 태국
  '\\u0900-\\u097F' + // 데바나가리
  '\\u3040-\\u30FF' + // 가나 (일본어 히라가나·가타카나)
  '\\u3400-\\u4DBF' + // CJK 확장 A
  '\\u4E00-\\u9FFF' + // CJK 통합 한자
  '\\uF900-\\uFAFF'; // CJK 호환 한자

// 영문 라틴 기본을 제외한 클래스(allowLatin 옵션용)
const FOREIGN_CLASS_NO_LATIN = FOREIGN_CLASS.replace('\\u0041-\\u005A\\u0061-\\u007A', '');

export interface KoreanGuardResult {
  clean: boolean;
  offenders: string[]; // 발견된 외국어 토막들 (로깅·디버깅용)
}

/**
 * 텍스트에 비한국어 문자(외국 letter)가 있는지 감지.
 * @param text 검사할 문자열
 * @param opts.allowLatin 영문(라틴 기본 A-Za-z) 허용 — 고유명사가 필요한 라우트용(기본 false)
 */
export function detectNonKorean(
  text: string,
  opts: { allowLatin?: boolean } = {}
): KoreanGuardResult {
  if (!text) return { clean: true, offenders: [] };
  const cls = opts.allowLatin ? FOREIGN_CLASS_NO_LATIN : FOREIGN_CLASS;
  const single = new RegExp(`[${cls}]`, 'u');
  if (!single.test(text)) return { clean: true, offenders: [] };
  const run = new RegExp(`[${cls}]+`, 'gu');
  const offenders = Array.from(new Set(text.match(run) ?? []));
  return { clean: false, offenders };
}

/** 여러 필드를 한 번에 검사. 하나라도 오염이면 clean=false. */
export function detectNonKoreanFields(
  fields: Record<string, unknown>,
  opts: { allowLatin?: boolean } = {}
): KoreanGuardResult {
  const allOffenders: string[] = [];
  for (const v of Object.values(fields)) {
    if (typeof v !== 'string') continue;
    const r = detectNonKorean(v, opts);
    if (!r.clean) allOffenders.push(...r.offenders);
  }
  return { clean: allOffenders.length === 0, offenders: Array.from(new Set(allOffenders)) };
}
