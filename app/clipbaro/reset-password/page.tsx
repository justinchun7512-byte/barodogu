'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const router = useRouter();
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
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setBusy(false);
      return;
    }

    setInfo('비밀번호가 변경되었습니다. 잠시 후 로그인 페이지로 이동합니다.');
    setBusy(false);
    setTimeout(() => router.push('/clipbaro/login'), 2000);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-16">
      <div className="mx-auto w-full max-w-md">
        <Link href="/clipbaro/login" className="text-sm text-slate-500 hover:text-slate-700">
          ← 로그인으로
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-slate-900">새 비밀번호 설정</h1>
        <p className="mt-2 text-sm text-slate-600">
          이메일로 받은 링크를 통해 들어오셨습니다. 새 비밀번호를 입력해주세요.
        </p>

        {!supabaseConfigured && (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            ⚠️ 베타 준비 중 — Supabase 미연결 상태입니다.
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                새 비밀번호 <span className="text-xs text-slate-400">(8자 이상)</span>
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
              {busy ? '변경 중...' : '비밀번호 변경'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
