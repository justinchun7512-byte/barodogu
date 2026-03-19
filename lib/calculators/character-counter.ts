export interface CharCountResult {
  charWithSpace: number;
  charNoSpace: number;
  bytes: number;
  words: number;
  lines: number;
  sentences: number;
  korean: number;
  english: number;
}

export function countCharacters(text: string): CharCountResult {
  if (!text) {
    return { charWithSpace: 0, charNoSpace: 0, bytes: 0, words: 0, lines: 0, sentences: 0, korean: 0, english: 0 };
  }

  const charWithSpace = text.length;
  const charNoSpace = text.replace(/\s/g, '').length;
  const bytes = new Blob([text]).size;
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const lines = text.split('\n').length;
  const sentences = text.split(/[.!?。]+/).filter(s => s.trim()).length;
  const korean = (text.match(/[\uAC00-\uD7A3]/g) || []).length;
  const english = (text.match(/[a-zA-Z]/g) || []).length;

  return { charWithSpace, charNoSpace, bytes, words, lines, sentences, korean, english };
}
