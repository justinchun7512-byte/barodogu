export interface AnnualLeaveResult {
  totalLeave: number;
  monthsWorked: number;
  yearsWorked: number;
  breakdown: string;
}

export function calculateAnnualLeave(
  startDate: Date,
  referenceDate: Date = new Date()
): AnnualLeaveResult {
  const diffMs = referenceDate.getTime() - startDate.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const monthsWorked = Math.floor(totalDays / 30.44);
  const yearsWorked = totalDays / 365;

  let totalLeave: number;
  let breakdown: string;

  if (yearsWorked < 1) {
    // 1년 미만: 1개월 개근 시 1일
    totalLeave = Math.min(Math.floor(monthsWorked), 11);
    breakdown = `입사 ${monthsWorked}개월차: 월 1일씩 ${totalLeave}일 발생`;
  } else {
    // 1년 이상: 15일 기본 + 2년마다 1일 추가 (최대 25일)
    const fullYears = Math.floor(yearsWorked);
    const extraDays = Math.floor(Math.max(0, fullYears - 1) / 2);
    totalLeave = Math.min(15 + extraDays, 25);
    breakdown = `근속 ${fullYears}년: 기본 15일 + 추가 ${extraDays}일 = ${totalLeave}일`;
  }

  return { totalLeave, monthsWorked, yearsWorked, breakdown };
}
