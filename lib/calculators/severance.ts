export interface SeveranceResult {
  totalDays: number;
  totalYears: number;
  dailyWage: number;
  severance: number;
}

export function calculateSeverance(
  startDate: Date,
  endDate: Date,
  avgMonthlySalary: number
): SeveranceResult {
  const diffMs = endDate.getTime() - startDate.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalYears = totalDays / 365;
  const dailyWage = avgMonthlySalary / 30;
  const severance = dailyWage * 30 * totalYears;

  return { totalDays, totalYears, dailyWage, severance };
}
