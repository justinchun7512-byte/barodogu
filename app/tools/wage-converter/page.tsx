'use client';

import { useState } from 'react';
import { getToolById } from '@/lib/tools';
import { convertWage, MIN_WAGE_2026, MONTHLY_HOURS } from '@/lib/calculators/wage-converter';
import { ToolLayout } from '@/components/layout/ToolLayout';

const tool = getToolById('wage-converter')!;
const fmt = (n: number) => n.toLocaleString('ko-KR');

type WageType = 'hourly' | 'monthly' | 'annual';

export default function WageConverterPage() {
  const [type, setType] = useState<WageType>('hourly');
  const [amount, setAmount] = useState('');

  const num = parseInt(amount.replace(/,/g, ''));
  const result = !isNaN(num) && num > 0 ? convertWage(type, type === 'hourly' ? num : num * 10000) : null;

  return (
    <ToolLayout tool={tool} seoContent={
        <section className="space-y-6 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">시급/월급 변환기란?</h2>
            <p>시급/월급 변환기는 시급, 월급, 연봉 간의 상호 변환을 자동으로 계산해주는 도구입니다. 아르바이트를 구할 때 시급으로 제시된 급여가 월급으로는 얼마인지, 혹은 월급을 시급으로 환산하면 최저임금 이상인지 확인할 때 유용합니다. 2026년 최저시급(10,030원)을 기준으로 주 40시간, 월 209시간(주휴수당 포함) 기준의 정확한 변환을 제공합니다.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">사용 방법</h2>
            <ol className="list-decimal pl-5 space-y-1.5">
              <li>상단의 시급/월급/연봉 탭 중 입력하려는 유형을 선택합니다.</li>
              <li>금액을 입력합니다. (시급은 원 단위, 월급과 연봉은 만원 단위)</li>
              <li>2026년 최저시급을 적용하려면 &quot;최저시급 적용&quot; 버튼을 클릭합니다.</li>
              <li>입력 즉시 시급, 월급, 연봉이 상호 변환되어 표시됩니다.</li>
            </ol>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">자주 묻는 질문</h2>
            <div className="space-y-2">
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">2026년 최저시급은 얼마인가요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">2026년 최저시급은 10,030원입니다. 이를 월급으로 환산하면 주 40시간 기준 약 209만 6,270원(세전, 주휴수당 포함)입니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">월 209시간은 어떻게 계산되나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">주 40시간 근무 + 주휴 8시간 = 주 48시간입니다. 이를 월 환산하면 48시간 x (365일 / 7일 / 12개월) = 약 209시간이 됩니다. 이것이 월 소정근로시간의 기준입니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">주휴수당이란 무엇인가요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">주휴수당은 주 15시간 이상 근무한 근로자가 1주일간 개근했을 때, 유급으로 쉴 수 있는 하루(주휴일)에 대한 수당입니다. 시급제 근로자도 주 15시간 이상 근무하면 주휴수당을 받을 수 있습니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">최저시급보다 적게 받고 있으면 어떻게 해야 하나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">최저임금법 위반으로 고용노동부(1350)에 신고할 수 있습니다. 최저임금 미만 지급 시 사업주에게 3년 이하의 징역 또는 2천만원 이하의 벌금이 부과될 수 있습니다.</p>
              </details>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">관련 정보</h2>
            <p>최저임금은 매년 최저임금위원회에서 결정하며, 모든 사업장에 동일하게 적용됩니다. 수습 기간 중에는 최저임금의 90%를 적용할 수 있으나, 1년 미만의 기간제 근로자에게는 적용되지 않습니다. 아르바이트 급여 계산 시에는 시급뿐 아니라 주휴수당, 야간근무수당(22시~06시, 50% 할증), 연장근무수당(주 40시간 초과, 50% 할증) 등을 함께 고려해야 합니다.</p>
          </div>
        </section>
      } disclaimer={
        <div>
          <p>&#9888;&#65039; 본 계산기는 <strong>모의 계산 결과</strong>로, 실제 급여와 다를 수 있으며 법적 효력이 없어요.</p>
          <p>&#8226; 2026년 시간당 최저임금은 작년보다 인상된 <strong>10,030원</strong>이에요.</p>
          <p>&#8226; 월급 기준: 주 40시간 근무, 월 소정근로시간 209시간 (주휴수당 포함)</p>
          <p>&#8226; 월급제 근로계약의 경우: 시급 × [주휴시간 포함 주별 근무시간 × (365일 / 12개월 / 7일)]</p>
          <p>&#8226; 실제 급여는 수당, 공제 항목에 따라 달라질 수 있어요.</p>
        </div>
      }>
      <div className="space-y-4">
        <div className="flex gap-2">
          {(['hourly', 'monthly', 'annual'] as WageType[]).map(t => (
            <button key={t} onClick={() => { setType(t); setAmount(''); }} className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${type === t ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-300'}`}>
              {t === 'hourly' ? '시급' : t === 'monthly' ? '월급' : '연봉'}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            value={amount}
            onChange={e => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder={type === 'hourly' ? `예: ${MIN_WAGE_2026.toLocaleString()}` : '예: 300'}
            className="w-full text-2xl font-bold py-4 px-4 pr-16 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary focus:outline-none text-right"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-gray-400">{type === 'hourly' ? '원' : '만원'}</span>
        </div>

        {type === 'hourly' && (
          <button onClick={() => setAmount(String(MIN_WAGE_2026))} className="text-sm text-primary hover:underline">2026년 최저시급 {MIN_WAGE_2026.toLocaleString()}원 적용</button>
        )}
      </div>

      {result && (
        <div className="mt-8 space-y-3">
          {[
            { label: '시급', value: result.hourly, unit: '원' },
            { label: '월급', value: result.monthly, unit: '원', sub: `(주 40시간, 월 ${MONTHLY_HOURS}시간 기준)` },
            { label: '연봉', value: result.annual, unit: '원' },
          ].map(r => (
            <div key={r.label} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 flex justify-between items-center">
              <div>
                <span className="text-sm text-gray-500">{r.label}</span>
                {r.sub && <p className="text-xs text-gray-400">{r.sub}</p>}
              </div>
              <span className="text-xl font-bold text-primary">{fmt(r.value)}{r.unit}</span>
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}
