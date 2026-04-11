'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

type Tier = 'basic' | 'starter' | 'pro';

interface LicenseResult {
  success: boolean;
  key: string;
  tier: Tier;
  tierLabel: string;
  expiresAt: string;
  issuedAt: string;
  orderNumber: string;
  error?: string;
}

const TIER_OPTIONS: { value: Tier; label: string; price: string; kmong: string }[] = [
  { value: 'basic', label: '기본', price: '9,900원', kmong: 'STANDARD' },
  { value: 'starter', label: '스타터', price: '15,000원', kmong: 'DELUXE' },
  { value: 'pro', label: '프로', price: '20,000원', kmong: 'PREMIUM' },
];

const VALID_TIERS: Tier[] = ['basic', 'starter', 'pro'];

function ActivateForm() {
  const searchParams = useSearchParams();
  const tierParam = searchParams.get('tier') as Tier | null;
  // URL에 tier가 있고 유효하면 잠금
  const tierFromUrl = tierParam && VALID_TIERS.includes(tierParam) ? tierParam : null;
  const tierLocked = !!tierFromUrl;

  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [tier, setTier] = useState<Tier>(tierFromUrl || 'basic');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LicenseResult | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch('/api/clipbaro/license', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber, email, tier }),
      });

      const data: LicenseResult = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || '라이선스 발급에 실패했습니다. 다시 시도해주세요.');
      } else {
        setResult(data);
      }
    } catch {
      setError('네트워크 오류가 발생했습니다. 인터넷 연결을 확인하고 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 클립보드 API 미지원 환경 폴백
      const el = document.createElement('textarea');
      el.value = result.key;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-2xl mx-auto px-4 py-12 md:py-20">
        {/* 헤더 */}
        <div className="text-center mb-10">
          <div className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary dark:bg-primary/20">
            클립바로
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            라이선스 활성화
          </h1>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
            크몽에서 클립바로를 구매하셨나요?
            <br />
            아래 정보를 입력하면 라이선스 키가 즉시 발급됩니다.
          </p>
        </div>

        {!result ? (
          /* 입력 폼 */
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 주문번호 */}
              <div>
                <label
                  htmlFor="orderNumber"
                  className="block text-sm font-semibold mb-1.5"
                >
                  크몽 주문번호 <span className="text-red-500">*</span>
                </label>
                <input
                  id="orderNumber"
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="예: 20260410-123456"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors text-sm"
                />
                <p className="mt-1.5 text-xs text-gray-400">
                  크몽 &apos;내 거래&apos; &gt; 주문 상세에서 확인할 수 있습니다
                </p>
              </div>

              {/* 이메일 */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold mb-1.5"
                >
                  이메일 주소 <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="예: user@example.com"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors text-sm"
                />
                <p className="mt-1.5 text-xs text-gray-400">
                  키 재발급 시 본인 확인용으로만 사용됩니다
                </p>
              </div>

              {/* 구매 등급 */}
              <div>
                <p className="text-sm font-semibold mb-2.5">
                  구매 등급 {tierLocked && <span className="text-xs text-green-600 font-normal ml-2">자동 선택됨</span>}
                </p>
                {tierLocked ? (
                  /* URL에서 tier가 지정된 경우: 잠금 표시 */
                  <div className="rounded-xl border-2 border-primary bg-primary/5 dark:bg-primary/10 p-4 text-center">
                    <div className="text-sm font-bold text-primary mb-0.5">
                      {TIER_OPTIONS.find(o => o.value === tier)?.label}
                    </div>
                    <div className="text-xs text-gray-500">
                      {TIER_OPTIONS.find(o => o.value === tier)?.kmong}
                    </div>
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-1">
                      {TIER_OPTIONS.find(o => o.value === tier)?.price}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      크몽 구매 패키지에 따라 자동 설정되었습니다
                    </p>
                  </div>
                ) : (
                  /* URL에 tier 없는 경우: 직접 선택 */
                  <div className="grid grid-cols-3 gap-3">
                    {TIER_OPTIONS.map((option) => (
                      <label
                        key={option.value}
                        className={`relative cursor-pointer rounded-xl border-2 p-3.5 text-center transition-all ${
                          tier === option.value
                            ? 'border-primary bg-primary/5 dark:bg-primary/10'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <input
                          type="radio"
                          name="tier"
                          value={option.value}
                          checked={tier === option.value}
                          onChange={() => setTier(option.value)}
                          className="sr-only"
                        />
                        <div
                          className={`text-sm font-bold mb-0.5 ${
                            tier === option.value
                              ? 'text-primary'
                              : 'text-gray-800 dark:text-gray-200'
                          }`}
                        >
                          {option.label}
                        </div>
                        <div className="text-xs text-gray-500">{option.kmong}</div>
                        <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-1">
                          {option.price}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* 오류 메시지 */}
              {error && (
                <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              {/* 제출 버튼 */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-primary hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors text-base"
              >
                {loading ? '발급 중...' : '라이선스 발급받기'}
              </button>
            </form>
          </div>
        ) : (
          /* 발급 성공 결과 */
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 md:p-8">
            {/* 성공 헤더 */}
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">&#127881;</div>
              <h2 className="text-xl font-bold mb-1">
                라이선스가 발급되었습니다!
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                아래 키를 클립바로 앱에 입력하세요
              </p>
            </div>

            {/* 라이선스 키 박스 */}
            <div className="mb-6">
              <p className="text-sm font-semibold mb-2 text-gray-600 dark:text-gray-300">
                라이선스 키
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-mono text-base font-bold tracking-wider text-primary overflow-x-auto">
                  {result.key}
                </div>
                <button
                  onClick={handleCopy}
                  className={`shrink-0 px-4 py-3.5 rounded-xl border font-medium text-sm transition-all ${
                    copied
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                      : 'border-gray-300 dark:border-gray-600 hover:border-primary hover:text-primary'
                  }`}
                >
                  {copied ? '복사됨' : '복사'}
                </button>
              </div>
            </div>

            {/* 발급 정보 */}
            <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <p className="text-xs text-gray-400 mb-0.5">등급</p>
                <p className="font-semibold">{result.tierLabel}</p>
              </div>
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <p className="text-xs text-gray-400 mb-0.5">유효기간</p>
                <p className="font-semibold">{result.expiresAt}까지</p>
              </div>
            </div>

            {/* 사용 방법 */}
            <div className="p-4 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl mb-6">
              <p className="text-sm font-semibold text-primary mb-2.5">
                &#128203; 사용 방법
              </p>
              <ol className="space-y-1.5 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex gap-2">
                  <span className="shrink-0 font-bold text-primary">1.</span>
                  <span>클립바로 앱을 실행하세요</span>
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 font-bold text-primary">2.</span>
                  <span>설정 &gt; 라이선스 탭으로 이동하세요</span>
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 font-bold text-primary">3.</span>
                  <span>위 키를 붙여넣기하세요</span>
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 font-bold text-primary">4.</span>
                  <span>&apos;활성화&apos; 버튼을 누르세요</span>
                </li>
              </ol>
            </div>

            {/* 재발급 안내 */}
            <p className="text-xs text-gray-400 text-center mb-4">
              같은 주문번호로 다시 접속하면 동일한 키가 재발급됩니다.
            </p>

            {/* 다시 발급받기 버튼 */}
            <button
              onClick={() => {
                setResult(null);
                setError('');
              }}
              className="w-full py-3 border border-gray-300 dark:border-gray-700 hover:border-primary hover:text-primary rounded-xl text-sm font-medium transition-colors"
            >
              다른 주문번호로 발급받기
            </button>
          </div>
        )}

        {/* 하단 도움말 */}
        <div className="mt-6 text-center text-xs text-gray-400 space-y-1">
          <p>문제가 있으신가요? 크몽 메시지 또는</p>
          <a
            href="/contact"
            className="text-primary hover:underline"
          >
            바로도구 문의하기
          </a>
          <span>로 연락주세요.</span>
        </div>
      </div>
    </main>
  );
}

export default function ClipBaroActivatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">로딩 중...</div>}>
      <ActivateForm />
    </Suspense>
  );
}
