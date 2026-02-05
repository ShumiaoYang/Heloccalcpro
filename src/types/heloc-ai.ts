/**
 * HELOC AI Analysis Type Definitions
 * 对应设计文档中的数据结构定义
 */

// ============================================
// Scenario Types (场景类型)
// ============================================

export type ScenarioType =
  | 'debt_consolidation'
  | 'home_renovation'
  | 'credit_optimization'
  | 'emergency_fund'
  | 'investment';

// ============================================
// Calculated Data (前端计算的财务快照)
// 对应设计文档 2.1
// ============================================

export interface CoreMetrics {
  /** Combined Loan-to-Value Ratio (%) */
  cltv: number;
  /** Debt-to-Income Ratio (%) */
  dti: number;
  /** HELOC Interest Rate (%) */
  helocRate: number;
  /** Monthly Savings ($) */
  monthlySavings: number;
  /** Maximum HELOC Limit ($) */
  maxLimit: number;
}

export interface DebtConsolidationMetrics {
  /** Total Interest Saved ($) */
  interestSaved: number;
  /** Months Reduced in Payoff Timeline */
  payoffMonthsReduced: number;
}

export interface HomeRenovationMetrics {
  /** Future Home Equity after Renovation ($) */
  futureEquity: number;
  /** Estimated Value Increase ($) */
  estValueIncrease: number;
}

export interface CreditOptimizationMetrics {
  /** Credit Limit Boost ($) */
  creditLimitBoost: number;
  /** Credit Utilization Drop (%) */
  utilizationDrop: number;
}

export interface EmergencyFundMetrics {
  /** Months of Expenses Covered */
  monthsCovered: number;
  /** Available Liquidity ($) */
  availableLiquidity: number;
}

export interface InvestmentMetrics {
  /** Minimum Required Return Rate (%) */
  hurdleRate: number;
  /** Equity Risk Ratio */
  equityRiskRatio: number;
}

export type ScenarioMetrics =
  | DebtConsolidationMetrics
  | HomeRenovationMetrics
  | CreditOptimizationMetrics
  | EmergencyFundMetrics
  | InvestmentMetrics;

export interface CalculatedData {
  scenario: ScenarioType;
  coreMetrics: CoreMetrics;
  scenarioMetrics: ScenarioMetrics;
}

// ============================================
// AI Analysis (LLM 驱动的叙事文本)
// 对应设计文档 2.2
// ============================================

export type TipType = 'info' | 'danger';

export interface Tip {
  type: TipType;
  content: string;
}

export interface ActionItem {
  /** Action step description */
  action: string;
  /** Why this step matters - explains the benefit */
  reason: string;
}

export interface AiAnalysis {
  /** Executive Summary - 执行摘要结论 */
  summary: string;

  /** Diagnostic - 针对 DTI/CLTV 的风险诊断 */
  diagnostic: string;

  /** Strategy - 针对特定场景的专家建议 */
  strategy: string;

  /** Action Plan - 行动建议列表 (3-5条) - 支持旧格式(string[])和新格式(ActionItem[]) */
  actionPlan: (string | ActionItem)[];

  /** Tips - 提示信息 */
  tips: Tip[];

  /** Stress Test Commentary - 压力测试点评 (可选) */
  stressTestCommentary?: string;
}

