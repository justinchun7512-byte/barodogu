/**
 * AI 응답에서 한자/일본어/중국어 문자를 제거하고, 제거 후 깨진 문법을 복구합니다.
 *
 * 문제 패턴: AI가 "끊임없는 革新과 도전 精神을" 생성 → 한자 제거 → "끊임없는 과 도전 을" (깨짐)
 * 해결: 한자 제거 후 고아 조사(orphaned particles)를 감지하여 자연스럽게 복구
 */
export function cleanAiText(text: string): string {
  return text
    // 1단계: 한자/일본어/중국어 문자 제거
    .replace(/[\u4E00-\u9FFF\u3400-\u4DBF\u3040-\u309F\u30A0-\u30FF]/g, '')

    // 2단계: 한자 제거 후 생기는 고아 조사 패턴 수정
    // "끊임없는 과 도전" → "끊임없는 도전" (형용사 뒤 고아 과/와 제거)
    .replace(/(는|은|인|한|된|적|의)\s+(과|와)\s/g, '$1 ')
    // "도전 을 유지" → "도전을 유지" (명사 뒤 고아 조사 붙이기)
    .replace(/(\S)\s+(을|를|이|가|은|는|과|와|의|에|로)\s/g, (match, prev, particle) => {
      // 이미 조사가 붙어있으면 스킵 (예: "것을 을" 방지)
      if (/[을를이가은는과와의에로]$/.test(prev)) return prev + ' ';
      return prev + particle + ' ';
    })
    // "와 으로" → "를 통해"
    .replace(/와\s+으로/g, '를 통해')
    .replace(/과\s+으로/g, '를 통해')
    // 고아 "으로" (앞에 명사 없이 조사만 남은 경우)
    .replace(/\s으로\s/g, ' 통해 ')

    // 3단계: 중복/깨진 기호 정리
    .replace(/을\s+을/g, '을')
    .replace(/를\s+를/g, '를')
    .replace(/[,\s]+[,]/g, ',')
    .replace(/\.\s*\./g, '.')
    .replace(/\(\s*\)/g, '')
    .replace(/「\s*」/g, '')
    .replace(/'\s*'/g, '')

    // 4단계: 공백 정리
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/** 문자열 배열의 각 항목에 cleanAiText 적용 */
export function cleanAiTextArray(arr: string[]): string[] {
  return arr.map(cleanAiText);
}
