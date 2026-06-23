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
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border-l-4 border-blue-400">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">퇴직할 때 퇴직금이 얼마인지 모르고 나온 게 부끄러웠습니다</h2>
            <p>이직을 결정하고 나서야 &quot;아, 퇴직금이 얼마지?&quot;를 처음 계산해봤어요. 재직 기간이 4년이고 마지막 3개월 평균 급여가 666만원이었는데, 막상 받고 보니 예상보다 적었더라고요.</p>
            <p className="mt-2">퇴직금 계산이 생각보다 복잡한 이유가, 단순히 월급 × 근속연수가 아니거든요. 마지막 3개월 평균 급여를 기준으로 1년 치를 계산하는 구조라, 퇴직 직전에 급여 변동(성과급, 인센티브 포함 여부)이 있으면 금액이 꽤 달라집니다.</p>
            <p className="mt-2">한 가지 놓치기 쉬운 것: 1년 미만 근무자는 퇴직금이 없지만, 1년이 딱 넘으면 발생합니다. 계약직이나 단기 프리랜서도 4대보험 가입 + 1년 이상이면 퇴직금 청구 가능하고요.</p>
            <p className="mt-2">퇴직 전에 꼭 한 번 계산해보시길 추천드려요. 예상 퇴직금을 미리 알아야 이직 타이밍이나 협상 레버리지로도 쓸 수 있습니다.</p>
          </div>
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
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">1년 근무 후 퇴직하면 퇴직금이 얼마나 나오나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">근로기준법상 퇴직금은 &quot;1일 평균임금 × 30일 × (재직일수 ÷ 365)&quot;로 계산합니다. 월급 300만원으로 정확히 1년(365일) 근무했다면 1일 평균임금이 약 10만원이므로, 퇴직금은 약 300만원(세전)이 됩니다. 1년 미만 근무 시에는 퇴직금 지급 의무가 없습니다(근로기준법 제34조). 위 계산기에 입사일·퇴사일·월급을 입력하면 예상 퇴직금을 바로 확인할 수 있습니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">퇴직금 평균임금 계산 시 상여금은 어떻게 포함하나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">평균임금은 퇴직일 직전 3개월간 지급된 총 임금을 해당 기간 총 일수로 나눈 금액입니다. 매달 정기적으로 지급된 상여금은 평균임금에 포함됩니다. 1년에 한 번 지급되는 연간 상여금은 3개월 기준 금액(연간 상여금 ÷ 12 × 3)으로 산입합니다. 불규칙 성과급·경영 인센티브는 포함 여부가 회사 규정과 판례에 따라 달라지므로 정확한 확인은 고용노동부(☎ 1350)에 문의하세요.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">퇴직금에 붙는 세금(퇴직소득세)은 얼마나 되나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">퇴직금에는 일반 소득세가 아닌 퇴직소득세가 별도로 부과됩니다. 퇴직소득세는 근속연수가 길수록 세금이 줄어드는 구조로, 5년 근무 후 퇴직금 1,500만원이라면 퇴직소득세가 수십만원 수준에 그칩니다. 정확한 퇴직소득세 계산은 국세청 홈택스의 퇴직소득 세액 계산기를 이용하거나 회사 인사팀에 문의하세요. 본 계산기는 퇴직소득세 전(前) 예상 금액을 보여줍니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">퇴직금을 회사가 14일 안에 안 줘도 되나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">근로기준법 제36조에 따라 퇴직금은 퇴직일로부터 14일 이내에 지급해야 합니다. 14일을 초과하면 연 20%의 지연이자가 붙습니다. 합의(서면)가 있을 경우에만 지급 기일을 연장할 수 있습니다. 14일이 지났음에도 퇴직금이 지급되지 않으면 관할 노동청 또는 고용노동부 민원 신청(☎ 1350)을 통해 진정할 수 있습니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">퇴직연금(IRP)과 일반 퇴직금의 차이는?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">일반 퇴직금은 회사가 내부에 적립 후 퇴직 시 일시금으로 지급합니다. 반면 퇴직연금은 DB(확정급여형)·DC(확정기여형)·IRP(개인형퇴직연금) 세 가지로 나뉘며, 외부 금융기관에 적립됩니다. DB형은 최종 평균임금 기준으로 수령액이 확정되고, DC형은 회사가 매년 부담금을 납입해 근로자가 직접 운용합니다. IRP는 퇴직금을 55세까지 유지하면 세제 혜택(퇴직소득세 30~40% 절감)이 있어 장기적으로 유리합니다.</p>
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
