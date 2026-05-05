'use client';

import { useState, useEffect } from 'react';
import { getToolById } from '@/lib/tools';
import { ToolLayout } from '@/components/layout/ToolLayout';

const tool = getToolById('dday-calculator')!;

function calculateDday(targetDate: string) {
  const target = new Date(targetDate + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffMs = target.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  const absDays = Math.abs(diffDays);
  const weeks = Math.floor(absDays / 7);
  const remainDays = absDays % 7;
  const months = Math.floor(absDays / 30);
  const years = Math.floor(absDays / 365);

  let label: string;
  let color: string;
  if (diffDays > 0) {
    label = `D-${diffDays}`;
    color = 'text-blue-500';
  } else if (diffDays < 0) {
    label = `D+${Math.abs(diffDays)}`;
    color = 'text-orange-500';
  } else {
    label = 'D-Day!';
    color = 'text-red-500';
  }

  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][target.getDay()];

  return { diffDays, absDays, weeks, remainDays, months, years, label, color, dayOfWeek };
}

export default function DdayCalculatorPage() {
  const [targetDate, setTargetDate] = useState('');
  const [memo, setMemo] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('date')) setTargetDate(params.get('date')!);
    if (params.get('memo')) setMemo(params.get('memo')!);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded || !targetDate) return;
    const url = new URL(window.location.href);
    url.searchParams.set('date', targetDate);
    if (memo) url.searchParams.set('memo', memo);
    else url.searchParams.delete('memo');
    window.history.replaceState({}, '', url.pathname + url.search);
  }, [targetDate, memo, loaded]);

  const result = targetDate ? calculateDday(targetDate) : null;

  return (
    <ToolLayout
      tool={tool}
      seoContent={
        <section className="space-y-6 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">D-day 계산기란?</h2>
            <p>특정 날짜까지 남은 일수(D-day) 또는 지난 일수(D+day)를 계산하는 도구입니다. 시험일, 기념일, 여행, 면접, 출산 예정일, 휴학·복학일, 군 전역일까지 모든 일정의 잔여 일수를 한 번에 확인할 수 있어 일정 관리와 동기 부여에 도움이 됩니다. 별도의 회원가입이나 앱 설치 없이 웹 브라우저에서 바로 사용할 수 있고, 입력한 날짜와 메모는 URL에 저장되므로 즐겨찾기에 등록해 두면 매번 다시 입력하지 않아도 됩니다.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">D-day와 D+day의 차이</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>D-day</strong>: 미래의 날짜까지 남은 일수. 예) 시험까지 D-30 = 시험일이 30일 남음</li>
              <li><strong>D+day</strong>: 과거의 날짜로부터 지난 일수. 예) 결혼기념일 D+365 = 결혼한 지 1년 지남</li>
              <li><strong>D-Day</strong>: 입력 날짜가 오늘과 같을 때 표시 (당일)</li>
            </ul>
            <p className="mt-2">"D"는 군사 작전에서 작전 개시일을 가리키는 영어 약어 "Day"에서 유래했습니다. 1944년 노르망디 상륙 작전(D-Day)에서 대중화되어 한국에서는 시험·이벤트 카운트다운 표현으로 자리 잡았습니다.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">사용 가이드 (5단계)</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li><strong>목표 날짜 입력</strong>: 시험일·기념일·여행 출발일 등 기준이 될 날짜를 선택합니다. 과거 날짜를 넣으면 자동으로 D+day로 계산됩니다.</li>
              <li><strong>메모 입력 (선택)</strong>: "토익 시험", "결혼기념일", "전역일"처럼 무엇을 위한 D-day인지 적어 두면 결과 화면에서도 한눈에 확인할 수 있습니다. 메모는 URL에 함께 저장되어 즐겨찾기로 다시 열어도 그대로 표시됩니다.</li>
              <li><strong>결과 확인</strong>: D-day 라벨, 총 일수, 주 단위(주+남은 일수), 약 개월·약 년이 한 번에 표시됩니다. 장기 일정도 직관적으로 파악할 수 있습니다.</li>
              <li><strong>요일 활용</strong>: 결과 화면에 목표 날짜의 요일이 함께 표시됩니다. 평일·주말 여부에 따라 휴가·연차 사용 계획을 미리 세울 수 있습니다.</li>
              <li><strong>URL 공유</strong>: 계산된 결과 페이지의 URL을 복사하면 친구·가족·동료에게 같은 D-day 화면을 공유할 수 있습니다. 카카오톡·메신저로 보내거나 즐겨찾기로 저장해 매일 확인하세요.</li>
            </ol>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">활용 예시</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>수험생</strong>: 토익·수능·공무원 시험·자격증 시험까지 남은 일수 확인. 매일 같은 URL로 접속해 카운트다운 동기 부여</li>
              <li><strong>커플·부부</strong>: 만난 지 100일·1주년·결혼기념일까지 남은 일수, 또는 사귄 지 며칠째인지(D+day)</li>
              <li><strong>예비 부모</strong>: 출산 예정일까지 남은 일수. 임신 주차 계산과 함께 사용</li>
              <li><strong>구직자</strong>: 면접일·합격 발표일·입사일까지 D-day. 합격 발표일이 지났으면 D+day로 자동 전환</li>
              <li><strong>군인·예비역</strong>: 전역일까지 남은 일수, 또는 전역 후 지난 일수. 한국에서 D-day의 가장 흔한 용도 중 하나</li>
              <li><strong>여행자</strong>: 출국일까지 남은 일수, 여행 마감까지 며칠 남았는지</li>
              <li><strong>업무·프로젝트</strong>: 마감일·출시일·제안 마감까지 D-day. 캘린더와 함께 사용해 일정 관리</li>
            </ul>
          </div>

          <details className="group">
            <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">자주 묻는 질문</summary>
            <div className="mt-3 space-y-3">
              <div>
                <p className="font-medium">D-1은 내일인가요, 모레인가요?</p>
                <p>D-1은 <strong>"내일"</strong>입니다. 즉, 오늘로부터 1일 뒤. D-day가 0일을 의미하니까 D-1은 1일 남았다는 뜻이고, 곧 내일이 D-day입니다.</p>
              </div>
              <div>
                <p className="font-medium">시간(시·분)도 계산되나요?</p>
                <p>현재 도구는 일 단위까지만 계산합니다. 분 단위 카운트다운이 필요하면 다른 도구를 검색해 보세요. 다만 결혼식·면접·시험처럼 시간 정확도가 중요한 일정도 일 단위로 표시되면 충분한 경우가 많습니다.</p>
              </div>
              <div>
                <p className="font-medium">시간대(타임존)는 어떻게 처리되나요?</p>
                <p>이 도구는 사용자의 로컬 시간대(브라우저 기준)로 계산합니다. 한국에서 사용하면 KST(한국 표준시) 기준으로 자정에 D-day가 갱신됩니다. 해외 출장 중이거나 시간대를 옮겼다면 결과가 1일 차이 날 수 있으니 주의하세요.</p>
              </div>
              <div>
                <p className="font-medium">윤년·윤달은 자동으로 반영되나요?</p>
                <p>네, JavaScript의 Date 객체가 윤년·윤달·서머타임을 자동으로 처리하므로 정확하게 계산됩니다. 1, 2년 단위 장기 D-day도 안심하고 사용할 수 있습니다.</p>
              </div>
              <div>
                <p className="font-medium">"약 개월"과 "약 년"이 정확하지 않은 이유는?</p>
                <p>월·년 단위는 실제 달력 길이가 28~31일, 365~366일로 일정하지 않기 때문에 평균값(30일·365일)으로 환산합니다. 정확한 일수는 "총 일수" 항목을 참고하세요.</p>
              </div>
              <div>
                <p className="font-medium">데이터는 어디에 저장되나요?</p>
                <p>입력한 날짜·메모는 URL 쿼리 스트링(?date=...&memo=...)에 저장되며, 서버에는 전송되지 않습니다. 즉, 즐겨찾기에 추가하거나 URL을 복사해 공유할 수 있고, 개인 정보 노출 우려는 없습니다.</p>
              </div>
            </div>
          </details>

          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">함께 쓰면 좋은 도구</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>나이 계산기</strong>: 생년월일을 입력하면 만 나이·한국 나이·띠를 한 번에 확인</li>
              <li><strong>이름 궁합</strong>: 두 사람 이름으로 궁합 점수 — 기념일 D-day와 함께 활용</li>
              <li><strong>회사 궁합</strong>: 입사 예정 회사 이름과 본인 이름으로 궁합 점수, 입사일 D-day와 함께 활용</li>
              <li><strong>TDEE 계산기</strong>: 다이어트·운동 목표일 D-day와 함께 일일 칼로리 관리</li>
            </ul>
          </div>
        </section>
      }
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">목표 날짜</label>
          <input
            type="date"
            value={targetDate}
            onChange={e => setTargetDate(e.target.value)}
            className="w-full min-w-0 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">메모 (선택)</label>
          <input
            type="text"
            value={memo}
            onChange={e => setMemo(e.target.value)}
            placeholder="예: 토익 시험, 결혼기념일"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {result && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="bg-primary/5 dark:bg-primary/20 rounded-xl p-6 text-center">
              {memo && <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{memo}</p>}
              <p className={`text-5xl font-bold font-heading ${result.color}`}>
                {result.label}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {targetDate.replace(/-/g, '.')} ({result.dayOfWeek}요일)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">총 일수</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{result.absDays.toLocaleString()}일</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">주 단위</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {result.weeks}주{result.remainDays > 0 ? ` ${result.remainDays}일` : ''}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">약 개월</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{result.months}개월</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">약 년</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{result.years > 0 ? `${result.years}년` : '-'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
