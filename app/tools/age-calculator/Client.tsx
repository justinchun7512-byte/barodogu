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
          <details className="group">
            <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">자주 묻는 질문</summary>
            <div className="mt-3 space-y-3">
              <div><p className="font-medium">법적으로 만 나이만 쓰나요?</p><p>2023년부터 법적·행정적으로는 만 나이가 기준입니다. 다만 병역, 청소년보호, 취학 기준처럼 연나이를 쓰는 예외가 있습니다.</p></div>
              <div><p className="font-medium">보험나이는 만 나이와 다른가요?</p><p>보험사는 다음 생일까지 6개월 미만이면 한 살을 더하는 보험나이를 쓰는 경우가 있습니다. 보험 가입 전에는 보험사 기준을 다시 확인하세요.</p></div>
              <div><p className="font-medium">2월 29일 출생자는 어떻게 계산하나요?</p><p>윤년이 아닌 해에는 제도나 서비스에 따라 2월 28일 또는 3월 1일을 기준으로 처리할 수 있습니다. 공식 문서는 해당 기관 기준을 따르세요.</p></div>
            </div>
          </details>
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
