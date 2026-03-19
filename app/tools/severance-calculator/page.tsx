'use client';

import { useState } from 'react';
import { getToolById } from '@/lib/tools';
import { calculateSeverance } from '@/lib/calculators/severance';
import { ToolLayout } from '@/components/layout/ToolLayout';

const tool = getToolById('severance-calculator')!;
const fmt = (n: number) => Math.round(n).toLocaleString('ko-KR');

export default function SeveranceCalculatorPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [salary, setSalary] = useState('');

  const canCalc = startDate && endDate && salary;
  const result = canCalc ? calculateSeverance(new Date(startDate), new Date(endDate), parseInt(salary.replace(/,/g, '')) * 10000) : null;

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-4">
        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">입사일</label><input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary focus:outline-none" /></div>
        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">퇴사일</label><input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary focus:outline-none" /></div>
        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">최근 3개월 평균 월급 (만원)</label><input type="text" inputMode="numeric" value={salary} onChange={e => setSalary(e.target.value.replace(/[^0-9]/g, ''))} placeholder="예: 300" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary focus:outline-none" /></div>
      </div>

      {result && result.totalDays > 0 && (
        <div className="mt-8">
          <div className="bg-primary/5 dark:bg-primary/20 rounded-xl p-6 text-center mb-6">
            <p className="text-sm text-primary mb-1">예상 퇴직금</p>
            <p className="text-4xl font-bold text-primary">{fmt(result.severance)}원</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">총 근무일수</span><span className="font-medium dark:text-gray-300">{fmt(result.totalDays)}일 ({result.totalYears.toFixed(1)}년)</span></div>
            <div className="flex justify-between"><span className="text-gray-500">1일 평균임금</span><span className="font-medium dark:text-gray-300">{fmt(result.dailyWage)}원</span></div>
            <div className="flex justify-between"><span className="text-gray-500">계산식</span><span className="font-medium dark:text-gray-300 text-xs">1일평균임금 × 30일 × (재직일수/365)</span></div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
