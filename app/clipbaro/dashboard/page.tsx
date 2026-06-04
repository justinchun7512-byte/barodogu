import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: '대시보드 - 클립바로',
};

export const dynamic = 'force-dynamic';

type Render = {
  id: string;
  status: string;
  progress: number;
  output_url: string | null;
  thumbnail_url: string | null;
  duration_sec: number | null;
  credit_cost: number;
  created_at: string;
  expires_at: string;
  projects: { title: string | null; category: string; topic: string } | null;
};

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  queued:    { label: '대기 중',   color: 'bg-slate-100 text-slate-600' },
  running:   { label: '제작 중',   color: 'bg-blue-100 text-blue-700' },
  completed: { label: '완료',      color: 'bg-green-100 text-green-700' },
  failed:    { label: '실패',      color: 'bg-red-100 text-red-600' },
  cancelled: { label: '취소됨',    color: 'bg-slate-100 text-slate-500' },
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/clipbaro/login?next=/clipbaro/dashboard');

  // 크레딧 잔액 (RPC)
  const { data: balance } = await supabase.rpc('get_credit_balance');

  // 최근 렌더 10개
  const { data: renders } = await supabase
    .from('renders')
    .select('id, status, progress, output_url, thumbnail_url, duration_sec, credit_cost, created_at, expires_at, projects(title, category, topic)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  const creditBalance = (balance as number | null) ?? 0;
  const renderList: Render[] = (renders as Render[] | null) ?? [];

  return (
    <main className="max-w-4xl mx-auto px-4 pt-24 pb-16 space-y-10">
      {/* 헤더 */}
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400">ClipBaro</p>
          <h1 className="mt-1 text-2xl font-bold dark:text-white">대시보드</h1>
          <p className="mt-1 text-sm text-slate-500">{user.email}</p>
        </div>
        <Link
          href="/clipbaro/render"
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition"
        >
          + 새 영상 만들기
        </Link>
      </header>

      {/* 크레딧 카드 */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <p className="text-xs text-slate-500">남은 크레딧</p>
          <p className="mt-2 text-4xl font-bold dark:text-white">{creditBalance}</p>
          <p className="mt-1 text-xs text-slate-400">1 크레딧 = 영상 1편</p>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <p className="text-xs text-slate-500">총 제작 영상</p>
          <p className="mt-2 text-4xl font-bold dark:text-white">
            {renderList.filter((r) => r.status === 'completed').length}
          </p>
          <p className="mt-1 text-xs text-slate-400">완료 기준</p>
        </div>
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-5 flex flex-col justify-center items-center text-center">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">크레딧 충전</p>
          <p className="mt-1 text-xs text-slate-400">결제 시스템 준비 중 (W9)</p>
        </div>
      </section>

      {/* 렌더 이력 */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold dark:text-white">최근 영상</h2>
          {creditBalance === 0 && (
            <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full">
              크레딧이 없습니다. 충전 후 영상을 만들 수 있어요.
            </p>
          )}
        </div>

        {renderList.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-12 text-center">
            <p className="text-slate-500 text-sm">아직 제작한 영상이 없어요.</p>
            <Link
              href="/clipbaro/render"
              className="mt-4 inline-block px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium hover:opacity-90 transition"
            >
              첫 영상 만들기
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {renderList.map((r) => {
              const st = STATUS_LABEL[r.status] ?? { label: r.status, color: 'bg-slate-100 text-slate-600' };
              return (
                <div
                  key={r.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex items-center gap-4"
                >
                  {/* 썸네일 */}
                  <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 flex items-center justify-center overflow-hidden">
                    {r.thumbnail_url ? (
                      <img src={r.thumbnail_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">🎬</span>
                    )}
                  </div>

                  {/* 정보 */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate dark:text-white">
                      {r.projects?.title ?? r.projects?.topic ?? '제목 없음'}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {r.projects?.category} · {r.credit_cost}크레딧 · {new Date(r.created_at).toLocaleDateString('ko-KR')}
                    </p>
                    {r.status === 'running' && (
                      <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all"
                          style={{ width: `${r.progress}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* 상태 + 다운로드 */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${st.color}`}>
                      {st.label}
                    </span>
                    {r.status === 'completed' && r.output_url && (
                      <a
                        href={r.output_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        다운로드
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
