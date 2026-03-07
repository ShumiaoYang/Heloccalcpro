/**
 * HELOC Calculator Types
 * Based on Heloc_PSD_V1.0.md specifications
 */

export interface HelocInput {
  // ===== 基础字段 =====
  homeValue: number;           // Home Value ($)
  mortgageBalance: number;     // Current Mortgage Balance ($)
  creditScore: number;         // Credit Score (300-850)
  annualIncome: number;        // Annual Income ($)
  monthlyDebts: number;        // Monthly Debts ($)
  primeRate: number;           // Prime Rate (%) - default 8.5%
  margin: number;              // Bank Margin (%) - default 0.5%

  // ===== v3.0 新增必填字段 =====
  propertyType?: PropertyType;           // 房产类型 (默认: Single-family)
  occupancyType?: OccupancyType;         // 房屋用途 (默认: Primary residence)

  // ===== v3.0 新增可选字段 =====
  subjectHousingPayment?: number;        // 标的房屋月住房支出(PITI)
  otherMonthlyDebt?: number;             // 其他固定月债务（主输入框）
  utilizationRatio?: number;             // 预估使用率(0-1, 默认1.0表示100%)
  drawPeriodMonths?: number;             // Draw期月数(默认120)
  repaymentMonths?: number;              // Repayment期月数(默认240)
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

// ===== v3.0 新增类型定义 =====

/**
 * Property Type - 房产类型
 */
export type PropertyType =
  | 'Single-family'
  | 'Townhouse'
  | 'Condo'
  | 'Multi-family'
  | 'Manufactured';

/**
 * Occupancy Type - 房屋用途
 */
export type OccupancyType =
  | 'Primary residence'
  | 'Second home'
  | 'Investment property';

/**
 * Debt Detail - 债务明细（用于债务计算器）
 */
export interface DebtDetail {
  otherPropertyHousing: number;    // 其他房产月住房支出（PITI）
  studentLoanPayment: number;      // 学生贷款月供
  autoLoanPayment: number;         // 汽车贷款月供
  creditCardMinPayment: number;    // 信用卡最低还款额
  supportObligations: number;      // 抚养费/赡养费月支出
  otherInstallmentDebt: number;    // 其他分期债务
  rentalIncomeCredit: number;      // 已验证可抵扣租金收入（减项）
}

// ===== 百分比与小数转换工具函数 =====

/**
 * 将百分比转换为小数
 * @param percentage - 百分比值 (例如: 85 表示 85%)
 * @returns 小数值 (例如: 0.85)
 */
export function pctToDecimal(percentage: number): number {
  return percentage / 100;
}

/**
 * 将小数转换为百分比
 * @param decimal - 小数值 (例如: 0.85)
 * @returns 百分比值 (例如: 85)
 */
export function decimalToPct(decimal: number): number {
  return decimal * 100;
}

/**
 * 格式化百分比显示
 * @param decimal - 小数值 (例如: 0.85)
 * @param precision - 小数位数 (默认: 1)
 * @returns 格式化字符串 (例如: "85.0%")
 */
export function formatPercent(decimal: number, precision: number = 1): string {
  return `${(decimal * 100).toFixed(precision)}%`;
}

/**
 * 计算债务总额
 * @param detail - 债务明细
 * @returns 总债务月供
 */
export function calculateTotalDebt(detail: DebtDetail): number {
  return (
    detail.otherPropertyHousing +
    detail.studentLoanPayment +
    detail.autoLoanPayment +
    detail.creditCardMinPayment +
    detail.supportObligations +
    detail.otherInstallmentDebt -
    detail.rentalIncomeCredit
  );
}

// ===== v3.0 更新后的默认值配置 =====

export const DEFAULT_VALUES = {
  // 利率相关
  primeRate: 8.5,
  margin: 0.5,

  // CLTV Cap 相关
  maxCLTVCap: 0.90,                    // 最大CLTV cap (90%)
  minEligibleCLTVCap: 0.60,            // 最小合格CLTV cap (60%)

  // DTI 相关
  baseDTI: 0.43,                       // 基础DTI上限 (43%)
  topDTI: 0.50,                        // 最高DTI上限 (50%)
  underwritingPaymentFactor: 0.0125,   // 审批口径月供代理系数 (1.25%)

  // 定价相关
  defaultFloorRate: 0.05,              // 默认地板利率 (5%)

  // 信用分相关
  minCreditScore: 640,                 // 最低信用分要求

  // 期限相关
  defaultDrawPeriodMonths: 120,        // 默认Draw期月数 (10年)
  defaultRepaymentMonths: 240,         // 默认Repayment期月数 (20年)

  // 房产相关
  defaultPropertyType: 'Single-family' as PropertyType,
  defaultOccupancyType: 'Primary residence' as OccupancyType,

  // 使用率相关
  defaultUtilizationRatio: 1.0,        // 默认使用率 (100%)

  // 旧版兼容（保留）
  maxLTV: 85,                          // Maximum LTV for HELOC (85%)
  drawPeriod: 10,                      // Draw period (years)
  repaymentPeriod: 20,                 // Repayment period (years)
  incomeGrowthRate: 0.5,               // Default income growth rate (%)
};
