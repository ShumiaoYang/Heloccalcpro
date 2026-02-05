/**
 * HELOC Calculator Types
 * Based on Heloc_PSD_V1.0.md specifications
 */

export interface HelocInput {
  homeValue: number;           // Home Value ($)
  mortgageBalance: number;     // Current Mortgage Balance ($)
  creditScore: number;         // Credit Score (300-850)
  annualIncome: number;        // Annual Income ($)
  monthlyDebts: number;        // Monthly Debts ($)
  primeRate: number;           // Prime Rate (%) - default 8.5%
  margin: number;              // Bank Margin (%) - default 0.5%
}

export interface HelocResult {
  maxCreditLine: number;       // Maximum Credit Line ($)
  availableEquity: number;     // Available Equity ($)
  currentLTV: number;          // Current Loan-to-Value (%)
  projectedLTV: number;        // Projected LTV after HELOC (%)
  monthlyPayment: number;      // Monthly Payment - Interest Only ($)
  dti: number;                 // Debt-to-Income Ratio (%)
  riskScore: number;           // Risk Health Score (0-100)
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];   // Personalized recommendations
}

export interface StressTestInput {
  baseInput: HelocInput;
  rateIncrease: number;        // Rate increase (%) - e.g., +2%
  incomeGrowth: number;        // Annual income growth (%) - e.g., 0.5%
  years: number;               // Projection period (years) - default 10
}

export interface StressTestResult {
  timeline: {
    year: number;
    nominalPayment: number;    // Nominal monthly payment
    adjustedIncome: number;    // Income adjusted for growth
    burdenRatio: number;       // Payment as % of income
  }[];
}

export type CreditScoreRange =
  | '300-579'   // Poor
  | '580-669'   // Fair
  | '670-739'   // Good
  | '740-799'   // Very Good
  | '800-850';  // Excellent

export const CREDIT_SCORE_RANGES: Record<CreditScoreRange, { min: number; max: number; label: string }> = {
  '300-579': { min: 300, max: 579, label: 'Poor' },
  '580-669': { min: 580, max: 669, label: 'Fair' },
  '670-739': { min: 670, max: 739, label: 'Good' },
  '740-799': { min: 740, max: 799, label: 'Very Good' },
  '800-850': { min: 800, max: 850, label: 'Excellent' },
};

export const DEFAULT_VALUES = {
  primeRate: 8.5,
  margin: 0.5,
  maxLTV: 85,                  // Maximum LTV for HELOC (85%)
  drawPeriod: 10,              // Draw period (years)
  repaymentPeriod: 20,         // Repayment period (years)
  incomeGrowthRate: 0.5,       // Default income growth rate (%)
};
