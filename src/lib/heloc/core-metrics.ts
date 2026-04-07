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

// ===== v3.0 Enhanced DTI Calculation =====

/**
 * 获取 FICO Bonus（用于动态 maxDTI 计算）
 * v3.0 规范：760+(7%), 720+(5%), 680+(2%), 640+(0%)
 * @param creditScore - 信用分
 * @returns Bonus percentage (as decimal)
 */
export function getFicoBonus(creditScore: number): number {
  if (creditScore >= 760) return 0.07;  // 7%
  if (creditScore >= 720) return 0.05;  // 5%
  if (creditScore >= 680) return 0.02;  // 2%
  return 0;  // 0% for 640-679
}

/**
 * 获取 CLTV Bonus（用于动态 maxDTI 计算）
 * v3.0 规范：≤60%(5%), ≤80%(2%), ≤90%(0%)
 * @param cltv - CLTV ratio (as percentage)
 * @returns Bonus percentage (as decimal)
 */
export function getCltvBonus(cltv: number): number {
  if (cltv <= 60) return 0.05;  // 5%
  if (cltv <= 80) return 0.02;  // 2%
  return 0;  // 0% for >80%
}

/**
 * 计算动态 maxDTI
 * v3.0 规范：min(50%, 43% + ficoBonus + cltvBonus)
 * @param creditScore - 信用分
 * @param cltv - CLTV ratio (as percentage)
 * @returns Maximum DTI (as decimal)
 */
export function calculateDynamicMaxDTI(creditScore: number, cltv: number): number {
  const ficoBonus = getFicoBonus(creditScore);
  const cltvBonus = getCltvBonus(cltv);
  const dynamicMaxDTI = Math.min(0.50, DEFAULT_VALUES.baseDTI + ficoBonus + cltvBonus);
  return dynamicMaxDTI;
}

/**
 * 计算审批口径月供代理
 * v3.0 规范：preHELOCPayment = estimatedLineAmount × 0.0125 (1.25%)
 * @param estimatedLineAmount - 预估额度
 * @returns 审批口径月供代理
 */
export function calculateUnderwritingPayment(estimatedLineAmount: number): number {
  return estimatedLineAmount * DEFAULT_VALUES.underwritingPaymentFactor;
}

/**
 * 计算审批口径 DTI（使用月供代理）
 * v3.0 规范：用于审批决策的 DTI 计算
 * @param annualIncome - 年收入
 * @param existingMonthlyDebt - 现有月债务
 * @param estimatedLineAmount - 预估 HELOC 额度
 * @returns Underwriting DTI (as decimal)
 */
export function calculateUnderwritingDTI(
  annualIncome: number,
  existingMonthlyDebt: number,
  estimatedLineAmount: number
): number {
  if (annualIncome <= 0) return 0;
  const monthlyIncome = annualIncome / 12;
  const proxyPayment = calculateUnderwritingPayment(estimatedLineAmount);
  const totalDebt = existingMonthlyDebt + proxyPayment;
  return totalDebt / monthlyIncome;
}

/**
 * 反推 Credit DTI Limit（基于动态 maxDTI）
 * v3.0 规范：基于用户信用分和预计 CLTV，反推可承受的 HELOC 额度
 * @param annualIncome - 年收入
 * @param existingMonthlyDebt - 现有月债务
 * @param creditScore - 信用分
 * @param projectedCLTV - 预计 CLTV (as percentage)
 * @returns 基于 DTI 限制的最大 HELOC 额度
 */
export function calculateCreditDTILimit(
  annualIncome: number,
  existingMonthlyDebt: number,
  creditScore: number,
  projectedCLTV: number
): number {
  if (annualIncome <= 0) return 0;

  const monthlyIncome = annualIncome / 12;
  const dynamicMaxDTI = calculateDynamicMaxDTI(creditScore, projectedCLTV);

  // maxDTI * monthlyIncome = existingDebt + (helocAmount * 0.0125)
  // helocAmount = (maxDTI * monthlyIncome - existingDebt) / 0.0125
  const maxTotalDebt = dynamicMaxDTI * monthlyIncome;
  const availableDebtCapacity = maxTotalDebt - existingMonthlyDebt;
  const maxHelocAmount = availableDebtCapacity / DEFAULT_VALUES.underwritingPaymentFactor;

  return Math.max(0, maxHelocAmount);
}

