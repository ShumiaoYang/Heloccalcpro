/**
 * PDF Template Structure
 * PDF模板结构定义
 */

import type { AiAnalysis, CalculatedData } from '@/types/heloc-ai';

/**
 * Debt Consolidation AI Analysis
 */
export interface DebtConsolidationAnalysis {
  executiveVerdict: {
    status: 'APPROVED_ZONE' | 'CAUTION_ZONE' | 'DANGER_ZONE';
    headline: string;
    summary: string;
  };
  cashFlowAnalysis: {
    freedUpCashFlow: number;
    commentary: string;
  };
  radicalCandorWarning: {
    title: string;
    message: string;
  };
  actionPlan: Array<{
    title: string;
    description: string;
  }>;
}

/**
 * PDF生成所需的完整数据
 */
export interface PdfData {
  // 用户输入
  userInputs: Record<string, any>;

  // 计算数据
  calculatedData: CalculatedData;

  // AI分析结果
  aiAnalysis: AiAnalysis;

  // 场景类型
  scenario?: string;

  // 是否为最大借款额度
  isMaxBorrowing?: boolean;

  // 生成时间
  generatedAt: Date;

  // 用户信息（可选）
  userInfo?: {
    name?: string;
    email?: string;
  };

  // v3.0 新增字段
  v3Metrics?: {
    approved_credit_limit: number;
    effective_rate: number;
    final_margin: number;
    loan_size_adjustment: number;
    floor_rate: number;
    payment_shock_amount: number;
    payment_shock_ratio: number;
    underwriting_dti: number;
    post_approval_cltv: number;
    utilization_ratio: number;
    income_growth_assumption: number;
    economic_outlook: string;
  };
}

/**
 * PDF章节类型
 */
export type PdfSection =
  | 'cover'
  | 'executive_summary'
  | 'financial_dashboard'
  | 'scenario_analysis'
  | 'strategy_tips'
  | 'stress_test'
  | 'appendix';

/**
 * PDF样式配置
 */
export interface PdfStyles {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    danger: string;
    info: string;
    text: string;
    textLight: string;
    textSecondary: string;
    background: string;
    border: string;
    bgLight: string;
    bgSuccess: string;
    bgWarning: string;
    bgDanger: string;
  };
  fonts: {
    heading: string;
    body: string;
    mono: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
  };
}
