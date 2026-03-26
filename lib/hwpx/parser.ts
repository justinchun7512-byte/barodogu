import JSZip from 'jszip';
import type {
  FileType,
  HwpxDocument,
  HwpxSection,
  HwpxParagraph,
  HwpxRun,
  HwpxTable,
  HwpxTableRow,
  HwpxTableCell,
  ParagraphStyle,
} from './types';

/**
 * Detect file type by reading the first 4 magic bytes.
 *  - 0x504B0304 (PK..) → HWPX (ZIP-based)
 *  - 0xD0CF11E0         → Legacy HWP (OLE compound)
 */
export async function detectFileType(file: File): Promise<FileType> {
  const buffer = await file.slice(0, 4).arrayBuffer();
  const view = new DataView(buffer);
  const magic = view.getUint32(0, false); // big-endian

  if (magic === 0x504b0304) return 'hwpx';
  if (magic === 0xd0cf11e0) return 'hwp';
  return 'unknown';
}

/**
 * Parse an HWPX file (ZIP archive) and return a structured document.
 */
export async function parseHwpxFile(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<HwpxDocument> {
  onProgress?.(5);

  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);

  onProgress?.(15);

  // ── Extract embedded binary images ──
  const images = new Map<string, string>();
  const binDataFolder = zip.folder('BinData');
  if (binDataFolder) {
    const imageFiles = Object.keys(zip.files).filter((p) =>
      p.startsWith('BinData/') && !zip.files[p].dir,
    );
    for (const path of imageFiles) {
      try {
        const data = await zip.files[path].async('base64');
        const fileName = path.split('/').pop() || '';
        const ext = fileName.split('.').pop()?.toLowerCase() || 'png';
        const mime =
          ext === 'jpg' || ext === 'jpeg'
            ? 'image/jpeg'
            : ext === 'gif'
              ? 'image/gif'
              : ext === 'bmp'
                ? 'image/bmp'
                : 'image/png';
        images.set(fileName, `data:${mime};base64,${data}`);
      } catch {
        // skip unreadable binary
      }
    }
  }

  onProgress?.(30);

  // ── Locate section XML files ──
  // HWPX stores sections in Contents/section0.xml, section1.xml, ...
  const sectionFiles = Object.keys(zip.files)
    .filter((p) => /^Contents\/section\d+\.xml$/i.test(p))
    .sort((a, b) => {
      const na = parseInt(a.match(/section(\d+)/i)?.[1] || '0');
      const nb = parseInt(b.match(/section(\d+)/i)?.[1] || '0');
      return na - nb;
    });

  if (sectionFiles.length === 0) {
    // Some HWPX files use Contents/Section0.xml (capital S) or slightly different paths
    const altSections = Object.keys(zip.files)
      .filter((p) => /section\d*\.xml$/i.test(p) && !zip.files[p].dir)
      .sort();
    if (altSections.length === 0) {
      throw new Error(
        'HWPX 파일에서 섹션 데이터를 찾을 수 없습니다. 파일이 손상되었거나 지원하지 않는 형식입니다.',
      );
    }
    sectionFiles.push(...altSections);
  }

  // Zip bomb 방어: 해제 후 총 크기 제한 (100MB)
  const MAX_UNZIPPED = 100 * 1024 * 1024;
  let totalUnzipped = 0;
  for (const path of Object.keys(zip.files)) {
    if (!zip.files[path].dir) {
      const data = await zip.files[path].async('arraybuffer');
      totalUnzipped += data.byteLength;
      if (totalUnzipped > MAX_UNZIPPED) {
        throw new Error('파일 압축 해제 크기가 100MB를 초과합니다. 파일을 확인해주세요.');
      }
    }
  }

  const sections: HwpxSection[] = [];
  const total = sectionFiles.length;

  for (let i = 0; i < total; i++) {
    const xml = await zip.files[sectionFiles[i]].async('string');
    sections.push(parseSection(xml, images));
    onProgress?.(30 + Math.round(((i + 1) / total) * 60));
  }

  onProgress?.(95);

  return { sections, images };
}

// ────────────────────────────────────────────────────────
// Section XML parser
// ────────────────────────────────────────────────────────

function parseSection(
  xml: string,
  images: Map<string, string>,
): HwpxSection {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');

  // XML 파싱 에러 체크
  const errorNode = doc.querySelector('parsererror');
  if (errorNode) {
    throw new Error('섹션 XML이 손상되었습니다. 파일을 확인해주세요.');
  }

  const paragraphs: HwpxParagraph[] = [];

  // hp:p elements represent paragraphs in HWPX
  const pElements = getAllElements(doc, 'p');

  for (const pEl of pElements) {
    const para = parseParagraph(pEl, images);
    if (para) paragraphs.push(para);
  }

  return { paragraphs };
}

