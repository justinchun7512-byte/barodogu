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
    <ToolLayout tool={tool} disclaimer={
        <div>
          <p>&#9888;&#65039; 본 계산기는 근로기준법 기준 <strong>모의 계산 결과</strong>로, 실제 연차와 다를 수 있으며 법적 효력이 없어요.</p>
          <p>&#8226; 1년 미만: 1개월 개근 시 1일 발생 (최대 11일). 1년 이상: 15일 기본.</p>
          <p>&#8226; 3년 이상 근속 시 2년마다 1일 추가 (최대 25일).</p>
          <p>&#8226; 회사별 취업규칙이나 단체협약에 따라 다를 수 있어요.</p>
        </div>
      }>
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
