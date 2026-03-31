'use client';

import { useState } from 'react';
import { getToolById } from '@/lib/tools';
import { ToolLayout } from '@/components/layout/ToolLayout';

const tool = getToolById('daily-fortune')!;

interface FortuneResult {
  overall: string;
  money: string;
  love: string;
  health: string;
  luckyNumber: number;
  luckyColor: string;
  advice: string;
  score: number;
}

function getScoreColor(score: number): string {
  if (score >= 90) return 'text-red-500';
  if (score >= 80) return 'text-orange-500';
  if (score >= 70) return 'text-yellow-500';
  return 'text-blue-500';
}

export default function DailyFortunePage() {
  const [birthDate, setBirthDate] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FortuneResult | null>(null);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const canCalc = birthDate && birthDate <= today;

  const handleSubmit = async () => {
    if (!canCalc || loading) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/daily-fortune', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ birthDate, name: name.trim() || undefined }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '오류가 발생했습니다.');
      }

      const data = await res.json();
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fortuneCategories = result ? [
    { label: '총운', emoji: '🌟', text: result.overall, color: 'bg-purple-50 dark:bg-purple-900/20' },
    { label: '재운', emoji: '💰', text: result.money, color: 'bg-yellow-50 dark:bg-yellow-900/20' },
    { label: '애정운', emoji: '💕', text: result.love, color: 'bg-pink-50 dark:bg-pink-900/20' },
    { label: '건강운', emoji: '💪', text: result.health, color: 'bg-green-50 dark:bg-green-900/20' },
  ] : [];

  return (
    <ToolLayout
      tool={tool}
      disclaimer="이 도구는 재미로만 봐주세요. AI가 생성한 운세이며 실제 운명과는 무관합니다."
      seoContent={
        <section className="space-y-6 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">AI 오늘의 운세란?</h2>
            <p>생년월일을 입력하면 AI가 오늘의 운세를 총운, 재운, 애정운, 건강운으로 나누어 알려드립니다. 매일 다른 운세를 확인할 수 있으며, 행운의 숫자와 색상도 함께 제공합니다. 재미로 보는 운세이니 가볍게 즐겨주세요.</p>
          </div>
        </section>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">생년월일</label>
            <input
              type="date"
              value={birthDate}
              onChange={e => setBirthDate(e.target.value)}
              max={today}
              className="w-full min-w-0 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">이름 (선택)</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="홍길동"
              maxLength={20}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!canCalc || loading}
          className={`w-full py-3 rounded-xl font-bold text-lg transition-all ${
            canCalc && !loading
              ? 'bg-primary text-white hover:bg-primary/90 shadow-md'
              : 'bg-gray-200 dark:bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              운세 보는 중...
            </span>
          ) : '오늘의 운세 보기 🔮'}
        </button>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* 점수 */}
            <div className="bg-primary/5 dark:bg-primary/20 rounded-xl p-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">오늘의 운세 점수</p>
              <p className={`text-5xl font-bold font-heading ${getScoreColor(result.score)}`}>
                {result.score}점
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{result.advice}</p>
            </div>

            {/* 행운 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">행운의 숫자</p>
                <p className="text-2xl font-bold text-primary">{result.luckyNumber}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">행운의 색상</p>
                <p className="text-2xl font-bold text-primary">{result.luckyColor}</p>
              </div>
            </div>

            {/* 카테고리별 운세 */}
            <div className="space-y-3">
              {fortuneCategories.map((cat) => (
                <div key={cat.label} className={`${cat.color} rounded-xl p-4`}>
                  <p className="font-medium text-gray-900 dark:text-white mb-1">
                    {cat.emoji} {cat.label}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{cat.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
