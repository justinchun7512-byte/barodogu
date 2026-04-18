'use client';

import { useState } from 'react';

const STORAGE_KEY = 'clipbaro_beta_waitlist_v1';

export default function BetaSignupForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmed = email.trim();
    if (!trimmed) {
      setError('이메일을 입력해주세요.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setError('올바른 이메일 형식이 아닙니다.');
      return;
    }

    // 로컬 저장 (W2 Supabase 연결 전까지 임시 저장소)
    try {
      const existing = localStorage.getItem(STORAGE_KEY);
      const list: { email: string; ts: string }[] = existing
        ? JSON.parse(existing)
        : [];
      const already = list.find((x) => x.email === trimmed);
      if (already) {
        setError('이미 신청된 이메일입니다.');
        return;
      }
      list.push({ email: trimmed, ts: new Date().toISOString() });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (err) {
      // localStorage 실패해도 신청 완료 표시 (UX 우선)
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto text-center bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-8">
        <div className="text-5xl mb-4">&#127881;</div>
        <h3 className="text-xl font-bold mb-2">베타 신청이 접수되었습니다</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          <strong>{email}</strong>
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          베타 초대 코드가 준비되면 이 이메일로 발송해드립니다.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto"
      noValidate
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-base"
          aria-label="베타 신청 이메일"
          required
        />
        <button
          type="submit"
          className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors whitespace-nowrap"
        >
          베타 신청
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-500 mt-2 text-center">{error}</p>
      )}
      <p className="text-xs text-gray-400 mt-3 text-center">
        스팸 없이 베타 초대 코드만 1회 발송됩니다.
      </p>
    </form>
  );
}
