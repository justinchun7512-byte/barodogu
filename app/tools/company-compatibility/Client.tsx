'use client';

import { useState } from 'react';
import { getToolById } from '@/lib/tools';
import { ToolLayout } from '@/components/layout/ToolLayout';

const tool = getToolById('company-compatibility')!;

interface CompatResult {
  score: number;
  grade: string;
  summary: string;
  analysis: {
    culture: string;
    growth: string;
    workStyle: string;
  };
  strengths: string[];
  cautions: string[];
  advice: string;
}

function getGradeColor(grade: string): string {
  switch (grade) {
    case '천생직장': return 'text-red-500';
    case '좋은 궁합': return 'text-pink-500';
    case '보통': return 'text-yellow-500';
    default: return 'text-orange-500';
  }
}

function getGradeEmoji(grade: string): string {
  switch (grade) {
    case '천생직장': return '💞';
    case '좋은 궁합': return '💕';
    case '보통': return '💛';
    default: return '🧡';
  }
}

const MBTI_TYPES = [
  'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
  'ISTP', 'ISFP', 'INFP', 'INTP',
  'ESTP', 'ESFP', 'ENFP', 'ENTP',
  'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ',
] as const;

type MbtiType = typeof MBTI_TYPES[number];

export default function CompanyCompatibilityPage() {
  const [companyName, setCompanyName] = useState('');
  const [mbti, setMbti] = useState<MbtiType | ''>('');
  const [career, setCareer] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompatResult | null>(null);
  const [error, setError] = useState('');

  const canCalc = companyName.trim().length >= 1 && mbti !== '';

  const handleSubmit = async () => {
    if (!canCalc || loading) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/company-compatibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: companyName.trim(),
          personality: `MBTI: ${mbti}`,
          career: career.trim() || undefined,
        }),
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

  return (
    <ToolLayout
      tool={tool}
      disclaimer="이 도구는 AI의 일반적인 분석이며, 실제 기업의 내부 문화와 다를 수 있습니다. 참고용으로만 활용하세요."
      seoContent={
        <section className="space-y-6 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">나와 기업의 궁합이란?</h2>
            <p>내 성향, 경력, 업무 스타일과 관심 있는 기업의 조직문화를 AI가 분석하여 궁합 점수를 알려드립니다. 취업이나 이직을 고민할 때 참고할 수 있는 재미있는 도구입니다. 조직문화 적합도, 성장 가능성, 업무 스타일 매칭을 종합적으로 분석합니다.</p>
          </div>
        </section>
      }
    >
      <div className="space-y-6">
        {/* 기업명 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">관심 기업</label>
          <input
            type="text"
            value={companyName}
            onChange={e => setCompanyName(e.target.value)}
            placeholder="예: 네이버, 삼성전자, 당근마켓"
            maxLength={50}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* MBTI 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">나의 MBTI</label>
          <div className="grid grid-cols-4 gap-1.5">
            {MBTI_TYPES.map(t => (
              <button
                key={t}
                onClick={() => setMbti(t)}
                className={`py-2 px-1 rounded-lg text-xs font-bold transition-all ${
                  mbti === t
                    ? 'bg-primary text-white shadow-md scale-105'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* 직무/경력 (선택) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">직무/경력 (선택)</label>
          <input
            type="text"
            value={career}
            onChange={e => setCareer(e.target.value)}
            placeholder="예: 프론트엔드 개발 3년, 마케팅 신입"
            maxLength={100}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
          />
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
              분석 중...
            </span>
          ) : '궁합 분석하기 🤝'}
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
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                나 x {companyName}
              </p>
              <p className="text-4xl mb-1">{getGradeEmoji(result.grade)}</p>
              <p className={`text-5xl font-bold font-heading ${getGradeColor(result.grade)}`}>
                {result.score}점
              </p>
              <p className={`text-lg font-semibold mt-1 ${getGradeColor(result.grade)}`}>{result.grade}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{result.summary}</p>
            </div>

            {/* 궁합 바 */}
            <div className="relative h-4 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-400 to-primary transition-all duration-1000"
                style={{ width: `${result.score}%` }}
              />
            </div>

            {/* 상세 분석 */}
            <div className="space-y-3">
              {[
                { label: '조직문화 적합도', emoji: '🏢', text: result.analysis.culture },
                { label: '성장 가능성', emoji: '📈', text: result.analysis.growth },
                { label: '업무 스타일', emoji: '💼', text: result.analysis.workStyle },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <p className="font-medium text-gray-900 dark:text-white mb-1">
                    {item.emoji} {item.label}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{item.text}</p>
                </div>
              ))}
            </div>

            {/* 강점/주의점 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                <p className="font-medium text-green-700 dark:text-green-400 mb-2">강점</p>
                <ul className="space-y-1.5 text-sm text-gray-600 dark:text-gray-300">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="flex gap-1.5"><span className="text-green-500 shrink-0">+</span>{s}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4">
                <p className="font-medium text-orange-700 dark:text-orange-400 mb-2">주의점</p>
                <ul className="space-y-1.5 text-sm text-gray-600 dark:text-gray-300">
                  {result.cautions.map((c, i) => (
                    <li key={i} className="flex gap-1.5"><span className="text-orange-500 shrink-0">!</span>{c}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 조언 */}
            <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-4">
              <p className="font-medium text-gray-900 dark:text-white mb-1">💡 조언</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{result.advice}</p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
