'use client';

import { useState, useEffect, useMemo } from 'react';
import { getToolById } from '@/lib/tools';
import { ToolLayout } from '@/components/layout/ToolLayout';

const tool = getToolById('holiday-calendar')!;

export interface Holiday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
  counties: string[] | null;
  launchYear: number | null;
  types: string[];
}

interface HolidayCalendarPageProps {
  initialYear: number;
  initialHolidays: Holiday[];
}

const MONTH_LABELS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

function formatDate(iso: string): { month: number; day: number; weekday: string } {
  const d = new Date(iso + 'T00:00:00');
  return {
    month: d.getMonth() + 1,
    day: d.getDate(),
    weekday: DAY_LABELS[d.getDay()],
  };
}

function groupByMonth(holidays: Holiday[]): Record<number, Holiday[]> {
  const groups: Record<number, Holiday[]> = {};
  for (const h of holidays) {
    const { month } = formatDate(h.date);
    if (!groups[month]) groups[month] = [];
    groups[month].push(h);
  }
  return groups;
}

function getNextHoliday(holidays: Holiday[]): { holiday: Holiday; daysLeft: number } | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = holidays
    .map(h => {
      const d = new Date(h.date + 'T00:00:00');
      return { holiday: h, daysLeft: Math.round((d.getTime() - today.getTime()) / 86400000) };
    })
    .filter(x => x.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft);
  return upcoming[0] || null;
}

function isWeekendIso(iso: string): boolean {
  const day = new Date(iso + 'T00:00:00').getDay();
  return day === 0 || day === 6;
}

function isSubstitute(h: Holiday): boolean {
  return h.types?.includes('Substitute') || h.localName.includes('대체');
}

