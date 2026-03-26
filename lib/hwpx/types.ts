export type FileType = 'hwpx' | 'hwp' | 'unknown';

export interface ParagraphStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  fontSize?: number;       // pt
  fontFamily?: string;
  color?: string;          // hex
  backgroundColor?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
}

export interface HwpxRun {
  text: string;
  style: ParagraphStyle;
}

export interface HwpxTableCell {
  runs: HwpxRun[];
  colSpan?: number;
  rowSpan?: number;
}

export interface HwpxTableRow {
  cells: HwpxTableCell[];
}

export interface HwpxTable {
  rows: HwpxTableRow[];
}

export interface HwpxImage {
  /** base64 data URI or blob URL */
  src: string;
  width?: number;
  height?: number;
  alt?: string;
}

export interface HwpxParagraph {
  type: 'text' | 'table' | 'image';
  runs: HwpxRun[];
  style: ParagraphStyle;
  table?: HwpxTable;
  image?: HwpxImage;
}

export interface HwpxSection {
  paragraphs: HwpxParagraph[];
}

export interface HwpxDocument {
  sections: HwpxSection[];
  images: Map<string, string>; // binDataId -> base64 data URI
}
