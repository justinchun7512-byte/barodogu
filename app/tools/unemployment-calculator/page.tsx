'use client';

import { useState } from 'react';
import { getToolById } from '@/lib/tools';
import { calculateUnemployment } from '@/lib/calculators/unemployment';
import { ToolLayout } from '@/components/layout/ToolLayout';

const tool = getToolById('unemployment-calculator')!;
const fmt = (n: number) => Math.round(n).toLocaleString('ko-KR');

export default function UnemploymentCalculatorPage() {
  const [age, setAge] = useState('');
  const [months, setMonths] = useState('');
  const [salary, setSalary] = useState('');

  const canCalc = age && months && salary;
  const result = canCalc ? calculateUnemployment(parseInt(age), parseInt(months), parseInt(salary.replace(/,/g, '')) * 10000) : null;

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-4">
        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">만 나이</label><input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="예: 35" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary focus:outline-none" /></div>
        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">피보험 근무기간 (개월)</label><input type="number" value={months} onChange={e => setMonths(e.target.value)} placeholder="예: 36" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary focus:outline-none" /></div>
        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">퇴직 전 3개월 평균 월급 (만원)</label><input type="text" inputMode="numeric" value={salary} onChange={e => setSalary(e.target.value.replace(/[^0-9]/g, ''))} placeholder="예: 300" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary focus:outline-none" /></div>
      </div>

      {result && (
        <div className="mt-8">
          <div className="bg-primary/5 dark:bg-primary/20 rounded-xl p-6 text-center mb-6">
            <p className="text-sm text-primary mb-1">예상 총 수급액</p>
            <p className="text-4xl font-bold text-primary">{fmt(result.totalBenefit)}원</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">일 수급액</span><span className="font-medium dark:text-gray-300">{fmt(result.dailyBenefit)}원</span></div>
            <div className="flex justify-between"><span className="text-gray-500">수급 일수</span><span className="font-medium dark:text-gray-300">{result.benefitDays}일</span></div>
            <div className="flex justify-between"><span className="text-gray-500">월 예상 수령액</span><span className="font-medium dark:text-gray-300">{fmt(result.monthlyEstimate)}원</span></div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
