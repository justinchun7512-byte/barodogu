'use client';

import { useEffect, useState } from 'react';

// ── 크레딧 팩 정의 (A안 USD 가격, Paddle Price ID는 env로 주입)
const PACKS = [
  {
    id: 'pack_10',
    credits: 10,
    usd: 3.99,
    krw: 5900,
    priceEnv: 'NEXT_PUBLIC_PADDLE_PRICE_PACK10',
    badge: '',
    desc: '가볍게 시작',
  },
  {
    id: 'pack_30',
    credits: 30,
    usd: 8.99,
    krw: 13200,
    priceEnv: 'NEXT_PUBLIC_PADDLE_PRICE_PACK30',
    badge: '인기',
    desc: '크레딧당 ₩440 — 가장 합리적',
  },
  {
    id: 'pack_100',
    credits: 100,
    usd: 19.99,
    krw: 29400,
    priceEnv: 'NEXT_PUBLIC_PADDLE_PRICE_PACK100',
    badge: '최고 혜택',
    desc: '크레딧당 ₩294 — 파워 유저용',
  },
];

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Paddle: any;
  }
}

export default function CreditsPage() {
  const [balance, setBalance] = useState<number | null>(null);
  const [paddleReady, setPaddleReady] = useState(false);
  const [purchasing, setPurchasing] = useState('');
  const [success, setSuccess] = useState(false);

  const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
  const isSandbox = process.env.NEXT_PUBLIC_PADDLE_ENV !== 'production';

  // Paddle.js 로드
  useEffect(() => {
    if (!clientToken) return;
    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    script.onload = () => {
      window.Paddle.Environment.set(isSandbox ? 'sandbox' : 'production');
      window.Paddle.Initialize({ token: clientToken });
      setPaddleReady(true);
    };
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, [clientToken, isSandbox]);

  // 크레딧 잔액 조회
  useEffect(() => {
    async function loadBalance() {
      const { createClient } = await import('@/lib/supabase/client');
      const sb = createClient();
      const { data } = await sb.rpc('get_credit_balance');
      setBalance(data as number ?? 0);
    }
    loadBalance();
  }, [success]);

  function handleBuy(pack: typeof PACKS[0]) {
    const priceId = (process.env as Record<string, string | undefined>)[pack.priceEnv];
    if (!paddleReady || !priceId) {
      alert('결제 시스템 준비 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    setPurchasing(pack.id);
    window.Paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      settings: { displayMode: 'overlay', locale: 'ko', theme: 'light' },
      successUrl: `${window.location.origin}/clipbaro/credits?success=1`,
      closeCallback: () => setPurchasing(''),
    });
  }

  // 성공 파라미터 감지
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === '1') setSuccess(true);
  }, []);

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

      {!clientToken && (
        <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 px-4 py-3 text-xs text-amber-700 dark:text-amber-300">
          Paddle 계정 승인 후 NEXT_PUBLIC_PADDLE_CLIENT_TOKEN을 .env.local에 추가하면 결제가 활성화됩니다.
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
                ₩{pack.krw.toLocaleString()}
                <span className="text-xs text-slate-400 font-normal ml-1">(${pack.usd})</span>
              </p>
              <p className="mt-1 text-xs text-slate-500">{pack.desc}</p>
            </div>
            <button
              onClick={() => handleBuy(pack)}
              disabled={!!purchasing || !clientToken}
              className={`w-full py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-50 ${
                pack.badge === '인기'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90'
              }`}
            >
              {purchasing === pack.id ? '결제 중...' : '구매하기'}
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
