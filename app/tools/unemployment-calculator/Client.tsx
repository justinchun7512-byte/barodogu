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
    <ToolLayout tool={tool} seoContent={
        <section className="space-y-6 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">실업급여 계산기란?</h2>
            <p>실업급여 계산기는 고용보험법에 따라 만 나이, 피보험 근무기간, 퇴직 전 평균 월급을 기반으로 예상 실업급여 수급액을 자동 계산해주는 도구입니다. 실업급여(구직급여)는 비자발적으로 실직한 근로자가 재취업 활동을 하는 동안 생활 안정을 위해 지급받는 급여입니다. 실직 후 경제적 계획을 세우는 데 도움이 되며, 예상 수급 기간과 일일/월별 수급액을 미리 확인할 수 있습니다.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">사용 방법</h2>
            <ol className="list-decimal pl-5 space-y-1.5">
              <li>만 나이를 입력합니다. (실업급여 수급 기간은 나이에 따라 달라집니다)</li>
              <li>고용보험 피보험 근무기간을 개월 수로 입력합니다.</li>
              <li>퇴직 전 3개월 평균 월급을 만원 단위로 입력합니다.</li>
              <li>입력 즉시 예상 총 수급액, 일 수급액, 수급 일수, 월 예상 수령액이 계산됩니다.</li>
            </ol>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">자주 묻는 질문</h2>
            <div className="space-y-2">
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">실업급여를 받으려면 어떤 조건이 필요한가요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">이직일 이전 18개월간 피보험단위기간이 180일 이상이어야 하며, 비자발적 퇴사(권고사직, 계약만료, 정리해고 등)여야 합니다. 또한 재취업 의사와 능력이 있고, 적극적으로 구직활동을 해야 합니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">자발적 퇴사도 실업급여를 받을 수 있나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">원칙적으로 자발적 퇴사(자진 퇴사)는 실업급여 수급 대상이 아닙니다. 다만, 임금 체불, 직장 내 괴롭힘, 통근 곤란 등 정당한 사유가 있는 경우에는 자발적 퇴사도 수급 자격이 인정될 수 있습니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">실업급여 수급 기간은 어떻게 되나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">수급 기간은 나이와 피보험기간에 따라 120일에서 최대 270일까지 차등 적용됩니다. 50세 이상 또는 장애인은 동일 피보험기간 대비 더 긴 수급 기간이 적용됩니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">실업급여 신청은 어디서 하나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">거주지 관할 고용센터를 방문하거나 고용보험 홈페이지(www.ei.go.kr)에서 온라인으로 신청할 수 있습니다. 퇴직 후 지체 없이 워크넷에 구직 등록을 하고, 수급자격 인정 신청을 해야 합니다.</p>
              </details>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">관련 정보</h2>
            <p>2026년 기준 실업급여 일 상한액은 66,000원이며, 하한액은 최저임금의 80%에 1일 근로시간(8시간)을 곱한 금액입니다. 실업급여 수급 중에도 구직활동을 성실히 이행해야 하며, 실업인정일에 고용센터를 방문하여 구직활동을 보고해야 합니다. 재취업을 빨리 하면 조기재취업수당을 받을 수도 있습니다. 자세한 내용은 고용보험 상담센터(1350)로 문의하세요.</p>
          </div>
        </section>
      } disclaimer={
        <div>
          <p>&#9888;&#65039; 본 계산기는 고용보험법 기준 <strong>모의 계산 결과</strong>로, 실제 수급액과 다를 수 있으며 법적 효력이 없어요.</p>
          <p>&#8226; 2026년 상한액: 1일 66,000원, 하한액: 최저임금의 80% × 8시간</p>
          <p>&#8226; 자발적 퇴사(자진 퇴사)의 경우 수급 자격이 제한될 수 있어요.</p>
          <p>&#8226; 정확한 수급 자격과 금액은 고용센터(1350) 또는 고용보험 홈페이지에서 확인하세요.</p>
        </div>
      }>
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
