'use client';

import { useState, useEffect } from 'react';
import { getToolById } from '@/lib/tools';
import { ToolLayout } from '@/components/layout/ToolLayout';

const tool = getToolById('dday-calculator')!;

function calculateDday(targetDate: string) {
  const target = new Date(targetDate + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffMs = target.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  const absDays = Math.abs(diffDays);
  const weeks = Math.floor(absDays / 7);
  const remainDays = absDays % 7;
  const months = Math.floor(absDays / 30);
  const years = Math.floor(absDays / 365);

  let label: string;
  let color: string;
  if (diffDays > 0) {
    label = `D-${diffDays}`;
    color = 'text-blue-500';
  } else if (diffDays < 0) {
    label = `D+${Math.abs(diffDays)}`;
    color = 'text-orange-500';
  } else {
    label = 'D-Day!';
    color = 'text-red-500';
  }

  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][target.getDay()];

  return { diffDays, absDays, weeks, remainDays, months, years, label, color, dayOfWeek };
}

export default function DdayCalculatorPage() {
  const [targetDate, setTargetDate] = useState('');
  const [memo, setMemo] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('date')) setTargetDate(params.get('date')!);
    if (params.get('memo')) setMemo(params.get('memo')!);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded || !targetDate) return;
    const url = new URL(window.location.href);
    url.searchParams.set('date', targetDate);
    if (memo) url.searchParams.set('memo', memo);
    else url.searchParams.delete('memo');
    window.history.replaceState({}, '', url.pathname + url.search);
  }, [targetDate, memo, loaded]);

  const result = targetDate ? calculateDday(targetDate) : null;

  return (
    <ToolLayout
      tool={tool}
      seoContent={
        <section className="space-y-6 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">D-day 계산기란?</h2>
            <p>특정 날짜까지 남은 일수(D-day) 또는 지난 일수(D+day)를 계산하는 도구입니다. 시험일, 기념일, 여행, 면접, 출산 예정일 등 다양한 이벤트의 날짜를 쉽게 계산할 수 있습니다.</p>
          </div>
        </section>
      }
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">목표 날짜</label>
          <input
            type="date"
            value={targetDate}
            onChange={e => setTargetDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">메모 (선택)</label>
          <input
            type="text"
            value={memo}
            onChange={e => setMemo(e.target.value)}
            placeholder="예: 토익 시험, 결혼기념일"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {result && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="bg-primary/5 dark:bg-primary/20 rounded-xl p-6 text-center">
              {memo && <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{memo}</p>}
              <p className={`text-5xl font-bold font-heading ${result.color}`}>
                {result.label}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {targetDate.replace(/-/g, '.')} ({result.dayOfWeek}요일)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">총 일수</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{result.absDays.toLocaleString()}일</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">주 단위</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {result.weeks}주{result.remainDays > 0 ? ` ${result.remainDays}일` : ''}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">약 개월</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{result.months}개월</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">약 년</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{result.years > 0 ? `${result.years}년` : '-'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
