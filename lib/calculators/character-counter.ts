/**
 * 한국어 글자 수 계산 — grapheme cluster 정밀화 + NEIS 호환 프로필
 *
 * 2026-05-15: k-skill korean-character-count (MIT) 룰 흡수.
 * - Intl.Segmenter("ko") grapheme cluster 기반 정확 카운트
 * - NEIS 프로필 (한글=3B, ASCII=1B, 줄바꿈=2B) — 학교 자기소개서·NEIS 폼 호환
 * - 줄바꿈 패턴 강화 (CRLF·LF·CR·U+2028·U+2029)
 */

export interface CharCountResult {
  // 기존 필드 (하위 호환)
  charWithSpace: number;       // grapheme cluster 기준 (이전: utf-16 code unit)
  charNoSpace: number;
  bytes: number;               // 기본 UTF-8 byte (이전과 동일)
  words: number;
  lines: number;               // CRLF·LF·CR·U+2028·U+2029 모두 1줄로 처리
  sentences: number;
  korean: number;
  english: number;

  // 신규 필드 (NEIS 호환 + 정밀 디버그)
  bytesNeis: number;           // NEIS 프로필 (학교 자기소개서·교육 시스템 호환)
  codePoints: number;          // Unicode code point 수 (이모지·결합 한글 1자 처리)
  utf16CodeUnits: number;      // 기존 text.length (구식 카운트 비교용)
}

const LINE_BREAK_PATTERN = /\r\n|[\n\r\u2028\u2029]/gu;
const HANGUL_OR_MARK_PATTERN = /^[\p{Script=Hangul}\p{Mark}]+$/u;
const HAS_HANGUL_PATTERN = /\p{Script=Hangul}/u;
const ASCII_ONLY_PATTERN = /^[\x00-\x7F]+$/;

function segmentGraphemes(text: string): string[] {
  if (typeof Intl !== 'undefined' && (Intl as { Segmenter?: typeof Intl.Segmenter }).Segmenter) {
    const segmenter = new Intl.Segmenter('ko', { granularity: 'grapheme' });
    return Array.from(segmenter.segment(text), ({ segment }) => segment);
  }
  // fallback: 구형 브라우저·환경 (code point 분할, 결합 한글·이모지 부정확)
  return Array.from(text);
}

function countUtf8Bytes(text: string): number {
  // 브라우저·Node 양쪽 동작 — TextEncoder는 globalThis
  return new TextEncoder().encode(text).length;
}

function countLines(text: string): number {
  if (text.length === 0) return 0;
  return Array.from(text.matchAll(LINE_BREAK_PATTERN)).length + 1;
}

function countNeisGraphemeBytes(grapheme: string): number {
  if (!grapheme) return 0;
  if (ASCII_ONLY_PATTERN.test(grapheme)) return 1;
  if (HANGUL_OR_MARK_PATTERN.test(grapheme) && HAS_HANGUL_PATTERN.test(grapheme)) return 3;
  return countUtf8Bytes(grapheme);
}

function countNeisChunkBytes(chunk: string): number {
  return segmentGraphemes(chunk).reduce((sum, g) => sum + countNeisGraphemeBytes(g), 0);
}

function countNeisBytes(text: string): number {
  let total = 0;
  let lastIndex = 0;
  for (const match of text.matchAll(LINE_BREAK_PATTERN)) {
    const breakIndex = match.index ?? 0;
    total += countNeisChunkBytes(text.slice(lastIndex, breakIndex));
    total += 2; // 줄바꿈 2B (NEIS 룰)
    lastIndex = breakIndex + match[0].length;
  }
  total += countNeisChunkBytes(text.slice(lastIndex));
  return total;
}

export function countCharacters(text: string): CharCountResult {
  if (!text) {
    return {
      charWithSpace: 0,
      charNoSpace: 0,
      bytes: 0,
      words: 0,
      lines: 0,
      sentences: 0,
      korean: 0,
      english: 0,
      bytesNeis: 0,
      codePoints: 0,
      utf16CodeUnits: 0,
    };
  }

  const graphemes = segmentGraphemes(text);
  const charWithSpace = graphemes.length;
  const charNoSpace = graphemes.filter((g) => !/^\s+$/u.test(g)).length;
  const bytes = countUtf8Bytes(text);
  const bytesNeis = countNeisBytes(text);
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const lines = countLines(text);
  const sentences = text.split(/[.!?。]+/).filter((s) => s.trim()).length;
  const korean = (text.match(/[가-힣]/g) || []).length;
  const english = (text.match(/[a-zA-Z]/g) || []).length;

  return {
    charWithSpace,
    charNoSpace,
    bytes,
    words,
    lines,
    sentences,
    korean,
    english,
    bytesNeis,
    codePoints: Array.from(text).length,
    utf16CodeUnits: text.length,
  };
}
