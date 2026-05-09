'use client';

import { useState } from 'react';
import { getToolById } from '@/lib/tools';
import { ToolLayout } from '@/components/layout/ToolLayout';

const tool = getToolById('company-compatibility')!;

interface CompatResult {
  score: number;
  grade: string;
  summary: string;
  analysis: {
    culture: string;
    growth: string;
    workStyle: string;
  };
  strengths: string[];
  cautions: string[];
  advice: string;
}

function getGradeColor(grade: string): string {
  switch (grade) {
    case '천생직장': return 'text-red-500';
    case '좋은 궁합': return 'text-pink-500';
    case '보통': return 'text-yellow-500';
    default: return 'text-orange-500';
  }
}

function getGradeEmoji(grade: string): string {
  switch (grade) {
    case '천생직장': return '💞';
    case '좋은 궁합': return '💕';
    case '보통': return '💛';
    default: return '🧡';
  }
}

const MBTI_TYPES = [
  'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
  'ISTP', 'ISFP', 'INFP', 'INTP',
  'ESTP', 'ESFP', 'ENFP', 'ENTP',
  'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ',
] as const;

type MbtiType = typeof MBTI_TYPES[number];

export default function CompanyCompatibilityPage() {
  const [companyName, setCompanyName] = useState('');
  const [mbti, setMbti] = useState<MbtiType | ''>('');
  const [career, setCareer] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompatResult | null>(null);
  const [error, setError] = useState('');

  const canCalc = companyName.trim().length >= 1 && mbti !== '';

  const handleSubmit = async () => {
    if (!canCalc || loading) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/company-compatibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: companyName.trim(),
          personality: `MBTI: ${mbti}`,
          career: career.trim() || undefined,
        }),
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

  return (
    <ToolLayout
      tool={tool}
      disclaimer="이 도구는 AI의 일반적인 분석이며, 실제 기업의 내부 문화와 다를 수 있습니다. 참고용으로만 활용하세요."
      seoContent={
        <section className="space-y-6 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">나와 기업의 궁합이란?</h2>
            <p>내 성향, 경력, 업무 스타일과 관심 있는 기업의 조직문화를 AI가 분석하여 궁합 점수를 알려드립니다. 취업이나 이직을 고민할 때 참고할 수 있는 도구입니다. 조직문화 적합도, 성장 가능성, 업무 스타일 매칭을 종합적으로 분석하지만 실제 기업 내부 문화와 다를 수 있으므로 최종 판단은 면접 경험, 채용공고, 현직자 정보와 함께 보세요.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">취업 준비에 활용하는 방법</h2>
            <p>궁합 점수가 높게 나온 항목은 자기소개서와 면접의 지원 동기 소재로 활용할 수 있습니다. 예를 들어 자율성, 빠른 실행, 데이터 기반 의사결정이 강점으로 나왔다면 본인의 실제 경험 중 그 키워드와 맞는 사례를 골라 지원 동기에 연결하세요. 반대로 낮게 나온 항목은 면접에서 받을 수 있는 우려 질문으로 보고 미리 답변을 준비하면 좋습니다. 궁합 점수는 합격 여부를 예측하는 도구가 아니라, 본인의 지원 논리를 정리하는 보조 도구입니다.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">이직 전에 확인할 체크포인트</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>현재 회사에서 불만족한 지점이 새 회사에서도 반복될 가능성이 있는지 확인</li>
              <li>연봉 인상보다 조직문화·업무 방식이 더 큰 스트레스 요인인지 점검</li>
              <li>스타트업, 대기업, 외국계처럼 조직 규모별 차이를 결과 해석에 반영</li>
              <li>궁합 결과를 현직자 인터뷰, 잡플래닛, 채용공고 문장과 교차 확인</li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">주요 기업 컬처핏 한눈에 보기 (예시)</h2>
            <p className="mb-3">대표적인 한국 기업의 알려진 조직문화 특징입니다. 본인의 성향과 비교해 어느 컬처가 잘 맞을지 미리 점검하세요. (잡플래닛·블라인드 공개 정보 + 대표 채용공고 키워드 기준)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                <p className="font-bold text-gray-900 dark:text-white mb-1">🟦 삼성전자</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">위계 명확·체계적 프로세스·장기 안정성. 보수적·문서 기반 의사결정. ISTJ·ESTJ 유형이 적응 빠름.</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                <p className="font-bold text-gray-900 dark:text-white mb-1">🟨 카카오</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">수평 호칭·자율 출퇴근·빠른 실행. 모호함 감내가 필요한 환경. ENFP·ENTP·INFJ가 잘 맞음.</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                <p className="font-bold text-gray-900 dark:text-white mb-1">🟩 네이버</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">기술 중심·데이터 기반 의사결정·안정 + 자율 균형. INTJ·INTP·ENTJ에게 우호적.</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                <p className="font-bold text-gray-900 dark:text-white mb-1">🟥 쿠팡</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">초고강도·성과 중심·빠른 의사결정. 실행력 + 회복탄력성 필수. ESTJ·ENTJ·ENTP가 살아남기 쉬움.</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                <p className="font-bold text-gray-900 dark:text-white mb-1">🟧 당근마켓</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">미션 중심·자율과 책임·문서 기반 비동기 협업. INTJ·INFJ·ENFJ에게 잘 맞음.</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                <p className="font-bold text-gray-900 dark:text-white mb-1">🟪 토스</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">개인 오너십·짧은 리뷰 사이클·빠른 출시. 성과 압력 강함. ENTJ·ESTJ·ENTP가 두각.</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                <p className="font-bold text-gray-900 dark:text-white mb-1">🟫 LG전자</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">안정적 위계·연구개발 중심·중장기 프로젝트. ISTJ·ISFJ·INTJ가 편안.</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                <p className="font-bold text-gray-900 dark:text-white mb-1">🟦 SK하이닉스</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">기술 깊이·교대 근무·체계적 R&D. ISTJ·INTP·ISTP가 강함.</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">※ 위 분류는 공개 자료 기반 일반화이며 부서·시기에 따라 다릅니다. 본 도구로 더 정밀한 분석을 받아보세요.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">대기업·스타트업·외국계 컬처핏 차이</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>대기업</strong>: 체계와 안정성. 의사결정 단계가 많고 보고 문화가 강함. 조직력·인내심 중요.</li>
              <li><strong>중견기업</strong>: 절충형. 빠른 의사결정 + 일정 수준의 체계. 멀티태스킹 능력 요구.</li>
              <li><strong>유니콘 스타트업</strong>: 자율과 책임. 빠른 학습·모호함 감내 필수. 성과 압박 상존.</li>
              <li><strong>외국계</strong>: 직무 명확성·수평 문화. 영어 커뮤니케이션·자기주도성·결과 책임이 핵심.</li>
            </ul>
          </div>

          <details className="group">
            <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">자주 묻는 질문</summary>
            <div className="mt-3 space-y-3">
              <div><p className="font-medium">궁합이 낮으면 지원하지 않는 게 좋나요?</p><p>아닙니다. 낮은 항목은 준비해야 할 리스크로 보면 됩니다. 면접에서 적응 전략을 설명할 수 있으면 오히려 강점이 됩니다.</p></div>
              <div><p className="font-medium">MBTI만으로 분석해도 충분한가요?</p><p>MBTI는 참고값입니다. 직무, 경력, 선호하는 협업 방식까지 입력할수록 더 실용적인 결과를 얻을 수 있습니다.</p></div>
              <div><p className="font-medium">입력 정보가 저장되나요?</p><p>회원가입 없이 사용할 수 있으며, 입력값은 분석 요청에만 사용됩니다. 민감한 개인정보는 입력하지 않는 것을 권장합니다.</p></div>
            </div>
          </details>
        </section>
      }
    >
      <div className="space-y-6">
        {/* 기업명 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">관심 기업</label>
          <input
            type="text"
            value={companyName}
            onChange={e => setCompanyName(e.target.value)}
            placeholder="예: 네이버, 삼성전자, 당근마켓"
            maxLength={50}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* MBTI 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">나의 MBTI</label>
          <div className="grid grid-cols-4 gap-1.5">
            {MBTI_TYPES.map(t => (
              <button
                key={t}
                onClick={() => setMbti(t)}
                className={`py-2 px-1 rounded-lg text-xs font-bold transition-all ${
                  mbti === t
                    ? 'bg-primary text-white shadow-md scale-105'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* 직무/경력 (선택) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">직무/경력 (선택)</label>
          <input
            type="text"
            value={career}
            onChange={e => setCareer(e.target.value)}
            placeholder="예: 프론트엔드 개발 3년, 마케팅 신입"
            maxLength={100}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
          />
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
              분석 중...
            </span>
          ) : '궁합 분석하기 🤝'}
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
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                나 x {companyName}
              </p>
              <p className="text-4xl mb-1">{getGradeEmoji(result.grade)}</p>
              <p className={`text-5xl font-bold font-heading ${getGradeColor(result.grade)}`}>
                {result.score}점
              </p>
              <p className={`text-lg font-semibold mt-1 ${getGradeColor(result.grade)}`}>{result.grade}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{result.summary}</p>
            </div>

            {/* 궁합 바 */}
            <div className="relative h-4 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-400 to-primary transition-all duration-1000"
                style={{ width: `${result.score}%` }}
              />
            </div>

            {/* 상세 분석 */}
            <div className="space-y-3">
              {[
                { label: '조직문화 적합도', emoji: '🏢', text: result.analysis.culture },
                { label: '성장 가능성', emoji: '📈', text: result.analysis.growth },
                { label: '업무 스타일', emoji: '💼', text: result.analysis.workStyle },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <p className="font-medium text-gray-900 dark:text-white mb-1">
                    {item.emoji} {item.label}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{item.text}</p>
                </div>
              ))}
            </div>

            {/* 강점/주의점 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                <p className="font-medium text-green-700 dark:text-green-400 mb-2">강점</p>
                <ul className="space-y-1.5 text-sm text-gray-600 dark:text-gray-300">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="flex gap-1.5"><span className="text-green-500 shrink-0">+</span>{s}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4">
                <p className="font-medium text-orange-700 dark:text-orange-400 mb-2">주의점</p>
                <ul className="space-y-1.5 text-sm text-gray-600 dark:text-gray-300">
                  {result.cautions.map((c, i) => (
                    <li key={i} className="flex gap-1.5"><span className="text-orange-500 shrink-0">!</span>{c}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 조언 */}
            <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-4">
              <p className="font-medium text-gray-900 dark:text-white mb-1">💡 조언</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{result.advice}</p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