/**
 * 计算实际使用口径 DTI（基于实际 balance 和 utilization）
 * 与审批口径不同，这是实际使用后的 DTI
 * @param annualIncome - 年收入
 * @param existingMonthlyDebt - 现有月债务
 * @param helocBalance - HELOC 实际使用余额
 * @param helocRate - HELOC 利率 (as percentage)
 * @returns Actual DTI (as decimal)
 */
export function calculateActualDTI(
  annualIncome: number,
  existingMonthlyDebt: number,
  helocBalance: number,
  helocRate: number
): number {
  if (annualIncome <= 0) return 0;
  const monthlyIncome = annualIncome / 12;
  const helocMonthlyPayment = calculateInterestOnlyPayment(helocBalance, helocRate);
  const totalDebt = existingMonthlyDebt + helocMonthlyPayment;
  return totalDebt / monthlyIncome;
}

// ===== v3.0 Pricing Logic =====

/**
 * 获取 Base Margin（基于 FICO 和 CLTV 的 8×5 矩阵）
 * v3.0 规范：8个信用分档位 × 5个CLTV档位
 * @param creditScore - 信用分
 * @param cltv - CLTV ratio (as percentage)
 * @returns Base margin (as decimal), or null if rejected
 */
export function getBaseMargin(creditScore: number, cltv: number): number | null {
  // CLTV档位判断
  let cltvTier: number;
  if (cltv <= 60) cltvTier = 0;
  else if (cltv <= 70) cltvTier = 1;
  else if (cltv <= 80) cltvTier = 2;
  else if (cltv <= 85) cltvTier = 3;
  else if (cltv <= 90) cltvTier = 4;
  else return null; // CLTV > 90% reject

  // 8×5 Base Margin Matrix (as decimal)
  const matrix: (number | null)[][] = [
    [0.0000, 0.0015, 0.0035, 0.0075, 0.0125], // 780+
    [0.0015, 0.0035, 0.0060, 0.0100, 0.0150], // 740-779
    [0.0035, 0.0075, 0.0100, 0.0150, 0.0200], // 720-739
    [0.0075, 0.0110, 0.0150, 0.0200, 0.0275], // 700-719
    [0.0125, 0.0175, 0.0225, 0.0300, 0.0400], // 680-699
    [0.0200, 0.0275, 0.0350, null, null],     // 660-679
    [0.0350, 0.0450, null, null, null],       // 640-659
    [null, null, null, null, null],           // <640
  ];

  // FICO档位判断
  let ficoTier: number;
  if (creditScore >= 780) ficoTier = 0;
  else if (creditScore >= 740) ficoTier = 1;
  else if (creditScore >= 720) ficoTier = 2;
  else if (creditScore >= 700) ficoTier = 3;
  else if (creditScore >= 680) ficoTier = 4;
  else if (creditScore >= 660) ficoTier = 5;
  else if (creditScore >= 640) ficoTier = 6;
  else ficoTier = 7;

  return matrix[ficoTier][cltvTier];
}

/**
 * 获取用途调整（Occupancy Margin Adjustment）
 * v3.0 规范：Primary(0%), Second home(+0.25%), Investment(+1.0%)
 */
export function getOccupancyMarginAdj(occupancyType: string): number {
  switch (occupancyType) {
    case 'Primary residence': return 0.0000;
    case 'Second home': return 0.0025;
    case 'Investment property': return 0.0100;
    default: return 0.0000;
  }
}

/**
 * 获取房产类型调整（Property Type Margin Adjustment）
 * v3.0 规范：Single-family/Townhouse(0%), Condo(+0.25%), Multi-family(+1.0%), Manufactured(+4.0%)
 */
export function getPropertyTypeMarginAdj(propertyType: string): number {
  switch (propertyType) {
    case 'Single-family':
    case 'Townhouse': return 0.0000;
    case 'Condo': return 0.0025;
    case 'Multi-family': return 0.0100;
    case 'Manufactured': return 0.0400;
    default: return 0.0000;
  }
}

