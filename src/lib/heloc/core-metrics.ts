/**
 * Core Metrics Calculation Functions
 * Provides calculations for CLTV, DTI, HELOC Rate, and Monthly Savings
 */

import type { ScenarioType } from '@/types/heloc-ai';
import { DEFAULT_VALUES } from './types';

/**
 * Calculate Combined Loan-to-Value Ratio (CLTV)
 * Formula: (mortgageBalance + helocAmount) / homeValue * 100
 */
export function calculateCLTV(
  homeValue: number,
  mortgageBalance: number,
  helocAmount: number
): number {
  if (homeValue <= 0) return 0;
  return Math.round(((mortgageBalance + helocAmount) / homeValue) * 100 * 100) / 100;
}

/**
 * Calculate Debt-to-Income Ratio (DTI)
 * Formula: (monthlyDebt + helocMonthlyPayment) / monthlyIncome * 100
 */
export function calculateDTI(
  annualIncome: number,
  monthlyDebt: number,
  helocMonthlyPayment: number
): number {
  if (annualIncome <= 0) return 0;
  const monthlyIncome = annualIncome / 12;
  return Math.round(((monthlyDebt + helocMonthlyPayment) / monthlyIncome) * 100 * 100) / 100;
}

/**
 * Get margin based on credit score
 * Higher credit score = lower margin
 */
export function getMarginByCredit(creditScore: number): number {
  if (creditScore >= 740) return 0.5;  // Excellent/Very Good
  if (creditScore >= 670) return 1.0;  // Good
  if (creditScore >= 580) return 1.5;  // Fair
  return 2.0;                          // Poor
}

/**
 * Calculate HELOC Rate
 * Formula: primeRate + margin
 */
export function calculateHelocRate(
  primeRate: number = DEFAULT_VALUES.primeRate,
  margin?: number,
  creditScore?: number
): number {
  const finalMargin = margin ?? (creditScore ? getMarginByCredit(creditScore) : DEFAULT_VALUES.margin);
  return Math.round((primeRate + finalMargin) * 100) / 100;
}

/**
 * Calculate maximum HELOC limit based on home value and LTV
 */
export function calculateMaxLimit(
  homeValue: number,
  mortgageBalance: number,
  maxLTV: number = DEFAULT_VALUES.maxLTV
): number {
  const maxLoanAmount = (homeValue * maxLTV) / 100;
  const maxHelocAmount = maxLoanAmount - mortgageBalance;
  return Math.max(0, Math.round(maxHelocAmount));
}

/**
 * Calculate monthly savings by scenario
 * Each scenario has different calculation logic
 */
export function calculateMonthlySavingsByScenario(
  scenario: ScenarioType,
  params: {
    helocAmount: number;
    helocRate: number;
    creditCardBalance?: number;
    creditCardRate?: number;
    currentMonthlyPayment?: number;
    renovationValue?: number;
  }
): number {
  const { helocAmount, helocRate, creditCardBalance, creditCardRate, currentMonthlyPayment } = params;

  switch (scenario) {
    case 'debt_consolidation': {
      // Savings = Credit Card Interest - HELOC Interest
      if (!creditCardBalance || !creditCardRate) return 0;
      const ccMonthlyInterest = (creditCardBalance * (creditCardRate / 100)) / 12;
      const helocMonthlyInterest = (helocAmount * (helocRate / 100)) / 12;
      return Math.round((ccMonthlyInterest - helocMonthlyInterest) * 100) / 100;
    }

    case 'home_renovation': {
      // Savings = Increased home value - HELOC cost
      // Simplified: Assume 1.5x ROI on renovation
      const { renovationValue = helocAmount * 1.5 } = params;
      const helocAnnualCost = (helocAmount * (helocRate / 100));
      const annualValueIncrease = (renovationValue - helocAmount) / 10; // Amortize over 10 years
      const monthlySavings = (annualValueIncrease - helocAnnualCost) / 12;
      return Math.round(monthlySavings * 100) / 100;
    }

    case 'credit_optimization': {
      // Savings = Reduced credit card interest by paying down balance
      if (!creditCardBalance || !creditCardRate) return 0;
      const amountToPay = Math.min(helocAmount, creditCardBalance);
      const ccMonthlySavings = (amountToPay * (creditCardRate / 100)) / 12;
      const helocMonthlyCost = (amountToPay * (helocRate / 100)) / 12;
      return Math.round((ccMonthlySavings - helocMonthlyCost) * 100) / 100;
    }

    case 'emergency_fund': {
      // Savings = Opportunity cost of not having emergency fund
      // Simplified: Assume avoiding high-interest debt in emergencies
      const emergencyRate = 18; // Average emergency borrowing rate (credit cards, payday loans)
      const potentialEmergencyCost = (helocAmount * (emergencyRate / 100)) / 12;
      const helocCost = (helocAmount * (helocRate / 100)) / 12;
      return Math.round((potentialEmergencyCost - helocCost) * 100) / 100;
    }

    case 'investment': {
      // Savings = Investment returns - HELOC cost
      const expectedReturn = 8; // Conservative investment return assumption
      const monthlyReturn = (helocAmount * (expectedReturn / 100)) / 12;
      const helocCost = (helocAmount * (helocRate / 100)) / 12;
      return Math.round((monthlyReturn - helocCost) * 100) / 100;
    }

    default:
      return 0;
  }
}

/**
 * Calculate interest-only monthly payment for HELOC
 */
export function calculateInterestOnlyPayment(
  helocAmount: number,
  helocRate: number
): number {
  return Math.round((helocAmount * (helocRate / 100) / 12) * 100) / 100;
}
