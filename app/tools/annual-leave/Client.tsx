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
    <ToolLayout tool={tool} seoContent={
        <section className="space-y-6 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">연차 계산기란?</h2>
            <p>연차 계산기는 근로기준법에 따라 입사일을 기준으로 올해 발생하는 연차휴가 일수를 자동으로 계산해주는 도구입니다. 연차유급휴가는 근로자의 기본 권리로, 입사 후 근무 기간에 따라 법적으로 보장되는 유급 휴일입니다. 1년 미만 근로자는 1개월 개근 시 1일, 1년 이상 근로자는 15일이 기본이며, 3년차부터 2년마다 1일씩 추가되어 최대 25일까지 부여됩니다.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">사용 방법</h2>
            <ol className="list-decimal pl-5 space-y-1.5">
              <li>입사일을 날짜 선택기에서 선택합니다.</li>
              <li>입력 즉시 올해 연차 일수, 근속 기간, 산출 근거가 자동으로 표시됩니다.</li>
              <li>근속 기간이 1년 미만인 경우와 1년 이상인 경우 각각 다른 기준이 적용됩니다.</li>
            </ol>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">자주 묻는 질문</h2>
            <div className="space-y-2">
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">입사 첫 해에도 연차를 사용할 수 있나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">네, 입사 후 1년 미만인 근로자는 1개월 개근 시 1일의 유급휴가가 발생합니다. 최대 11일까지 사용할 수 있으며, 이는 1년차에 발생하는 15일에서 차감됩니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">연차가 최대 몇 일까지 늘어나나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">근로기준법상 연차유급휴가는 최대 25일까지 부여됩니다. 1년 이상 근무 시 15일이 기본이고, 3년차부터 2년마다 1일이 추가되어 21년 근속 시 25일에 도달합니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">사용하지 않은 연차는 어떻게 되나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">사용하지 않은 연차에 대해서는 연차수당(미사용 연차 보상)을 받을 수 있습니다. 단, 회사가 연차 사용 촉진 조치를 취한 경우에는 미사용 연차수당 지급 의무가 면제될 수 있습니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">연차는 1년마다 리셋되나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">네, 연차휴가는 입사일 기준 1년 단위로 새로 발생하며, 전년도 미사용 연차는 다음 해로 이월되지 않는 것이 원칙입니다. 다만 회사 규정에 따라 이월을 허용하는 경우도 있습니다.</p>
              </details>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">관련 정보</h2>
            <p>연차유급휴가는 근로기준법 제60조에 규정된 근로자의 기본 권리입니다. 회사는 근로자의 연차 사용을 부당하게 제한할 수 없으며, 연차 사용을 이유로 불이익을 줄 수 없습니다. 2018년 법 개정으로 입사 1년 미만 근로자도 월 1일의 유급휴가를 사용할 수 있게 되었습니다. 연차 관련 분쟁이 있을 경우 고용노동부(1350)에 상담하거나 진정을 제기할 수 있습니다.</p>
          </div>
        </section>
      } disclaimer={
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
