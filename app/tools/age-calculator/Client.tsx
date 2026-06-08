'use client';

import { useState, useEffect } from 'react';
import { getToolById } from '@/lib/tools';
import { ToolLayout } from '@/components/layout/ToolLayout';

const tool = getToolById('age-calculator')!;

const ZODIAC_ANIMALS = ['원숭이', '닭', '개', '돼지', '쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양'];
const ZODIAC_EMOJI = ['🐵', '🐔', '🐶', '🐷', '🐭', '🐮', '🐯', '🐰', '🐲', '🐍', '🐴', '🐑'];
const ZODIAC_HANJA = ['申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未'];

function calculateAge(birthDate: string) {
  const birth = new Date(birthDate + 'T00:00:00');
  const today = new Date();

  // 만 나이
  let koreanAge = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  const dayDiff = today.getDate() - birth.getDate();
  let internationalAge = koreanAge;
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    internationalAge--;
  }

  // 한국 나이 (2023년 이전 방식, 참고용)
  koreanAge = today.getFullYear() - birth.getFullYear() + 1;

  // 띠
  const zodiacIndex = birth.getFullYear() % 12;
  const zodiacAnimal = ZODIAC_ANIMALS[zodiacIndex];
  const zodiacEmoji = ZODIAC_EMOJI[zodiacIndex];
  const zodiacHanja = ZODIAC_HANJA[zodiacIndex];

  // 다음 생일
  const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBirthday <= today) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }
  const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  // 살아온 일수
  const daysAlive = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));

  return {
    internationalAge,
    koreanAge,
    zodiacAnimal,
    zodiacEmoji,
    zodiacHanja,
    daysUntilBirthday,
    daysAlive,
    birthYear: birth.getFullYear(),
  };
}

