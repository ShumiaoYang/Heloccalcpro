/**
 * Scenario Calculator
 * 场景专项计算器 - 为5种不同场景提供专项分析
 */

import type {
  ScenarioType,
  DebtConsolidationMetrics,
  HomeRenovationMetrics,
  CreditOptimizationMetrics,
  EmergencyFundMetrics,
  InvestmentMetrics,
} from '@/types/heloc-ai';

// ============================================
// 输入参数接口
// ============================================

export interface BaseScenarioInput {
  // 基础财务数据
  homeValue: number;
  mortgageBalance: number;
  helocLimit: number;
  helocRate: number;
  creditScore: number;
  annualIncome: number;
  monthlyDebt: number;
}

export interface DebtConsolidationInput extends BaseScenarioInput {
  creditCardBalance: number;
  creditCardLimit: number;
  // 假设信用卡利率基于信用分数
}

export interface HomeRenovationInput extends BaseScenarioInput {
  renovationCost: number;
  renovationType: 'simple' | 'kitchen_bath' | 'structural';
  renovationDuration: number; // 月数
}

export interface CreditOptimizationInput extends BaseScenarioInput {
  creditCardBalance: number;
  creditCardLimit: number;
}

export interface EmergencyFundInput extends BaseScenarioInput {
  monthlyExpenses: number;
}

export interface InvestmentInput extends BaseScenarioInput {
  investmentAmount: number;
  expectedReturn: number; // 预期年化收益率 (%)
}

// ============================================
// 辅助函数
// ============================================

/**
 * 根据信用分数估算信用卡利率
 */
function estimateCreditCardRate(creditScore: number): number {
  if (creditScore >= 750) return 18.9;
  if (creditScore >= 700) return 21.9;
  if (creditScore >= 650) return 24.9;
  if (creditScore >= 600) return 27.9;
  return 29.9;
}

/**
 * 根据装修类型获取ROI
 */
function getRenovationROI(type: 'simple' | 'kitchen_bath' | 'structural'): number {
  const roiMap = {
    simple: 0.5,
    kitchen_bath: 0.75,
    structural: 0.75,
  };
  return roiMap[type];
}

// ============================================
// 场景计算函数
// ============================================

/**
 * 债务整合场景计算
 * 分析使用HELOC整合高息债务的收益
 */
export function calculateDebtConsolidation(
  input: DebtConsolidationInput
): DebtConsolidationMetrics {
  const creditCardRate = estimateCreditCardRate(input.creditScore);
  const helocRate = input.helocRate;

  // 计算信用卡月利息
  const creditCardMonthlyRate = creditCardRate / 100 / 12;
  const creditCardMonthlyInterest = input.creditCardBalance * creditCardMonthlyRate;

  // 计算HELOC月利息（如果用HELOC还清信用卡）
  const helocMonthlyRate = helocRate / 100 / 12;
  const helocMonthlyInterest = input.creditCardBalance * helocMonthlyRate;

  // 每月节省的利息
  const monthlySavings = creditCardMonthlyInterest - helocMonthlyInterest;

  // 年度节省
  const annualSavings = monthlySavings * 12;

  // 假设5年还款期，计算总节省
  const totalSavings = annualSavings * 5;

  // 计算还款时间缩短（假设每月固定还款）
  const monthlyPayment = input.creditCardBalance * 0.03; // 假设最低还款3%

  // 信用卡还款月数（复利计算）
  const ccMonths = Math.log(1 / (1 - creditCardMonthlyRate * input.creditCardBalance / monthlyPayment))
    / Math.log(1 + creditCardMonthlyRate);

  // HELOC还款月数
  const helocMonths = Math.log(1 / (1 - helocMonthlyRate * input.creditCardBalance / monthlyPayment))
    / Math.log(1 + helocMonthlyRate);

  const payoffMonthsReduced = Math.max(0, Math.round(ccMonths - helocMonths));

  return {
    interestSaved: Math.round(totalSavings),
    payoffMonthsReduced,
  };
}

/**
 * 房屋翻新场景计算
 * 分析翻新投资的ROI和房屋增值
 */
export function calculateHomeRenovation(
  input: HomeRenovationInput
): HomeRenovationMetrics {
  const roi = getRenovationROI(input.renovationType);

  // 预计房屋增值
  const estValueIncrease = input.renovationCost * roi;

  // 翻新后的房屋净值
  const currentEquity = input.homeValue - input.mortgageBalance;
  const futureHomeValue = input.homeValue + estValueIncrease;
  const futureEquity = futureHomeValue - input.mortgageBalance;

  return {
    futureEquity: Math.round(futureEquity),
    estValueIncrease: Math.round(estValueIncrease),
  };
}

/**
 * 信用优化场景计算
 * 分析HELOC如何提升总信用额度和降低利用率
 */
export function calculateCreditOptimization(
  input: CreditOptimizationInput
): CreditOptimizationMetrics {
  // 当前信用利用率
  const currentUtilization = (input.creditCardBalance / input.creditCardLimit) * 100;

  // HELOC带来的信用额度提升
  const creditLimitBoost = input.helocLimit;

  // 新的总信用额度
  const newTotalLimit = input.creditCardLimit + creditLimitBoost;

  // 新的信用利用率（假设用HELOC还清部分信用卡）
  const newUtilization = (input.creditCardBalance / newTotalLimit) * 100;

  // 利用率下降
  const utilizationDrop = currentUtilization - newUtilization;

  return {
    creditLimitBoost: Math.round(creditLimitBoost),
    utilizationDrop: Math.round(utilizationDrop * 10) / 10, // 保留1位小数
  };
}

/**
 * 应急基金场景计算
 * 分析HELOC作为应急资金的覆盖能力
 */
export function calculateEmergencyFund(
  input: EmergencyFundInput
): EmergencyFundMetrics {
  // HELOC可用额度
  const availableLiquidity = input.helocLimit;

  // 可覆盖的月数
  const monthsCovered = availableLiquidity / input.monthlyExpenses;

  return {
    monthsCovered: Math.round(monthsCovered * 10) / 10, // 保留1位小数
    availableLiquidity: Math.round(availableLiquidity),
  };
}

/**
 * 投资场景计算
 * 分析使用HELOC投资的获利门槛
 */
export function calculateInvestment(
  input: InvestmentInput
): InvestmentMetrics {
  // HELOC成本（年化利率）
  const hurdleRate = input.helocRate;

  // 权益风险比率（投资金额 / 房屋净值）
  const currentEquity = input.homeValue - input.mortgageBalance;
  const equityRiskRatio = (input.investmentAmount / currentEquity) * 100;

  return {
    hurdleRate: Math.round(hurdleRate * 10) / 10, // 保留1位小数
    equityRiskRatio: Math.round(equityRiskRatio * 10) / 10, // 保留1位小数
  };
}

