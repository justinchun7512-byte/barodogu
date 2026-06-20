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
            <p>MBTI(Myers-Briggs Type Indicator)는 4가지 선호 지표의 조합으로 16가지 성격 유형을 분류합니다. 두 사람의 MBTI 궁합은 인지 기능 스택의 상보성을 기준으로 분석하며, 서로 부족한 기능을 보완하는 조합일수록 더 높은 궁합 점수를 받습니다.</p>
            <ul className="mt-3 space-y-1 text-xs text-gray-600 dark:text-gray-400">
              <li><strong>E/I</strong> — 외향(Extraversion) / 내향(Introversion): 에너지 방향</li>
              <li><strong>S/N</strong> — 감각(Sensing) / 직관(iNtuition): 정보 수집 방식</li>
              <li><strong>T/F</strong> — 사고(Thinking) / 감정(Feeling): 판단 기준</li>
              <li><strong>J/P</strong> — 판단(Judging) / 인식(Perceiving): 생활 양식</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">천생연분 Top 조합 (이상적 파트너)</h2>
            <p className="mb-3">인지 기능이 완전히 상호 보완되는 조합으로, 서로 다른 강점이 시너지를 만듭니다.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-2 text-center"><strong>INFJ ♥ ENTP</strong><br /><span className="text-gray-500">옹호자 × 변론가</span></div>
              <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-2 text-center"><strong>INFJ ♥ ENFP</strong><br /><span className="text-gray-500">옹호자 × 활동가</span></div>
              <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-2 text-center"><strong>INTJ ♥ ENTP</strong><br /><span className="text-gray-500">전략가 × 변론가</span></div>
              <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-2 text-center"><strong>INTJ ♥ ENFP</strong><br /><span className="text-gray-500">전략가 × 활동가</span></div>
              <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-2 text-center"><strong>INFP ♥ ENFJ</strong><br /><span className="text-gray-500">중재자 × 사회운동가</span></div>
              <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-2 text-center"><strong>INFP ♥ ENTJ</strong><br /><span className="text-gray-500">중재자 × 통솔자</span></div>
              <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-2 text-center"><strong>ISFJ ♥ ESFP</strong><br /><span className="text-gray-500">수호자 × 연예인</span></div>
              <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-2 text-center"><strong>ISTJ ♥ ESTP</strong><br /><span className="text-gray-500">논리주의 × 사업가</span></div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">MBTI 궁합 점수는 어떻게 계산되나요?</h2>
            <p>이 테스트는 융의 인지 기능 이론에 기반한 기능적 스택 상보성 매트릭스를 사용합니다.</p>
            <ul className="mt-2 space-y-1">
              <li>💯 <strong>5단계 (90~100%)</strong>: 천생연분 — 인지 기능이 완벽히 보완</li>
              <li>😊 <strong>4단계 (75~89%)</strong>: 좋은 궁합 — 주요 기능이 일치·보완</li>
              <li>🙂 <strong>3단계 (60~74%)</strong>: 보통 궁합 — 노력하면 무난</li>
              <li>😐 <strong>2단계 (45~59%)</strong>: 노력 필요 — 소통 방식 차이 큼</li>
              <li>😥 <strong>1단계 (30~44%)</strong>: 도전적 — 서로 다른 언어를 쓰는 느낌</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">MBTI 16유형별 천생연분 베스트 파트너</h2>
            <p className="mb-3">각 유형의 인지 기능 보완 관계가 가장 강한 조합입니다. INFP·ENFP·INTJ 등 유형별 궁합표.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              {MBTI_TYPES.map(t => {
                const partners = MBTI_TYPES.filter(p => p !== t && getCompatScore(t, p) === 5);
                return (
                  <div key={t} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
                    <p className="font-bold text-gray-900 dark:text-white mb-1">{MBTI_LABELS[t].emoji} {t} 궁합</p>
                    <p className="text-gray-600 dark:text-gray-300">
                      {partners.length > 0
                        ? <>천생연분 → <strong>{partners.join(', ')}</strong></>
                        : '특별 보완 조합 없음'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">MBTI 연애·친구·직장 궁합은 어떻게 다른가요?</h2>
            <ul className="space-y-2">
              <li><strong>연애 궁합</strong>: 인지 기능 보완(서로 부족한 기능 채움) 비중이 높습니다. 천생연분 조합(예: INFJ-ENTP, INFP-ENFJ)이 가장 안정적입니다.</li>
              <li><strong>친구 궁합</strong>: 공통 가치관(S/N, T/F 일치)이 더 중요합니다. 같은 유형이나 1글자만 다른 유형이 편합니다.</li>
              <li><strong>직장 궁합</strong>: 의사결정 방식(T/F)과 생활 양식(J/P) 호환성이 핵심입니다. 정반대 J/P는 갈등이 잦지만 보완 시 생산성이 폭발합니다.</li>
            </ul>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">※ 본 도구는 연애 궁합 기준 매트릭스를 사용합니다. 친구·직장 관점에서는 결과가 다를 수 있어요.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">자주 묻는 질문</h2>
            <div className="space-y-2">
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">MBTI 궁합이 낮으면 연애를 못하나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">아닙니다. MBTI는 성격의 경향성을 나타낼 뿐이며, 과학적으로 검증된 궁합 측정 도구가 아닙니다. 실제 관계에서는 서로에 대한 이해, 존중, 소통 방식이 훨씬 중요합니다. 궁합 점수가 낮더라도 서로를 이해하고 노력하면 충분히 좋은 관계를 만들 수 있습니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">같은 MBTI끼리는 궁합이 좋나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">동일 유형끼리는 서로를 잘 이해하지만 같은 약점을 공유한다는 단점도 있습니다. 예를 들어 두 명의 P(인식형)가 만나면 계획 없이 즉흥적으로 흘러갈 수 있고, 두 명의 F(감정형)가 만나면 갈등 해결이 어려울 수 있습니다. 이 도구에서는 동일 유형을 "보통 궁합" 등급으로 분류합니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">MBTI가 바뀔 수도 있나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">핵심 인지 기능 선호는 비교적 안정적이지만, 환경·나이·경험에 따라 측정 결과가 달라질 수 있습니다. 특히 E/I(외향/내향)는 상황에 따라 점수 차이가 작아 검사 때마다 바뀌는 경우가 많습니다. 정확한 유형 파악을 위해 공식 MBTI 검사를 활용하고, 이 도구는 재미 참고용으로 사용하는 것을 권장합니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">MBTI 궁합 점수는 어떻게 계산하나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">이 도구는 두 유형의 인지 기능 유사성과 보완성을 기준으로 미리 정의된 점수표를 사용합니다. INFJ-ENFP처럼 직관(N)과 감정(F)을 공유하면서 에너지 방향(I/E)만 다른 조합은 높은 점수를 받고, 기능이 전혀 맞지 않는 조합은 낮은 점수를 받습니다. 이 점수표는 공식 MBTI 기관의 자료가 아닌 참고용 지표입니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">MBTI 궁합 표는 어디에서 볼 수 있나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">이 도구의 궁합 결과 화면에서 두 유형의 점수와 등급(천생연분·잘 맞는 조합·보통·도전적 조합)을 바로 확인할 수 있습니다. 16유형 전체 조합표가 필요하다면 결과 페이지 하단의 "16유형별 천생연분 베스트 파트너" 섹션을 참고하세요.</p>
              </details>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">함께 보면 좋은 궁합 도구</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <a href="/tools/name-compatibility" className="block bg-gray-50 dark:bg-gray-700 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                <p className="font-bold text-gray-900 dark:text-white">💕 이름 궁합 테스트</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">두 사람의 이름으로 즉석 궁합 점수 확인</p>
              </a>
              <a href="/tools/company-compatibility" className="block bg-gray-50 dark:bg-gray-700 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                <p className="font-bold text-gray-900 dark:text-white">🤝 회사 궁합 AI 분석</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">본인과 회사의 궁합을 AI로 분석</p>
              </a>
              <a href="/tools/daily-fortune" className="block bg-gray-50 dark:bg-gray-700 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                <p className="font-bold text-gray-900 dark:text-white">🔮 AI 오늘의 운세</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">생년월일로 오늘의 총운·재운·애정운 보기</p>
              </a>
              <a href="/tools/core-competency" className="block bg-gray-50 dark:bg-gray-700 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                <p className="font-bold text-gray-900 dark:text-white">⭐ 핵심역량 추출기</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">MBTI 유형별 강점을 이력서에 녹이는 방법</p>
              </a>
            </div>
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
