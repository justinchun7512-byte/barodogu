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
    <ToolLayout tool={tool} seoContent={
        <section className="space-y-6 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">퇴직금 계산기란?</h2>
            <p>퇴직금 계산기는 근로기준법에 따라 입사일, 퇴사일, 평균 월급을 기반으로 예상 퇴직금을 자동 계산해주는 도구입니다. 퇴직금은 계속근로기간 1년에 대해 30일분 이상의 평균임금을 지급하는 것으로, 1년 이상 근무한 근로자에게 법적으로 보장됩니다. 퇴직을 준비하는 직장인, 이직을 고려하는 분, 인사 담당자 등이 퇴직금 규모를 미리 파악하는 데 유용합니다.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">사용 방법</h2>
            <ol className="list-decimal pl-5 space-y-1.5">
              <li>입사일을 날짜 선택기에서 선택합니다.</li>
              <li>퇴사일(또는 예상 퇴사일)을 선택합니다.</li>
              <li>최근 3개월 평균 월급을 만원 단위로 입력합니다. (예: 300만원이면 &quot;300&quot;)</li>
              <li>입력 즉시 예상 퇴직금, 총 근무일수, 1일 평균임금이 자동 계산됩니다.</li>
            </ol>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">자주 묻는 질문</h2>
            <div className="space-y-2">
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">퇴직금은 언제부터 받을 수 있나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">근로기준법 제34조에 따라 1년 이상 계속 근로한 근로자가 퇴직할 때 퇴직금을 받을 수 있습니다. 1년 미만 근무 시에는 퇴직금 지급 의무가 없습니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">퇴직금 계산에 상여금도 포함되나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">네, 정기적으로 지급되는 상여금은 퇴직금 산정 시 평균임금에 포함됩니다. 다만 경영 성과에 따른 일시적 성과급은 포함되지 않을 수 있으므로, 정확한 포함 여부는 고용노동부에 확인하세요.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">퇴직금에 세금이 붙나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">퇴직금에는 퇴직소득세가 부과됩니다. 퇴직소득세는 근속연수와 퇴직금 규모에 따라 달라지며, 일반적으로 근속연수가 길수록 세율이 낮아집니다. 퇴직소득세는 본 계산기에 포함되지 않습니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">퇴직금은 언제까지 지급해야 하나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">근로기준법에 따라 퇴직일로부터 14일 이내에 퇴직금을 지급해야 합니다. 특별한 사정이 있으면 당사자 간 합의로 연장할 수 있습니다.</p>
              </details>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">관련 정보</h2>
            <p>퇴직금 제도는 근로자의 노후 생활 안정을 위한 제도입니다. 2005년 12월부터는 퇴직연금제도가 도입되어, 기업이 퇴직금을 외부 금융기관에 적립하여 운용하는 방식도 시행되고 있습니다. 퇴직연금은 확정급여형(DB), 확정기여형(DC), 개인형퇴직연금(IRP) 세 가지 유형이 있습니다. 퇴직금 관련 분쟁이 있을 경우 고용노동부(전화 1350) 또는 노동위원회에 진정 또는 신고할 수 있습니다.</p>
          </div>
        </section>
      } disclaimer={
        <div>
          <p>&#9888;&#65039; 본 계산기는 근로기준법 기준 <strong>모의 계산 결과</strong>로, 실제 퇴직금과 다를 수 있으며 법적 효력이 없어요.</p>
          <p>&#8226; 퇴직금 = 1일 평균임금 × 30일 × (재직일수/365). 상여금, 연차수당 등 포함 여부에 따라 달라져요.</p>
          <p>&#8226; 퇴직소득세는 별도이며, 정확한 금액은 고용노동부(1350) 또는 회사 인사팀에 문의하세요.</p>
          <p>&#8226; 1년 미만 근무 시 퇴직금 지급 의무가 없을 수 있어요 (근로기준법 제34조).</p>
        </div>
      }>
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
