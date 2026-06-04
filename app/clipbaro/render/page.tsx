'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { createClient } from '@/lib/supabase/client';

// ────────────────────────────────────────────────────────
// 설정 데이터
// ────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'health',       label: '건강·운동',   icon: '🏥' },
  { id: 'food',         label: '음식·요리',   icon: '🍳' },
  { id: 'finance',      label: '재테크·경제', icon: '💰' },
  { id: 'lifestyle',    label: '라이프스타일',icon: '✨' },
  { id: 'barodogu',     label: '바로도구 소개',icon: '🛠' },
  { id: 'custom',       label: '직접 입력',   icon: '✏️' },
];

const STYLES = [
  { id: 'informative',    label: '정보형',    desc: '전문적이고 신뢰감 있는 톤' },
  { id: 'entertainment',  label: '엔터테인먼트', desc: '재미있고 가벼운 톤' },
  { id: 'story',          label: '스토리텔링', desc: '감동·공감 중심' },
  { id: 'tutorial',       label: '튜토리얼',  desc: '단계별 설명 중심' },
];

const STEP_LABELS = ['카테고리', '스타일', '주제', 'AI 대본', '확인', '제작 중'];

// ────────────────────────────────────────────────────────
// 타입
// ────────────────────────────────────────────────────────
type Scene = { section: string; text: string; tts_text: string; duration: number };
type AiScript = { title: string; description: string; tags: string[]; script: Scene[]; thumbnail_text: string };

