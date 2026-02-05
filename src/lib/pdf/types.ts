/**
 * PDF Template Structure
 * PDF模板结构定义
 */

import type { AiAnalysis, CalculatedData } from '@/types/heloc-ai';

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

  // 生成时间
  generatedAt: Date;

  // 用户信息（可选）
  userInfo?: {
    name?: string;
    email?: string;
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
