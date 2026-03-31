'use client';

import { useState } from 'react';
import { getToolById } from '@/lib/tools';
import { ToolLayout } from '@/components/layout/ToolLayout';

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
          <details className="group">
            <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">자주 묻는 질문</summary>
            <div className="mt-3 space-y-3">
              <div>
                <p className="font-medium">BMI가 정상인데 배가 나왔어요. 괜찮은 건가요?</p>
                <p>BMI는 전체 체중 기준이므로 내장지방이 많은 마른 비만은 감지하지 못합니다. 허리둘레 측정을 병행하세요.</p>
              </div>
              <div>
                <p className="font-medium">근육량이 많으면 BMI가 높게 나오나요?</p>
                <p>네, BMI는 근육과 지방을 구분하지 못합니다. 운동을 많이 하는 분은 체지방률 측정을 권장합니다.</p>
              </div>
            </div>
          </details>
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
    </ToolLayout>
  );
}