export default function RenderPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState('');
  const [style, setStyle] = useState('');
  const [topic, setTopic] = useState('');
  const [mode, setMode] = useState<'basic' | 'byok'>('basic');
  const [aiScript, setAiScript] = useState<AiScript | null>(null);
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [renderId, setRenderId] = useState('');

  // ── AI 대본 생성 ──
  async function generateScript() {
    setGenerating(true);
    setError('');
    try {
      const res = await fetch('/api/ai-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, channel: category }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      setAiScript(data.script);
      setStep(3);
    } catch {
      setError('대본 생성 실패. 다시 시도해주세요.');
    } finally {
      setGenerating(false);
    }
  }

  // ── 렌더 제출 ──
  async function submitRender() {
    if (!aiScript) return;
    setSubmitting(true);
    setError('');
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/clipbaro/login?next=/clipbaro/render'); return; }

      // 1) 프로젝트 생성
      const { data: project, error: pErr } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          title: aiScript.title,
          category,
          style,
          topic,
          mode,
          custom_options: { tags: aiScript.tags, script: aiScript.script },
        })
        .select('id')
        .single();
      if (pErr || !project) throw new Error(pErr?.message ?? '프로젝트 생성 실패');

      // 2) 크레딧 차감 (RPC)
      const { error: cErr } = await supabase.rpc('consume_credit', {
        p_amount: 1,
        p_reason: 'render_start',
      });
      if (cErr) throw new Error('크레딧 부족: ' + cErr.message);

      // 3) 렌더 잡 생성
      const idempotencyKey = `${user.id}-${project.id}-${Date.now()}`;
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      const { data: render, error: rErr } = await supabase
        .from('renders')
        .insert({
          project_id: project.id,
          user_id: user.id,
          status: 'queued',
          credit_cost: 1,
          idempotency_key: idempotencyKey,
          expires_at: expiresAt,
        })
        .select('id')
        .single();
      if (rErr || !render) throw new Error(rErr?.message ?? '렌더 생성 실패');

      setRenderId(render.id);
      setStep(5);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '알 수 없는 오류');
    } finally {
      setSubmitting(false);
    }
  }

  // ────────────────────────────────────────────────────────
  // UI
  // ────────────────────────────────────────────────────────
  return (
    <main className="max-w-2xl mx-auto px-4 pt-24 pb-16 space-y-8">
      {/* 헤더 */}
      <header>
        <p className="text-xs uppercase tracking-widest text-slate-400">ClipBaro</p>
        <h1 className="mt-1 text-2xl font-bold dark:text-white">새 영상 만들기</h1>
      </header>

      {/* 스텝 바 */}
      <div className="flex items-center gap-1">
        {STEP_LABELS.map((label, i) => (
          <div key={i} className="flex items-center gap-1 flex-1">
            <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0 ${
              i < step ? 'bg-blue-600 text-white' :
              i === step ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' :
              'bg-slate-100 dark:bg-slate-800 text-slate-400'
            }`}>{i < step ? '✓' : i + 1}</div>
            <span className={`text-xs hidden sm:block ${i === step ? 'font-semibold dark:text-white' : 'text-slate-400'}`}>
              {label}
            </span>
            {i < STEP_LABELS.length - 1 && <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700 mx-1" />}
          </div>
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 rounded-xl px-4 py-3">{error}</p>
      )}

      {/* ── STEP 0: 카테고리 ── */}
      {step === 0 && (
        <section className="space-y-4">
          <h2 className="font-semibold dark:text-white">어떤 카테고리의 영상인가요?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`rounded-2xl border p-4 text-left transition ${
                  category === c.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <span className="text-2xl">{c.icon}</span>
                <p className="mt-2 text-sm font-medium dark:text-white">{c.label}</p>
              </button>
            ))}
          </div>
          <button
            disabled={!category}
            onClick={() => setStep(1)}
            className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold disabled:opacity-40 transition"
          >
            다음
          </button>
        </section>
      )}

      {/* ── STEP 1: 스타일 ── */}
      {step === 1 && (
        <section className="space-y-4">
          <h2 className="font-semibold dark:text-white">영상 톤·스타일을 선택하세요.</h2>
          <div className="space-y-3">
            {STYLES.map((s) => (
              <button
                key={s.id}
                onClick={() => setStyle(s.id)}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  style === s.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <p className="font-medium text-sm dark:text-white">{s.label}</p>
                <p className="mt-0.5 text-xs text-slate-500">{s.desc}</p>
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(0)} className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-medium">이전</button>
            <button disabled={!style} onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold disabled:opacity-40 transition">다음</button>
          </div>
        </section>
      )}

      {/* ── STEP 2: 주제 ── */}
      {step === 2 && (
        <section className="space-y-4">
          <h2 className="font-semibold dark:text-white">영상 주제를 입력하세요.</h2>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="예: 거북목을 1주일 만에 고치는 운동 한 가지"
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-500">AI 모드</span>
            <div className="flex gap-2 ml-auto">
              {(['basic', 'byok'] as const).map((m) => (
                <button key={m} onClick={() => setMode(m)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium ${mode === m ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'text-slate-500'}`}>
                  {m === 'basic' ? '기본 AI' : 'BYOK (내 API 키)'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-medium">이전</button>
            <button
              disabled={!topic.trim() || generating}
              onClick={generateScript}
              className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-40 transition"
            >
              {generating ? '대본 생성 중...' : '✨ AI 대본 생성'}
            </button>
          </div>
        </section>
      )}

      {/* ── STEP 3: 대본 확인 ── */}
      {step === 3 && aiScript && (
        <section className="space-y-4">
          <h2 className="font-semibold dark:text-white">AI 대본 확인</h2>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
            <p className="font-bold text-sm dark:text-white">{aiScript.title}</p>
            <p className="text-xs text-slate-500 leading-relaxed">{aiScript.description}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {aiScript.tags.map((t) => (
                <span key={t} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full text-xs text-slate-600 dark:text-slate-300">#{t}</span>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {aiScript.script.map((sc, i) => (
              <div key={i} className="rounded-xl border border-slate-100 dark:border-slate-800 p-3">
                <p className="text-xs font-semibold text-slate-400 uppercase">{sc.section} · {sc.duration}초</p>
                <p className="mt-1 text-sm dark:text-white">{sc.text}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-medium">다시 생성</button>
            <button onClick={() => setStep(4)} className="flex-1 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold transition">이 대본으로 제작</button>
          </div>
        </section>
      )}

      {/* ── STEP 4: 최종 확인 ── */}
      {step === 4 && aiScript && (
        <section className="space-y-6">
          <h2 className="font-semibold dark:text-white">제작 전 최종 확인</h2>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">카테고리</span><span className="font-medium dark:text-white">{CATEGORIES.find(c=>c.id===category)?.label}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">스타일</span><span className="font-medium dark:text-white">{STYLES.find(s=>s.id===style)?.label}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">제목</span><span className="font-medium dark:text-white text-right max-w-xs truncate">{aiScript.title}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">총 길이</span><span className="font-medium dark:text-white">{aiScript.script.reduce((s,sc)=>s+sc.duration,0)}초</span></div>
            <div className="flex justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
              <span className="text-slate-500">차감 크레딧</span>
              <span className="font-bold text-blue-600">1 크레딧</span>
            </div>
          </div>
          <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 px-4 py-3 text-xs text-amber-700 dark:text-amber-300">
            렌더 워커(Fly.io) 연동 준비 중입니다. 현재는 대기열에 등록만 되며 실제 영상 생성은 워커 배포 후 자동 처리됩니다.
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(3)} className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-medium">이전</button>
            <button
              disabled={submitting}
              onClick={submitRender}
              className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50 transition"
            >
              {submitting ? '제출 중...' : '제작 시작'}
            </button>
          </div>
        </section>
      )}

      {/* ── STEP 5: 완료 ── */}
      {step === 5 && (
        <section className="text-center space-y-6 py-8">
          <div className="text-6xl">🎬</div>
          <h2 className="text-xl font-bold dark:text-white">제작 대기열에 등록됐어요!</h2>
          <p className="text-sm text-slate-500">렌더 ID: <code className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs">{renderId.slice(0,8)}...</code></p>
          <p className="text-xs text-slate-400">워커 배포 후 자동으로 처리됩니다. 대시보드에서 진행 상황을 확인하세요.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => { setStep(0); setAiScript(null); setTopic(''); setCategory(''); setStyle(''); setRenderId(''); }} className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm">새 영상 만들기</button>
            <a href="/clipbaro/dashboard" className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold">대시보드로</a>
          </div>
        </section>
      )}
    </main>
  );
}
