/**
 * HELOC Calculator - Core Calculation Logic
 * Based on Heloc_PSD_V1.0.md specifications
 */

import type { HelocInput, HelocResult } from './types';
import { DEFAULT_VALUES } from './types';
import { calculateRiskScore } from './risk-score';

/**
 * Main HELOC calculation function
 * Calculates maximum credit line, monthly payment, LTV, DTI, and risk score
 */
export function calculateHeloc(input: HelocInput): HelocResult {
  // Validate input
  validateInput(input);

  // Calculate maximum credit line
  // Formula: (Home Value × 85%) - Mortgage Balance
  const maxCreditLine = Math.max(
    0,
    input.homeValue * (DEFAULT_VALUES.maxLTV / 100) - input.mortgageBalance
  );

  // Calculate available equity
  const availableEquity = Math.max(0, input.homeValue - input.mortgageBalance);

  // Calculate current LTV
  // Formula: (Mortgage Balance / Home Value) × 100
  const currentLTV = (input.mortgageBalance / input.homeValue) * 100;

  // Calculate projected LTV (after using HELOC)
  // Formula: ((Mortgage Balance + Max Credit Line) / Home Value) × 100
  const projectedLTV = ((input.mortgageBalance + maxCreditLine) / input.homeValue) * 100;

  // Calculate monthly payment (Interest-Only period)
  // Formula: Max Credit Line × (Prime Rate + Margin) / 12
  const annualRate = (input.primeRate + input.margin) / 100;
  const monthlyPayment = (maxCreditLine * annualRate) / 12;

  // Calculate DTI (Debt-to-Income Ratio)
  // Formula: (Monthly Debts + Monthly Payment) / (Annual Income / 12) × 100
  const monthlyIncome = input.annualIncome / 12;
  const totalMonthlyDebt = input.monthlyDebts + monthlyPayment;
  const dti = (totalMonthlyDebt / monthlyIncome) * 100;

  // Calculate risk score
  const riskScore = calculateRiskScore(projectedLTV, dti, input.creditScore);

  // Determine risk level
  const riskLevel = getRiskLevel(riskScore);

  // Generate recommendations
  const recommendations = generateRecommendations({
    maxCreditLine,
    currentLTV,
    projectedLTV,
    dti,
    riskScore,
    creditScore: input.creditScore,
  });

  return {
    maxCreditLine: Math.round(maxCreditLine * 100) / 100,
    availableEquity: Math.round(availableEquity * 100) / 100,
    currentLTV: Math.round(currentLTV * 100) / 100,
    projectedLTV: Math.round(projectedLTV * 100) / 100,
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    dti: Math.round(dti * 100) / 100,
    riskScore: Math.round(riskScore * 100) / 100,
    riskLevel,
    recommendations,
  };
}

/**
 * Validate HELOC input
 */
function validateInput(input: HelocInput): void {
  if (input.homeValue <= 0) {
    throw new Error('Home value must be greater than 0');
  }
  if (input.mortgageBalance < 0) {
    throw new Error('Mortgage balance cannot be negative');
  }
  if (input.mortgageBalance > input.homeValue) {
    throw new Error('Mortgage balance cannot exceed home value');
  }
  if (input.creditScore < 300 || input.creditScore > 850) {
    throw new Error('Credit score must be between 300 and 850');
  }
  if (input.annualIncome <= 0) {
    throw new Error('Annual income must be greater than 0');
  }
  if (input.monthlyDebts < 0) {
    throw new Error('Monthly debts cannot be negative');
  }
  if (input.primeRate < 0 || input.primeRate > 30) {
    throw new Error('Prime rate must be between 0 and 30');
  }
  if (input.margin < 0 || input.margin > 10) {
    throw new Error('Margin must be between 0 and 10');
  }
}

/**
 * Determine risk level based on risk score
 */
function getRiskLevel(riskScore: number): 'low' | 'medium' | 'high' {
  if (riskScore >= 80) return 'low';
  if (riskScore >= 60) return 'medium';
  return 'high';
}

/**
 * Generate personalized recommendations
 */
function generateRecommendations(params: {
  maxCreditLine: number;
  currentLTV: number;
  projectedLTV: number;
  dti: number;
  riskScore: number;
  creditScore: number;
}): string[] {
  const recommendations: string[] = [];

  // No credit line available
  if (params.maxCreditLine <= 0) {
    recommendations.push(
      'Your current mortgage balance is too high relative to your home value. Consider paying down your mortgage or waiting for home value appreciation.'
    );
    return recommendations;
  }

  // High LTV warning
  if (params.projectedLTV > 80) {
    recommendations.push(
      'Your projected LTV is high (>80%). Consider borrowing less to maintain a healthier equity position.'
    );
  }

  // High DTI warning
  if (params.dti > 43) {
    recommendations.push(
      'Your DTI ratio exceeds 43%, which may make it difficult to qualify for a HELOC. Consider reducing existing debts or increasing income.'
    );
  } else if (params.dti > 36) {
    recommendations.push(
      'Your DTI ratio is elevated (>36%). Lenders prefer DTI below 36% for better terms.'
    );
  }

  // Credit score recommendations
  if (params.creditScore < 670) {
    recommendations.push(
      'Your credit score is below 670. Improving your credit score could help you qualify for better interest rates.'
    );
  }

  // Positive recommendations
  if (params.riskScore >= 80) {
    recommendations.push(
      'Your financial profile is strong! You should qualify for competitive HELOC rates.'
    );
  }

  if (params.projectedLTV < 70 && params.dti < 36) {
    recommendations.push(
      'Excellent! Your low LTV and DTI ratios position you well for favorable loan terms.'
    );
  }

  // Tax deduction reminder
  recommendations.push(
    'Remember: HELOC interest may be tax-deductible if funds are used to buy, build, or substantially improve your home (IRS Pub 936).'
  );

  return recommendations;
}

/**
 * Calculate monthly payment for principal + interest period
 */
export function calculatePrincipalAndInterestPayment(
  balance: number,
  annualRate: number,
  months: number
): number {
  if (balance <= 0 || months <= 0) return 0;

  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate === 0) return balance / months;

  // Standard amortization formula
  const payment =
    (balance * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);

  return Math.round(payment * 100) / 100;
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format percentage for display
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}
