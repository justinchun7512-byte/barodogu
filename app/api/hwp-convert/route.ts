import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const format = (formData.get('format') as string) || 'text';

    if (!file) {
      return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 });
    }

    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: '파일 크기가 20MB를 초과합니다.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 네이티브 바인딩 사용 (dist/index.js)
    const hwpjs = await import('@ohah/hwpjs');

    if (format === 'text') {
      const result = hwpjs.toMarkdown(buffer);
      return NextResponse.json({ result: result.markdown, format: 'text' });
    } else {
      const html = hwpjs.toHtml(buffer);
      return NextResponse.json({ result: html, format: 'html' });
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : '알 수 없는 오류';
    return NextResponse.json(
      { error: `HWP 변환 실패: ${msg}` },
      { status: 500 },
    );
  }
}