function parseParagraph(
  pEl: Element,
  images: Map<string, string>,
): HwpxParagraph | null {
  // Check for table inside the paragraph
  const tableEl = getElement(pEl, 'tbl');
  if (tableEl) {
    return {
      type: 'table',
      runs: [],
      style: {},
      table: parseTable(tableEl, images),
    };
  }

  // Check for image
  const picEl = getElement(pEl, 'pic');
  if (picEl) {
    const imgPara = parseImageParagraph(picEl, images);
    if (imgPara) return imgPara;
  }

  // Normal text paragraph
  const runs: HwpxRun[] = [];
  const runElements = getAllElements(pEl, 'run');

  if (runElements.length === 0) {
    // Try direct text content (some HWPX variants)
    const text = extractTextContent(pEl);
    if (text.trim()) {
      runs.push({ text, style: {} });
    }
  } else {
    for (const runEl of runElements) {
      const run = parseRun(runEl);
      if (run) runs.push(run);
    }
  }

  // Extract paragraph-level alignment
  const paraStyle = extractParagraphStyle(pEl);

  if (runs.length === 0) return null;

  return {
    type: 'text',
    runs,
    style: paraStyle,
  };
}

function parseRun(runEl: Element): HwpxRun | null {
  // Extract text from <hp:t> or <t> elements
  const tElements = getAllElements(runEl, 't');
  let text = '';
  for (const t of tElements) {
    text += t.textContent || '';
  }

  // Also check for <hp:secPr> or <hp:ctrl> elements - skip them
  if (!text && !runEl.textContent?.trim()) return null;
  if (!text) {
    // Fallback: get all text that isn't in sub-elements we skip
    text = extractTextContent(runEl);
  }

  if (!text) return null;

  const style = extractRunStyle(runEl);

  return { text, style };
}

function parseTable(
  tableEl: Element,
  images: Map<string, string>,
): HwpxTable {
  const rows: HwpxTableRow[] = [];
  const trElements = getAllElements(tableEl, 'tr');

  for (const trEl of trElements) {
    const cells: HwpxTableCell[] = [];
    const tcElements = getAllElements(trEl, 'tc');

    for (const tcEl of tcElements) {
      const cellRuns: HwpxRun[] = [];
      const cellParagraphs = getAllElements(tcEl, 'p');

      for (const cp of cellParagraphs) {
        const cpRuns = getAllElements(cp, 'run');
        for (const r of cpRuns) {
          const run = parseRun(r);
          if (run) cellRuns.push(run);
        }
        if (cpRuns.length === 0) {
          const text = extractTextContent(cp);
          if (text.trim()) {
            cellRuns.push({ text, style: {} });
          }
        }
      }

      // colspan / rowspan from cellAddr or cellSpan
      const colSpan = parseInt(
        tcEl.getAttribute('colSpan') ||
          tcEl.getAttributeNS(null, 'colSpan') ||
          '1',
      );
      const rowSpan = parseInt(
        tcEl.getAttribute('rowSpan') ||
          tcEl.getAttributeNS(null, 'rowSpan') ||
          '1',
      );

      cells.push({ runs: cellRuns, colSpan, rowSpan });
    }

    if (cells.length > 0) rows.push({ cells });
  }

  return { rows };
}

function parseImageParagraph(
  picEl: Element,
  images: Map<string, string>,
): HwpxParagraph | null {
  // Look for binDataId reference
  const binItem =
    getElement(picEl, 'binItem') ||
    getElement(picEl, 'img');

  let src = '';

  if (binItem) {
    const binDataId =
      binItem.getAttribute('binaryItemIDRef') ||
      binItem.getAttribute('binItemIDRef') ||
      binItem.getAttribute('src') ||
      '';

    // Try to match in our images map
    for (const [key, value] of images) {
      if (key.includes(binDataId) || binDataId.includes(key.replace(/\.[^.]+$/, ''))) {
        src = value;
        break;
      }
    }

    // Also try by direct name match
    if (!src && binDataId) {
      const match = images.get(binDataId);
      if (match) src = match;
    }
  }

  if (!src && images.size > 0) {
    // Skip if we can't resolve the image
    return null;
  }

  if (!src) return null;

  return {
    type: 'image',
    runs: [],
    style: {},
    image: { src, alt: 'embedded image' },
  };
}

// ────────────────────────────────────────────────────────
// Style extraction helpers
// ────────────────────────────────────────────────────────

function extractParagraphStyle(pEl: Element): ParagraphStyle {
  const style: ParagraphStyle = {};

  // Look for paragraph properties
  const pPr =
    getElement(pEl, 'paraPr') ||
    getElement(pEl, 'pPr');

  if (pPr) {
    const align =
      pPr.getAttribute('align') ||
      pPr.getAttribute('textAlign') ||
      getElement(pPr, 'align')?.textContent;

    if (align) {
      const alignMap: Record<string, ParagraphStyle['textAlign']> = {
        LEFT: 'left',
        left: 'left',
        CENTER: 'center',
        center: 'center',
        RIGHT: 'right',
        right: 'right',
        JUSTIFY: 'justify',
        justify: 'justify',
        BOTH: 'justify',
        both: 'justify',
      };
      style.textAlign = alignMap[align];
    }
  }

  return style;
}

