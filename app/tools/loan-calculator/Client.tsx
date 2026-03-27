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
    <ToolLayout tool={tool} seoContent={
        <section className="space-y-6 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">대출 이자 계산기란?</h2>
            <p>대출 이자 계산기는 대출 원금, 연 이자율, 대출 기간, 상환 방식을 입력하면 월 상환금, 총 이자, 총 상환금을 자동으로 계산하고 상환 스케줄까지 보여주는 도구입니다. 주택담보대출, 전세대출, 신용대출 등 다양한 대출 상품을 비교할 때 유용하며, 원리금균등, 원금균등, 만기일시 세 가지 상환 방식별 이자 차이를 한눈에 비교할 수 있습니다.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">사용 방법</h2>
            <ol className="list-decimal pl-5 space-y-1.5">
              <li>대출 원금을 만원 단위로 입력합니다. (예: 3억이면 &quot;30000&quot;)</li>
              <li>연 이자율을 퍼센트로 입력합니다. (예: 3.5%)</li>
              <li>대출 기간을 개월 수로 입력합니다. (프리셋: 10년/20년/30년)</li>
              <li>상환 방식(원리금균등, 원금균등, 만기일시)을 선택합니다.</li>
              <li>입력 즉시 월 상환금, 총 이자, 상환 스케줄이 자동 계산됩니다.</li>
            </ol>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">자주 묻는 질문</h2>
            <div className="space-y-2">
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">원리금균등과 원금균등 중 어떤 게 유리한가요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">총 이자 기준으로는 원금균등이 더 유리합니다. 다만 원금균등은 초기 상환액이 크고, 원리금균등은 매월 동일한 금액을 내므로 가계 관리가 쉽습니다. 여유 자금이 있다면 원금균등, 매월 일정 금액을 선호한다면 원리금균등을 추천합니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">만기일시상환은 언제 유리한가요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">만기일시상환은 매월 이자만 납부하므로 월 부담이 가장 적지만, 총 이자는 가장 많습니다. 단기 대출이나 곧 목돈이 예정된 경우(전세금 반환 등)에 적합합니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">금리가 0.5%p 차이나면 이자가 얼마나 달라지나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">3억원 30년 기준, 금리가 3.5%에서 4.0%로 0.5%p 오르면 총 이자가 약 3,000만원 이상 증가합니다. 금리 차이가 장기 대출에 미치는 영향은 매우 크므로, 반드시 여러 금융기관을 비교해보세요.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">중도상환수수료도 계산되나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">본 계산기는 단순 이자율 기준의 모의 계산이므로 중도상환수수료, 우대금리, 변동금리 조정 등은 반영되지 않습니다. 정확한 조건은 해당 금융기관에 직접 문의하세요.</p>
              </details>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">관련 정보</h2>
            <p>대출을 받기 전에는 반드시 여러 금융기관의 금리를 비교해야 합니다. 한국은행 기준금리, 코픽스(COFIX) 금리 등에 따라 시중 대출 금리가 결정되며, 고정금리와 변동금리의 선택도 중요합니다. 주택담보대출의 경우 LTV(주택담보인정비율), DTI(총부채상환비율), DSR(총부채원리금상환비율) 규제를 확인해야 합니다. 금융감독원의 금융상품한눈에(finlife.fss.or.kr)에서 각 은행별 대출 금리를 비교할 수 있습니다.</p>
          </div>
        </section>
      } disclaimer={
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