export default function HolidayCalendarPage({ initialYear, initialHolidays }: HolidayCalendarPageProps) {
  const [year, setYear] = useState(initialYear);
  const [holidays, setHolidays] = useState<Holiday[]>(initialHolidays);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const yearOptions = useMemo(() => {
    const thisYear = new Date().getFullYear();
    return [thisYear - 1, thisYear, thisYear + 1, thisYear + 2];
  }, []);

  useEffect(() => {
    if (year === initialYear) {
      setHolidays(initialHolidays);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/holidays?year=${year}`)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        if (data.error) {
          setError(data.error);
          setHolidays([]);
        } else {
          setHolidays(data.holidays || []);
        }
      })
      .catch(() => {
        if (!cancelled) setError('공휴일 정보를 불러오지 못했습니다.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [year, initialYear, initialHolidays]);

  const grouped = useMemo(() => groupByMonth(holidays), [holidays]);
  const nextHoliday = useMemo(() => (year >= new Date().getFullYear() ? getNextHoliday(holidays) : null), [holidays, year]);
  const weekdayCount = holidays.filter(h => !isWeekendIso(h.date)).length;

  return (
    <ToolLayout
      tool={tool}
      seoContent={
        <section className="space-y-6 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{year}년 대한민국 공휴일 안내</h2>
            <p>
              대한민국의 법정공휴일은 「관공서의 공휴일에 관한 규정」에 따라 지정된 날로, 국가 기관과 대부분의 민간 기업이 휴무하는 날입니다.
              {year}년에는 총 <strong>{holidays.length}일</strong>의 공휴일이 있으며, 그 중 <strong>{weekdayCount}일</strong>이 평일(월~금)에 해당해 실질 휴무일로 활용됩니다.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">법정공휴일과 대체공휴일의 차이</h3>
            <p className="mb-2">
              <strong>법정공휴일</strong>은 달력에 빨갛게 표시되는 고정 또는 음력 기반 휴일입니다. 1월 1일 신정, 3월 1일 삼일절, 5월 5일 어린이날, 8월 15일 광복절, 10월 3일 개천절, 10월 9일 한글날, 12월 25일 성탄절과 음력으로 정해지는 설날·부처님오신날·추석 등이 해당합니다.
            </p>
            <p>
              <strong>대체공휴일</strong>은 법정공휴일이 토요일·일요일 또는 다른 공휴일과 겹칠 때 그 다음 평일을 휴일로 지정하는 제도입니다.
              2021년부터 설날·추석·어린이날·현충일 등 주요 공휴일에 대해 확대 적용되어, 연간 실질 휴무일이 과거보다 평균 2~4일 늘어났습니다.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">연휴 계획과 D-day 활용</h3>
            <p>
              공휴일이 금요일이나 월요일에 위치하면 주말과 연결되어 3일 이상의 연휴가 만들어집니다.
              여행이나 휴식을 계획할 때는 다음 공휴일까지 남은 일수를 미리 확인해두면 항공권·숙박 예약 타이밍을 잡는 데 유리합니다.
              바로도구의 <a href="/tools/dday-calculator" className="text-primary underline">D-day 계산기</a>로 특정 공휴일까지 남은 일수를 계산하거나,{' '}
              <a href="/tools/annual-leave" className="text-primary underline">연차 계산기</a>와 함께 사용해 연차를 효율적으로 배치해보세요.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">자주 묻는 질문</h3>
            <dl className="space-y-3">
              <div>
                <dt className="font-medium text-gray-900 dark:text-white">Q. 공휴일 데이터는 얼마나 자주 갱신되나요?</dt>
                <dd className="mt-1">하루 1회 자동 갱신됩니다. 정부가 임시공휴일을 새로 지정한 경우 반영까지 시차가 있을 수 있으며, 최종 확인은 관보나 행정안전부 공지를 권장합니다.</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900 dark:text-white">Q. 토요일에 겹친 공휴일은 대체공휴일이 생기나요?</dt>
                <dd className="mt-1">설날·추석·어린이날·3.1절·광복절·개천절·한글날·현충일은 토요일·일요일과 겹치면 다음 평일이 대체공휴일로 지정됩니다(2021~2022년 확대 적용). 성탄절과 부처님오신날은 일요일에 겹칠 때만 대체공휴일이 적용됩니다.</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900 dark:text-white">Q. 민간 기업도 공휴일에 반드시 쉬어야 하나요?</dt>
                <dd className="mt-1">2022년부터 5인 이상 민간 사업장은 관공서 공휴일을 유급 휴일로 보장해야 합니다. 5인 미만 사업장은 취업규칙·근로계약에 따라 달라질 수 있으니 계약서를 확인하세요.</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900 dark:text-white">Q. 2027년, 2028년 공휴일도 확인할 수 있나요?</dt>
                <dd className="mt-1">위 연도 선택에서 내년·내후년을 선택하면 음력 기반 공휴일까지 자동 계산된 예상 일정을 볼 수 있습니다. 다만 임시공휴일은 정부 지정 시점에 반영됩니다.</dd>
              </div>
            </dl>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">{year}년 전체 공휴일 목록</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="py-2 pr-4 font-medium">날짜</th>
                    <th className="py-2 pr-4 font-medium">요일</th>
                    <th className="py-2 pr-4 font-medium">공휴일</th>
                    <th className="py-2 font-medium">구분</th>
                  </tr>
                </thead>
                <tbody>
                  {holidays.map(h => {
                    const { month, day, weekday } = formatDate(h.date);
                    const isWeekend = weekday === '일' || weekday === '토';
                    const sub = isSubstitute(h);
                    return (
                      <tr key={h.date + h.name} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-2 pr-4 whitespace-nowrap">{month}월 {day}일</td>
                        <td className={`py-2 pr-4 ${weekday === '일' ? 'text-red-500' : weekday === '토' ? 'text-blue-500' : ''}`}>{weekday}</td>
                        <td className="py-2 pr-4">
                          {h.localName}
                          {sub && <span className="ml-1 inline-block px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] rounded">대체</span>}
                        </td>
                        <td className="py-2 text-xs text-gray-500">{isWeekend ? '주말 겹침' : '평일'}</td>
                      </tr>
                    );
                  })}
                  {holidays.length === 0 && (
                    <tr><td colSpan={4} className="py-4 text-center text-gray-500">공휴일 데이터가 없습니다.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      }
    >
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <label htmlFor="year-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">연도</label>
          <select
            id="year-select"
            value={year}
            onChange={e => setYear(Number(e.target.value))}
            className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {yearOptions.map(y => (
              <option key={y} value={y}>{y}년</option>
            ))}
          </select>
          {loading && <span className="text-sm text-gray-500">불러오는 중...</span>}
          {error && <span className="text-sm text-red-500">{error}</span>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-primary/5 dark:bg-primary/20 rounded-xl p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">{year}년 총 공휴일</p>
            <p className="text-2xl font-bold font-heading text-gray-900 dark:text-white mt-1">{holidays.length}일</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">평일 공휴일</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{weekdayCount}일</p>
            <p className="text-[11px] text-gray-400 mt-0.5">주말 겹침 {holidays.length - weekdayCount}일 제외</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">다음 공휴일</p>
            {nextHoliday ? (
              <>
                <p className="text-base font-bold text-gray-900 dark:text-white mt-1 line-clamp-1">{nextHoliday.holiday.localName}</p>
                <p className="text-sm text-primary font-medium mt-0.5">{nextHoliday.daysLeft === 0 ? '오늘!' : `D-${nextHoliday.daysLeft}`}</p>
              </>
            ) : (
              <p className="text-sm text-gray-500 mt-2">올해 남은 공휴일 없음</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MONTH_LABELS.map((label, idx) => {
            const month = idx + 1;
            const monthHolidays = grouped[month] || [];
            return (
              <div
                key={month}
                className={`rounded-xl border p-4 ${monthHolidays.length > 0 ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700' : 'bg-gray-50 dark:bg-gray-800/40 border-gray-100 dark:border-gray-800'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-900 dark:text-white">{label}</h3>
                  {monthHolidays.length > 0 && (
                    <span className="text-xs text-primary font-medium">{monthHolidays.length}일</span>
                  )}
                </div>
                {monthHolidays.length === 0 ? (
                  <p className="text-xs text-gray-400">공휴일 없음</p>
                ) : (
                  <ul className="space-y-1.5">
                    {monthHolidays.map(h => {
                      const { day, weekday } = formatDate(h.date);
                      const sub = isSubstitute(h);
                      return (
                        <li key={h.date + h.name} className="text-sm flex items-start gap-2">
                          <span className={`inline-flex items-center justify-center min-w-[42px] px-1.5 py-0.5 rounded-md text-xs font-medium ${sub ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' : 'bg-primary/10 text-primary'}`}>
                            {day}일 {weekday}
                          </span>
                          <span className="text-gray-700 dark:text-gray-300 leading-5">
                            {h.localName}
                            {sub && <span className="ml-1 text-[10px] text-amber-600 dark:text-amber-400 font-medium">대체</span>}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </ToolLayout>
  );
}
