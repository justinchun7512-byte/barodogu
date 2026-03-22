'use client';

import { useState } from 'react';
import { getToolById } from '@/lib/tools';
import { ToolLayout } from '@/components/layout/ToolLayout';

const tool = getToolById('loan-calculator')!;
const fmt = (n: number) => Math.round(n).toLocaleString('ko-KR');

type RepayType = 'equal-payment' | 'equal-principal' | 'bullet';

function calculateLoan(principal: number, annualRate: number, months: number, type: RepayType) {
  const monthlyRate = annualRate / 100 / 12;
  let totalInterest = 0;
  let monthlyPayment = 0;
  const schedule: { month: number; principal: number; interest: number; payment: number; balance: number }[] = [];
  let balance = principal;

  if (type === 'equal-payment') {
    // 원리금균등
    if (monthlyRate === 0) {
      monthlyPayment = principal / months;
    } else {
      monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    }
    for (let i = 1; i <= months; i++) {
      const interest = balance * monthlyRate;
      const princ = monthlyPayment - interest;
      balance -= princ;
      totalInterest += interest;
      if (i <= 12 || i === months) schedule.push({ month: i, principal: princ, interest, payment: monthlyPayment, balance: Math.max(0, balance) });
    }
  } else if (type === 'equal-principal') {
    // 원금균등
    const monthlyPrincipal = principal / months;
    for (let i = 1; i <= months; i++) {
      const interest = balance * monthlyRate;
      const payment = monthlyPrincipal + interest;
      balance -= monthlyPrincipal;
      totalInterest += interest;
      if (i === 1) monthlyPayment = payment;
      if (i <= 12 || i === months) schedule.push({ month: i, principal: monthlyPrincipal, interest, payment, balance: Math.max(0, balance) });
    }
  } else {
    // 만기일시
    monthlyPayment = principal * monthlyRate;
    totalInterest = monthlyPayment * months;
    for (let i = 1; i <= Math.min(months, 12); i++) {
      schedule.push({ month: i, principal: 0, interest: monthlyPayment, payment: monthlyPayment, balance: principal });
    }
    if (months > 12) {
      schedule.push({ month: months, principal, interest: monthlyPayment, payment: principal + monthlyPayment, balance: 0 });
    }
  }

  return { monthlyPayment, totalInterest, totalPayment: principal + totalInterest, schedule };
}

export default function LoanCalculatorPage() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [months, setMonths] = useState('');
  const [type, setType] = useState<RepayType>('equal-payment');

  const p = parseInt(principal.replace(/,/g, '')) * 10000;
  const r = parseFloat(rate);
  const m = parseInt(months);
  const canCalc = !isNaN(p) && p > 0 && !isNaN(r) && r >= 0 && !isNaN(m) && m > 0;
  const result = canCalc ? calculateLoan(p, r, m, type) : null;

  return (
    <ToolLayout tool={tool} disclaimer={
        <div>
          <p>&#9888;&#65039; 본 계산기는 단순 이자율 기준 <strong>모의 계산 결과</strong>로, 실제 대출 상환액과 다를 수 있으며 법적 효력이 없어요.</p>
          <p>&#8226; 실제 대출 이자는 금리 유형(고정/변동), 우대금리, 중도상환수수료 등에 따라 달라져요.</p>
          <p>&#8226; 정확한 대출 조건은 해당 금융기관에 직접 문의하세요.</p>
          <p>&#8226; 본 결과를 근거로 한 금융 의사결정에 대해 바로도구는 책임지지 않아요.</p>
        </div>
      } guideContent={
      <div>
        <h2 className="text-xl font-bold mb-4 dark:text-white">대출 상환 방식 비교</h2>
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <div><h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">원리금균등 상환</h3><p>매월 같은 금액을 납부합니다. 초기에는 이자 비중이 크고, 시간이 지날수록 원금 비중이 커집니다.</p></div>
          <div><h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">원금균등 상환</h3><p>매월 같은 원금을 갚고, 이자는 줄어듭니다. 초기 부담이 크지만 총 이자는 가장 적습니다.</p></div>
          <div><h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">만기일시 상환</h3><p>매월 이자만 내고, 만기에 원금을 한꺼번에 상환합니다. 월 부담은 적지만 총 이자가 가장 많습니다.</p></div>
        </div>
      </div>
    }>
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">대출 원금 (만원)</label>
          <input type="text" inputMode="numeric" value={principal} onChange={e => setPrincipal(e.target.value.replace(/[^0-9]/g, ''))} placeholder="예: 30000 (3억)" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">연 이자율 (%)</label>
          <input type="text" inputMode="decimal" value={rate} onChange={e => setRate(e.target.value)} placeholder="예: 3.5" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">대출 기간 (개월)</label>
          <input type="number" value={months} onChange={e => setMonths(e.target.value)} placeholder="예: 360 (30년)" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary focus:outline-none" />
          <div className="flex gap-2 mt-2">
            {[{ l: '10년', v: 120 }, { l: '20년', v: 240 }, { l: '30년', v: 360 }].map(p => (
              <button key={p.v} onClick={() => setMonths(String(p.v))} className="px-3 py-1 text-xs rounded-lg border border-gray-300 dark:border-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white hover:border-primary transition">{p.l}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">상환 방식</label>
          <div className="flex gap-2">
            {([
              { id: 'equal-payment' as RepayType, label: '원리금균등' },
              { id: 'equal-principal' as RepayType, label: '원금균등' },
              { id: 'bullet' as RepayType, label: '만기일시' },
            ]).map(t => (
              <button key={t.id} onClick={() => setType(t.id)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${type === t.id ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-300'}`}>{t.label}</button>
            ))}
          </div>
        </div>
      </div>

      {result && (
        <div>
          <div className="bg-primary/5 dark:bg-primary/20 rounded-xl p-6 text-center mb-6">
            <p className="text-sm text-primary mb-1">{type === 'bullet' ? '월 이자' : '월 상환금'} (첫 달)</p>
            <p className="text-4xl font-bold text-primary">{fmt(result.monthlyPayment)}원</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">대출 원금</span><span className="font-medium dark:text-gray-300">{fmt(p)}원</span></div>
            <div className="flex justify-between"><span className="text-gray-500">총 이자</span><span className="font-medium text-red-500">{fmt(result.totalInterest)}원</span></div>
            <hr className="my-2 dark:border-gray-600" />
            <div className="flex justify-between font-bold"><span className="dark:text-white">총 상환금</span><span className="text-primary">{fmt(result.totalPayment)}원</span></div>
          </div>

          {/* Schedule */}
          <div className="mt-6">
            <h3 className="font-semibold text-sm mb-3 dark:text-gray-300">상환 스케줄</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b dark:border-gray-600 text-gray-500">
                    <th className="py-2 text-left">회차</th>
                    <th className="py-2 text-right">원금</th>
                    <th className="py-2 text-right">이자</th>
                    <th className="py-2 text-right">납입금</th>
                    <th className="py-2 text-right">잔액</th>
                  </tr>
                </thead>
                <tbody>
                  {result.schedule.map(s => (
                    <tr key={s.month} className="border-b dark:border-gray-700">
                      <td className="py-1.5 dark:text-gray-300">{s.month}회</td>
                      <td className="py-1.5 text-right dark:text-gray-300">{fmt(s.principal)}</td>
                      <td className="py-1.5 text-right text-red-500">{fmt(s.interest)}</td>
                      <td className="py-1.5 text-right font-medium dark:text-gray-300">{fmt(s.payment)}</td>
                      <td className="py-1.5 text-right text-gray-400">{fmt(s.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
