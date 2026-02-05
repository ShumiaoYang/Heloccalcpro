// Mortgage Balance Calculator - Calculate remaining mortgage balance

export interface MortgageInput {
  initialAmount: number;
  startDate: Date;
  annualRate: number;
  termYears: number;
}

export interface MortgageResult {
  remainingBalance: number;
  monthsPassed: number;
  monthsRemaining: number;
  monthlyPayment: number;
  totalPaid: number;
  totalInterestPaid: number;
}

/**
 * Calculate monthly payment using standard amortization formula
 */
export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  termYears: number
): number {
  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = termYears * 12;

  if (monthlyRate === 0) {
    return principal / totalMonths;
  }

  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );
}

/**
 * Calculate months between two dates
 */
export function getMonthsBetween(startDate: Date, endDate: Date): number {
  const yearsDiff = endDate.getFullYear() - startDate.getFullYear();
  const monthsDiff = endDate.getMonth() - startDate.getMonth();
  return yearsDiff * 12 + monthsDiff;
}

/**
 * Calculate remaining balance after certain months
 */
export function calculateRemainingBalance(
  principal: number,
  monthlyRate: number,
  totalMonths: number,
  monthsPassed: number
): number {
  if (monthsPassed >= totalMonths) {
    return 0;
  }

  if (monthlyRate === 0) {
    return principal * (1 - monthsPassed / totalMonths);
  }

  // Remaining balance formula
  const numerator =
    Math.pow(1 + monthlyRate, totalMonths) -
    Math.pow(1 + monthlyRate, monthsPassed);
  const denominator = Math.pow(1 + monthlyRate, totalMonths) - 1;

  return principal * (numerator / denominator);
}

/**
 * Calculate complete mortgage details
 */
export function calculateMortgageBalance(input: MortgageInput): MortgageResult {
  const { initialAmount, startDate, annualRate, termYears } = input;

  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = termYears * 12;
  const monthsPassed = Math.max(0, getMonthsBetween(startDate, new Date()));
  const monthsRemaining = Math.max(0, totalMonths - monthsPassed);

  const monthlyPayment = calculateMonthlyPayment(
    initialAmount,
    annualRate,
    termYears
  );

  const remainingBalance = Math.round(
    calculateRemainingBalance(
      initialAmount,
      monthlyRate,
      totalMonths,
      monthsPassed
    )
  );

  const totalPaid = monthlyPayment * monthsPassed;
  const totalInterestPaid = totalPaid - (initialAmount - remainingBalance);

  return {
    remainingBalance,
    monthsPassed,
    monthsRemaining,
    monthlyPayment,
    totalPaid,
    totalInterestPaid,
  };
}

/**
 * Validate mortgage input
 */
export function validateMortgageInput(
  input: Partial<MortgageInput>
): string[] {
  const errors: string[] = [];

  if (!input.initialAmount || input.initialAmount <= 0) {
    errors.push('Initial mortgage amount must be greater than 0');
  }

  if (!input.startDate) {
    errors.push('Start date is required');
  } else if (input.startDate > new Date()) {
    errors.push('Start date cannot be in the future');
  }

  if (
    input.annualRate === undefined ||
    input.annualRate < 0 ||
    input.annualRate > 30
  ) {
    errors.push('Annual rate must be between 0 and 30');
  }

  if (!input.termYears || ![15, 20, 30].includes(input.termYears)) {
    errors.push('Term must be 15, 20, or 30 years');
  }

  return errors;
}
