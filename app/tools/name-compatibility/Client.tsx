'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getToolById } from '@/lib/tools';
import { ToolLayout } from '@/components/layout/ToolLayout';

const tool = getToolById('name-compatibility')!;

// 한글 자모 획수 테이블 (초성 14, 중성 10, 종성 14 그룹)
const CHO_STROKES = [2, 3, 2, 4, 2, 4, 2, 3, 4, 3, 4, 4, 2, 3]; // ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅈㅉㅊ...
const CHOSUNG = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const JUNGSUNG = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
const JONGSUNG = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];

// 자모별 획수
const STROKE_MAP: Record<string, number> = {
  'ㄱ':2,'ㄲ':4,'ㄴ':2,'ㄷ':3,'ㄸ':6,'ㄹ':5,'ㅁ':4,'ㅂ':4,'ㅃ':8,'ㅅ':2,'ㅆ':4,
  'ㅇ':1,'ㅈ':3,'ㅉ':6,'ㅊ':4,'ㅋ':3,'ㅌ':4,'ㅍ':4,'ㅎ':3,
  'ㅏ':2,'ㅐ':3,'ㅑ':3,'ㅒ':4,'ㅓ':2,'ㅔ':3,'ㅕ':3,'ㅖ':4,
  'ㅗ':2,'ㅘ':4,'ㅙ':5,'ㅚ':3,'ㅛ':3,'ㅜ':2,'ㅝ':4,'ㅞ':5,'ㅟ':3,'ㅠ':3,'ㅡ':1,'ㅢ':2,'ㅣ':1,
  'ㄳ':4,'ㄵ':5,'ㄶ':5,'ㄺ':7,'ㄻ':9,'ㄼ':9,'ㄽ':7,'ㄾ':6,'ㄿ':6,'ㅀ':8,'ㅄ':6,
};

function getStrokes(char: string): number {
  const code = char.charCodeAt(0);
  if (code < 0xAC00 || code > 0xD7A3) return 0;
  const offset = code - 0xAC00;
  const choIdx = Math.floor(offset / (21 * 28));
  const jungIdx = Math.floor((offset % (21 * 28)) / 28);
  const jongIdx = offset % 28;

  const cho = CHOSUNG[choIdx];
  const jung = JUNGSUNG[jungIdx];
  const jong = JONGSUNG[jongIdx];

  return (STROKE_MAP[cho] || 2) + (STROKE_MAP[jung] || 2) + (jong ? (STROKE_MAP[jong] || 2) : 0);
}

function calculateCompatibility(name1: string, name2: string): { score: number; numbers: number[][] } {
  // 두 이름의 글자를 번갈아 배치하여 획수 배열 생성
  const maxLen = Math.max(name1.length, name2.length);
  const strokeArray: number[] = [];

  for (let i = 0; i < maxLen; i++) {
    if (i < name1.length) strokeArray.push(getStrokes(name1[i]));
    if (i < name2.length) strokeArray.push(getStrokes(name2[i]));
  }

  // 인접한 두 수를 더해서 1의 자리만 취하는 과정을 반복
  const numbers: number[][] = [strokeArray];
  let current = strokeArray;
  while (current.length > 2) {
    const next: number[] = [];
    for (let i = 0; i < current.length - 1; i++) {
      next.push((current[i] + current[i + 1]) % 10);
    }
    numbers.push(next);
    current = next;
  }

  const score = current.length >= 2 ? current[0] * 10 + current[1] : current[0] * 10;
  return { score: Math.min(score, 100), numbers };
}

const RESULT_MESSAGES: { min: number; label: string; emoji: string; color: string; message: string }[] = [
  { min: 90, label: '천생연분', emoji: '💞', color: 'text-red-500', message: '이보다 완벽한 궁합은 없어요! 운명적인 만남입니다.' },
  { min: 75, label: '아주 좋은 궁합', emoji: '💕', color: 'text-pink-500', message: '서로를 잘 이해하는 좋은 관계가 될 수 있어요.' },
  { min: 60, label: '좋은 궁합', emoji: '💗', color: 'text-pink-400', message: '함께 노력하면 더 좋은 관계로 발전할 수 있어요.' },
  { min: 40, label: '보통 궁합', emoji: '💛', color: 'text-yellow-500', message: '평범하지만 안정적인 관계입니다. 대화가 중요해요.' },
  { min: 20, label: '노력이 필요한 궁합', emoji: '🧡', color: 'text-orange-500', message: '서로의 차이를 인정하고 노력하면 충분히 잘 맞을 수 있어요.' },
  { min: 0, label: '도전적인 궁합', emoji: '💜', color: 'text-purple-500', message: '정반대의 매력! 서로에게 새로운 세계를 열어줄 수 있어요.' },
];

