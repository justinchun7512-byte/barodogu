'use client';

import { useState } from 'react';
import { getToolById } from '@/lib/tools';
import { ToolLayout } from '@/components/layout/ToolLayout';

const tool = getToolById('daily-fortune')!;

interface FortuneResult {
  overall: string;
  money: string;
  love: string;
  health: string;
  luckyNumber: number;
  luckyColor: string;
  advice: string;
  score: number;
}

function getScoreColor(score: number): string {
  if (score >= 90) return 'text-red-500';
  if (score >= 80) return 'text-orange-500';
  if (score >= 70) return 'text-yellow-500';
  return 'text-blue-500';
}

export default function DailyFortunePage() {
  const [birthDate, setBirthDate] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FortuneResult | null>(null);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const canCalc = birthDate && birthDate <= today;

  const handleSubmit = async () => {
    if (!canCalc || loading) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/daily-fortune', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ birthDate, name: name.trim() || undefined }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '오류가 발생했습니다.');
      }

      const data = await res.json();
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fortuneCategories = result ? [
    { label: '총운', emoji: '🌟', text: result.overall, color: 'bg-purple-50 dark:bg-purple-900/20' },
    { label: '재운', emoji: '💰', text: result.money, color: 'bg-yellow-50 dark:bg-yellow-900/20' },
    { label: '애정운', emoji: '💕', text: result.love, color: 'bg-pink-50 dark:bg-pink-900/20' },
    { label: '건강운', emoji: '💪', text: result.health, color: 'bg-green-50 dark:bg-green-900/20' },
  ] : [];

  return (
    <ToolLayout
      tool={tool}
      disclaimer="이 도구는 재미로만 봐주세요. AI가 생성한 운세이며 실제 운명과는 무관합니다."
      seoContent={
        <section className="space-y-6 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">AI 오늘의 운세란?</h2>
            <p>생년월일을 입력하면 AI가 오늘의 운세를 총운, 재운, 애정운, 건강운 네 카테고리로 나누어 알려드립니다. 매일 다른 운세를 확인할 수 있으며, 행운의 숫자와 색상도 함께 제공합니다. 재미로 보는 운세이니 가볍게 즐겨주세요. 전통 사주와 달리 AI가 일자별로 다양한 해석을 생성하므로 같은 생년월일이라도 매일 결과가 달라집니다. 출근길 5초, 점심시간 짬, 자기 전 한 컷처럼 가벼운 일상 루틴으로 활용하기 좋습니다.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">사용 가이드 (4단계)</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li><strong>생년월일 입력</strong>: 만 나이 산출과 운세 시드(seed) 계산에 사용됩니다. 양력 기준 입력을 권장하며, 음력 사용자는 양력으로 변환해 입력해 주세요.</li>
              <li><strong>이름 입력 (선택)</strong>: 한글 또는 영문 이름을 입력하면 운세 해석에 본인의 이름이 자연스럽게 녹아듭니다. 입력하지 않아도 운세는 정상 생성되며, 이름은 서버에 저장되지 않습니다.</li>
              <li><strong>"오늘의 운세 보기" 클릭</strong>: AI가 약 3~5초 안에 총운·재운·애정운·건강운 + 행운의 숫자·색상 + 한 줄 조언을 생성합니다. 같은 날 여러 번 보면 같은 결과가 표시될 수 있습니다.</li>
              <li><strong>결과 활용</strong>: 점수와 한 줄 조언을 보고 오늘의 마음가짐을 잡거나, 행운의 색상을 그날 옷·소품에 살짝 반영해 보세요. 카카오톡으로 친구에게 캡처를 공유해 함께 운세를 비교하면 더 재미있습니다.</li>
            </ol>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">4가지 운세 카테고리</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>총운</strong>: 오늘 하루의 전반적인 흐름. 컨디션·인간관계·작은 결정의 운을 종합한 운세입니다.</li>
              <li><strong>재운</strong>: 금전 운. 지출·투자·복권·보너스·예상 외 수입이 있을 가능성을 안내합니다. 큰 결정은 참고만 하시고 본인 판단을 우선하세요.</li>
              <li><strong>애정운</strong>: 연인·배우자·짝사랑·친구 관계 운. 솔로는 이성과의 만남 가능성, 커플은 분위기·갈등 가능성을 안내합니다.</li>
              <li><strong>건강운</strong>: 컨디션·체력·작은 부상 가능성. 평소 약한 부위에 신경 쓰라는 식의 가벼운 주의 안내가 포함됩니다.</li>
            </ul>
          </div>

          <details className="group">
            <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">자주 묻는 질문</summary>
            <div className="mt-3 space-y-3">
              <div>
                <p className="font-medium">전통 사주와 무엇이 다른가요?</p>
                <p>전통 사주는 태어난 연·월·일·시 4기둥(四柱)과 음양·오행 이론을 기반으로 해석합니다. 본 도구는 사주 학습 데이터를 참고한 AI가 매일 다른 해석을 생성하는 방식이라, 정밀한 사주 풀이를 원하면 전문 명리학자에게 별도 상담받기를 권장합니다. 일상의 가벼운 운세 루틴으로 활용하기에 적합합니다.</p>
              </div>
              <div>
                <p className="font-medium">같은 생년월일인데 매일 결과가 다른 이유는?</p>
                <p>오늘 날짜가 운세 시드의 일부로 사용되기 때문입니다. 즉, 같은 생년월일이라도 5월 7일과 5월 8일의 운세는 다른 해석으로 생성됩니다. 자정이 지나면 새로운 운세가 갱신됩니다.</p>
              </div>
              <div>
                <p className="font-medium">왜 같은 날 다시 봐도 결과가 같을 때가 있나요?</p>
                <p>같은 사용자(생년월일+이름)가 하루 안에 여러 번 조회하면 결과가 일관되게 보일 수 있도록 동작합니다. 매일 한 번씩 보는 게 가장 자연스러운 사용 방식입니다.</p>
              </div>
              <div>
                <p className="font-medium">결과를 친구와 공유할 수 있나요?</p>
                <p>화면 캡처로 카카오톡이나 SNS에 공유하면 됩니다. 입력한 생년월일·이름은 서버에 저장되지 않으므로 캡처에 보이는 정보 외에는 노출되지 않습니다.</p>
              </div>
              <div>
                <p className="font-medium">결과를 보고 큰 결정을 내려도 되나요?</p>
                <p>아닙니다. 본 도구는 재미용 운세이며, 투자·이직·연애 같은 중요한 결정은 본인의 판단과 전문가 상담을 우선해 주세요. 행운의 숫자·색상 정도를 일상 소품에 가볍게 반영하는 정도로만 활용하시는 게 가장 잘 맞는 사용법입니다.</p>
              </div>
            </div>
          </details>

          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">함께 쓰면 좋은 도구</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>이름 궁합 테스트</strong>: 좋아하는 사람·친구와의 궁합 점수를 운세와 함께 확인</li>
              <li><strong>MBTI 궁합</strong>: 16가지 성격 유형 조합으로 인간관계 케미를 분석</li>
              <li><strong>나이 계산기</strong>: 만 나이·한국 나이·띠를 한 번에 — 띠별 운세와 함께 활용</li>
              <li><strong>D-day 계산기</strong>: 오늘 운세와 함께 중요한 일정까지 남은 일수 체크</li>
            </ul>
          </div>
        </section>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">생년월일</label>
            <input
              type="date"
              value={birthDate}
              onChange={e => setBirthDate(e.target.value)}
              max={today}
              className="w-full min-w-0 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">이름 (선택)</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="홍길동"
              maxLength={20}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!canCalc || loading}
          className={`w-full py-3 rounded-xl font-bold text-lg transition-all ${
            canCalc && !loading
              ? 'bg-primary text-white hover:bg-primary/90 shadow-md'
              : 'bg-gray-200 dark:bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              운세 보는 중...
            </span>
          ) : '오늘의 운세 보기 🔮'}
        </button>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* 점수 */}
            <div className="bg-primary/5 dark:bg-primary/20 rounded-xl p-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">오늘의 운세 점수</p>
              <p className={`text-5xl font-bold font-heading ${getScoreColor(result.score)}`}>
                {result.score}점
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{result.advice}</p>
            </div>

            {/* 행운 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">행운의 숫자</p>
                <p className="text-2xl font-bold text-primary">{result.luckyNumber}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">행운의 색상</p>
                <p className="text-2xl font-bold text-primary">{result.luckyColor}</p>
              </div>
            </div>

            {/* 카테고리별 운세 */}
            <div className="space-y-3">
              {fortuneCategories.map((cat) => (
                <div key={cat.label} className={`${cat.color} rounded-xl p-4`}>
                  <p className="font-medium text-gray-900 dark:text-white mb-1">
                    {cat.emoji} {cat.label}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{cat.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
