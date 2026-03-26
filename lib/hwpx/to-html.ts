import type {
  HwpxDocument,
  HwpxParagraph,
  HwpxRun,
  HwpxTable,
  ParagraphStyle,
} from './types';

/**
 * Convert an HwpxDocument to a styled HTML string.
 */
export function hwpxToHtml(doc: HwpxDocument): string {
  const bodyParts: string[] = [];

  for (const section of doc.sections) {
    for (const para of section.paragraphs) {
      bodyParts.push(paragraphToHtml(para));
    }
  }

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>HWPX 변환 결과</title>
<style>
  body {
    font-family: 'Malgun Gothic', '맑은 고딕', sans-serif;
    line-height: 1.8;
    max-width: 800px;
    margin: 0 auto;
    padding: 24px;
    color: #333;
  }
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 8px 0;
  }
  td, th {
    border: 1px solid #ccc;
    padding: 6px 10px;
    text-align: left;
    vertical-align: top;
  }
  img {
    max-width: 100%;
    height: auto;
  }
  p {
    margin: 4px 0;
  }
  @media print {
    body { max-width: none; padding: 0; }
  }
</style>
</head>
<body>
${bodyParts.join('\n')}
</body>
</html>`;
}

function paragraphToHtml(para: HwpxParagraph): string {
  switch (para.type) {
    case 'table':
      return tableToHtml(para.table);
    case 'image':
      return imageToHtml(para);
    case 'text':
    default:
      return textParagraphToHtml(para);
  }
}

function textParagraphToHtml(para: HwpxParagraph): string {
  const innerHtml = para.runs.map(runToHtml).join('');
  if (!innerHtml.trim()) return '<p>&nbsp;</p>';

  const styleAttr = paragraphStyleToCSS(para.style);
  return `<p${styleAttr}>${innerHtml}</p>`;
}

function runToHtml(run: HwpxRun): string {
  let text = escapeHtml(run.text);

  if (run.style.bold) text = `<strong>${text}</strong>`;
  if (run.style.italic) text = `<em>${text}</em>`;
  if (run.style.underline) text = `<u>${text}</u>`;
  if (run.style.strikethrough) text = `<del>${text}</del>`;

  const css = runStyleToCSS(run.style);
  if (css) {
    return `<span style="${css}">${text}</span>`;
  }

  return text;
}

function tableToHtml(table?: HwpxTable): string {
  if (!table) return '';

  const rows = table.rows
    .map((row) => {
      const cells = row.cells
        .map((cell) => {
          const content = cell.runs.map(runToHtml).join('') || '&nbsp;';
          const attrs: string[] = [];
          if (cell.colSpan && cell.colSpan > 1) attrs.push(`colspan="${cell.colSpan}"`);
          if (cell.rowSpan && cell.rowSpan > 1) attrs.push(`rowspan="${cell.rowSpan}"`);
          return `<td${attrs.length ? ' ' + attrs.join(' ') : ''}>${content}</td>`;
        })
        .join('');
      return `<tr>${cells}</tr>`;
    })
    .join('\n');

  return `<table>\n${rows}\n</table>`;
}

function imageToHtml(para: HwpxParagraph): string {
  if (!para.image?.src) return '<p>[이미지]</p>';
  // XSS 방어: data:image/ URI만 허용 (javascript: 등 차단)
  if (!para.image.src.startsWith('data:image/')) {
    return '<p>[이미지: 지원하지 않는 형식]</p>';
  }
  const alt = escapeHtml(para.image.alt || '');
  const style = para.image.width ? ` style="max-width:${para.image.width}px"` : '';
  return `<p><img src="${para.image.src}" alt="${alt}"${style} /></p>`;
}

// ────────────────────────────────────────────────────────
// CSS helpers
// ────────────────────────────────────────────────────────

function paragraphStyleToCSS(style: ParagraphStyle): string {
  const parts: string[] = [];
  if (style.textAlign) parts.push(`text-align:${style.textAlign}`);
  if (parts.length === 0) return '';
  return ` style="${parts.join(';')}"`;
}

/** CSS 값에서 위험 문자 제거 (CSS Injection 방어) */
function sanitizeCSSValue(val: string): string {
  return val.replace(/[;{}()\\'"<>]/g, '');
}

function runStyleToCSS(style: ParagraphStyle): string {
  const parts: string[] = [];
  if (style.fontSize) parts.push(`font-size:${style.fontSize}pt`);
  if (style.fontFamily) parts.push(`font-family:'${sanitizeCSSValue(style.fontFamily)}',sans-serif`);
  if (style.color && style.color !== '#000000') {
    const safeColor = sanitizeCSSValue(style.color);
    if (/^#[0-9a-fA-F]{3,8}$/.test(safeColor)) parts.push(`color:${safeColor}`);
  }
  if (style.backgroundColor) {
    const safeBg = sanitizeCSSValue(style.backgroundColor);
    if (/^#[0-9a-fA-F]{3,8}$/.test(safeBg)) parts.push(`background-color:${safeBg}`);
  }
  return parts.join(';');
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