/**
 * 获取额度调整（Loan Size Adjustment）
 * v3.0 规范：≥$500K(-0.5%), ≥$250K(-0.25%), ≥$100K(-0.1%), <$50K(+0.5%)
 */
export function getLoanSizeAdj(approvedCreditLimit: number): number {
  if (approvedCreditLimit >= 500000) return -0.0050;
  if (approvedCreditLimit >= 250000) return -0.0025;
  if (approvedCreditLimit >= 100000) return -0.0010;
  if (approvedCreditLimit < 50000) return 0.0050;
  return 0.0000;
}

/**
 * 计算最终 Margin
 * v3.0 规范：finalMargin = baseMargin + occupancyAdj + propertyTypeAdj + loanSizeAdj
 */
export function calculateFinalMargin(
  creditScore: number,
  cltv: number,
  occupancyType: string,
  propertyType: string,
  approvedCreditLimit: number
): number | null {
  const baseMargin = getBaseMargin(creditScore, cltv);
  if (baseMargin === null) return null; // Rejected

  const occupancyAdj = getOccupancyMarginAdj(occupancyType);
  const propertyTypeAdj = getPropertyTypeMarginAdj(propertyType);
  const loanSizeAdj = getLoanSizeAdj(approvedCreditLimit);

  return baseMargin + occupancyAdj + propertyTypeAdj + loanSizeAdj;
}

/**
 * 计算生效利率（含 Floor Rate 机制）
 * v3.0 规范：effectiveRate = max(floorRate, primeRate + finalMargin)
 */
export function calculateEffectiveRate(
  primeRate: number,
  finalMargin: number,
  floorRate: number = DEFAULT_VALUES.defaultFloorRate
): number {
  const rawRate = primeRate + finalMargin;
  return Math.max(floorRate, rawRate);
}

// ===== v3.0 Payment Shock Calculation =====

/**
 * 计算 Interest-Only 月供（Draw 期）
 * v3.0 规范：modeledInterestOnlyPayment = modeledBalance × effectiveRate / 12
 */
export function calculateModeledInterestOnlyPayment(
  modeledBalance: number,
  effectiveRate: number
): number {
  return (modeledBalance * effectiveRate) / 12;
}

/**
 * 计算 Repayment 期月供（本息摊还）
 * v3.0 规范：标准摊还公式
 */
export function calculateModeledRepaymentPayment(
  modeledBalance: number,
  effectiveRate: number,
  repaymentMonths: number = DEFAULT_VALUES.defaultRepaymentMonths
): number {
  const monthlyRate = effectiveRate / 12;
  if (monthlyRate === 0) {
    return modeledBalance / repaymentMonths;
  }
  const numerator = modeledBalance * monthlyRate * Math.pow(1 + monthlyRate, repaymentMonths);
  const denominator = Math.pow(1 + monthlyRate, repaymentMonths) - 1;
  return numerator / denominator;
}

/**
 * 计算 Payment Shock（月供跳升金额）
 * v3.0 规范：paymentShock = repaymentPayment - interestOnlyPayment
 */
export function calculatePaymentShock(
  modeledBalance: number,
  effectiveRate: number,
  repaymentMonths: number = DEFAULT_VALUES.defaultRepaymentMonths
): number {
  const interestOnlyPayment = calculateModeledInterestOnlyPayment(modeledBalance, effectiveRate);
  const repaymentPayment = calculateModeledRepaymentPayment(modeledBalance, effectiveRate, repaymentMonths);
  return repaymentPayment - interestOnlyPayment;
}

/**
 * 计算 Payment Shock Ratio（相对收入的月供跳升比率）
 * v3.0 规范：paymentShockRatio = paymentShock / grossMonthlyIncome
 */
export function calculatePaymentShockRatio(
  modeledBalance: number,
  effectiveRate: number,
  annualIncome: number,
  repaymentMonths: number = DEFAULT_VALUES.defaultRepaymentMonths
): number {
  if (annualIncome <= 0) return 0;
  const grossMonthlyIncome = annualIncome / 12;
  const paymentShock = calculatePaymentShock(modeledBalance, effectiveRate, repaymentMonths);
  return paymentShock / grossMonthlyIncome;
}
