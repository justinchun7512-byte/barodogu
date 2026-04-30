'use client';

import Link from 'next/link';
import { useState } from 'react';

import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
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
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/clipbaro/reset-password`,
    });

    if (error) {
      setError(error.message);
      setBusy(false);
      return;
    }

    setInfo('비밀번호 재설정 링크를 이메일로 보냈습니다. 받은편지함을 확인해주세요.');
    setBusy(false);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-16">
      <div className="mx-auto w-full max-w-md">
        <Link href="/clipbaro/login" className="text-sm text-slate-500 hover:text-slate-700">
          ← 로그인으로
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-slate-900">비밀번호 재설정</h1>
        <p className="mt-2 text-sm text-slate-600">
          가입 시 사용한 이메일을 입력하시면 재설정 링크를 보내드립니다.
        </p>

        {!supabaseConfigured && (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            ⚠️ 베타 준비 중 — Supabase 미연결 상태입니다.
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

            {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            {info && (
              <p className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-700">{info}</p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-lg bg-slate-900 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {busy ? '전송 중...' : '재설정 링크 보내기'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          비밀번호가 기억나셨나요?{' '}
          <Link href="/clipbaro/login" className="font-medium text-blue-600 hover:text-blue-700">
            로그인
          </Link>
        </p>
      </div>
    </main>
  );
}
