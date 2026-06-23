'use client';

import { useState } from 'react';
import { getToolById } from '@/lib/tools';
import { calculateSalary, type SalaryResult } from '@/lib/calculators/salary';
import { ToolLayout } from '@/components/layout/ToolLayout';

const tool = getToolById('salary-calculator')!;
const PRESETS = [3000, 4000, 5000, 6000, 8000, 10000];

function fmt(n: number) {
  return Math.round(n).toLocaleString('ko-KR');
}

export default function SalaryCalculatorPage() {
  const [input, setInput] = useState('');
  const amount = parseInt(input.replace(/,/g, ''));
  const result: SalaryResult | null = !isNaN(amount) && amount > 0 ? calculateSalary(amount) : null;

  return (
    <ToolLayout
      tool={tool}
      seoContent={
        <section className="space-y-6 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border-l-4 border-blue-400">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">이직할 때마다 가장 먼저 켜는 도구가 생겼습니다</h2>
            <p>직장인 20년 넘게 다니면서 이직을 몇 번 해봤는데, 연봉 협상할 때마다 항상 헷갈리는 게 있었어요. 회사에서 &quot;연봉 8,000만원&quot;이라고 하는데, 막상 통장에 들어오는 돈이 생각보다 적다는 거죠.</p>
            <p className="mt-2">처음 이직할 때 연봉이 전 직장보다 1,000만원 오른다고 들어서 기뻤는데, 실수령으로 계산해보니 월에 고작 55만원 차이였거든요. 4대보험이랑 세금 빼고 나면 그렇게 되더라고요.</p>
            <p className="mt-2">그 이후부턴 오퍼를 받을 때마다 연봉 숫자보다 월 실수령을 먼저 계산해봅니다. 식비·교통비·복지포인트 별도 여부도 따지면 연봉 숫자만 보고 판단하면 안 되거든요. 특히 스타트업은 포괄임금제 여부도 체크해야 해요.</p>
            <p className="mt-2">이 계산기는 2026년 최신 4대보험 요율을 반영해서 만들었습니다. 국민연금 4.5%, 건강보험 3.545%, 고용보험 0.9% — 연봉 협상 전에 한 번 돌려보시면 기대치 조정이 됩니다.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">연봉 실수령액 계산기란?</h2>
            <p>연봉 실수령액 계산기는 세전 연봉에서 국민연금, 건강보험, 장기요양보험, 고용보험 등 4대보험료와 소득세, 지방소득세를 자동으로 공제하여 실제로 매월 통장에 입금되는 금액을 계산해주는 도구입니다. 취업 준비생, 이직을 고려하는 직장인, 연봉 협상을 앞둔 분들에게 유용합니다. 2026년 최신 세율과 4대보험 요율을 반영하여 정확한 실수령액을 확인할 수 있습니다. 연봉 3000만원부터 1억원 이상까지 다양한 구간의 실수령액을 빠르게 비교해보세요.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">사용 방법</h2>
            <ol className="list-decimal pl-5 space-y-1.5">
              <li>상단 입력란에 세전 연봉을 만원 단위로 입력합니다. (예: 연봉 5000만원이면 &quot;5000&quot; 입력)</li>
              <li>자주 사용하는 금액은 프리셋 버튼(3000, 4000, 5000, 6000, 8000, 1억)을 클릭하면 바로 입력됩니다.</li>
              <li>입력 즉시 월 실수령액, 연간 실수령액, 4대보험 내역, 소득세 내역이 자동 계산되어 표시됩니다.</li>
              <li>하단의 시각적 바 차트를 통해 실수령 비율과 공제 비율을 한눈에 확인할 수 있습니다.</li>
            </ol>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">자주 묻는 질문</h2>
            <div className="space-y-2">
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">연봉 5000만원이면 실제로 한 달에 얼마 받나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">2026년 기준 연봉 5,000만원의 월 실수령액은 약 350~365만원 수준입니다(부양가족 1인, 비과세 없는 일반 조건 기준). 4대보험(국민연금 4.5%, 건강보험 3.545%, 장기요양 0.459%, 고용보험 0.9%)과 소득세·지방소득세를 공제하면 총 공제액이 월 52만원 안팎이 됩니다. 비과세 항목(식대 월 20만원 등)이 있으면 실수령액이 더 올라가므로, 위 계산기에 본인 연봉을 직접 입력해 정확한 금액을 확인하세요.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">연봉 4000만원 실수령액은 얼마인가요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">2026년 기준 연봉 4,000만원의 월 실수령액은 약 290~300만원 수준입니다. 연봉을 12로 나누면 월 333만원이지만, 국민연금·건강보험·고용보험 합산 약 30만원과 소득세·지방소득세 약 8만원이 차감됩니다. 비과세 식대(월 20만원 한도)를 적용하면 소득세 부담이 줄어 실수령액이 조금 더 높아질 수 있습니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">2026년 국민연금·건강보험 요율이 올랐나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">2026년 기준으로 국민연금 4.5%, 건강보험 3.545%, 장기요양보험(건강보험료의 12.95%), 고용보험 0.9%가 적용됩니다. 장기요양보험 요율이 매년 소폭 조정되므로, 가장 정확한 수치는 국민건강보험공단 공식 고지서를 참고하세요. 본 계산기는 2026년 최신 요율을 반영하고 있습니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">월급에서 실제로 빠져나가는 세금 비율은 얼마인가요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">연봉 구간에 따라 다르지만, 연봉 3,000~6,000만원 사이의 직장인은 대체로 월 급여의 13~17%가 4대보험과 세금으로 빠져나갑니다. 연봉 3,000만원대는 공제 비율이 약 13%, 연봉 5,000만원대는 약 15%, 연봉 8,000만원 이상은 20%를 넘는 경우가 있습니다. 정확한 공제율은 계산기 결과 화면 하단의 바 차트에서 확인할 수 있습니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">연봉 협상 시 실수령액 기준으로 비교하는 방법은?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">연봉 협상 시 회사 A의 6,000만원과 회사 B의 5,500만원을 단순 비교하면 안 됩니다. 각각의 실수령 월급을 먼저 계산하면 A는 약 400만원, B는 약 370만원으로 월 30만원 차이입니다. 여기에 성과급·식대 별도 제공·퇴직금 별도 여부·연차 개수를 더해야 진짜 비교가 됩니다. 계산기 프리셋 버튼으로 두 연봉을 번갈아 입력해 실수령액을 빠르게 비교해 보세요.</p>
              </details>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">관련 정보</h2>
            <p>연봉 실수령액은 같은 연봉이라도 부양가족 수, 비과세 항목, 회사의 급여 체계에 따라 달라질 수 있습니다. 국민연금은 월 소득 590만원 상한선이 있어 고연봉자의 경우 국민연금 부담이 일정 수준에서 멈춥니다. 연봉 협상 시에는 세전 연봉뿐 아니라 성과급, 복리후생, 퇴직금 별도 여부 등을 종합적으로 고려하는 것이 중요합니다. 보다 정확한 세금 계산을 위해서는 국세청 홈택스의 근로소득 간이세액표를 참고하시기 바랍니다.</p>
          </div>
        </section>
      }
      disclaimer={
        <div>
          <p>&#9888;&#65039; 본 계산기는 2026년 기준 세율을 적용한 <strong>모의 계산 결과</strong>로, 실제 수령액과 다를 수 있으며 법적 효력이 없어요.</p>
          <p>&#8226; 부양가족 수, 비과세 항목, 공제 감면 등에 따라 실제 금액은 달라질 수 있어요.</p>
          <p>&#8226; 정확한 금액은 국세청 간이세액표 또는 회사 급여 담당자에게 확인하세요.</p>
          <p>&#8226; 4대보험 요율: 국민연금 4.5%, 건강보험 3.545%, 장기요양 12.95%, 고용보험 0.9%</p>
        </div>
      }
      guideContent={
        <div>
          <h2 className="text-xl font-bold mb-4 dark:text-white">2026년 연봉 실수령액 계산 방법</h2>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-3">
            <p>연봉 실수령액은 세전 연봉에서 4대보험과 소득세를 공제한 금액입니다.</p>
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">4대보험 요율 (2026년)</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>국민연금</strong>: 월 소득의 4.5% (상한 590만원)</li>
              <li><strong>건강보험</strong>: 월 소득의 3.545%</li>
              <li><strong>장기요양보험</strong>: 건강보험의 12.95%</li>
              <li><strong>고용보험</strong>: 월 소득의 0.9%</li>
            </ul>
          </div>
        </div>
      }
    >
      {/* Input */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">연봉 (세전)</label>
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            value={input}
            onChange={(e) => setInput(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="예: 5000"
            className="w-full text-3xl md:text-4xl font-bold py-4 px-4 pr-16 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary focus:outline-none transition text-right"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-gray-400 font-medium">만원</span>
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          {PRESETS.map(v => (
            <button key={v} onClick={() => setInput(String(v))} className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white hover:border-primary transition">
              {v >= 10000 ? `${v / 10000}억` : v.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      {/* Result */}
      {result && (
        <div>
          <div className="bg-primary/5 dark:bg-primary/20 rounded-xl p-6 mb-6 text-center">
            <p className="text-sm text-primary mb-1">월 실수령액</p>
            <p className="text-4xl md:text-5xl font-bold text-primary">{fmt(result.monthlyNet)}원</p>
            <p className="text-sm text-gray-500 mt-2">연간 실수령액: <span className="font-semibold text-gray-700 dark:text-gray-300">{fmt(result.yearlyNet)}원</span></p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">4대보험 (월)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">국민연금</span><span className="font-medium dark:text-gray-300">{fmt(result.pension)}원</span></div>
                <div className="flex justify-between"><span className="text-gray-500">건강보험</span><span className="font-medium dark:text-gray-300">{fmt(result.health)}원</span></div>
                <div className="flex justify-between"><span className="text-gray-500">장기요양</span><span className="font-medium dark:text-gray-300">{fmt(result.longterm)}원</span></div>
                <div className="flex justify-between"><span className="text-gray-500">고용보험</span><span className="font-medium dark:text-gray-300">{fmt(result.employment)}원</span></div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">세금 (월)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">소득세</span><span className="font-medium dark:text-gray-300">{fmt(result.incomeTax)}원</span></div>
                <div className="flex justify-between"><span className="text-gray-500">지방소득세</span><span className="font-medium dark:text-gray-300">{fmt(result.localTax)}원</span></div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">월 급여 (세전)</span>
              <span className="font-medium dark:text-gray-300">{fmt(result.monthlyGross)}원</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">총 공제액</span>
              <span className="font-medium text-red-500">-{fmt(result.totalDeduction)}원</span>
            </div>
            <hr className="my-2 dark:border-gray-600" />
            <div className="flex justify-between font-bold">
              <span className="dark:text-white">월 실수령액</span>
              <span className="text-primary">{fmt(result.monthlyNet)}원</span>
            </div>
            <div className="mt-3 h-4 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden flex">
              <div className="bg-primary h-full" style={{ width: `${(result.monthlyNet / result.monthlyGross * 100)}%` }} />
              <div className="bg-red-300 h-full" style={{ width: `${((result.pension + result.health + result.longterm + result.employment) / result.monthlyGross * 100)}%` }} />
              <div className="bg-red-500 h-full" style={{ width: `${((result.incomeTax + result.localTax) / result.monthlyGross * 100)}%` }} />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>실수령 {(result.monthlyNet / result.monthlyGross * 100).toFixed(1)}%</span>
              <span>4대보험 + 세금</span>
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
