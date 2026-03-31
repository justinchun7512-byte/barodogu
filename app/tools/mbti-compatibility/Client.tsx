'use client';

import { useState, useEffect } from 'react';
import { getToolById } from '@/lib/tools';
import { ToolLayout } from '@/components/layout/ToolLayout';

const tool = getToolById('mbti-compatibility')!;

const MBTI_TYPES = [
  'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
  'ISTP', 'ISFP', 'INFP', 'INTP',
  'ESTP', 'ESFP', 'ENFP', 'ENTP',
  'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ',
] as const;

type MbtiType = typeof MBTI_TYPES[number];

const MBTI_LABELS: Record<MbtiType, { title: string; emoji: string }> = {
  ISTJ: { title: '청렴결백한 논리주의자', emoji: '📋' },
  ISFJ: { title: '용감한 수호자', emoji: '🛡️' },
  INFJ: { title: '선의의 옹호자', emoji: '🌟' },
  INTJ: { title: '용의주도한 전략가', emoji: '♟️' },
  ISTP: { title: '만능 재주꾼', emoji: '🔧' },
  ISFP: { title: '호기심 많은 예술가', emoji: '🎨' },
  INFP: { title: '열정적인 중재자', emoji: '🦄' },
  INTP: { title: '논리적인 사색가', emoji: '🔬' },
  ESTP: { title: '모험을 즐기는 사업가', emoji: '🏄' },
  ESFP: { title: '자유로운 영혼의 연예인', emoji: '🎭' },
  ENFP: { title: '재기발랄한 활동가', emoji: '🦋' },
  ENTP: { title: '뜨거운 논쟁을 즐기는 변론가', emoji: '💡' },
  ESTJ: { title: '엄격한 관리자', emoji: '👔' },
  ESFJ: { title: '사교적인 외교관', emoji: '🤗' },
  ENFJ: { title: '정의로운 사회운동가', emoji: '🌍' },
  ENTJ: { title: '대담한 통솔자', emoji: '👑' },
};

// 궁합 등급: 5=천생연분, 4=좋은 궁합, 3=보통, 2=노력 필요, 1=도전적
// 기능적 스택 상보성 기반 궁합 매트릭스 (대칭)
const COMPAT_MATRIX: Record<string, number> = {
  // 천생연분 (5) - 이상적 파트너
  'INFJ-ENTP': 5, 'INFJ-ENFP': 5, 'INTJ-ENTP': 5, 'INTJ-ENFP': 5,
  'INFP-ENFJ': 5, 'INFP-ENTJ': 5, 'INTP-ENTJ': 5, 'INTP-ENFJ': 5,
  'ISFJ-ESFP': 5, 'ISFJ-ESTP': 5, 'ISTJ-ESFP': 5, 'ISTJ-ESTP': 5,
  'ISFP-ESFJ': 5, 'ISFP-ESTJ': 5, 'ISTP-ESFJ': 5, 'ISTP-ESTJ': 5,
  // 좋은 궁합 (4)
  'ENFP-INFJ': 5, 'ENFP-INTJ': 5,
  'ENTP-INFJ': 5, 'ENTP-INTJ': 5,
  'ENFJ-INFP': 5, 'ENFJ-INTP': 5,
  'ENTJ-INFP': 5, 'ENTJ-INTP': 5,
  'ENFP-ENFJ': 4, 'ENFP-ENTJ': 4, 'ENTP-ENFJ': 4, 'ENTP-ENTJ': 4,
  'INFJ-INFP': 4, 'INTJ-INTP': 4, 'INFJ-INTJ': 4, 'INFP-INTP': 4,
  'ESFP-ISFJ': 5, 'ESTP-ISFJ': 5, 'ESFP-ISTJ': 5, 'ESTP-ISTJ': 5,
  'ESFJ-ISFP': 5, 'ESTJ-ISFP': 5, 'ESFJ-ISTP': 5, 'ESTJ-ISTP': 5,
  'ESFP-ESFJ': 4, 'ESTP-ESTJ': 4, 'ESFJ-ESTJ': 4, 'ESFP-ESTP': 4,
  'ISFJ-ISTJ': 4, 'ISFP-ISTP': 4,
};

function getCompatScore(type1: MbtiType, type2: MbtiType): number {
  if (type1 === type2) return 3; // 같은 유형
  const key1 = `${type1}-${type2}`;
  const key2 = `${type2}-${type1}`;
  return COMPAT_MATRIX[key1] || COMPAT_MATRIX[key2] || 3;
}

interface CompatResult {
  score: number;
  grade: string;
  emoji: string;
  color: string;
  percent: number;
  description: string;
  strengths: string[];
  cautions: string[];
}

