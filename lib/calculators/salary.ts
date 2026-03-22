export interface SalaryResult {
  monthlyGross: number;
  pension: number;
  health: number;
  longterm: number;
  employment: number;
  incomeTax: number;
  localTax: number;
  totalDeduction: number;
  monthlyNet: number;
  yearlyNet: number;
}

const PENSION_RATE = 0.045;
const PENSION_CAP = 5900000;
const HEALTH_RATE = 0.03545;
const LONGTERM_RATE = 0.1295;
const EMPLOYMENT_RATE = 0.009;

function calculateIncomeTax(annualIncome: number): number {
  if (annualIncome <= 14_000_000) return annualIncome * 0.06;
  if (annualIncome <= 50_000_000) return 840_000 + (annualIncome - 14_000_000) * 0.15;
  if (annualIncome <= 88_000_000) return 6_240_000 + (annualIncome - 50_000_000) * 0.24;
  if (annualIncome <= 150_000_000) return 15_360_000 + (annualIncome - 88_000_000) * 0.35;
  if (annualIncome <= 300_000_000) return 37_060_000 + (annualIncome - 150_000_000) * 0.38;
  if (annualIncome <= 500_000_000) return 94_060_000 + (annualIncome - 300_000_000) * 0.40;
  if (annualIncome <= 1_000_000_000) return 174_060_000 + (annualIncome - 500_000_000) * 0.42;
  return 384_060_000 + (annualIncome - 1_000_000_000) * 0.45;
}

export function calculateSalary(annualSalaryManwon: number): SalaryResult {
  const annualSalary = annualSalaryManwon * 10_000;
  const monthlyGross = annualSalary / 12;

  const pensionBase = Math.min(monthlyGross, PENSION_CAP);
  const pension = pensionBase * PENSION_RATE;
  const health = monthlyGross * HEALTH_RATE;
  const longterm = health * LONGTERM_RATE;
  const employment = monthlyGross * EMPLOYMENT_RATE;

  const annualTax = calculateIncomeTax(annualSalary);
  const incomeTax = annualTax / 12;
  const localTax = incomeTax * 0.1;

  const totalDeduction = pension + health + longterm + employment + incomeTax + localTax;
  const monthlyNet = monthlyGross - totalDeduction;

  return {
    monthlyGross,
    pension,
    health,
    longterm,
    employment,
    incomeTax,
    localTax,
    totalDeduction,
    monthlyNet,
    yearlyNet: monthlyNet * 12,
  };
}