export default function AgeCalculatorPage() {
  const [birthDate, setBirthDate] = useState('');
  const [loaded, setLoaded] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('birth')) setBirthDate(params.get('birth')!);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded || !birthDate || birthDate > today) return;
    const url = new URL(window.location.href);
    url.searchParams.set('birth', birthDate);
    window.history.replaceState({}, '', url.pathname + url.search);
  }, [birthDate, today, loaded]);

  const result = birthDate && birthDate <= today ? calculateAge(birthDate) : null;

  return (
    <ToolLayout
      tool={tool}
      seoContent={
        <section className="space-y-6 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">나이 계산기란?</h2>
            <p>생년월일을 입력하면 만 나이(국제 표준), 한국 나이(세는 나이), 띠를 한번에 확인하는 도구입니다. 2023년 6월 28일부터 시행된 만나이 통일법에 따라, 법적/행정적으로는 만 나이가 기준입니다.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">만 나이 vs 한국 나이</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>만 나이: 생일이 지나야 한 살 더 먹음 (국제 표준, 법적 기준)</li>
              <li>한국 나이(세는 나이): 태어나면 1살, 매년 1월 1일에 +1살</li>
              <li>연나이: 현재 연도에서 출생 연도를 뺀 값. 병역·청소년보호 등 일부 제도에서 사용</li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">어떤 상황에서 어떤 나이를 쓰나요?</h2>
            <p>계약서, 은행 업무, 병원 진료, 행정 서류처럼 법적 효력이 있는 문서에서는 만 나이가 기준입니다. 병역 의무나 일부 청소년 관련 제도는 연나이를 쓰는 경우가 있어 생일과 무관하게 출생 연도 기준으로 판단합니다. 일상 대화에서는 한국 나이를 쓰는 사람이 여전히 많으므로, 공식 문서와 사적인 대화를 구분하는 것이 좋습니다. 해외에서는 대부분 만 나이만 사용하므로 영어로 나이를 말할 때는 반드시 만 나이를 기준으로 답하세요.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">띠와 생일 정보 활용</h2>
            <p>띠는 태어난 해를 12간지로 나눈 값입니다. 다만 전통 사주나 작명에서는 음력 설 기준으로 띠가 달라질 수 있어 1월과 2월 초 출생자는 주의가 필요합니다. 이 도구는 빠른 확인을 위해 양력 연도 기준 띠를 보여주며, 다음 생일까지 남은 일수와 살아온 일수도 함께 표시합니다. 생일 이벤트, 기념일, 보험나이 확인 전 빠른 참고용으로 활용하세요.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">자주 묻는 질문</h2>
            <div className="space-y-2">
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">2026년 기준 내 만 나이를 빠르게 계산하는 방법은?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">만 나이는 생일이 지났으면 올해 연도 - 출생 연도, 생일이 아직 안 지났으면 올해 연도 - 출생 연도 - 1로 계산합니다. 예를 들어 1995년 8월생이라면 2026년 6월 현재 생일 전이므로 만 나이는 30세입니다. 생년월일을 위 도구에 입력하면 만 나이와 한국 나이를 동시에 자동으로 계산해줍니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">2026년 한국 나이와 만 나이는 얼마나 차이 나나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">2026년 기준으로 한국 나이(세는 나이)는 만 나이보다 1~2살 많습니다. 생일이 지난 사람은 만 나이 + 1살, 생일이 아직 안 지난 사람은 만 나이 + 2살이 한국 나이입니다. 예: 1990년 3월생은 2026년 6월 현재 만 36세, 한국 나이 37세입니다. 2023년 법 개정 이후 병원·은행·공공기관 서류에서는 만 나이를 기준으로 사용합니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">만 나이 통일법 이후 달라진 점은 무엇인가요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">2023년 6월 28일부터 시행된 만나이 통일법에 따라, 법령·계약서·행정 서류에서는 만 나이가 공식 기준입니다. 이제는 명시적 예외(병역법·청소년보호법 등 연나이 사용 조항)가 없으면 모두 만 나이로 해석합니다. 금융 상품 가입 연령·보험 나이 기준도 만 나이로 통일되어 있으므로, 가입 전 정확한 만 나이를 확인하는 것이 중요합니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">연나이와 만 나이는 어떻게 다르고, 어디에 쓰나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">연나이는 올해 연도 - 출생 연도로 계산하며, 생일에 상관없이 1월 1일에 모든 사람이 동시에 한 살 더 먹는 방식입니다. 현재 병역법(징병검사 대상 연도 기준), 청소년보호법(주류·담배 판매 기준), 일부 학교 취학 기준에 연나이가 적용됩니다. 예: 2007년생은 2026년 연나이 19세, 만 나이는 생일 전이라면 18세입니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">보험나이는 만 나이와 다른가요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">네, 보험나이는 만 나이와 다릅니다. 보험사에서는 생일 6개월 전후를 기준으로 반올림하는 방식을 쓰는 경우가 있습니다. 예를 들어 만 30세 6개월이 지났다면 보험나이는 31세로 적용될 수 있습니다. 보험나이가 높을수록 보험료가 올라가므로, 생일이 6개월 이내로 다가왔다면 그 전에 가입하는 것이 유리할 수 있습니다. 위 도구로 만 나이를 정확히 확인한 뒤 보험사 기준을 별도로 확인하세요.</p>
              </details>
            </div>
          </div>
        </section>
      }
    >
      <div className="space-y-6">
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

        {result && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* 만 나이 (메인) */}
            <div className="bg-primary/5 dark:bg-primary/20 rounded-xl p-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">만 나이 (법적 기준)</p>
              <p className="text-5xl font-bold font-heading text-primary">
                {result.internationalAge}세
              </p>
            </div>

            {/* 한국 나이 + 띠 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">한국 나이 (세는 나이)</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{result.koreanAge}세</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">띠</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {result.zodiacEmoji} {result.zodiacAnimal}띠
                </p>
                <p className="text-xs text-gray-400">{result.zodiacHanja}({result.birthYear}년생)</p>
              </div>
            </div>

            {/* 추가 정보 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">다음 생일까지</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{result.daysUntilBirthday}일</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">살아온 일수</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{result.daysAlive.toLocaleString()}일</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
