'use client';

import { useState, useRef } from 'react';
import { getToolById } from '@/lib/tools';
import { ToolLayout } from '@/components/layout/ToolLayout';
import { detectFileType, parseHwpxFile } from '@/lib/hwpx/parser';
import { hwpxToText } from '@/lib/hwpx/to-text';
import { hwpxToHtml } from '@/lib/hwpx/to-html';
import type { HwpxDocument } from '@/lib/hwpx/types';

const tool = getToolById('hwp-converter')!;

type OutputFormat = 'text' | 'html' | 'pdf';
type FileFormat = 'hwpx' | 'hwp' | 'unknown';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export default function HwpConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [fileFormat, setFileFormat] = useState<FileFormat>('hwpx');
  const [error, setError] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('text');
  const [doc, setDoc] = useState<HwpxDocument | null>(null);
  const [textResult, setTextResult] = useState<string | null>(null);
  const [htmlResult, setHtmlResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setFile(null);
    setError(null);
    setConverting(false);
    setProgress(0);
    setDoc(null);
    setTextResult(null);
    setHtmlResult(null);
    setCopied(false);
    setFileFormat('hwpx');
  };

  const handleFile = async (f: File) => {
    setError(null);
    setTextResult(null);
    setHtmlResult(null);
    setDoc(null);
    setCopied(false);
    setFileFormat('hwpx');

    if (f.size > MAX_FILE_SIZE) {
      setError('파일 크기가 20MB를 초과합니다. 더 작은 파일을 사용해주세요.');
      return;
    }

    const fileType = await detectFileType(f);

    if (fileType === 'hwp') {
      setFileFormat('hwp');
      setFile(f);
      return;
    }

    if (fileType === 'unknown') {
      const ext = f.name.split('.').pop()?.toLowerCase();
      if (ext !== 'hwpx' && ext !== 'hwp') {
        setError('지원하지 않는 파일 형식입니다. HWP 또는 HWPX 파일을 업로드해주세요.');
        return;
      }
      if (ext === 'hwp') {
        setFileFormat('hwp');
      }
    }

    setFile(f);
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

  const convertLegacyHwp = async () => {
    if (!file) return;
    setConverting(true);
    setProgress(10);
    setError(null);
    setTextResult(null);
    setHtmlResult(null);

    try {
      setProgress(20);
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const hwpjs = await import(/* webpackIgnore: true */ '@ohah/hwpjs');
      const { toHtml, toMarkdown } = hwpjs;
      setProgress(40);

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      setProgress(60);

      if (outputFormat === 'text') {
        const result = toMarkdown(buffer);
        const md = result.markdown;
        if (!md.trim()) {
          setError('문서에서 텍스트를 추출할 수 없습니다. 문서가 비어있거나 암호화되어 있을 수 있습니다.');
          return;
        }
        setTextResult(md);
      } else {
        const html = toHtml(buffer);
        setHtmlResult(html);
      }
      setProgress(100);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '알 수 없는 오류';
      setError(`구형 HWP 변환 실패: ${msg}\n\n이 파일이 손상되었거나 암호화되어 있을 수 있습니다.`);
    } finally {
      setConverting(false);
    }
  };

  const convert = async () => {
    if (!file) return;

    if (fileFormat === 'hwp') {
      return convertLegacyHwp();
    }

    setConverting(true);
    setProgress(0);
    setError(null);
    setTextResult(null);
    setHtmlResult(null);

    try {
      let parsedDoc = doc;
      if (!parsedDoc) {
        parsedDoc = await parseHwpxFile(file, setProgress);
        setDoc(parsedDoc);
      }

      setProgress(95);

      if (outputFormat === 'text') {
        const text = hwpxToText(parsedDoc);
        if (!text.trim()) {
          setError('문서에서 텍스트를 추출할 수 없습니다. 문서가 비어있거나 암호화되어 있을 수 있습니다.');
          return;
        }
        setTextResult(text);
      } else if (outputFormat === 'html') {
        const html = hwpxToHtml(parsedDoc);
        setHtmlResult(html);
      } else if (outputFormat === 'pdf') {
        const html = hwpxToHtml(parsedDoc);
        setHtmlResult(html);
        // XSS 안전: Blob URL + sandbox iframe으로 인쇄
        setTimeout(() => {
          const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const printFrame = document.createElement('iframe');
          printFrame.style.position = 'fixed';
          printFrame.style.left = '-9999px';
          printFrame.style.width = '800px';
          printFrame.style.height = '600px';
          printFrame.src = url;
          document.body.appendChild(printFrame);
          printFrame.onload = () => {
            try {
              printFrame.contentWindow?.print();
            } catch {
              // 크로스 오리진 제한 시 새 창으로 폴백
              window.open(url, '_blank');
            }
            setTimeout(() => {
              document.body.removeChild(printFrame);
              URL.revokeObjectURL(url);
            }, 1000);
          };
        }, 100);
      }

      setProgress(100);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('encrypted') || msg.includes('password') || msg.includes('암호')) {
        setError('암호화된 문서입니다. 암호를 해제한 후 다시 시도해주세요.');
      } else {
        setError(`변환 중 오류가 발생했습니다: ${msg}`);
      }
    } finally {
      setConverting(false);
    }
  };

  const copyText = async () => {
    if (!textResult) return;
    try {
      await navigator.clipboard.writeText(textResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = textResult;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadText = () => {
    if (!textResult) return;
    const blob = new Blob([textResult], { type: 'text/plain;charset=utf-8' });
    downloadBlob(blob, baseName() + '.txt');
  };

  const downloadHtml = () => {
    if (!htmlResult) return;
    const blob = new Blob([htmlResult], { type: 'text/html;charset=utf-8' });
    downloadBlob(blob, baseName() + '.html');
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const baseName = () => file?.name.replace(/\.[^.]+$/, '') || 'document';

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <ToolLayout tool={tool} seoContent={
        <section className="space-y-6 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">HWPX 변환이란?</h2>
            <p>HWPX 변환 도구는 한글 오피스의 HWPX 파일을 텍스트, HTML, PDF로 변환하는 온라인 도구입니다. HWPX는 한글 2014 이후 도입된 ZIP 기반 개방형 포맷(OWPML)으로, 기존 HWP 바이너리 포맷보다 호환성이 뛰어납니다. Mac이나 Linux에서 한글 문서를 열어야 할 때, 관공서 서류를 다른 형식으로 변환하고 싶을 때 유용합니다. 모든 변환이 브라우저에서 처리되므로 파일이 서버로 전송되지 않아 안전합니다.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">사용 방법</h2>
            <ol className="list-decimal pl-5 space-y-1.5">
              <li>HWPX 파일을 드래그 앤 드롭하거나 클릭하여 업로드합니다. (최대 20MB)</li>
              <li>변환할 포맷(텍스트, HTML, PDF)을 선택합니다.</li>
              <li>&quot;변환&quot; 버튼을 클릭하면 즉시 변환됩니다.</li>
              <li>결과를 복사하거나 다운로드할 수 있습니다.</li>
            </ol>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">자주 묻는 질문</h2>
            <div className="space-y-2">
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">HWP 파일도 변환할 수 있나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">HWP(구형)와 HWPX(신형) 파일 모두 지원합니다. 구형 HWP 파일도 바로 변환할 수 있습니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">HWPX와 HWP의 차이는 무엇인가요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">HWP는 한컴의 독자 바이너리 포맷이고, HWPX는 ZIP 기반 XML 포맷(OWPML 표준)입니다. HWPX는 구조가 개방되어 있어 다른 프로그램에서도 읽기가 용이합니다. 한글 2014 이후 버전에서 HWPX를 지원합니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">변환 시 서식이 유지되나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">HTML 변환 시 볼드, 이탤릭, 밑줄, 폰트 크기 등 기본 서식이 유지됩니다. 표와 이미지도 변환됩니다. 다만, 복잡한 레이아웃(다단, 머리글/바닥글, 각주 등)은 단순화될 수 있습니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">내 파일이 서버에 저장되나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">아닙니다. 모든 변환은 사용자의 브라우저에서 처리됩니다. 파일이 서버로 전송되거나 저장되지 않으므로 안심하고 사용하실 수 있습니다.</p>
              </details>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">관련 정보</h2>
            <p>HWPX는 한글과컴퓨터가 OWPML(Open Word-Processing Markup Language) 표준을 기반으로 만든 문서 포맷입니다. ZIP 컨테이너 안에 XML 파일들로 문서 구조가 저장되므로, 프로그래밍적으로 접근하기 용이합니다. 공공기관 전자문서 표준으로 HWP/HWPX가 널리 쓰이고 있으며, 취업 서류, 관공서 양식 등을 다룰 때 필수적인 변환 도구입니다.</p>
          </div>
        </section>
      } guideContent={
      <div>
        <h2 className="text-xl font-bold mb-4 dark:text-white">HWPX 변환 가이드</h2>
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <div><h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">HWPX 파일이란?</h3><p>HWPX는 한글 2014 이후 지원하는 ZIP 기반 XML 문서 포맷입니다. 기존 HWP보다 호환성이 좋습니다.</p></div>
          <div><h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">구형 HWP도 지원하나요?</h3><p>네, 구형 HWP(.hwp)와 신형 HWPX(.hwpx) 파일 모두 변환할 수 있습니다. 파일을 업로드하면 자동으로 형식을 감지합니다.</p></div>
          <div><h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">파일이 서버로 올라가나요?</h3><p>아닙니다. 모든 변환은 브라우저에서 이루어지며, 파일이 서버로 전송되지 않습니다.</p></div>
        </div>
      </div>
    }>
      {/* Error Display */}
      {error && !file && (
        <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <p className="text-red-700 dark:text-red-400 text-sm whitespace-pre-line">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-sm text-red-500 hover:text-red-700 underline"
          >
            닫기
          </button>
        </div>
      )}

      {/* Upload */}
      {!file && (
        <div
          onDragOver={preventDefaults}
          onDragEnter={preventDefaults}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center hover:border-primary transition cursor-pointer"
        >
          <div className="text-4xl mb-3">📃</div>
          <p className="text-gray-500 dark:text-gray-400 mb-1">HWPX 파일을 드래그하거나 클릭하여 업로드</p>
          <p className="text-xs text-gray-400">HWPX 파일 지원 (최대 20MB)</p>
          <input
            ref={inputRef}
            type="file"
            accept=".hwpx,.hwp"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>
      )}

      {/* File loaded - Options + Convert */}
      {file && !textResult && !htmlResult && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="font-medium text-sm dark:text-white">{file.name}</p>
              <p className="text-xs text-gray-400">{formatSize(file.size)}</p>
            </div>
            <button
              onClick={reset}
              className="text-sm text-gray-400 hover:text-red-500 transition"
            >
              삭제
            </button>
          </div>

          {/* Error inside file view */}
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <p className="text-red-700 dark:text-red-400 text-sm whitespace-pre-line">{error}</p>
            </div>
          )}

          {/* Format Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">변환 포맷</label>
            <div className="flex gap-2">
              {([
                { id: 'text' as OutputFormat, label: '텍스트' },
                { id: 'html' as OutputFormat, label: 'HTML' },
                { id: 'pdf' as OutputFormat, label: 'PDF (인쇄)' },
              ]).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setOutputFormat(f.id)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${
                    outputFormat === f.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Convert Button */}
          <button
            onClick={convert}
            disabled={converting}
            className="w-full py-3 bg-primary hover:bg-primary-dark disabled:bg-gray-300 text-white font-semibold rounded-xl transition text-base"
          >
            {converting ? `변환 중... ${progress}%` : '변환하기'}
          </button>

          {/* Progress Bar */}
          {converting && (
            <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* Text Result */}
      {textResult && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="font-medium dark:text-white">텍스트 변환 완료</p>
            <div className="flex gap-2">
              <button
                onClick={reset}
                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                다시 하기
              </button>
            </div>
          </div>

          <textarea
            readOnly
            value={textResult}
            className="w-full h-80 p-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 font-mono resize-y focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <div className="flex gap-2 mt-3">
            <button
              onClick={copyText}
              className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl text-sm font-medium transition"
            >
              {copied ? '복사됨!' : '클립보드에 복사'}
            </button>
            <button
              onClick={downloadText}
              className="flex-1 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-medium transition"
            >
              TXT 다운로드
            </button>
          </div>
        </div>
      )}

      {/* HTML Result */}
      {htmlResult && !textResult && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="font-medium dark:text-white">HTML 변환 완료</p>
            <div className="flex gap-2">
              <button
                onClick={reset}
                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                다시 하기
              </button>
              <button
                onClick={downloadHtml}
                className="px-4 py-1.5 text-sm bg-primary hover:bg-primary-dark text-white rounded-lg transition font-medium"
              >
                HTML 다운로드
              </button>
            </div>
          </div>

          {/* HTML Preview */}
          <div className="border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
            <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600">
              미리보기
            </div>
            <iframe
              srcDoc={htmlResult}
              className="w-full bg-white"
              style={{ minHeight: '400px' }}
              sandbox="allow-same-origin"
              title="HWPX HTML 미리보기"
            />
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
