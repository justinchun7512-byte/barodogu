'use client';

import { useState, useEffect } from 'react';
import { getToolById } from '@/lib/tools';
import { ToolLayout } from '@/components/layout/ToolLayout';
import { CoupangWidget } from '@/components/CoupangWidget';

const tool = getToolById('bmi-calculator')!;

interface BmiResult {
  bmi: number;
  category: string;
  color: string;
  description: string;
}

const BMI_RANGES = [
  { max: 18.5, category: '저체중', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/30', description: '체중이 부족한 상태입니다. 균형 잡힌 식사를 권장합니다.' },
  { max: 23, category: '정상', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/30', description: '건강한 체중입니다. 현재 상태를 유지하세요.' },
  { max: 25, category: '과체중', color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/30', description: '과체중 단계입니다. 식이조절과 운동을 시작하세요.' },
  { max: 30, category: '비만 1단계', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/30', description: '비만 단계입니다. 적극적인 체중 관리가 필요합니다.' },
  { max: 35, category: '비만 2단계', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/30', description: '고도비만 단계입니다. 전문가 상담을 권장합니다.' },
  { max: Infinity, category: '비만 3단계', color: 'text-red-700', bg: 'bg-red-50 dark:bg-red-900/30', description: '초고도비만 단계입니다. 반드시 전문가 상담이 필요합니다.' },
];

function calculateBmi(heightCm: number, weightKg: number): BmiResult {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  const range = BMI_RANGES.find(r => bmi < r.max) || BMI_RANGES[BMI_RANGES.length - 1];
  return { bmi, category: range.category, color: range.color, description: range.description };
}

function getBmiBarPosition(bmi: number): number {
  return Math.min(Math.max((bmi - 10) / 30 * 100, 0), 100);
}

export default function BmiCalculatorPage() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [loaded, setLoaded] = useState(false);

  // 마운트 시 URL 파라미터에서 초기값 로드
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('h')) setHeight(params.get('h')!);
    if (params.get('w')) setWeight(params.get('w')!);
    setLoaded(true);
  }, []);

  // 입력 변경 시 URL 파라미터 동기화
  useEffect(() => {
    if (!loaded) return;
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!isNaN(h) && h > 0 && !isNaN(w) && w > 0) {
      const url = new URL(window.location.href);
      url.searchParams.set('h', height);
      url.searchParams.set('w', weight);
      window.history.replaceState({}, '', url.pathname + url.search);
    }
  }, [height, weight, loaded]);

  const h = parseFloat(height);
  const w = parseFloat(weight);
  const canCalc = !isNaN(h) && h > 0 && h < 300 && !isNaN(w) && w > 0 && w < 500;
  const result = canCalc ? calculateBmi(h, w) : null;

  return (
    <ToolLayout
      tool={tool}
      disclaimer="이 도구는 의학적 진단을 대체하지 않습니다. 정확한 건강 상태 확인은 전문의와 상담하세요."
      seoContent={
        <section className="space-y-6 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">BMI 계산기란?</h2>
            <p>BMI(Body Mass Index, 체질량지수)는 키와 몸무게로 비만도를 측정하는 국제 표준 지표입니다. 체중(kg)을 키(m)의 제곱으로 나누어 계산합니다. 이 계산기는 대한비만학회의 아시아-태평양 기준을 적용하여 한국인에게 적합한 판정을 제공합니다.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">BMI 판정 기준 (아시아-태평양)</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>저체중: 18.5 미만</li>
              <li>정상: 18.5 ~ 22.9</li>
              <li>과체중: 23 ~ 24.9</li>
              <li>비만 1단계: 25 ~ 29.9</li>
              <li>비만 2단계: 30 ~ 34.9</li>
              <li>비만 3단계: 35 이상</li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">키별 BMI 정상 체중 표 (BMI 18.5~22.9 기준)</h2>
            <p className="mb-3">정상 BMI 범위(18.5~22.9, 아시아-태평양 기준)에 해당하는 키별 표준 체중표입니다. 자신의 키에 해당하는 정상 체중 범위를 바로 확인하세요.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-gray-200 dark:border-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-2 py-2 text-left">키 (cm)</th>
                    <th className="px-2 py-2 text-left">정상 체중 (kg)</th>
                    <th className="px-2 py-2 text-left">표준 체중 (BMI 22)</th>
                    <th className="px-2 py-2 text-left">과체중 시작</th>
                  </tr>
                </thead>
                <tbody>
                  {[150, 155, 160, 165, 170, 175, 180, 185].map(cm => {
                    const m = cm / 100;
                    const min = (18.5 * m * m).toFixed(1);
                    const max = (22.9 * m * m).toFixed(1);
                    const std = (22 * m * m).toFixed(1);
                    const over = (23 * m * m).toFixed(1);
                    return (
                      <tr key={cm} className="border-t border-gray-200 dark:border-gray-700">
                        <td className="px-2 py-2 font-medium">{cm}</td>
                        <td className="px-2 py-2">{min} ~ {max}</td>
                        <td className="px-2 py-2 text-green-600 dark:text-green-400">{std}</td>
                        <td className="px-2 py-2 text-yellow-600 dark:text-yellow-400">{over} 이상</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">※ 표준 체중(BMI 22)은 사망률·질환 위험이 가장 낮은 BMI 값입니다.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">남자·여자 BMI 정상 범위 차이</h2>
            <p>BMI 정상 범위(18.5~22.9)는 성별과 무관하게 동일한 기준을 적용합니다. 다만 동일 BMI라도 남자는 근육량이 많아 체지방률이 낮은 경향이 있고, 여자는 지방 비중이 높아 같은 BMI에서도 외형이 달라 보일 수 있어요.</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>남자</strong> 정상 체지방률: 10~20%</li>
              <li><strong>여자</strong> 정상 체지방률: 18~28%</li>
              <li>BMI가 정상이어도 체지방률이 높으면 <strong>마른 비만(skinny fat)</strong>일 수 있어 허리둘레·체지방률 측정 병행이 필요합니다.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">연령대별 BMI 적정 범위</h2>
            <p>나이가 들수록 근육량이 줄고 기초대사량이 떨어져 BMI 적정 범위가 약간 상향 조정됩니다. WHO 권장 연령대별 적정 BMI는 다음과 같습니다.</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>19~24세: 19~24</li>
              <li>25~34세: 20~25</li>
              <li>35~44세: 21~26</li>
              <li>45~54세: 22~27</li>
              <li>55~64세: 23~28</li>
              <li>65세 이상: 24~29</li>
            </ul>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">※ 본 계산기는 대한비만학회 표준 기준(18.5~22.9)을 사용합니다.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">자주 묻는 질문</h2>
            <div className="space-y-2">
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">여자 BMI 정상 범위는 남자와 다른가요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">BMI 판정 기준(저체중 18.5 미만·정상 18.5~22.9·과체중 23~24.9·비만 25 이상)은 대한비만학회 아시아-태평양 기준으로 성별 무관하게 동일합니다. 다만 같은 BMI라도 여자는 남자보다 체지방률이 10%p 정도 높은 경향이 있습니다(여성 정상 체지방률 18~28%, 남성 10~20%). 즉, 여자가 BMI 22라면 체지방률 24~27%가 일반적이고, 남자가 BMI 22라면 체지방률 14~18%가 일반적입니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">키 170cm, 몸무게 65kg이면 BMI는 얼마이고 정상인가요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">키 170cm, 몸무게 65kg이면 BMI = 65 ÷ (1.70 × 1.70) = 22.5입니다. 대한비만학회 아시아-태평양 기준 정상 범위(18.5~22.9)에 해당합니다. 키 170cm의 정상 체중 범위는 약 53.5~66.4kg이므로, 65kg은 정상 상한에 가까운 수준입니다. 위 도구에 직접 입력하면 계산 결과와 함께 BMI 게이지 바에서 현재 위치를 시각으로 확인할 수 있습니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">BMI가 정상인데 배가 나왔습니다. 왜 그럴까요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">BMI는 키와 체중만으로 계산하므로 체지방 분포를 반영하지 못합니다. 복부에 내장지방이 집중된 &quot;마른 비만(skinny fat)&quot; 체형은 BMI가 정상이어도 대사증후군 위험이 높을 수 있습니다. 일반적으로 남성 허리둘레 90cm 이상, 여성 85cm 이상이면 복부 비만으로 판정합니다. BMI와 허리둘레를 함께 확인하는 것이 정확한 건강 상태 파악에 도움이 됩니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">근육이 많으면 BMI가 높게 나오나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">맞습니다. BMI는 근육과 지방을 구분하지 않아 근육량이 많은 사람은 과체중·비만으로 잘못 분류될 수 있습니다. 예를 들어 키 175cm, 체중 80kg의 운동선수는 BMI 26.1(과체중)이 나오지만 체지방률이 12%라면 실제로는 매우 건강한 상태입니다. 이런 경우에는 체성분 분석기(인바디 등)를 통해 체지방률과 근육량을 직접 측정하는 것이 정확합니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">연령별 적정 BMI가 다른가요? 나이 들면 BMI 기준이 올라가나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">네, 나이가 들수록 근육량이 줄고 기초대사량이 감소해 체지방이 쌓이기 쉬워집니다. WHO 권장 기준에 따르면 25~34세는 BMI 20~25, 45~54세는 BMI 22~27, 65세 이상은 BMI 24~29가 적정 범위입니다. 단, 본 도구는 대한비만학회 표준(18.5~22.9)을 기준으로 계산합니다. 40대 이상이라면 BMI 수치보다 허리둘레와 체지방률 측정을 병행하는 것을 권장합니다.</p>
              </details>
            </div>
          </div>
        </section>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">키 (cm)</label>
            <input
              type="number"
              value={height}
              onChange={e => setHeight(e.target.value)}
              placeholder="170"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">몸무게 (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={e => setWeight(e.target.value)}
              placeholder="65"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {result && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="bg-primary/5 dark:bg-primary/20 rounded-xl p-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">BMI 지수</p>
              <p className={`text-4xl font-bold font-heading ${result.color}`}>
                {result.bmi.toFixed(1)}
              </p>
              <p className={`text-lg font-semibold mt-1 ${result.color}`}>{result.category}</p>
            </div>

            {/* BMI 게이지 바 */}
            <div className="relative h-4 rounded-full overflow-hidden bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 via-orange-400 to-red-500">
              <div
                className="absolute top-0 w-1 h-full bg-white border-2 border-gray-800 rounded-full transform -translate-x-1/2 transition-all duration-500"
                style={{ left: `${getBmiBarPosition(result.bmi)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>10</span>
              <span>18.5</span>
              <span>23</span>
              <span>25</span>
              <span>30</span>
              <span>40</span>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">{result.description}</p>
            </div>

            {/* 정상 체중 범위 */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">키 {h}cm 기준 정상 체중 범위</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {(18.5 * (h / 100) * (h / 100)).toFixed(1)}kg ~ {(22.9 * (h / 100) * (h / 100)).toFixed(1)}kg
              </p>
            </div>
          </div>
        )}
      </div>
      <CoupangWidget tool="bmi-calculator" />
    </ToolLayout>
  );
}
