'use client';

import { useEffect, useState } from 'react';

const PACKS = [
  {
    id: 'pack_10',
    credits: 10,
    usd: 1.99,
    krw: 2900,
    badge: '',
    desc: '가볍게 시작',
  },
  {
    id: 'pack_30',
    credits: 30,
    usd: 3.99,
    krw: 5900,
    badge: '인기',
    desc: '크레딧당 ₩197 — 가장 합리적',
  },
  {
    id: 'pack_100',
    credits: 100,
    usd: 8.99,
    krw: 13200,
    badge: '최고 혜택',
    desc: '크레딧당 ₩132 — 파워 유저용',
  },
];

const paymentEnabled = process.env.NEXT_PUBLIC_PAYMENT_ENABLED === 'true';

export default function CreditsPage() {
  const [balance, setBalance] = useState<number | null>(null);
  const [purchasing, setPurchasing] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadBalance() {
      const { createClient } = await import('@/lib/supabase/client');
      const sb = createClient();
      const { data } = await sb.rpc('get_credit_balance');
      setBalance(data as number ?? 0);
    }
    loadBalance();
  }, [success]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === '1') setSuccess(true);
  }, []);

  async function handleBuy(packId: string) {
    if (!paymentEnabled) return;
    setPurchasing(packId);
    setError('');
    try {
      const res = await fetch('/api/clipbaro/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? '결제 준비 중 오류가 발생했습니다.');
        return;
      }
      window.location.href = data.checkoutUrl;
    } catch {
      setError('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setPurchasing('');
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 pt-24 pb-16 space-y-10">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400">ClipBaro</p>
          <h1 className="mt-1 text-2xl font-bold dark:text-white">크레딧 충전</h1>
          <p className="mt-1 text-sm text-slate-500">
            현재 잔액: <strong>{balance ?? '—'}</strong> 크레딧
          </p>
        </div>
        <a href="/clipbaro/dashboard" className="text-sm text-slate-500 hover:underline">← 대시보드</a>
      </header>

      {success && (
        <div className="rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-5 py-4">
          <p className="font-semibold text-green-700 dark:text-green-400">결제 완료!</p>
          <p className="mt-1 text-sm text-green-600 dark:text-green-500">크레딧이 곧 충전됩니다. 잠시 후 새로고침 해주세요.</p>
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* 베타 무료 배너 */}
      {!paymentEnabled && (
        <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 px-5 py-4">
          <p className="font-semibold text-amber-700 dark:text-amber-400">🎁 베타 기간 무료 이용 중</p>
          <p className="mt-1 text-sm text-amber-600 dark:text-amber-500">
            베타 기간 동안 모든 기능을 무료로 사용할 수 있습니다. 정식 출시 후 크레딧 결제가 활성화됩니다.
          </p>
        </div>
      )}

      {/* 크레딧 팩 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {PACKS.map((pack) => (
          <div
            key={pack.id}
            className={`relative rounded-2xl border p-6 space-y-4 transition ${
              pack.badge === '인기'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
            }`}
          >
            {pack.badge && (
              <span className={`absolute -top-3 left-4 px-3 py-0.5 rounded-full text-xs font-bold ${
                pack.badge === '최고 혜택'
                  ? 'bg-violet-600 text-white'
                  : 'bg-blue-600 text-white'
              }`}>
                {pack.badge}
              </span>
            )}
            <div>
              <p className="text-3xl font-bold dark:text-white">{pack.credits}
                <span className="text-base font-normal text-slate-500 ml-1">크레딧</span>
              </p>
              <p className="mt-1 text-xl font-semibold dark:text-white">
                {paymentEnabled ? (
                  <>₩{pack.krw.toLocaleString()}<span className="text-xs text-slate-400 font-normal ml-1">(${pack.usd})</span></>
                ) : (
                  <span className="text-slate-400 text-base font-normal">베타 무료</span>
                )}
              </p>
              <p className="mt-1 text-xs text-slate-500">{pack.desc}</p>
            </div>
            <button
              onClick={() => handleBuy(pack.id)}
              disabled={!paymentEnabled || !!purchasing}
              className={`w-full py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${
                pack.badge === '인기'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90'
              }`}
            >
              {purchasing === pack.id
                ? '처리 중...'
                : paymentEnabled
                  ? '구매하기'
                  : '베타 무료 사용 중'}
            </button>
          </div>
        ))}
      </div>

      {/* 크레딧 안내 */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3 text-sm">
        <h2 className="font-semibold dark:text-white">크레딧 안내</h2>
        <ul className="space-y-1.5 text-slate-600 dark:text-slate-400 text-xs">
          <li>• 1 크레딧 = 영상 1편 제작</li>
          <li>• 구매 후 <strong>1년</strong> 유효 (만료 30일 전 이메일 알림)</li>
          <li>• 가입 시 무료 5크레딧 자동 지급 (30일 유효)</li>
          <li>• 렌더 실패 시 크레딧 자동 환불</li>
          <li>• 환불: 미사용 크레딧 구매 7일 내 전액 환불 가능</li>
        </ul>
      </section>
    </main>
  );
}
