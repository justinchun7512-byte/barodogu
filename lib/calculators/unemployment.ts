export interface UnemploymentResult {
  dailyBenefit: number;
  benefitDays: number;
  totalBenefit: number;
  monthlyEstimate: number;
}

const DAILY_CAP = 66_000;
const DAILY_FLOOR_RATE = 0.8;
const MIN_WAGE_2026 = 10_030;

function getBenefitDays(age: number, workYears: number): number {
  // 2026년 기준 실업급여 소정급여일수 테이블
  if (workYears < 1) return 120;
  if (age < 30) {
    if (workYears < 3) return 120;
    if (workYears < 5) return 150;
    if (workYears < 10) return 180;
    return 210;
  }
  if (age < 50) {
    if (workYears < 3) return 150;
    if (workYears < 5) return 180;
    if (workYears < 10) return 210;
    return 240;
  }
  // 50세 이상
  if (workYears < 3) return 180;
  if (workYears < 5) return 210;
  if (workYears < 10) return 240;
  return 270;
}

export function calculateUnemployment(
  age: number,
  workMonths: number,
  avgMonthlySalary: number
): UnemploymentResult {
  const avgDailySalary = avgMonthlySalary / 30;
  let dailyBenefit = avgDailySalary * 0.6;

  dailyBenefit = Math.min(dailyBenefit, DAILY_CAP);
  const dailyFloor = MIN_WAGE_2026 * DAILY_FLOOR_RATE * 8;
  dailyBenefit = Math.max(dailyBenefit, dailyFloor);

  const workYears = workMonths / 12;
  const benefitDays = getBenefitDays(age, workYears);
  const totalBenefit = dailyBenefit * benefitDays;
  const monthlyEstimate = dailyBenefit * 30;

  return { dailyBenefit, benefitDays, totalBenefit, monthlyEstimate };
}
