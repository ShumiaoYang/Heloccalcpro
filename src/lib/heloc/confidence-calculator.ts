/**
 * Confidence Score Calculator
 * 信心评分计算器 - 基于 CLTV 和 DTI 计算申请信心等级
 */

export type ConfidenceLevel = 'high' | 'moderate' | 'low';

export interface ConfidenceScore {
  level: ConfidenceLevel;
  message: string;
}

/**
 * Calculate confidence score based on CLTV and DTI ratios
 *
 * Scoring Logic:
 * - High: CLTV < 70% AND DTI < 36%
 * - Moderate: CLTV < 85% AND DTI < 43%
 * - Low: Otherwise
 */
export function calculateConfidenceScore(cltv: number, dti: number): ConfidenceScore {
  // High Confidence
  if (cltv < 70 && dti < 36) {
    return {
      level: 'high',
      message: 'High Confidence: Your equity position is strong and your debt load is manageable, making this a strategic move.',
    };
  }

  // Moderate Confidence
  if (cltv < 85 && dti < 43) {
    return {
      level: 'moderate',
      message: 'Moderate Confidence: Your financial position is solid, but we want to be careful about maintaining a healthy debt-to-income ratio.',
    };
  }

  // Low Confidence
  return {
    level: 'low',
    message: 'Needs Attention: Your current debt load is high. We recommend working with a financial advisor to ensure this decision supports your long-term security.',
  };
}