function getCompatResult(type1: MbtiType, type2: MbtiType): CompatResult {
  const score = getCompatScore(type1, type2);

  const shared = [type1, type2].reduce((count, t, _, arr) => {
    const other = arr[1 - arr.indexOf(t)];
    return count + [...t].filter((c, i) => c === other[i]).length;
  }, 0) / 2;

  const grades: Record<number, Omit<CompatResult, 'strengths' | 'cautions'>> = {
    5: { score: 5, grade: '천생연분', emoji: '💞', color: 'text-red-500', percent: 95, description: '서로를 완벽하게 보완하는 이상적인 조합입니다!' },
    4: { score: 4, grade: '좋은 궁합', emoji: '💕', color: 'text-pink-500', percent: 80, description: '공통점이 많아 편안하고 안정적인 관계를 만듭니다.' },
    3: { score: 3, grade: '보통 궁합', emoji: '💛', color: 'text-yellow-500', percent: 60, description: '서로의 차이를 이해하면 좋은 관계가 될 수 있어요.' },
    2: { score: 2, grade: '노력 필요', emoji: '🧡', color: 'text-orange-500', percent: 40, description: '다른 점이 많지만, 그만큼 배울 점도 많습니다.' },
    1: { score: 1, grade: '도전적 궁합', emoji: '💜', color: 'text-purple-500', percent: 25, description: '정반대의 매력! 서로에게 새로운 관점을 선사합니다.' },
  };

  const base = grades[score] || grades[3];

  // E/I 차이
  const eiSame = type1[0] === type2[0];
  // S/N 차이
  const snSame = type1[1] === type2[1];
  // T/F 차이
  const tfSame = type1[2] === type2[2];
  // J/P 차이
  const jpSame = type1[3] === type2[3];

  const strengths: string[] = [];
  const cautions: string[] = [];

  if (eiSame) strengths.push('에너지 방향이 같아 생활 리듬이 맞아요');
  else strengths.push('외향과 내향이 서로를 균형 있게 보완해요');

  if (snSame) strengths.push('정보를 받아들이는 방식이 비슷해 소통이 수월해요');
  else cautions.push('현실주의와 이상주의 차이로 의견 충돌이 있을 수 있어요');

  if (tfSame) strengths.push('의사결정 방식이 비슷해 갈등이 적어요');
  else cautions.push('논리 vs 감정 차이를 이해하려는 노력이 필요해요');

  if (jpSame) strengths.push('생활 패턴(계획/즉흥)이 비슷해 편안해요');
  else cautions.push('계획파 vs 즉흥파 차이에 대한 배려가 필요해요');

  return { ...base, strengths, cautions };
}

export default function MbtiCompatibilityPage() {
  const [type1, setType1] = useState<MbtiType | ''>('');
  const [type2, setType2] = useState<MbtiType | ''>('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('t1')) setType1(params.get('t1') as MbtiType);
    if (params.get('t2')) setType2(params.get('t2') as MbtiType);
    setLoaded(true);
  }, []);

  const canCalc = type1 !== '' && type2 !== '';
  const result = canCalc ? getCompatResult(type1, type2) : null;

  useEffect(() => {
    if (!loaded || !type1 || !type2) return;
    const url = new URL(window.location.href);
    url.searchParams.set('t1', type1);
    url.searchParams.set('t2', type2);
    window.history.replaceState({}, '', url.pathname + url.search);
  }, [type1, type2, loaded]);

  const renderTypeSelector = (
    label: string,
    value: MbtiType | '',
    onChange: (v: MbtiType) => void,
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
      <div className="grid grid-cols-4 gap-1.5">
        {MBTI_TYPES.map(t => (
          <button
            key={t}
            onClick={() => onChange(t)}
            className={`py-2 px-1 rounded-lg text-xs font-bold transition-all ${
              value === t
                ? 'bg-primary text-white shadow-md scale-105'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      {value && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 text-center">
          {MBTI_LABELS[value].emoji} {MBTI_LABELS[value].title}
        </p>
      )}
    </div>
  );

  return (
    <ToolLayout
      tool={tool}
      disclaimer="이 도구는 재미로만 봐주세요. MBTI는 성격의 경향성일 뿐, 실제 관계를 결정하지 않습니다."
      seoContent={
        <section className="space-y-6 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">MBTI 궁합이란?</h2>
            <p>MBTI(Myers-Briggs Type Indicator)는 4가지 선호 지표(E/I, S/N, T/F, J/P)의 조합으로 16가지 성격 유형을 분류합니다. 궁합은 두 유형의 인지 기능 스택 상보성을 기반으로 분석합니다. 서로 다른 기능이 보완되는 조합일수록 더 높은 궁합을 보입니다.</p>
          </div>
        </section>
      }
    >
      <div className="space-y-6">
        {renderTypeSelector('나의 MBTI', type1, setType1)}
        <div className="text-center text-2xl">♥</div>
        {renderTypeSelector('상대방 MBTI', type2, setType2)}

        {result && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="bg-primary/5 dark:bg-primary/20 rounded-xl p-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {type1} ♥ {type2}
              </p>
              <p className="text-5xl mb-2">{result.emoji}</p>
              <p className={`text-4xl font-bold font-heading ${result.color}`}>
                {result.percent}%
              </p>
              <p className={`text-lg font-semibold mt-1 ${result.color}`}>{result.grade}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{result.description}</p>
            </div>

            {/* 궁합 바 */}
            <div className="relative h-4 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600">
              <div
                className="h-full rounded-full bg-gradient-to-r from-pink-400 to-red-500 transition-all duration-1000"
                style={{ width: `${result.percent}%` }}
              />
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
                  {result.cautions.length > 0 ? result.cautions.map((c, i) => (
                    <li key={i} className="flex gap-1.5"><span className="text-orange-500 shrink-0">!</span>{c}</li>
                  )) : (
                    <li className="flex gap-1.5"><span className="text-green-500 shrink-0">+</span>특별한 주의점이 없어요!</li>
                  )}
                </ul>
              </div>
            </div>

            {/* 유형 정보 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                <p className="text-2xl mb-1">{MBTI_LABELS[type1 as MbtiType].emoji}</p>
                <p className="font-bold text-gray-900 dark:text-white">{type1}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{MBTI_LABELS[type1 as MbtiType].title}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                <p className="text-2xl mb-1">{MBTI_LABELS[type2 as MbtiType].emoji}</p>
                <p className="font-bold text-gray-900 dark:text-white">{type2}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{MBTI_LABELS[type2 as MbtiType].title}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
