'use client';

import { useState, useRef } from 'react';
import { getToolById } from '@/lib/tools';
import { ToolLayout } from '@/components/layout/ToolLayout';

const tool = getToolById('pdf-to-image')!;

type OutputFormat = 'jpeg' | 'png';

interface PageImage {
  pageNum: number;
  url: string;
  blob: Blob;
}

export default function PdfToImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<OutputFormat>('jpeg');
  const [scale, setScale] = useState(2);
  const [converting, setConverting] = useState(false);
  const [pages, setPages] = useState<PageImage[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (f.type !== 'application/pdf') return;
    setFile(f);
    setPages([]);
    setProgress(0);
  };

  const preventDefaults = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    preventDefaults(e);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const convert = async () => {
    if (!file) return;
    setConverting(true);
    setPages([]);
    setProgress(0);

    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setTotalPages(pdf.numPages);

      const results: PageImage[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;

        await page.render({ canvasContext: ctx, viewport, canvas } as never).promise;

        const blob = await new Promise<Blob>((resolve) =>
          canvas.toBlob((b) => resolve(b!), `image/${format}`, 0.92)
        );

        const url = URL.createObjectURL(blob);
        results.push({ pageNum: i, url, blob });
        setProgress(Math.round((i / pdf.numPages) * 100));
      }

      setPages(results);
    } catch (err) {
      console.error(err);
      alert('PDF 변환 중 오류가 발생했습니다. 다른 PDF 파일을 시도해주세요.');
    } finally {
      setConverting(false);
    }
  };

  const downloadPage = (page: PageImage) => {
    const ext = format === 'jpeg' ? 'jpg' : 'png';
    const baseName = file?.name.replace(/\.pdf$/i, '') || 'page';
    const a = document.createElement('a');
    a.href = page.url;
    a.download = `${baseName}_${page.pageNum}.${ext}`;
    a.click();
  };

  const downloadAll = async () => {
    if (pages.length === 1) {
      downloadPage(pages[0]);
      return;
    }
    const { default: JSZip } = await import('jszip');
    const { saveAs } = await import('file-saver');
    const zip = new JSZip();
    const ext = format === 'jpeg' ? 'jpg' : 'png';
    const baseName = file?.name.replace(/\.pdf$/i, '') || 'pdf';

    pages.forEach((page) => {
      zip.file(`${baseName}_${page.pageNum}.${ext}`, page.blob);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${baseName}_images.zip`);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <ToolLayout tool={tool} guideContent={
      <div>
        <h2 className="text-xl font-bold mb-4 dark:text-white">PDF 이미지 변환 가이드</h2>
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <div><h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">어떤 경우에 사용하나요?</h3><p>PDF 문서의 특정 페이지를 이미지로 저장하고 싶을 때, 프레젠테이션이나 SNS에 공유하고 싶을 때 유용합니다.</p></div>
          <div><h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">해상도는 어떻게 되나요?</h3><p>배율(scale)을 높이면 더 선명한 이미지를 얻을 수 있습니다. 1x는 기본, 2x는 선명, 3x는 고해상도입니다.</p></div>
          <div><h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">PDF가 서버로 올라가나요?</h3><p>아닙니다. 모든 변환은 브라우저에서 이루어집니다. PDF 파일이 서버로 전송되지 않습니다.</p></div>
        </div>
      </div>
    }>
      {/* Upload */}
      {!file && (
        <div
          onDragOver={preventDefaults}
          onDragEnter={preventDefaults}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center hover:border-primary transition cursor-pointer"
        >
          <div className="text-4xl mb-3">📄</div>
          <p className="text-gray-500 dark:text-gray-400 mb-1">PDF 파일을 드래그하거나 클릭하여 업로드</p>
          <p className="text-xs text-gray-400">최대 50MB</p>
          <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>
      )}

      {/* Options + Convert */}
      {file && pages.length === 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="font-medium text-sm dark:text-white">{file.name}</p>
              <p className="text-xs text-gray-400">{formatSize(file.size)}</p>
            </div>
            <button onClick={() => { setFile(null); setPages([]); }} className="text-sm text-gray-400 hover:text-red-500">삭제</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">출력 포맷</label>
              <div className="flex gap-2">
                {(['jpeg', 'png'] as OutputFormat[]).map(f => (
                  <button key={f} onClick={() => setFormat(f)} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${format === f ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-300'}`}>
                    {f === 'jpeg' ? 'JPG' : 'PNG'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">해상도: {scale}x</label>
              <input type="range" min="1" max="3" step="0.5" value={scale} onChange={e => setScale(parseFloat(e.target.value))} className="w-full accent-primary" />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>1x 기본</span><span>2x 선명</span><span>3x 고해상도</span>
              </div>
            </div>
          </div>

          <button onClick={convert} disabled={converting} className="w-full py-3 bg-primary hover:bg-primary-dark disabled:bg-gray-300 text-white font-semibold rounded-xl transition">
            {converting ? `변환 중... ${progress}%` : '이미지로 변환'}
          </button>

          {converting && (
            <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
      )}

      {/* Results */}
      {pages.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="font-medium dark:text-white">변환 완료! {pages.length}페이지</p>
            <div className="flex gap-2">
              <button onClick={() => { setFile(null); setPages([]); }} className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">다시 하기</button>
              <button onClick={downloadAll} className="px-4 py-1.5 text-sm bg-primary hover:bg-primary-dark text-white rounded-lg transition font-medium">
                {pages.length > 1 ? 'ZIP 전체 다운로드' : '다운로드'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {pages.map(page => (
              <div key={page.pageNum} className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden group relative">
                <img src={page.url} alt={`Page ${page.pageNum}`} className="w-full" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <button onClick={() => downloadPage(page)} className="px-3 py-1.5 bg-white text-gray-900 rounded-lg text-xs font-medium">
                    {page.pageNum}페이지 다운로드
                  </button>
                </div>
                <div className="p-2 text-xs text-gray-500 text-center">{page.pageNum} / {totalPages} | {formatSize(page.blob.size)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
