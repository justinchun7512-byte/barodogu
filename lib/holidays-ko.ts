/**
 * 한국 공휴일 오버라이드 데이터
 *
 * Nager.Date API가 커버하지 못하는 한국 특화 공휴일을 보완한다.
 * 포함 대상:
 *   - 근로자의 날 (2026년부터 법정공휴일)
 *   - 제헌절 (2026년부터 공휴일 재지정)
 *   - 임기만료에 따른 선거일 (공직선거법 + 관공서 공휴일에 관한 규정 제2조 제10호)
 *   - 대체공휴일 (3·1절, 어린이날, 부처님오신날, 광복절, 개천절, 한글날, 성탄절, 설·추석 연휴)
 *
 * ⚠️ 매년 1월 정부 관보 및 행정안전부 공지 확인 후 수동 업데이트 필요.
 */

export interface HolidayBase {
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

export interface KoreanHolidayOverride {
  date: string;
  localName: string;
  name: string;
  kind: 'public' | 'substitute';
}

export const KR_OVERRIDES: Record<number, KoreanHolidayOverride[]> = {
  2025: [
    { date: '2025-03-03', localName: '3·1절 대체공휴일', name: 'March 1st Movement Day (Substitute)', kind: 'substitute' },
    { date: '2025-05-06', localName: '어린이날·부처님오신날 대체공휴일', name: "Children's Day (Substitute)", kind: 'substitute' },
    { date: '2025-10-08', localName: '추석 연휴 대체공휴일', name: 'Chuseok (Substitute)', kind: 'substitute' },
  ],
  2026: [
    { date: '2026-03-02', localName: '3·1절 대체공휴일', name: 'March 1st Movement Day (Substitute)', kind: 'substitute' },
    { date: '2026-05-01', localName: '근로자의 날', name: 'Labor Day', kind: 'public' },
    { date: '2026-05-25', localName: '부처님오신날 대체공휴일', name: "Buddha's Birthday (Substitute)", kind: 'substitute' },
    { date: '2026-06-03', localName: '제9회 전국동시지방선거일', name: 'Local Election Day', kind: 'public' },
    { date: '2026-07-17', localName: '제헌절', name: 'Constitution Day', kind: 'public' },
    { date: '2026-08-17', localName: '광복절 대체공휴일', name: 'Liberation Day (Substitute)', kind: 'substitute' },
    { date: '2026-10-05', localName: '개천절 대체공휴일', name: 'National Foundation Day (Substitute)', kind: 'substitute' },
  ],
  2027: [
    { date: '2027-05-01', localName: '근로자의 날', name: 'Labor Day', kind: 'public' },
    { date: '2027-07-17', localName: '제헌절', name: 'Constitution Day', kind: 'public' },
    { date: '2027-08-16', localName: '광복절 대체공휴일', name: 'Liberation Day (Substitute)', kind: 'substitute' },
    { date: '2027-10-04', localName: '개천절 대체공휴일', name: 'National Foundation Day (Substitute)', kind: 'substitute' },
    { date: '2027-10-11', localName: '한글날 대체공휴일', name: 'Hangul Day (Substitute)', kind: 'substitute' },
  ],
};

export function mergeKoreanHolidays(year: number, base: HolidayBase[]): HolidayBase[] {
  const overrides = KR_OVERRIDES[year] || [];
  const existing = new Set(base.map(h => `${h.date}|${h.localName}`));

  const extra: HolidayBase[] = overrides
    .filter(o => !existing.has(`${o.date}|${o.localName}`))
    .map(o => ({
      date: o.date,
      localName: o.localName,
      name: o.name,
      countryCode: 'KR',
      fixed: false,
      global: true,
      counties: null,
      launchYear: null,
      types: [o.kind === 'substitute' ? 'Substitute' : 'Public'],
    }));

  return [...base, ...extra].sort((a, b) => a.date.localeCompare(b.date));
}

export function getHolidayKind(h: HolidayBase): 'public' | 'substitute' {
  if (h.types.includes('Substitute') || h.localName.includes('대체')) return 'substitute';
  return 'public';
}