function extractRunStyle(runEl: Element): ParagraphStyle {
  const style: ParagraphStyle = {};

  const rPr =
    getElement(runEl, 'charPr') ||
    getElement(runEl, 'rPr');

  if (!rPr) return style;

  // Bold
  if (
    rPr.getAttribute('bold') === '1' ||
    rPr.getAttribute('bold') === 'true' ||
    getElement(rPr, 'bold')
  ) {
    style.bold = true;
  }

  // Italic
  if (
    rPr.getAttribute('italic') === '1' ||
    rPr.getAttribute('italic') === 'true' ||
    getElement(rPr, 'italic')
  ) {
    style.italic = true;
  }

  // Underline
  if (
    rPr.getAttribute('underline') ||
    getElement(rPr, 'underline')
  ) {
    const val = rPr.getAttribute('underline') || '';
    if (val !== '0' && val !== 'none' && val !== 'NONE') {
      style.underline = true;
    }
  }

  // Strikethrough
  if (
    rPr.getAttribute('strikeout') ||
    rPr.getAttribute('strikethrough')
  ) {
    style.strikethrough = true;
  }

  // Font size (stored in half-points or hundredths in HWPX)
  const sizeAttr =
    rPr.getAttribute('sz') ||
    rPr.getAttribute('height');
  if (sizeAttr) {
    const sizeVal = parseInt(sizeAttr);
    if (sizeVal > 0) {
      // HWPX uses hundredths of a point (e.g., 1000 = 10pt)
      style.fontSize = sizeVal >= 100 ? sizeVal / 100 : sizeVal;
    }
  }

  // Font family
  const fontFace =
    getElement(rPr, 'fontRef') ||
    getElement(rPr, 'fontface');
  if (fontFace) {
    const face =
      fontFace.getAttribute('hangul') ||
      fontFace.getAttribute('latin') ||
      fontFace.textContent;
    if (face) style.fontFamily = face;
  }

  // Color
  const colorAttr = rPr.getAttribute('color');
  if (colorAttr && colorAttr !== '0') {
    style.color = normalizeColor(colorAttr);
  }

  return style;
}

// ────────────────────────────────────────────────────────
// XML helpers – namespace-agnostic element lookup
// ────────────────────────────────────────────────────────

/**
 * Find the first element with a given local name, ignoring namespace prefixes.
 * This handles HWPX's hp: namespace gracefully.
 */
function getElement(parent: Element | Document, localName: string): Element | null {
  // Try direct
  const direct = parent.getElementsByTagName(localName);
  if (direct.length > 0) return direct[0];

  // Try with hp: prefix
  const prefixed = parent.getElementsByTagName(`hp:${localName}`);
  if (prefixed.length > 0) return prefixed[0];

  // Try with ha: prefix (HWPX app namespace)
  const ha = parent.getElementsByTagName(`ha:${localName}`);
  if (ha.length > 0) return ha[0];

  // Try with hc: prefix (HWPX core namespace)
  const hc = parent.getElementsByTagName(`hc:${localName}`);
  if (hc.length > 0) return hc[0];

  // Namespace-aware search
  const all = parent.getElementsByTagName('*');
  for (let i = 0; i < all.length; i++) {
    if (all[i].localName === localName) return all[i];
  }

  return null;
}

function getAllElements(parent: Element | Document, localName: string): Element[] {
  const results: Element[] = [];

  // Collect from all common prefixes
  const tags = [
    ...Array.from(parent.getElementsByTagName(localName)),
    ...Array.from(parent.getElementsByTagName(`hp:${localName}`)),
    ...Array.from(parent.getElementsByTagName(`ha:${localName}`)),
    ...Array.from(parent.getElementsByTagName(`hc:${localName}`)),
  ];

  // Deduplicate
  const seen = new Set<Element>();
  for (const el of tags) {
    if (!seen.has(el)) {
      seen.add(el);
      results.push(el);
    }
  }

  // Fallback: localName match
  if (results.length === 0) {
    const all = parent.getElementsByTagName('*');
    for (let i = 0; i < all.length; i++) {
      if (all[i].localName === localName && !seen.has(all[i])) {
        results.push(all[i]);
      }
    }
  }

  return results;
}

function extractTextContent(el: Element): string {
  let text = '';
  // Get text from <t> elements or direct text nodes
  const tElements = getAllElements(el, 't');
  if (tElements.length > 0) {
    for (const t of tElements) {
      text += t.textContent || '';
    }
  }
  if (!text) {
    // Collect only direct text node children
    for (const child of Array.from(el.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        text += child.textContent || '';
      }
    }
  }
  return text;
}

function normalizeColor(color: string): string {
  if (color.startsWith('#')) return color;
  // HWPX may store colors as decimal or hex without #
  if (/^\d+$/.test(color)) {
    const num = parseInt(color);
    return '#' + num.toString(16).padStart(6, '0');
  }
  return '#' + color;
}
