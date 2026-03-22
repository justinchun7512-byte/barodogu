export interface WageResult {
  hourly: number;
  monthly: number;
  annual: number;
}

export const MIN_WAGE_2026 = 10_030;
export const MONTHLY_HOURS = 209; // 주 40시간 기준

export function convertWage(
  type: 'hourly' | 'monthly' | 'annual',
  amount: number
): WageResult {
  let hourly: number;

  switch (type) {
    case 'hourly':
      hourly = amount;
      break;
    case 'monthly':
      hourly = amount / MONTHLY_HOURS;
      break;
    case 'annual':
      hourly = amount / 12 / MONTHLY_HOURS;
      break;
  }

  return {
    hourly: Math.round(hourly),
    monthly: Math.round(hourly * MONTHLY_HOURS),
    annual: Math.round(hourly * MONTHLY_HOURS * 12),
  };
}
