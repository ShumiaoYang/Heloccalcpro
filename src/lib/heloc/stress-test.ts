/**
 * HELOC Stress Test Simulator
 * Based on Heloc_PSD_V1.0.md specifications
 *
 * Simulates the impact of rate increases and income growth on payment burden
 */

import type { HelocInput, StressTestInput, StressTestResult } from './types';
import { DEFAULT_VALUES } from './types';

/**
 * Run stress test simulation
 * Generates timeline showing nominal payment vs. adjusted burden ratio
 */
export function runStressTest(input: StressTestInput): StressTestResult {
  const { baseInput, rateIncrease, incomeGrowth, years } = input;

  // Calculate base monthly payment
  const baseRate = (baseInput.primeRate + baseInput.margin) / 100;
  const maxCreditLine =
    Math.max(0, baseInput.homeValue * (DEFAULT_VALUES.maxLTV / 100) - baseInput.mortgageBalance);

  const timeline: StressTestResult['timeline'] = [];

  for (let year = 0; year <= years; year++) {
    // Calculate stressed rate for this year
    const stressedRate = baseRate + (rateIncrease / 100);

    // Calculate nominal monthly payment with stressed rate
    const nominalPayment = (maxCreditLine * stressedRate) / 12;

    // Calculate adjusted income with growth
    const adjustedIncome = baseInput.annualIncome * Math.pow(1 + incomeGrowth / 100, year);
    const monthlyIncome = adjustedIncome / 12;

    // Calculate burden ratio (payment as % of monthly income)
    const totalMonthlyDebt = baseInput.monthlyDebts + nominalPayment;
    const burdenRatio = (totalMonthlyDebt / monthlyIncome) * 100;

    timeline.push({
      year,
      nominalPayment: Math.round(nominalPayment * 100) / 100,
      adjustedIncome: Math.round(adjustedIncome * 100) / 100,
      burdenRatio: Math.round(burdenRatio * 100) / 100,
    });
  }

  return { timeline };
}

/**
 * Calculate payment change due to rate increase
 */
export function calculatePaymentChange(
  maxCreditLine: number,
  baseRate: number,
  rateIncrease: number
): {
  basePayment: number;
  stressedPayment: number;
  increase: number;
  increasePercent: number;
} {
  const basePayment = (maxCreditLine * (baseRate / 100)) / 12;
  const stressedPayment = (maxCreditLine * ((baseRate + rateIncrease) / 100)) / 12;
  const increase = stressedPayment - basePayment;
  const increasePercent = (increase / basePayment) * 100;

  return {
    basePayment: Math.round(basePayment * 100) / 100,
    stressedPayment: Math.round(stressedPayment * 100) / 100,
    increase: Math.round(increase * 100) / 100,
    increasePercent: Math.round(increasePercent * 100) / 100,
  };
}

/**
 * Calculate affordability threshold
 * Returns the maximum rate increase before DTI exceeds 43%
 */
export function calculateAffordabilityThreshold(
  maxCreditLine: number,
  baseRate: number,
  monthlyIncome: number,
  existingDebts: number
): {
  maxRate: number;
  maxRateIncrease: number;
  maxPayment: number;
} {
  // Maximum DTI is 43%
  const maxDTI = 43;
  const maxTotalDebt = (monthlyIncome * maxDTI) / 100;
  const maxPayment = maxTotalDebt - existingDebts;

  // Calculate maximum rate
  const maxRate = (maxPayment * 12 / maxCreditLine) * 100;
  const maxRateIncrease = Math.max(0, maxRate - baseRate);

  return {
    maxRate: Math.round(maxRate * 100) / 100,
    maxRateIncrease: Math.round(maxRateIncrease * 100) / 100,
    maxPayment: Math.round(maxPayment * 100) / 100,
  };
}

/**
 * Generate stress test scenarios
 * @deprecated This function is not currently used in the UI.
 * The UI uses manual sliders with income growth and inflation presets instead.
 * Kept for potential future use.
 */
export function generateStressScenarios(baseInput: HelocInput): {
  mild: StressTestResult;
  moderate: StressTestResult;
  severe: StressTestResult;
} {
  return {
    mild: runStressTest({
      baseInput,
      rateIncrease: 1,
      incomeGrowth: DEFAULT_VALUES.incomeGrowthRate,
      years: 10,
    }),
    moderate: runStressTest({
      baseInput,
      rateIncrease: 2,
      incomeGrowth: DEFAULT_VALUES.incomeGrowthRate,
      years: 10,
    }),
    severe: runStressTest({
      baseInput,
      rateIncrease: 3,
      incomeGrowth: DEFAULT_VALUES.incomeGrowthRate,
      years: 10,
    }),
  };
}

/**
 * Calculate break-even income growth
 * Returns the income growth rate needed to maintain constant burden ratio
 */
export function calculateBreakEvenGrowth(
  rateIncrease: number,
  currentBurdenRatio: number
): number {
  // Simplified calculation: income growth needed to offset rate increase
  // This maintains the same burden ratio
  const breakEvenGrowth = (rateIncrease * currentBurdenRatio) / 100;
  return Math.round(breakEvenGrowth * 100) / 100;
}