function getResultMessage(score: number) {
  return RESULT_MESSAGES.find(r => score >= r.min) || RESULT_MESSAGES[RESULT_MESSAGES.length - 1];
}

export default function NameCompatibilityPage() {
  return <Suspense fallback={null}><NameCompatibilityInner /></Suspense>;
}

function NameCompatibilityInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [name1, setName1] = useState(searchParams.get('n1') || '');
  const [name2, setName2] = useState(searchParams.get('n2') || '');
  const [showResult, setShowResult] = useState(false);

  const canCalc = name1.trim().length >= 1 && name2.trim().length >= 1;
  const result = canCalc && showResult ? calculateCompatibility(name1.trim(), name2.trim()) : null;
  const msg = result ? getResultMessage(result.score) : null;

  useEffect(() => {
    if (result) {
      const url = new URL(window.location.href);
      url.searchParams.set('n1', name1.trim());
      url.searchParams.set('n2', name2.trim());
      router.replace(url.pathname + url.search, { scroll: false });
    }
  }, [result, name1, name2, router]);

  // URL에 이름이 있으면 자동 결과 표시
  useEffect(() => {
    if (searchParams.get('n1') && searchParams.get('n2')) {
      setShowResult(true);
    }
  }, [searchParams]);

  const handleCalc = () => {
    if (canCalc) setShowResult(true);
  };

  return (
    <ToolLayout
      tool={tool}
      disclaimer="이 도구는 재미로만 봐주세요. 실제 궁합이나 관계와는 무관합니다."
      seoContent={
        <section className="space-y-6 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">이름 궁합 테스트란?</h2>
            <p>두 사람의 이름을 한글 자모로 분해하여 획수를 기반으로 궁합 점수를 계산합니다. 초성, 중성, 종성의 획수를 번갈아 배치한 뒤, 인접한 수를 더하는 과정을 반복하여 최종 점수를 구합니다. 전통적인 이름 궁합 놀이를 디지털로 구현한 것으로, 재미를 위한 도구입니다.</p>
          </div>
        </section>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">이름 1</label>
            <input
              type="text"
              value={name1}
              onChange={e => { setName1(e.target.value); setShowResult(false); }}
              placeholder="홍길동"
              maxLength={10}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent text-center text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">이름 2</label>
            <input
              type="text"
              value={name2}
              onChange={e => { setName2(e.target.value); setShowResult(false); }}
              placeholder="김영희"
              maxLength={10}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent text-center text-lg"
            />
          </div>
        </div>

        <button
          onClick={handleCalc}
          disabled={!canCalc}
          className={`w-full py-3 rounded-xl font-bold text-lg transition-all ${
            canCalc
              ? 'bg-primary text-white hover:bg-primary/90 shadow-md'
              : 'bg-gray-200 dark:bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          궁합 보기 💕
        </button>

        {result && msg && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="bg-primary/5 dark:bg-primary/20 rounded-xl p-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {name1} ♥ {name2}
              </p>
              <p className="text-6xl mb-2">{msg.emoji}</p>
              <p className={`text-5xl font-bold font-heading ${msg.color}`}>
                {result.score}점
              </p>
              <p className={`text-lg font-semibold mt-2 ${msg.color}`}>{msg.label}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{msg.message}</p>
            </div>

            {/* 궁합 점수 바 */}
            <div className="relative h-4 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600">
              <div
                className="h-full rounded-full bg-gradient-to-r from-pink-400 to-red-500 transition-all duration-1000"
                style={{ width: `${result.score}%` }}
              />
            </div>

            {/* 획수 계산 과정 (피라미드) */}
            <details className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">계산 과정 보기</summary>
              <div className="mt-3 space-y-1 text-center">
                {result.numbers.map((row, i) => (
                  <div key={i} className="flex justify-center gap-1">
                    {row.map((n, j) => (
                      <span
                        key={j}
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                          i === result.numbers.length - 1
                            ? 'bg-primary text-white'
                            : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </details>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
