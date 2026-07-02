'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { createClient } from '@/lib/supabase/client';

type Provider = 'email' | 'google' | string;

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [provider, setProvider] = useState<Provider>('email');
  const [loading, setLoading] = useState(true);

  // 비밀번호 변경
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwBusy, setPwBusy] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwInfo, setPwInfo] = useState<string | null>(null);

  // 회원 탈퇴
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showDeleteSection, setShowDeleteSection] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace('/clipbaro/login?next=/clipbaro/settings');
        return;
      }
      setEmail(user.email ?? '');
      const identity = user.identities?.[0];
      setProvider(identity?.provider ?? 'email');
      setLoading(false);
    });
  }, []);

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPwError(null);
    setPwInfo(null);

    if (newPassword.length < 8) {
      setPwError('비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setPwBusy(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setPwError(error.message);
    } else {
      setPwInfo('비밀번호가 변경되었습니다.');
      setNewPassword('');
      setConfirmPassword('');
    }
    setPwBusy(false);
  }

  async function handleDeleteAccount() {
    if (deleteConfirm !== '탈퇴합니다') {
      setDeleteError('"탈퇴합니다"를 정확히 입력해주세요.');
      return;
    }

    setDeleteBusy(true);
    setDeleteError(null);

    const res = await fetch('/api/clipbaro/account/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ confirm: '탈퇴합니다' }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setDeleteError(data.error ?? '탈퇴 처리 중 오류가 발생했습니다.');
      setDeleteBusy(false);
      return;
    }

    await supabase.auth.signOut();
    router.replace('/clipbaro?withdrawn=1');
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-slate-400 text-sm">
        로딩 중...
      </main>
    );
  }

  const isOAuth = provider !== 'email';

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-16">
      <div className="mx-auto w-full max-w-lg space-y-8">
        <div>
          <Link href="/clipbaro/dashboard" className="text-sm text-slate-500 hover:text-slate-700">
            ← 대시보드
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">계정 설정</h1>
          <p className="mt-1 text-sm text-slate-500">{email}</p>
        </div>

        {/* 비밀번호 변경 */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-slate-900">비밀번호 변경</h2>

          {isOAuth ? (
            <p className="text-sm text-slate-500">
              Google 계정으로 로그인하셨습니다. 비밀번호 변경은 Google 계정 설정에서 해주세요.
            </p>
          ) : (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-slate-700">
                  새 비밀번호 <span className="text-xs text-slate-400">(8자 이상)</span>
                </label>
                <input
                  id="new-password"
                  type="password"
                  required
                  autoComplete="new-password"
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700">
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

              {pwError && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{pwError}</p>}
              {pwInfo && <p className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-700">{pwInfo}</p>}

              <button
                type="submit"
                disabled={pwBusy}
                className="w-full rounded-lg bg-slate-900 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
              >
                {pwBusy ? '변경 중...' : '비밀번호 변경'}
              </button>
            </form>
          )}
        </section>

        {/* 회원 탈퇴 */}
        <section className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-red-700">회원 탈퇴</h2>
          <p className="text-sm text-slate-600">
            탈퇴하면 계정, 제작 이력, 남은 크레딧이 모두 삭제되며 복구할 수 없습니다.
          </p>

          {!showDeleteSection ? (
            <button
              type="button"
              onClick={() => setShowDeleteSection(true)}
              className="text-sm text-red-600 hover:text-red-700 underline underline-offset-2"
            >
              탈퇴 진행하기
            </button>
          ) : (
            <div className="space-y-4">
              <div>
                <label htmlFor="delete-confirm" className="block text-sm font-medium text-slate-700">
                  확인을 위해 아래에{' '}
                  <span className="font-mono font-bold text-slate-900">탈퇴합니다</span>를
                  입력하세요.
                </label>
                <input
                  id="delete-confirm"
                  type="text"
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  placeholder="탈퇴합니다"
                  className="mt-1 block w-full rounded-lg border border-red-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              {deleteError && (
                <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{deleteError}</p>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteSection(false);
                    setDeleteConfirm('');
                    setDeleteError(null);
                  }}
                  className="flex-1 rounded-lg border border-slate-300 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deleteBusy || deleteConfirm !== '탈퇴합니다'}
                  className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-40"
                >
                  {deleteBusy ? '탈퇴 처리 중...' : '계정 영구 삭제'}
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
