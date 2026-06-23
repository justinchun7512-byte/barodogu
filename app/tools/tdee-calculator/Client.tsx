'use client';

import { useState, useEffect } from 'react';
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
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('g')) setGender(params.get('g') as Gender);
    if (params.get('a')) setAge(params.get('a')!);
    if (params.get('h')) setHeight(params.get('h')!);
    if (params.get('w')) setWeight(params.get('w')!);
    if (params.get('act')) setActivity(params.get('act') as ActivityLevel);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const a = parseInt(age);
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!isNaN(a) && a > 0 && !isNaN(h) && h > 0 && !isNaN(w) && w > 0) {
      const url = new URL(window.location.href);
      url.searchParams.set('g', gender);
      url.searchParams.set('a', age);
      url.searchParams.set('h', height);
      url.searchParams.set('w', weight);
      url.searchParams.set('act', activity);
      window.history.replaceState({}, '', url.pathname + url.search);
    }
  }, [gender, age, height, weight, activity, loaded]);

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
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border-l-4 border-blue-400">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">다이어트 실패를 반복하다가 깨달은 것</h2>
            <p>체중 관리를 몇 번 시도해봤는데 매번 작심삼일로 끝나다가, 어느 순간 &quot;내가 하루에 실제로 얼마나 먹어야 하는지&quot;를 제대로 모르고 있었다는 걸 알게 됐습니다.</p>
            <p className="mt-2">헬스 유튜브 보면서 1,800kcal 먹으면 된다는 말을 듣고 따라 해봤는데, 제 키 163cm, 체중 61kg, 나이 50세, 사무직 기준으로 TDEE를 계산해보니 유지 열량이 1,661kcal였어요. 1,800kcal는 유지 열량보다 많이 먹고 있던 거더라고요. 살이 빠지기는커녕 현상 유지도 안 되던 이유가 있었습니다.</p>
            <p className="mt-2">TDEE는 기초대사량(BMR)에 활동 계수를 곱해서 나옵니다. 사무직으로 하루 종일 앉아 있으면 활동 계수 1.2가 적용되는데, 운동을 전혀 안 하는 날 기준으로 TDEE를 계산해두고 거기서 300~500kcal 빼는 걸 목표로 잡으면 굶지 않고 감량할 수 있습니다.</p>
            <p className="mt-2">지금은 다이어트 시작 전에 이 계산기로 유지 열량부터 확인하는 걸 첫 단계로 삼고 있어요.</p>
          </div>
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
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">활동량을 고르는 기준</h2>
            <p>활동량은 운동 시간만이 아니라 직업, 출퇴근, 하루 걸음 수까지 합쳐 판단해야 합니다. 사무직이고 주 1~2회 가볍게 걷는 정도라면 비활동적 또는 가벼운 활동으로 시작하는 것이 안전합니다. 반대로 매장 근무, 현장직, 하루 1만 보 이상 이동이 잦은 직무라면 운동을 따로 하지 않아도 보통 활동에 가까울 수 있습니다. 처음에는 보수적으로 선택하고 2주 평균 체중 변화를 보며 조정하세요.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">목표별 칼로리 설정</h2>
            <p>체중 감량은 TDEE에서 300~500kcal를 뺀 값으로 시작하는 것을 권장합니다. 유지가 목표라면 TDEE 전후 100kcal 범위에서 식단을 맞추고, 근육 증가가 목표라면 TDEE보다 300~500kcal 높게 잡되 근력 운동과 단백질 섭취를 함께 관리해야 합니다. 계산 결과는 의학적 처방이 아니라 생활 관리 기준점이므로, 질환이나 특수한 식단 제한이 있다면 전문가 상담을 우선하세요.</p>
          </div>
          <details className="group">
            <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">자주 묻는 질문</summary>
            <div className="mt-3 space-y-3">
              <div><p className="font-medium">계산 결과대로 먹었는데 체중이 안 변합니다.</p><p>2주 평균 체중을 기준으로 하루 섭취량을 100~200kcal씩 조정하세요. 활동량 입력이 실제보다 높았을 수 있습니다.</p></div>
              <div><p className="font-medium">기초대사량보다 적게 먹어도 되나요?</p><p>단기간에는 가능하지만 지속성이 낮고 근손실 위험이 큽니다. 감량은 TDEE에서 적당히 줄이는 방식이 안전합니다.</p></div>
              <div><p className="font-medium">운동하지 않는 날도 같은 칼로리를 먹나요?</p><p>초보자는 주간 평균으로 맞추는 편이 쉽습니다. 익숙해지면 운동일과 휴식일을 나누어 조정할 수 있습니다.</p></div>
            </div>
          </details>
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-sm">
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
