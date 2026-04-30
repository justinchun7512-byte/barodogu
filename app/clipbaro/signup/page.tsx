'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

import { createClient } from '@/lib/supabase/client';

function SignupForm() {
  const searchParams = useSearchParams();
  const next = searchParams?.get('next') ?? '/clipbaro';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const supabaseConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (password.length < 8) {
      setError('비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setBusy(true);

    if (!supabaseConfigured) {
      setError('Supabase가 아직 연결되지 않았습니다. 관리자에게 문의해주세요.');
      setBusy(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
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

    setInfo('가입 확인 이메일을 보냈습니다. 받은편지함에서 확인해주세요.');
    setBusy(false);
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

      <h1 className="mt-6 text-3xl font-bold text-slate-900">클립바로 회원가입</h1>
      <p className="mt-2 text-sm text-slate-600">
        가입 즉시 무료 5크레딧 지급. 신용카드 등록 없이 바로 시작하세요.
      </p>

      {!supabaseConfigured && (
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          ⚠️ 베타 준비 중 — Supabase 프로젝트가 아직 연결되지 않았습니다. 곧 정식 오픈
          예정입니다.
        </div>
      )}

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
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

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              비밀번호 <span className="text-xs text-slate-400">(8자 이상)</span>
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="new-password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-slate-700"
            >
              비밀번호 확인
            </label>
            <input
              id="confirm-password"
              type="password"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          {info && (
            <p className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-700">{info}</p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-slate-900 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {busy ? '가입 중...' : '계정 만들기'}
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
          Google 계정으로 가입
        </button>

        <p className="mt-6 text-center text-xs text-slate-500">
          가입 시{' '}
          <Link href="/terms" className="underline hover:text-slate-700">
            이용약관
          </Link>
          과{' '}
          <Link href="/privacy" className="underline hover:text-slate-700">
            개인정보처리방침
          </Link>
          에 동의한 것으로 간주합니다.
        </p>
      </div>

      <p className="mt-6 text-center text-sm text-slate-600">
        이미 계정이 있으신가요?{' '}
        <Link
          href={`/clipbaro/login${next ? `?next=${encodeURIComponent(next)}` : ''}`}
          className="font-medium text-blue-600 hover:text-blue-700"
        >
          로그인
        </Link>
      </p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-16">
      <Suspense fallback={<div className="mx-auto w-full max-w-md text-center text-slate-400">로딩 중...</div>}>
        <SignupForm />
      </Suspense>
    </main>
  );
}
