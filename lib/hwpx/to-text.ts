import type { HwpxDocument, HwpxParagraph, HwpxRun } from './types';

/**
 * Convert an HwpxDocument to plain text.
 * - Paragraphs separated by newlines
 * - Table cells separated by tabs, rows by newlines
 */
export function hwpxToText(doc: HwpxDocument): string {
  const parts: string[] = [];

  for (const section of doc.sections) {
    for (const para of section.paragraphs) {
      const line = paragraphToText(para);
      if (line !== null) parts.push(line);
    }
  }

  return parts.join('\n');
}

function paragraphToText(para: HwpxParagraph): string | null {
  switch (para.type) {
    case 'table':
      return tableToText(para);
    case 'image':
      return '[이미지]';
    case 'text':
    default:
      return runsToText(para.runs);
  }
}

function runsToText(runs: HwpxRun[]): string {
  return runs.map((r) => r.text).join('');
}

function tableToText(para: HwpxParagraph): string {
  if (!para.table) return '';

  return para.table.rows
    .map((row) =>
      row.cells.map((cell) => runsToText(cell.runs).trim()).join('\t'),
    )
    .join('\n');
}
