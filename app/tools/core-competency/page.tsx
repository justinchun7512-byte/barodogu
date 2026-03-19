'use client';

import { useState, useRef, useCallback } from 'react';
import { getToolById } from '@/lib/tools';
import { ToolLayout } from '@/components/layout/ToolLayout';

const tool = getToolById('core-competency')!;

interface Competency {
  order: number;
  category: string;
  title: string;
  description: string;
  source: string;
  period: string;
  recency: 'current' | 'recent' | 'mid' | 'old';
  matchedKeywords: string[];
}

interface Gap {
  requirement: string;
  severity: 'missing' | 'partial';
  suggestion: string;
}

interface TransformResult {
  matchScore: number;
  competencies: Competency[];
  gaps: Gap[];
}

const RECENCY_CONFIG: Record<string, { label: string; bg: string; dot: string }> = {
  current: { label: '현재 재직', bg: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-600' },
  recent: { label: '최근 3년', bg: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-600' },
  mid: { label: '3~5년 전', bg: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
  old: { label: '5년 이상', bg: 'bg-gray-100 text-gray-500', dot: 'bg-gray-400' },
};

export default function CoreCompetencyPage() {
  const [jdTasks, setJdTasks] = useState('');
  const [jdRequirements, setJdRequirements] = useState('');
  const [jdPreferred, setJdPreferred] = useState('');
  const [jdCulture, setJdCulture] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [result, setResult] = useState<TransformResult | null>(null);
  const [error, setError] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [jdInputMode, setJdInputMode] = useState<'text' | 'image'>('text');
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrPreview, setOcrPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jdImageInputRef = useRef<HTMLInputElement>(null);

  const handleJdImage = async (imageData: string) => {
    setOcrLoading(true);
    setError('');
    try {
      const res = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (data.jdTasks) setJdTasks(data.jdTasks);
      if (data.jdRequirements) setJdRequirements(data.jdRequirements);
      if (data.jdPreferred) setJdPreferred(data.jdPreferred);
      if (data.jdCulture) setJdCulture(data.jdCulture);
      setJdInputMode('text'); // 인식 후 텍스트 모드로 전환 (수정 가능)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '이미지 인식 오류');
    } finally {
      setOcrLoading(false);
    }
  };

  const handleJdImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setOcrPreview(dataUrl);
      handleJdImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleJdPaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) handleJdImageFile(file);
        return;
      }
    }
  };

  const handleFileUpload = useCallback(async (file: File) => {
    const name = file.name.toLowerCase();
    if (!name.endsWith('.pdf') && !name.endsWith('.docx')) {
      setUploadError('PDF 또는 DOCX 파일만 업로드할 수 있습니다.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('파일 크기는 10MB 이하만 가능합니다.');
      return;
    }

    setUploadedFile(file);
    setUploadError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/parse-resume', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResumeText(data.text);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : '파일 업로드 오류');
      setUploadedFile(null);
    } finally {
      setUploading(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  }, [handleFileUpload]);

  const preventDefaults = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };

  const handleGenerate = async () => {
    if (!jdTasks || !jdRequirements) { setError('업무내용과 자격요건을 입력해주세요.'); return; }
    if (!resumeText) { setError('이력서를 업로드하거나 붙여넣기 해주세요.'); return; }

    setLoading(true);
    setError('');
    setResult(null);

    const steps = ['잡 디스크립션 요구역량 추출 중...', '이력서 경험/역량 분석 중...', '이력서-JD 매칭 분석 중...', '핵심역량 문장 생성 중...'];
    let stepIndex = 0;
    setLoadingStep(steps[0]);
    const interval = setInterval(() => { stepIndex++; if (stepIndex < steps.length) setLoadingStep(steps[stepIndex]); }, 2000);

    try {
      const res = await fetch('/api/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jdTasks, jdRequirements, jdPreferred, jdCulture, resumeText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const copyAll = () => {
    if (!result) return;
    const text = result.competencies.map((c, i) => `${i + 1}. ${c.title}\n${c.description}`).join('\n\n');
    navigator.clipboard.writeText(text);
  };

  const copyOne = (c: Competency) => {
    navigator.clipboard.writeText(`${c.title}\n${c.description}`);
  };

  const scoreOffset = result ? 264 - (264 * result.matchScore) / 100 : 264;
  const allMatchedKeywords = result ? [...new Set(result.competencies.flatMap(c => c.matchedKeywords))].slice(0, 8) : [];

  return (
    <ToolLayout tool={tool} guideContent={
      <div>
        <h2 className="text-xl font-bold mb-4 dark:text-white">핵심역량이란?</h2>
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <div><h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">왜 중요한가요?</h3><p>채용 담당자는 이력서에서 해당 포지션에 맞는 핵심역량을 가장 먼저 확인합니다. 공고에 맞춤화된 핵심역량은 서류 통과율을 2~3배 높일 수 있습니다.</p></div>
          <div><h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">어떻게 작동하나요?</h3><p>AI가 채용공고(JD)의 요구사항과 이력서의 경험을 분석하여, 공고에 최적화된 핵심역량을 자동으로 생성합니다. 이력서에 있는 사실만을 기반으로 작성합니다.</p></div>
          <div><h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">매번 새로 만들어야 하나요?</h3><p>네, 지원하는 공고마다 요구 역량이 다르므로 공고별로 맞춤 생성하는 것이 가장 효과적입니다.</p></div>
        </div>
      </div>
    }>
      {/* Step Indicator */}
      <div className="flex justify-center gap-2 mb-6 text-xs">
        {[{ n: 1, l: 'JD 입력' }, { n: 2, l: '이력서 입력' }, { n: 3, l: '결과 확인' }].map((s, i) => {
          const current = result ? 3 : (jdTasks && jdRequirements) ? 2 : 1;
          const done = current > s.n;
          const active = current === s.n;
          return (
            <div key={s.n} className="flex items-center gap-2">
              {i > 0 && <span className="text-gray-300">&rarr;</span>}
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium border ${done ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : active ? 'text-primary bg-primary/5 border-primary/20' : 'text-gray-400 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'}`}>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${done ? 'bg-emerald-600 text-white' : active ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-500'}`}>
                  {done ? '✓' : s.n}
                </span>
                {s.l}
              </div>
            </div>
          );
        })}
      </div>

      {!result && (
        <>
          {/* Input Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* JD Panel */}
            <div className="space-y-3" onPaste={handleJdPaste}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold dark:text-white">채용공고 (JD)</h3>
                <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
                  <button onClick={() => setJdInputMode('text')} className={`px-2.5 py-1 text-[10px] font-medium rounded-md transition ${jdInputMode === 'text' ? 'bg-white dark:bg-gray-600 dark:text-white shadow-sm' : 'text-gray-500'}`}>텍스트</button>
                  <button onClick={() => setJdInputMode('image')} className={`px-2.5 py-1 text-[10px] font-medium rounded-md transition ${jdInputMode === 'image' ? 'bg-white dark:bg-gray-600 dark:text-white shadow-sm' : 'text-gray-500'}`}>이미지 OCR</button>
                </div>
              </div>

              {jdInputMode === 'image' ? (
                <div>
                  {ocrLoading ? (
                    <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center bg-primary/5">
                      <div className="w-10 h-10 mx-auto mb-3 border-3 border-gray-200 border-t-primary rounded-full animate-spin" />
                      <p className="text-sm font-medium text-primary">AI가 이미지를 분석하고 있습니다...</p>
                      <p className="text-xs text-gray-400 mt-1">채용공고 텍스트를 자동으로 추출합니다</p>
                    </div>
                  ) : (
                    <div>
                      <div
                        onDrop={(e) => { e.preventDefault(); e.stopPropagation(); const f = e.dataTransfer.files[0]; if (f) handleJdImageFile(f); }}
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        onClick={() => jdImageInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary transition cursor-pointer"
                      >
                        <div className="text-3xl mb-2">📷</div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">채용공고 캡쳐 이미지를 업로드하세요</p>
                        <p className="text-xs text-gray-400">드래그, 클릭, 또는 <strong>Ctrl+V</strong>로 붙여넣기</p>
                        <input ref={jdImageInputRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleJdImageFile(e.target.files[0])} />
                      </div>
                      {ocrPreview && (
                        <div className="mt-3">
                          <img src={ocrPreview} alt="JD capture" className="w-full rounded-lg border border-gray-200 dark:border-gray-600 max-h-48 object-contain" />
                        </div>
                      )}
                      <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs text-blue-700 dark:text-blue-400">
                        <strong>Tip:</strong> 잡코리아/사람인에서 채용공고를 캡쳐(스크린샷)한 후 <strong>Ctrl+V</strong>로 바로 붙여넣기 하세요. AI가 자동으로 텍스트를 인식합니다.
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div>
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">업무내용 <span className="text-red-500">*</span></label>
                    <textarea rows={3} value={jdTasks} onChange={e => setJdTasks(e.target.value)} placeholder="예: 마케팅 전략 수립 및 실행..." className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none resize-y" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">자격요건 <span className="text-red-500">*</span></label>
                    <textarea rows={3} value={jdRequirements} onChange={e => setJdRequirements(e.target.value)} placeholder="예: 마케팅 경력 3년 이상..." className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none resize-y" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">우대사항</label>
                    <textarea rows={2} value={jdPreferred} onChange={e => setJdPreferred(e.target.value)} placeholder="예: 스타트업 경험..." className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none resize-y" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">인재상/기업문화</label>
                    <textarea rows={2} value={jdCulture} onChange={e => setJdCulture(e.target.value)} placeholder="예: 주도적으로 문제를 해결하는 인재..." className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none resize-y" />
                  </div>
                </>
              )}
            </div>

            {/* Resume Panel */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold dark:text-white">이력서</h3>
              <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                {(['upload', 'paste'] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-1.5 text-xs font-medium rounded-md transition ${activeTab === tab ? 'bg-white dark:bg-gray-600 dark:text-white shadow-sm' : 'text-gray-500'}`}>
                    {tab === 'upload' ? '파일 업로드' : '텍스트 붙여넣기'}
                  </button>
                ))}
              </div>

              {activeTab === 'upload' ? (
                <div>
                  {uploadedFile && !uploading ? (
                    <div className="border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium dark:text-white">{uploadedFile.name}</p>
                          <p className="text-xs text-emerald-600">텍스트 추출 완료</p>
                        </div>
                        <button onClick={() => { setUploadedFile(null); setResumeText(''); }} className="text-xs text-gray-400 hover:text-red-500">삭제</button>
                      </div>
                      {resumeText && <p className="text-xs text-gray-500 mt-2 line-clamp-3">{resumeText.slice(0, 200)}...</p>}
                    </div>
                  ) : (
                    <div
                      onDrop={handleDrop}
                      onDragOver={preventDefaults}
                      onDragEnter={preventDefaults}
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary transition cursor-pointer"
                    >
                      <input ref={fileInputRef} type="file" accept=".pdf,.docx" className="hidden" onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])} />
                      {uploading ? (
                        <><div className="w-8 h-8 mx-auto mb-2 border-2 border-gray-200 border-t-primary rounded-full animate-spin" /><p className="text-sm text-gray-500">텍스트 추출 중...</p></>
                      ) : (
                        <><p className="text-sm text-gray-500 mb-1">PDF 또는 DOCX 파일을 드래그하거나 클릭</p><p className="text-xs text-gray-400">최대 10MB</p></>
                      )}
                    </div>
                  )}
                  {uploadError && <p className="text-xs text-red-500 mt-2">{uploadError}</p>}
                </div>
              ) : (
                <textarea rows={14} value={resumeText} onChange={e => setResumeText(e.target.value)} placeholder="이력서 내용을 여기에 붙여넣기 해주세요." className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none resize-y" />
              )}
            </div>
          </div>

          {/* Generate Button */}
          <button onClick={handleGenerate} disabled={loading} className="w-full py-3.5 bg-primary hover:bg-primary-dark disabled:bg-gray-300 text-white font-semibold rounded-xl transition text-base">
            {loading ? `AI 분석 중... ${loadingStep}` : '✨ 핵심역량 생성하기'}
          </button>

          {error && <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm text-red-600">{error}</div>}
        </>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-10 text-center max-w-sm shadow-xl">
            <div className="w-12 h-12 mx-auto mb-4 border-3 border-gray-200 border-t-primary rounded-full animate-spin" />
            <h3 className="text-lg font-bold dark:text-white mb-2">AI가 분석 중입니다</h3>
            <p className="text-sm text-gray-500">{loadingStep}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold dark:text-white">생성된 핵심역량</h2>
            <div className="flex gap-2">
              <button onClick={() => { setResult(null); setError(''); }} className="px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">다시 생성</button>
              <button onClick={copyAll} className="px-3 py-1.5 text-xs bg-primary text-white rounded-lg hover:bg-primary-dark transition">전체 복사</button>
            </div>
          </div>

          {/* Fact Notice */}
          <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-4 text-xs text-blue-700 dark:text-blue-400">
            <span className="shrink-0 mt-0.5">🔒</span>
            <p><strong>이력서 사실 기반 생성</strong> — 모든 핵심역량은 업로드된 이력서 내용만을 근거로 작성되었습니다.</p>
          </div>

          {/* Match Score */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 mb-4 flex items-center gap-5 flex-wrap">
            <div className="relative w-20 h-20 shrink-0">
              <svg viewBox="0 0 100 100" className="-rotate-90 w-20 h-20">
                <circle cx="50" cy="50" r="42" fill="none" strokeWidth="8" className="stroke-gray-200 dark:stroke-gray-600" />
                <circle cx="50" cy="50" r="42" fill="none" strokeWidth="8" strokeDasharray="264" strokeDashoffset={scoreOffset} strokeLinecap="round" className="stroke-primary transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-primary">
                {result.matchScore}<span className="text-xs">%</span>
              </div>
            </div>
            <div>
              <p className="font-bold text-sm dark:text-white mb-1">JD 매칭 적합도</p>
              <div className="flex flex-wrap gap-1">
                {allMatchedKeywords.map(kw => (
                  <span key={kw} className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">✓ {kw}</span>
                ))}
                {result.gaps.filter(g => g.severity === 'missing').map(g => (
                  <span key={g.requirement} className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400">✕ {g.requirement}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Competency Cards */}
          <div className="space-y-3 mb-4">
            {result.competencies.map(c => {
              const recency = RECENCY_CONFIG[c.recency] || RECENCY_CONFIG.mid;
              return (
                <div key={c.order} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">{c.order}</span>
                      <span className="text-[10px] font-semibold uppercase text-primary bg-primary/10 px-2 py-0.5 rounded">{c.category}</span>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded ${recency.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${recency.dot}`} />
                        {c.period || recency.label}
                      </span>
                    </div>
                    <button onClick={() => copyOne(c)} className="text-xs text-gray-400 hover:text-primary" title="복사">📋</button>
                  </div>
                  <h3 className="text-sm font-bold dark:text-white mb-1">{c.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{c.description}</p>
                  <div className="mt-2 p-2 bg-white dark:bg-gray-800 border-l-2 border-primary rounded-r-lg">
                    <p className="text-[10px] font-bold text-primary uppercase mb-0.5">이력서 근거</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">&ldquo;{c.source}&rdquo;</p>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {c.matchedKeywords.map(kw => (
                      <span key={kw} className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">{kw}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Gaps */}
          {result.gaps.length > 0 && (
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
              <h3 className="text-sm font-bold text-amber-700 dark:text-amber-400 mb-2">⚠️ 보완 포인트</h3>
              {result.gaps.map((g, i) => (
                <div key={i} className={`flex items-start gap-2 py-2 text-sm ${i > 0 ? 'border-t border-amber-200 dark:border-amber-800' : ''}`}>
                  <span className="shrink-0">{g.severity === 'missing' ? '🔴' : '🟠'}</span>
                  <div>
                    <p className="text-gray-700 dark:text-gray-300"><strong>&ldquo;{g.requirement}&rdquo;</strong> {g.severity === 'missing' ? '이 이력서에서 확인되지 않습니다.' : '에 대한 구체적 경험이 부족합니다.'}</p>
                    <p className="text-xs text-primary mt-0.5">→ {g.suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </ToolLayout>
  );
}
