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
    <ToolLayout tool={tool} disclaimer={
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
