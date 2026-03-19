'use client';

import { useState, useRef } from 'react';
import { getToolById } from '@/lib/tools';
import { ToolLayout } from '@/components/layout/ToolLayout';

const tool = getToolById('image-converter')!;

type Format = 'png' | 'jpeg' | 'webp' | 'avif';

const FORMATS: { id: Format; label: string; mime: string }[] = [
  { id: 'png', label: 'PNG', mime: 'image/png' },
  { id: 'jpeg', label: 'JPG', mime: 'image/jpeg' },
  { id: 'webp', label: 'WebP', mime: 'image/webp' },
  { id: 'avif', label: 'AVIF', mime: 'image/avif' },
];

export default function ImageConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<Format>('webp');
  const [quality, setQuality] = useState(85);
  const [converting, setConverting] = useState(false);
  const [result, setResult] = useState<{ url: string; size: number; name: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (!f.type.startsWith('image/')) return;
    setFile(f);
    setResult(null);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
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
    if (!file || !preview) return;
    setConverting(true);

    try {
      const img = new Image();
      img.src = preview;
      await new Promise(resolve => { img.onload = resolve; });

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);

      const targetMime = FORMATS.find(f => f.id === targetFormat)!.mime;
      const blob = await new Promise<Blob | null>(resolve =>
        canvas.toBlob(resolve, targetMime, quality / 100)
      );

      if (blob) {
        const url = URL.createObjectURL(blob);
        const ext = targetFormat === 'jpeg' ? 'jpg' : targetFormat;
        const baseName = file.name.replace(/\.[^.]+$/, '');
        setResult({ url, size: blob.size, name: `${baseName}.${ext}` });
      }
    } finally {
      setConverting(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <ToolLayout tool={tool} guideContent={
      <div>
        <h2 className="text-xl font-bold mb-4 dark:text-white">이미지 포맷 변환 가이드</h2>
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <div><h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">WebP는 왜 좋은가요?</h3><p>WebP는 JPG 대비 약 30% 작은 용량으로 같은 화질을 제공합니다. 웹사이트 속도 개선에 효과적입니다.</p></div>
          <div><h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">AVIF는 뭔가요?</h3><p>AVIF는 WebP보다 더 뛰어난 압축률을 가진 차세대 이미지 포맷입니다. 최신 브라우저에서 지원됩니다.</p></div>
          <div><h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">내 파일이 서버로 올라가나요?</h3><p>아닙니다. 모든 변환은 브라우저에서 이루어지며, 파일이 서버로 전송되지 않습니다.</p></div>
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
          <div className="text-4xl mb-3">🖼️</div>
          <p className="text-gray-500 dark:text-gray-400 mb-1">이미지를 드래그하거나 클릭하여 업로드</p>
          <p className="text-xs text-gray-400">PNG, JPG, WebP, GIF, BMP, AVIF 지원 (최대 10MB)</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>
      )}

      {/* Preview + Options */}
      {file && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {preview && (
                <img src={preview} alt="preview" className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-600" />
              )}
              <div>
                <p className="font-medium text-sm dark:text-white">{file.name}</p>
                <p className="text-xs text-gray-400">{formatSize(file.size)} | {file.type.split('/')[1]?.toUpperCase()}</p>
              </div>
            </div>
            <button
              onClick={() => { setFile(null); setPreview(null); setResult(null); }}
              className="text-sm text-gray-400 hover:text-red-500 transition"
            >
              삭제
            </button>
          </div>

          {/* Target Format */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">변환할 포맷</label>
            <div className="flex gap-2">
              {FORMATS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setTargetFormat(f.id)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${
                    targetFormat === f.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quality (for lossy formats) */}
          {(targetFormat === 'jpeg' || targetFormat === 'webp' || targetFormat === 'avif') && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                화질: {quality}%
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={e => setQuality(parseInt(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>작은 용량</span>
                <span>높은 화질</span>
              </div>
            </div>
          )}

          {/* Convert Button */}
          <button
            onClick={convert}
            disabled={converting}
            className="w-full py-3 bg-primary hover:bg-primary-dark disabled:bg-gray-300 text-white font-semibold rounded-xl transition text-base"
          >
            {converting ? '변환 중...' : `${FORMATS.find(f => f.id === targetFormat)!.label}로 변환`}
          </button>

          {/* Result */}
          {result && (
            <div className="mt-6 bg-green-50 dark:bg-green-900/20 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium text-green-700 dark:text-green-400 text-sm">변환 완료!</p>
                  <p className="text-xs text-gray-500">{result.name} | {formatSize(result.size)}</p>
                  {file && (
                    <p className="text-xs text-gray-400 mt-1">
                      {result.size < file.size
                        ? `용량 ${((1 - result.size / file.size) * 100).toFixed(0)}% 감소`
                        : `용량 ${((result.size / file.size - 1) * 100).toFixed(0)}% 증가`
                      }
                    </p>
                  )}
                </div>
                <a
                  href={result.url}
                  download={result.name}
                  className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl transition text-sm"
                >
                  다운로드
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </ToolLayout>
  );
}
