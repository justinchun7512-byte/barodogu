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
      // Dynamic import with type assertion for pdfjs-dist
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pdfjsLib = await import('pdfjs-dist') as any;

      // Worker를 로컬 public/ 에서 로드 (CDN 의존 제거)
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

      const arrayBuffer = await file.arrayBuffer();

      // getDocument 호출 - Uint8Array 사용
      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer),
        cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/cmaps/',
        cMapPacked: true,
      });

      const pdf = await loadingTask.promise;
      setTotalPages(pdf.numPages);

      const results: PageImage[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error(`Failed to get 2D context for page ${i}`);
        }

        // render() 메소드 호출
        const renderTask = page.render({
          canvasContext: ctx,
          viewport: viewport,
        });

        await renderTask.promise;

        // Canvas를 Blob으로 변환
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (b) => {
              if (b) {
                resolve(b);
              } else {
                reject(new Error(`Failed to convert page ${i} to blob`));
              }
            },
            `image/${format}`,
            0.92
          );
        });

        const url = URL.createObjectURL(blob);
        results.push({ pageNum: i, url, blob });
        setProgress(Math.round((i / pdf.numPages) * 100));
      }

      setPages(results);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('PDF conversion error:', errorMessage, err);
      alert(
        `PDF 변환 중 오류가 발생했습니다:\n${errorMessage}\n\n다른 PDF 파일을 시도해주세요.`
      );
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
    <ToolLayout tool={tool} seoContent={
        <section className="space-y-6 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">PDF 이미지 변환이란?</h2>
            <p>PDF 이미지 변환 도구는 PDF 문서의 각 페이지를 JPG 또는 PNG 이미지로 변환해주는 온라인 도구입니다. 프레젠테이션 자료, 보고서, 논문 등의 PDF 파일에서 특정 페이지를 이미지로 추출하여 SNS 공유, 블로그 삽입, 카카오톡 전송 등에 활용할 수 있습니다. 1x부터 3x까지 해상도를 조절할 수 있으며, 여러 페이지를 ZIP 파일로 일괄 다운로드하는 기능도 제공합니다. 모든 변환이 브라우저에서 처리되어 파일이 서버로 전송되지 않습니다.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">사용 방법</h2>
            <ol className="list-decimal pl-5 space-y-1.5">
              <li>PDF 파일을 드래그 앤 드롭하거나 클릭하여 업로드합니다. (최대 50MB)</li>
              <li>출력 포맷(JPG 또는 PNG)을 선택합니다.</li>
              <li>해상도를 설정합니다. (1x 기본, 2x 선명, 3x 고해상도)</li>
              <li>&quot;이미지로 변환&quot; 버튼을 클릭하면 각 페이지가 순차적으로 변환됩니다.</li>
              <li>개별 페이지를 다운로드하거나 전체를 ZIP 파일로 한번에 다운로드할 수 있습니다.</li>
            </ol>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">자주 묻는 질문</h2>
            <div className="space-y-2">
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">JPG와 PNG 중 어떤 포맷을 선택해야 하나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">사진이 많은 PDF는 JPG가 용량이 작아 유리합니다. 텍스트나 도표가 많은 문서는 PNG가 더 선명합니다. SNS 공유용이라면 JPG, 인쇄나 고화질이 필요하면 PNG를 추천합니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">해상도(배율)는 어떤 차이가 있나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">1x는 PDF 원본 해상도(보통 72dpi) 그대로입니다. 2x는 144dpi로 일반 용도에 충분히 선명하며, 3x는 216dpi로 인쇄용이나 확대 사용에 적합합니다. 배율이 높을수록 파일 크기도 커집니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">PDF 파일이 서버에 저장되나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">아닙니다. 모든 변환 과정은 사용자의 브라우저에서 처리됩니다. PDF 파일이 서버로 전송되거나 저장되지 않으므로 기밀 문서도 안전하게 변환할 수 있습니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">몇 페이지까지 변환할 수 있나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">페이지 수에 제한은 없지만, 페이지가 많고 해상도가 높을수록 변환 시간이 길어지고 메모리를 많이 사용합니다. 50페이지 이상의 대용량 PDF는 2x 이하 해상도를 권장합니다.</p>
              </details>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">관련 정보</h2>
            <p>PDF(Portable Document Format)는 Adobe가 개발한 문서 포맷으로, 어떤 환경에서든 동일한 레이아웃을 유지하는 것이 특징입니다. PDF를 이미지로 변환하면 별도의 PDF 뷰어 없이 이미지 뷰어만으로 내용을 확인할 수 있어, 모바일 메신저나 SNS에서 공유하기 편리합니다. 본 도구는 PDF.js 라이브러리를 활용하여 브라우저에서 직접 PDF를 렌더링하므로, 별도의 프로그램 설치가 필요 없습니다.</p>
          </div>
        </section>
      } guideContent={
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
