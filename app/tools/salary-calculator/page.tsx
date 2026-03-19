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
