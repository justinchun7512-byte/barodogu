'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

import { createClient } from '@/lib/supabase/client';

type Mode = 'password' | 'magic';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams?.get('next') ?? '/clipbaro';

  const [mode, setMode] = useState<Mode>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const supabaseConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);

    if (!supabaseConfigured) {
      setError('Supabase가 아직 연결되지 않았습니다. 관리자에게 문의해주세요.');
      setBusy(false);
      return;
    }

    const supabase = createClient();

    if (mode === 'password') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setBusy(false);
        return;
      }
      router.push(next);
      router.refresh();
    } else {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/clipbaro/auth/callback?next=${encodeURIComponent(
            next,
          )}`,
        },
      });
      if (error) {
        setError(error.message);
        setBusy(false);
        return;
      }
      setInfo('이메일로 매직링크를 보냈습니다. 받은편지함을 확인해주세요.');
      setBusy(false);
    }
  }

  async function handleGoogle() {
    if (!supabaseConfigured) {
      setError('Supabase가 아직 연결되지 않았습니다. 관리자에게 문의해주세요.');
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/clipbaro/auth/callback?next=${encodeURIComponent(
          next,
        )}`,
      },
    });
    if (error) setError(error.message);
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <Link href="/clipbaro" className="text-sm text-slate-500 hover:text-slate-700">
        ← 클립바로 홈
      </Link>

      <h1 className="mt-6 text-3xl font-bold text-slate-900">클립바로 로그인</h1>
      <p className="mt-2 text-sm text-slate-600">
        AI 영상 생성 + 크레딧 관리를 위한 클립바로 계정에 로그인하세요.
      </p>

      {!supabaseConfigured && (
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          ⚠️ 베타 준비 중 — Supabase 프로젝트가 아직 연결되지 않았습니다. 곧 정식 오픈
          예정입니다.
        </div>
      )}

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex gap-2 rounded-lg bg-slate-100 p-1 text-sm">
          <button
            type="button"
            onClick={() => setMode('password')}
            className={`flex-1 rounded-md py-2 transition ${
              mode === 'password'
                ? 'bg-white shadow font-medium text-slate-900'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            비밀번호
          </button>
          <button
            type="button"
            onClick={() => setMode('magic')}
            className={`flex-1 rounded-md py-2 transition ${
              mode === 'magic'
                ? 'bg-white shadow font-medium text-slate-900'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            매직링크
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              이메일
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

          {mode === 'password' && (
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700"
                >
                  비밀번호
                </label>
                <Link
                  href="/clipbaro/forgot-password"
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  비밀번호 찾기
                </Link>
              </div>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}

          {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          {info && (
            <p className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-700">{info}</p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-slate-900 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {busy ? '처리 중...' : mode === 'password' ? '로그인' : '매직링크 보내기'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-slate-400">
          <div className="h-px flex-1 bg-slate-200" />
          또는
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          className="w-full rounded-lg border border-slate-300 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Google 계정으로 계속
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-slate-600">
        아직 계정이 없으신가요?{' '}
        <Link
          href={`/clipbaro/signup${next ? `?next=${encodeURIComponent(next)}` : ''}`}
          className="font-medium text-blue-600 hover:text-blue-700"
        >
          회원가입
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-16">
      <Suspense fallback={<div className="mx-auto w-full max-w-md text-center text-slate-400">로딩 중...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
