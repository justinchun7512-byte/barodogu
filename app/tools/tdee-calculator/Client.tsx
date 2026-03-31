'use client';

import { useState } from 'react';
import { getToolById } from '@/lib/tools';
import { ToolLayout } from '@/components/layout/ToolLayout';

const tool = getToolById('tdee-calculator')!;

type Gender = 'male' | 'female';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';

const ACTIVITY_LEVELS: { value: ActivityLevel; label: string; multiplier: number; desc: string }[] = [
  { value: 'sedentary', label: '비활동적', multiplier: 1.2, desc: '운동 거의 안 함, 사무직' },
  { value: 'light', label: '가벼운 활동', multiplier: 1.375, desc: '주 1~3회 가벼운 운동' },
  { value: 'moderate', label: '보통 활동', multiplier: 1.55, desc: '주 3~5회 중간 강도 운동' },
  { value: 'active', label: '활발한 활동', multiplier: 1.725, desc: '주 6~7회 높은 강도 운동' },
  { value: 'very-active', label: '매우 활발', multiplier: 1.9, desc: '하루 2회 운동 또는 육체 노동' },
];

function calculateBmr(gender: Gender, weightKg: number, heightCm: number, age: number): number {
  // Mifflin-St Jeor 공식
  if (gender === 'male') {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  }
  return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
}

const fmt = (n: number) => Math.round(n).toLocaleString('ko-KR');

export default function TdeeCalculatorPage() {
  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activity, setActivity] = useState<ActivityLevel>('moderate');

  const a = parseInt(age);
  const h = parseFloat(height);
  const w = parseFloat(weight);
  const canCalc = !isNaN(a) && a > 0 && a < 120 && !isNaN(h) && h > 0 && !isNaN(w) && w > 0;

  const bmr = canCalc ? calculateBmr(gender, w, h, a) : 0;
  const activityInfo = ACTIVITY_LEVELS.find(l => l.value === activity)!;
  const tdee = bmr * activityInfo.multiplier;

  return (
    <ToolLayout
      tool={tool}
      disclaimer="이 도구는 의학적 진단을 대체하지 않습니다. 정확한 영양 상담은 전문가와 상담하세요."
      seoContent={
        <section className="space-y-6 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">기초대사량(BMR)과 TDEE란?</h2>
            <p>기초대사량(BMR)은 아무것도 하지 않아도 생명 유지에 필요한 최소 칼로리입니다. TDEE(Total Daily Energy Expenditure)는 BMR에 일상 활동량을 곱한 하루 총 소비 칼로리입니다. 체중 감량을 원하면 TDEE보다 300~500kcal 적게, 체중 증가를 원하면 300~500kcal 많이 섭취하세요.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Mifflin-St Jeor 공식</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>남성: (10 x 체중kg) + (6.25 x 키cm) - (5 x 나이) + 5</li>
              <li>여성: (10 x 체중kg) + (6.25 x 키cm) - (5 x 나이) - 161</li>
            </ul>
          </div>
        </section>
      }
    >
      <div className="space-y-6">
        {/* 성별 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">성별</label>
          <div className="grid grid-cols-2 gap-3">
            {(['male', 'female'] as Gender[]).map(g => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`py-3 rounded-xl font-medium transition-all ${
                  gender === g
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {g === 'male' ? '남성' : '여성'}
              </button>
            ))}
          </div>
        </div>

        {/* 나이, 키, 몸무게 */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">나이</label>
            <input
              type="number"
              value={age}
              onChange={e => setAge(e.target.value)}
              placeholder="30"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
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

        {/* 활동량 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">활동량</label>
          <div className="space-y-2">
            {ACTIVITY_LEVELS.map(level => (
              <button
                key={level.value}
                onClick={() => setActivity(level.value)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                  activity === level.value
                    ? 'bg-primary/10 border-2 border-primary dark:bg-primary/20'
                    : 'bg-gray-50 dark:bg-gray-700 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <span className="font-medium text-gray-900 dark:text-white">{level.label}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">{level.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 결과 */}
        {canCalc && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">기초대사량 (BMR)</p>
                <p className="text-3xl font-bold font-heading text-gray-900 dark:text-white">{fmt(bmr)}</p>
                <p className="text-sm text-gray-400">kcal/일</p>
              </div>
              <div className="bg-primary/5 dark:bg-primary/20 rounded-xl p-5 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">하루 소비 칼로리 (TDEE)</p>
                <p className="text-3xl font-bold font-heading text-primary">{fmt(tdee)}</p>
                <p className="text-sm text-gray-400">kcal/일</p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-2">
              <p className="text-sm font-medium text-gray-900 dark:text-white">목표별 권장 칼로리</p>
              <div className="grid grid-cols-3 gap-3 text-center text-sm">
                <div className="bg-white dark:bg-gray-600 rounded-lg p-3">
                  <p className="text-gray-500 dark:text-gray-400">체중 감량</p>
                  <p className="font-bold text-blue-500">{fmt(tdee - 500)}</p>
                  <p className="text-xs text-gray-400">kcal/일</p>
                </div>
                <div className="bg-white dark:bg-gray-600 rounded-lg p-3">
                  <p className="text-gray-500 dark:text-gray-400">체중 유지</p>
                  <p className="font-bold text-green-500">{fmt(tdee)}</p>
                  <p className="text-xs text-gray-400">kcal/일</p>
                </div>
                <div className="bg-white dark:bg-gray-600 rounded-lg p-3">
                  <p className="text-gray-500 dark:text-gray-400">체중 증가</p>
                  <p className="font-bold text-orange-500">{fmt(tdee + 500)}</p>
                  <p className="text-xs text-gray-400">kcal/일</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
