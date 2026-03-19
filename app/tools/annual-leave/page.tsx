'use client';

import { useState } from 'react';
import { getToolById } from '@/lib/tools';
import { calculateAnnualLeave } from '@/lib/calculators/annual-leave';
import { ToolLayout } from '@/components/layout/ToolLayout';

const tool = getToolById('annual-leave')!;

export default function AnnualLeavePage() {
  const [startDate, setStartDate] = useState('');
  const result = startDate ? calculateAnnualLeave(new Date(startDate)) : null;

  return (
    <ToolLayout tool={tool}>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">입사일</label>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary focus:outline-none" />
      </div>

      {result && (
        <div className="mt-8">
          <div className="bg-primary/5 dark:bg-primary/20 rounded-xl p-6 text-center mb-6">
            <p className="text-sm text-primary mb-1">올해 연차 일수</p>
            <p className="text-5xl font-bold text-primary">{result.totalLeave}<span className="text-2xl">일</span></p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">근속 기간</span><span className="font-medium dark:text-gray-300">{result.yearsWorked.toFixed(1)}년 ({result.monthsWorked}개월)</span></div>
            <div className="flex justify-between"><span className="text-gray-500">산출 근거</span><span className="font-medium dark:text-gray-300 text-xs">{result.breakdown}</span></div>
          </div>
          <p className="text-xs text-gray-400 mt-3">근로기준법 기준. 1년 미만: 월 1일, 1년 이상: 15일, 3년부터 2년마다 +1일 (최대 25일)</p>
        </div>
      )}
    </ToolLayout>
  );
}
