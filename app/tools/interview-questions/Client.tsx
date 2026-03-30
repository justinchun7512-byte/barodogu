'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { getToolById } from '@/lib/tools';
import { ToolLayout } from '@/components/layout/ToolLayout';

const tool = getToolById('interview-questions')!;

interface Question {
  id: number;
  category: '직무 역량' | '경험 검증' | '지원 동기 & 조직문화' | '돌발 & 압박';
  frequency: '높음' | '보통' | '낮음';
  question: string;
  intent: string;
  hint: string;
}

interface Summary {
  totalQuestions: number;
  focusCategories: string[];
  resumeGaps: string[];
}

interface InterviewResult {
  summary: Summary;
  questions: Question[];
}

type InputTab = 'text' | 'image';
type QuestionCount = 10 | 15 | 20;
type Difficulty = 'basic' | 'advanced';
type CategoryFilter = 'all' | '직무 역량' | '경험 검증' | '지원 동기 & 조직문화' | '돌발 & 압박';

const CATEGORY_CONFIG: Record<string, { color: string; bg: string; darkBg: string }> = {
  '직무 역량': { color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-50', darkBg: 'dark:bg-blue-900/20' },
  '경험 검증': { color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50', darkBg: 'dark:bg-emerald-900/20' },
  '지원 동기 & 조직문화': { color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50', darkBg: 'dark:bg-amber-900/20' },
  '돌발 & 압박': { color: 'text-red-700 dark:text-red-400', bg: 'bg-red-50', darkBg: 'dark:bg-red-900/20' },
};

const FREQUENCY_CONFIG: Record<string, { label: string; color: string; bg: string; darkBg: string }> = {
  '높음': { label: '높음', color: 'text-red-700 dark:text-red-400', bg: 'bg-red-50', darkBg: 'dark:bg-red-900/20' },
  '보통': { label: '보통', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50', darkBg: 'dark:bg-amber-900/20' },
  '낮음': { label: '낮음', color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-50', darkBg: 'dark:bg-blue-900/20' },
};

const CATEGORIES: CategoryFilter[] = ['all', '직무 역량', '경험 검증', '지원 동기 & 조직문화', '돌발 & 압박'];

export default function InterviewQuestionsPage() {
  // Input states
  const [jdTasks, setJdTasks] = useState('');
  const [jdRequirements, setJdRequirements] = useState('');
  const [jdPreferred, setJdPreferred] = useState('');
  const [jdCulture, setJdCulture] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [resumeTab, setResumeTab] = useState<InputTab>('text');

  // OCR states
  const [ocrLoadingField, setOcrLoadingField] = useState<string | null>(null);
  const [ocrFieldError, setOcrFieldError] = useState<string | null>(null);
  const [resumeOcrLoading, setResumeOcrLoading] = useState(false);
  const resumeImageRef = useRef<HTMLInputElement>(null);

  // Generation states
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<InterviewResult | null>(null);

  // Result filter/settings states
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [questionCount, setQuestionCount] = useState<QuestionCount>(15);
  const [difficulty, setDifficulty] = useState<Difficulty>('basic');
  const [expandedHints, setExpandedHints] = useState<Set<number>>(new Set());
  const [copyToast, setCopyToast] = useState(false);
  const [settingsChanged, setSettingsChanged] = useState(false);

  // ---------- OCR helpers (same pattern as core-competency) ----------

  const compressImage = (dataUrl: string, maxWidth = 1024): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ratio = Math.min(maxWidth / img.width, 1);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = () => reject(new Error('이미지를 불러올 수 없습니다. 올바른 이미지 파일인지 확인해주세요.'));
      img.src = dataUrl;
    });
  };

  const ocrForField = async (imageData: string, setter: (fn: (prev: string) => string) => void, fieldName: string) => {
    setOcrLoadingField(fieldName);
    setOcrFieldError(null);
    try {
      const compressed = await compressImage(imageData);
      const res = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: compressed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `OCR 실패 (${res.status})`);
      if (!data.text) throw new Error('텍스트를 추출하지 못했습니다.');
      setter(prev => prev ? prev + '\n' + data.text : data.text);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '이미지 인식 오류';
      setOcrFieldError(`[${fieldName}] ${msg}`);
    } finally {
      setOcrLoadingField(null);
    }
  };

  const handleFieldPaste = (e: React.ClipboardEvent, setter: (fn: (prev: string) => string) => void, fieldName: string) => {
    for (const item of e.clipboardData.items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = () => ocrForField(reader.result as string, setter, fieldName);
          reader.readAsDataURL(file);
        }
        return;
      }
    }
  };

  const handleResumeImageUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setResumeOcrLoading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const compressed = await compressImage(reader.result as string);
        const res = await fetch('/api/ocr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: compressed }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || `OCR 실패 (${res.status})`);
        if (!data.text) throw new Error('텍스트를 추출하지 못했습니다.');
        setResumeText(prev => prev ? prev + '\n' + data.text : data.text);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : '이미지 인식 오류');
      } finally {
        setResumeOcrLoading(false);
      }
    };
    reader.onerror = () => {
      setError('파일을 읽는 중 오류가 발생했습니다.');
      setResumeOcrLoading(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleResumeDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) handleResumeImageUpload(file);
  }, [handleResumeImageUpload]);

  const preventDefaults = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };

  // ---------- Generate ----------

  const handleGenerate = async () => {
    if (!jdTasks && !jdRequirements && !jdPreferred && !jdCulture) {
      setError('채용공고 항목을 최소 1개 이상 입력해주세요.');
      return;
    }
    if (!resumeText) {
      setError('이력서를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setExpandedHints(new Set());
    setCategoryFilter('all');

    const steps = ['채용공고를 읽는 중...', '이력서와 교차 분석 중...', '면접 질문을 구성 중...'];
    let stepIndex = 0;
    setLoadingStep(steps[0]);
    const interval = setInterval(() => {
      stepIndex++;
      if (stepIndex < steps.length) setLoadingStep(steps[stepIndex]);
    }, 2500);

    try {
      const res = await fetch('/api/interview-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jdTasks, jdRequirements, jdPreferred, jdCulture, resumeText, questionCount, difficulty }),
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

  // ---------- Actions ----------

  const toggleHint = (id: number) => {
    setExpandedHints(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const showToast = () => {
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2000);
  };

  const copyAll = () => {
    if (!result) return;
    const lines = result.questions.map((q, i) =>
      `## ${i + 1}. [${q.category}] ${q.question}\n빈도: ${q.frequency} | 의도: ${q.intent}\n\n**답변 힌트:** ${q.hint}`
    ).join('\n\n---\n\n');
    const header = `# AI 면접 질문 생성 결과 (총 ${result.summary.totalQuestions}개)\n\n`;
    navigator.clipboard.writeText(header + lines);
    showToast();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRegenerate = () => {
    setSettingsChanged(false);
    handleGenerate();
  };

  // ---------- Filtered questions ----------

  const filteredQuestions = result
    ? categoryFilter === 'all'
      ? result.questions
      : result.questions.filter(q => q.category === categoryFilter)
    : [];

  const categoryCount = (cat: CategoryFilter) => {
    if (!result) return 0;
    if (cat === 'all') return result.questions.length;
    return result.questions.filter(q => q.category === cat).length;
  };

  // ---------- Render ----------

  return (
    <ToolLayout tool={tool} seoContent={
      <section className="space-y-6 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">AI 면접 질문 생성기란?</h2>
          <p>AI 면접 질문 생성기는 채용공고(JD)와 이력서를 교차 분석하여, 면접관이 실제로 할 만한 질문을 생성해주는 도구입니다. 단순 질문 목록이 아니라, 질문마다 면접관의 의도, 이상적인 답변 방향, 질문 빈도 등급을 함께 제공하여 &ldquo;왜 이 질문이 나오는가&rdquo;를 이해하고 준비할 수 있도록 설계되었습니다.</p>
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">사용 방법</h2>
          <ol className="list-decimal pl-5 space-y-1.5">
            <li>채용공고의 담당업무, 자격요건 등을 항목별로 입력합니다. (이미지 캡쳐 후 Ctrl+V 붙여넣기도 가능)</li>
            <li>이력서를 텍스트로 직접 입력하거나, 이미지를 업로드하여 OCR로 추출합니다.</li>
            <li>&ldquo;면접 질문 생성하기&rdquo; 버튼을 클릭하면 AI가 분석을 시작합니다.</li>
            <li>카테고리별 탭으로 질문을 필터링하고, 각 카드의 답변 힌트를 참고하여 면접을 준비합니다.</li>
            <li>전체 복사 또는 인쇄 기능으로 오프라인에서도 복습할 수 있습니다.</li>
          </ol>
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">자주 묻는 질문</h2>
          <div className="space-y-2">
            <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
              <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">면접 질문이 실제와 얼마나 유사한가요?</summary>
              <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">AI가 채용공고와 이력서를 교차 분석하여 면접관의 관점에서 질문을 생성합니다. 실제 면접과 100% 일치하지는 않지만, 핵심 질문 유형과 방향은 높은 확률로 겹칩니다.</p>
            </details>
            <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
              <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">빈도 등급은 어떤 기준인가요?</summary>
              <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">&ldquo;높음&rdquo;은 해당 직무 면접의 80% 이상에서 등장하는 질문, &ldquo;보통&rdquo;은 50~80%, &ldquo;낮음&rdquo;은 50% 미만이지만 대비하면 차별화되는 질문입니다.</p>
            </details>
            <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
              <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">이력서 내용이 유출될 우려는 없나요?</summary>
              <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">입력된 데이터는 면접 질문 생성에만 사용되며, 별도로 저장하거나 제3자에게 공유하지 않습니다.</p>
            </details>
          </div>
        </div>
      </section>
    } guideContent={
      <div>
        <h2 className="text-xl font-bold mb-4 dark:text-white">면접 준비, 어떻게 해야 할까?</h2>
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">질문의 의도를 파악하세요</h3>
            <p>면접관은 &ldquo;정답&rdquo;을 듣고 싶은 게 아니라, 지원자의 사고 과정과 경험의 깊이를 확인하고 싶습니다. 각 질문에 달린 면접관 의도를 먼저 읽고 답변을 준비하세요.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">빈도 높은 질문부터 준비하세요</h3>
            <p>시간이 제한적이라면 빈도 &ldquo;높음&rdquo; 질문을 우선 준비하세요. 해당 직무 면접에서 거의 반드시 나오는 질문들입니다.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">핵심역량 추출기와 함께 쓰세요</h3>
            <p>면접 질문 준비와 함께 AI 핵심역량 추출기로 자신의 강점을 정리하면, 답변에 활용할 구체적 역량을 미리 준비할 수 있습니다.</p>
          </div>
        </div>
      </div>
    }>
      {/* Print styles */}
      <style jsx global>{`
        @media print {
          header, footer, nav, .no-print, [class*="AdSlot"], [class*="ShareButtons"] { display: none !important; }
          .print-only { display: block !important; }
          body { font-size: 12px; color: #111; }
          .space-y-3 > * { page-break-inside: avoid; margin-bottom: 12px; }
          .rounded-xl { border: 1px solid #e5e7eb; padding: 12px; margin-bottom: 8px; }
          .bg-gray-50, [class*="bg-gray-700"] { background: #fff !important; }
          .shadow-sm, .shadow-lg { box-shadow: none !important; }
        }
      `}</style>

      {/* Step Indicator */}
      <div className="flex justify-center gap-2 mb-6 text-xs no-print">
        {[{ n: 1, l: '공고 + 이력서' }, { n: 2, l: '질문 생성' }, { n: 3, l: '결과 확인' }].map((s, i) => {
          const current = result ? 3 : loading ? 2 : 1;
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

      {/* ===== INPUT SECTION ===== */}
      {!result && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* JD Panel */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold dark:text-white">채용공고 (JD)</h3>
              <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs text-blue-700 dark:text-blue-400">
                <strong>Tip:</strong> 각 항목별로 캡쳐한 이미지를 입력창에 <strong>Ctrl+V</strong>로 붙여넣기 하면 AI가 자동 인식합니다.
              </div>
              {ocrFieldError && (
                <div className="p-2.5 bg-red-50 dark:bg-red-900/20 rounded-lg text-xs text-red-600 dark:text-red-400">
                  <strong>OCR 오류:</strong> {ocrFieldError}
                  <button onClick={() => setOcrFieldError(null)} className="ml-2 underline">닫기</button>
                </div>
              )}
              {[
                { label: '담당업무', required: false, value: jdTasks, setter: setJdTasks as (fn: (prev: string) => string) => void, field: 'jdTasks', placeholder: '직무기술서에서 \'주요업무\' 섹션을 붙여넣으세요' },
                { label: '자격요건', required: false, value: jdRequirements, setter: setJdRequirements as (fn: (prev: string) => string) => void, field: 'jdRequirements', placeholder: '자격요건 섹션을 붙여넣으세요' },
                { label: '우대사항', required: false, value: jdPreferred, setter: setJdPreferred as (fn: (prev: string) => string) => void, field: 'jdPreferred', placeholder: '우대사항 섹션을 붙여넣으세요 (선택)' },
                { label: '조직문화', required: false, value: jdCulture, setter: setJdCulture as (fn: (prev: string) => string) => void, field: 'jdCulture', placeholder: '인재상, 기업문화 설명을 붙여넣으세요 (선택)' },
              ].map(f => (
                <div key={f.field}>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {f.label}
                    </label>
                    {ocrLoadingField === f.field && (
                      <span className="text-[10px] text-primary flex items-center gap-1">
                        <span className="w-3 h-3 border-2 border-gray-200 border-t-primary rounded-full animate-spin" />
                        AI 인식 중...
                      </span>
                    )}
                  </div>
                  <textarea
                    rows={3}
                    value={f.value}
                    onChange={e => f.setter(() => e.target.value)}
                    onPaste={e => handleFieldPaste(e, f.setter, f.field)}
                    placeholder={f.placeholder}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none resize-y transition ${
                      ocrLoadingField === f.field
                        ? 'border-primary/50 bg-primary/5 dark:bg-primary/10'
                        : 'border-gray-200 dark:border-gray-600 dark:bg-gray-700'
                    } dark:text-white`}
                  />
                </div>
              ))}
            </div>

            {/* Resume Panel */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold dark:text-white">이력서</h3>
              <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                {([['text', '직접 입력'], ['image', '이미지 붙여넣기']] as const).map(([tab, label]) => (
                  <button key={tab} onClick={() => setResumeTab(tab)} className={`flex-1 py-1.5 text-xs font-medium rounded-md transition ${resumeTab === tab ? 'bg-white dark:bg-gray-600 dark:text-white shadow-sm' : 'text-gray-500'}`}>
                    {label}
                  </button>
                ))}
              </div>

              {resumeTab === 'text' ? (
                <textarea
                  rows={14}
                  value={resumeText}
                  onChange={e => setResumeText(e.target.value)}
                  placeholder="이력서 내용을 여기에 붙여넣기 해주세요. 경력사항, 프로젝트 경험, 보유 기술 등을 포함하면 더 정확한 질문이 생성됩니다."
                  className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none resize-y"
                />
              ) : (
                <div>
                  <div
                    onDrop={handleResumeDrop}
                    onDragOver={preventDefaults}
                    onDragEnter={preventDefaults}
                    onClick={() => resumeImageRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary transition cursor-pointer"
                  >
                    <input ref={resumeImageRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleResumeImageUpload(e.target.files[0])} />
                    {resumeOcrLoading ? (
                      <>
                        <div className="w-8 h-8 mx-auto mb-2 border-2 border-gray-200 border-t-primary rounded-full animate-spin" />
                        <p className="text-sm text-gray-500">이력서를 읽는 중...</p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-gray-500 mb-1">이력서 이미지를 드래그하거나 클릭</p>
                        <p className="text-xs text-gray-400">PNG, JPG 형식 지원</p>
                      </>
                    )}
                  </div>
                  {resumeText && (
                    <div className="mt-3 border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">텍스트 추출 완료</p>
                        <button onClick={() => setResumeText('')} className="text-xs text-gray-400 hover:text-red-500">삭제</button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3">{resumeText.slice(0, 200)}...</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Generate Button */}
          <button onClick={handleGenerate} disabled={loading} className="w-full py-3.5 bg-primary hover:bg-primary-dark disabled:bg-gray-300 text-white font-semibold rounded-xl transition text-base">
            {loading ? `분석 중... ${loadingStep}` : '면접 질문 생성하기'}
          </button>

          {error && <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm text-red-600 dark:text-red-400">{error}</div>}
        </>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-10 text-center max-w-sm shadow-xl">
            <div className="w-12 h-12 mx-auto mb-4 border-3 border-gray-200 border-t-primary rounded-full animate-spin" />
            <h3 className="text-lg font-bold dark:text-white mb-2">면접관 시점으로 분석 중</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{loadingStep}</p>
          </div>
        </div>
      )}

      {/* ===== RESULT SECTION ===== */}
      {result && (
        <div>
          {/* Settings bar */}
          <div className="flex flex-wrap items-center gap-3 mb-4 no-print">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">질문 수</span>
              <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
                {([10, 15, 20] as QuestionCount[]).map(n => (
                  <button
                    key={n}
                    onClick={() => { setQuestionCount(n); setSettingsChanged(true); }}
                    className={`px-2.5 py-1 text-xs rounded-md transition ${questionCount === n ? 'bg-white dark:bg-gray-600 dark:text-white shadow-sm font-medium' : 'text-gray-500'}`}
                  >
                    {n}개
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">난이도</span>
              <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
                {([['basic', '기본'], ['advanced', '심화']] as const).map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => { setDifficulty(val); setSettingsChanged(true); }}
                    className={`px-2.5 py-1 text-xs rounded-md transition ${difficulty === val ? 'bg-white dark:bg-gray-600 dark:text-white shadow-sm font-medium' : 'text-gray-500'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={handleRegenerate} className={`ml-auto px-3 py-1.5 text-xs rounded-lg transition ${settingsChanged ? 'bg-primary text-white hover:bg-primary-dark animate-pulse' : 'border border-gray-300 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
              재생성
            </button>
          </div>
          {settingsChanged && (
            <div className="mb-4 p-2.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-xs text-amber-700 dark:text-amber-400 no-print">
              설정이 변경되었습니다. <button onClick={handleRegenerate} className="underline font-semibold">재생성</button>을 눌러 새로운 결과를 받아보세요.
            </div>
          )}

          {/* Summary Banner */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5 mb-5">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-2">
              <p className="text-sm font-bold dark:text-white">총 {result.summary.totalQuestions}개 질문 생성됨</p>
              {result.summary.focusCategories.map(cat => (
                <span key={cat} className="text-xs font-medium text-primary">{cat} 질문이 집중됩니다</span>
              ))}
            </div>
            {result.summary.resumeGaps.length > 0 && (
              <div className="space-y-1">
                {result.summary.resumeGaps.map((gap, i) => (
                  <p key={i} className="text-xs text-gray-600 dark:text-gray-400">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 relative top-[-1px]" />
                    {gap}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 mb-4 no-print">
            <button onClick={copyAll} className="px-3 py-1.5 text-xs bg-primary text-white rounded-lg hover:bg-primary-dark transition">
              전체 복사
            </button>
            <button onClick={handlePrint} className="px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              인쇄하기
            </button>
            <button onClick={() => { setResult(null); setError(''); }} className="px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              새로 입력
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 mb-5 no-print">
            {CATEGORIES.map(cat => {
              const count = categoryCount(cat);
              const active = categoryFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 text-xs rounded-lg border transition ${
                    active
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:border-primary/40'
                  }`}
                >
                  {cat === 'all' ? '전체' : cat}
                  <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-600'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Question Cards */}
          <div className="space-y-3 mb-6">
            {filteredQuestions.map(q => {
              const catConfig = CATEGORY_CONFIG[q.category] || CATEGORY_CONFIG['직무 역량'];
              const freqConfig = FREQUENCY_CONFIG[q.frequency] || FREQUENCY_CONFIG['보통'];
              const isExpanded = expandedHints.has(q.id);

              return (
                <div
                  key={q.id}
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 shadow-sm hover:shadow-lg transition"
                >
                  {/* Card header */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${catConfig.bg} ${catConfig.darkBg} ${catConfig.color}`}>
                      {q.category}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${freqConfig.bg} ${freqConfig.darkBg} ${freqConfig.color}`}>
                      빈도 {freqConfig.label}
                    </span>
                  </div>

                  {/* Question text */}
                  <p className="text-sm font-bold dark:text-white leading-relaxed mb-2">
                    {q.question}
                  </p>

                  {/* Intent */}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    {q.intent}
                  </p>

                  {/* Hint accordion */}
                  <button
                    onClick={() => toggleHint(q.id)}
                    className="text-xs font-medium text-primary hover:text-primary-dark transition flex items-center gap-1"
                  >
                    <span className={`inline-block transition-transform ${isExpanded ? 'rotate-90' : ''}`}>&#9656;</span>
                    답변 힌트 {isExpanded ? '접기' : '보기'}
                  </button>

                  {isExpanded && (
                    <div className="mt-2 p-3 bg-white dark:bg-gray-800 border-l-2 border-primary rounded-r-lg">
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {q.hint}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Cross-sell CTA: Core Competency */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5 mb-4 no-print">
            <p className="text-sm font-bold dark:text-white mb-2">답변에 쓸 핵심역량, 아직 정리 안 하셨나요?</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">면접 답변의 설득력은 정리된 핵심역량에서 나옵니다. 같은 채용공고와 이력서로 바로 핵심역량을 뽑아보세요.</p>
            <Link
              href="/tools/core-competency"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition"
            >
              <span>🎯</span>
              AI 핵심역량 추출기 바로가기
            </Link>
          </div>
        </div>
      )}

      {/* Copy Toast */}
      {copyToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[300] bg-gray-900 text-white text-sm px-4 py-2.5 rounded-lg shadow-lg">
          클립보드에 복사되었습니다
        </div>
      )}
    </ToolLayout>
  );
}
