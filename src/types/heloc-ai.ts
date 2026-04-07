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
  /** Debt consolidation legacy fields (backward compatibility) */
  executiveVerdict?: {
    status: 'APPROVED_ZONE' | 'CAUTION_ZONE' | 'DANGER_ZONE';
    headline: string;
    summary: string;
  };
  cashFlowAnalysis?: {
    freedUpCashFlow: number;
    commentary: string;
  };
  radicalCandorWarning?: {
    title: string;
    message: string;
  };

  /** v3.0: Structured Report Data */
  v3Report?: {
    executiveBrief: string;
    goalAnalysis: {
      economicImpact: string;
      advisorNote: string;
    };
    bankEvaluation: {
      cltvInsight: string;
      dtiInsight: string;
      marginInsight: string;
    };
    riskDashboard: {
      dtiLabel: string;
      cltvLabel: string;
      dtiColor: 'green' | 'yellow' | 'red';
      cltvColor: 'green' | 'yellow' | 'red';
    };
    lifetimeRoadmap: {
      drawPeriodView: string;
      repaymentPeriodView: string;
      paymentShockWarning: string;
    };
    lifecyclePersonalized: string;
    stressTest: {
      rateHikeImpact: string;
      advisorTip: string;
    };
    bankReadiness: string[];
    specialRecommendation: string;
    radicalCandorWarning?: {
      title: string;
      message: string;
    };
  };

  /** Executive Summary (向后兼容) */
  summary: string;

  /** Diagnostic (向后兼容) */
  diagnostic: string;

  /** Strategy (向后兼容) */
  strategy: string;

  /** Action Plan (向后兼容) */
  actionPlan: (string | ActionItem)[];

  /** Tips (向后兼容) */
  tips: Tip[];

  /** Stress Test Commentary (向后兼容) */
  stressTestCommentary?: string;

  /** Home Renovation v2 page-specific content (optional, backward compatible) */
  homeRenovationV2?: {
    goalFeasibility?: {
      overallAssessment?: string;
      chartCommentary?: string;
    };
    borrowingCapacity: {
      executiveVerdict: string;
      advisorsNote: string;
      parameterChartReview?: string;
    };
    cashFlowStress: {
      summary: string;
      paymentShockWarning: string;
      stressTestAssessment: string;
      advisorsNote?: string;
    };
    roiEquity: {
      summary: string;
      budgetingGuidance: string;
    };
    contractorPlan: {
      intro: string;
      checklist: string[];
    };
  };
}
