/**
 * HELOC Risk Score Calculator
 * Based on Heloc_PSD_V1.0.md specifications
 *
 * Risk Score Formula:
 * Score = 100 - (LTV_Weight + DTI_Weight + Credit_Weight)
 *
 * Where:
 * - LTV_Weight = (Projected LTV / 85) × 40%
 * - DTI_Weight = (DTI / 43) × 35%
 * - Credit_Weight = ((850 - Credit Score) / 550) × 25%
 */

import { PropertyType, OccupancyType } from './types';

export interface RiskScoreBreakdown {
  totalScore: number;
  ltvScore: number;
  dtiScore: number;
  creditScore: number;
  ltvWeight: number;
  dtiWeight: number;
  creditWeight: number;
}

/**
 * Calculate risk health score (0-100)
 * Higher score = Lower risk = Healthier financial position
 */
export function calculateRiskScore(
  projectedLTV: number,
  dti: number,
  creditScore: number
): number {
  // LTV component (40% weight)
  // Lower LTV = Better score
  const ltvWeight = (projectedLTV / 85) * 40;

  // DTI component (35% weight)
  // Lower DTI = Better score
  const dtiWeight = (dti / 43) * 35;

  // Credit Score component (25% weight)
  // Higher credit score = Better score
  const creditWeight = ((850 - creditScore) / 550) * 25;

  // Calculate final score
  const riskScore = 100 - (ltvWeight + dtiWeight + creditWeight);

  // Ensure score is within 0-100 range
  return Math.max(0, Math.min(100, riskScore));
}

/**
 * Calculate detailed risk score breakdown
 */
export function calculateRiskScoreBreakdown(
  projectedLTV: number,
  dti: number,
  creditScore: number
): RiskScoreBreakdown {
  // Calculate weights
  const ltvWeight = (projectedLTV / 85) * 40;
  const dtiWeight = (dti / 43) * 35;
  const creditWeight = ((850 - creditScore) / 550) * 25;

  // Calculate individual scores (inverted for display)
  const ltvScore = Math.max(0, 100 - (ltvWeight / 40) * 100);
  const dtiScore = Math.max(0, 100 - (dtiWeight / 35) * 100);
  const creditScoreValue = Math.max(0, 100 - (creditWeight / 25) * 100);

  // Calculate total score
  const totalScore = Math.max(0, Math.min(100, 100 - (ltvWeight + dtiWeight + creditWeight)));

  return {
    totalScore: Math.round(totalScore * 100) / 100,
    ltvScore: Math.round(ltvScore * 100) / 100,
    dtiScore: Math.round(dtiScore * 100) / 100,
    creditScore: Math.round(creditScoreValue * 100) / 100,
    ltvWeight: Math.round(ltvWeight * 100) / 100,
    dtiWeight: Math.round(dtiWeight * 100) / 100,
    creditWeight: Math.round(creditWeight * 100) / 100,
  };
}

/**
 * Get risk level label
 */
export function getRiskLevel(riskScore: number): 'low' | 'medium' | 'high' {
  if (riskScore >= 80) return 'low';
  if (riskScore >= 60) return 'medium';
  return 'high';
}

/**
 * Get risk level color
 */
export function getRiskLevelColor(riskScore: number): string {
  if (riskScore >= 80) return 'text-green-600'; // Low risk - Green
  if (riskScore >= 60) return 'text-yellow-600'; // Medium risk - Yellow
  return 'text-red-600'; // High risk - Red
}

/**
 * Get risk level description
 */
export function getRiskLevelDescription(riskScore: number): string {
  if (riskScore >= 80) {
    return 'Excellent financial health. You should qualify for competitive rates.';
  }
  if (riskScore >= 60) {
    return 'Moderate risk. Consider improving your LTV or DTI for better terms.';
  }
  return 'High risk. Focus on reducing debt or increasing equity before applying.';
}

/**
 * Get LTV rating
 */
export function getLTVRating(ltv: number): {
  rating: string;
  color: string;
  description: string;
} {
  if (ltv < 70) {
    return {
      rating: 'Excellent',
      color: 'text-green-600',
      description: 'Strong equity position',
    };
  }
  if (ltv < 80) {
    return {
      rating: 'Good',
      color: 'text-emerald-600',
      description: 'Healthy equity position',
    };
  }
  if (ltv < 85) {
    return {
      rating: 'Fair',
      color: 'text-yellow-600',
      description: 'Moderate equity position',
    };
  }
  return {
    rating: 'High',
    color: 'text-red-600',
    description: 'Limited equity cushion',
  };
}

/**
 * Get DTI rating
 */
export function getDTIRating(dti: number): {
  rating: string;
  color: string;
  description: string;
} {
  if (dti < 36) {
    return {
      rating: 'Excellent',
      color: 'text-green-600',
      description: 'Strong debt management',
    };
  }
  if (dti < 43) {
    return {
      rating: 'Good',
      color: 'text-emerald-600',
      description: 'Acceptable debt level',
    };
  }
  if (dti < 50) {
    return {
      rating: 'Fair',
      color: 'text-yellow-600',
      description: 'Elevated debt level',
    };
  }
  return {
    rating: 'High',
    color: 'text-red-600',
    description: 'High debt burden',
  };
}

/**
 * Get credit score rating
 */
export function getCreditScoreRating(creditScore: number): {
  rating: string;
  color: string;
  description: string;
} {
  if (creditScore >= 800) {
    return {
      rating: 'Exceptional',
      color: 'text-green-600',
      description: 'Best rates available',
    };
  }
  if (creditScore >= 740) {
    return {
      rating: 'Very Good',
      color: 'text-emerald-600',
      description: 'Competitive rates',
    };
  }
  if (creditScore >= 670) {
    return {
      rating: 'Good',
      color: 'text-yellow-600',
      description: 'Standard rates',
    };
  }
  if (creditScore >= 580) {
    return {
      rating: 'Fair',
      color: 'text-orange-600',
      description: 'Higher rates',
    };
  }
  return {
    rating: 'Poor',
    color: 'text-red-600',
    description: 'May not qualify',
  };
}

// ===== v3.0 Enhanced Risk Scoring =====

/**
 * v3.0 风险评分明细
 */
export interface RiskScoreV3Breakdown {
  totalScore: number;
  riskLevel: 'low' | 'medium' | 'elevated' | 'high';
  penalties: {
    cltvPenalty: number;
    dtiPenalty: number;
    ficoPenalty: number;
    paymentShockPenalty: number;
    collateralPenalty: number;
  };
}

/**
 * 计算 CLTV Penalty（基于 modeledCLTV）
 * v3.0 规范：基于实际使用后的 CLTV 扣分
 */
export function calculateCltvPenalty(modeledCLTV: number): number {
  if (modeledCLTV <= 60) return 0;
  if (modeledCLTV <= 70) return 5;
  if (modeledCLTV <= 80) return 10;
  if (modeledCLTV <= 85) return 15;
  if (modeledCLTV <= 90) return 20;
  return 30; // >90%
}

/**
 * 计算 DTI Penalty（基于 modeledCurrentDTI）
 * v3.0 规范：基于实际使用后的 DTI 扣分
 */
export function calculateDtiPenalty(modeledCurrentDTI: number): number {
  const dtiPercent = modeledCurrentDTI * 100; // 转换为百分比
  if (dtiPercent <= 36) return 0;
  if (dtiPercent <= 43) return 5;
  if (dtiPercent <= 50) return 10;
  return 20; // >50%
}

/**
 * 计算 FICO Penalty（信用分扣分）
 * v3.0 规范：信用分越低扣分越高
 */
export function calculateFicoPenalty(creditScore: number): number {
  if (creditScore >= 760) return 0;
  if (creditScore >= 720) return 5;
  if (creditScore >= 680) return 10;
  if (creditScore >= 640) return 15;
  return 25; // <640
}

/**
 * 计算 Payment Shock Penalty
 * v3.0 规范：≤2%:0分, 2-4%:6分, 4-6%:12分, 6-8%:18分, >8%:25分
 * @param paymentShockRatio - Payment Shock / 月收入 (as decimal)
 */
export function calculatePaymentShockPenalty(paymentShockRatio: number): number {
  const shockPercent = paymentShockRatio * 100;
  if (shockPercent <= 2) return 0;
  if (shockPercent <= 4) return 6;
  if (shockPercent <= 6) return 12;
  if (shockPercent <= 8) return 18;
  return 25; // >8%
}

/**
 * 计算 Collateral Penalty（抵押物风险扣分）
 * v3.0 规范：基于房产类型和用途的综合风险
 */
export function calculateCollateralPenalty(
  propertyType: PropertyType = 'Single-family',
  occupancyType: OccupancyType = 'Primary residence'
): number {
  let penalty = 0;

  // 房产类型扣分
  switch (propertyType) {
    case 'Single-family':
    case 'Townhouse':
      penalty += 0;
      break;
    case 'Condo':
      penalty += 3;
      break;
    case 'Multi-family':
      penalty += 5;
      break;
    case 'Manufactured':
      penalty += 10;
      break;
  }

  // 房屋用途扣分
  switch (occupancyType) {
    case 'Primary residence':
      penalty += 0;
      break;
    case 'Second home':
      penalty += 3;
      break;
    case 'Investment property':
      penalty += 5;
      break;
  }

  return penalty;
}

/**
 * 计算 v3.0 风险评分
 * 基础分100分，根据5个维度扣分
 * v3.0 规范：≥80(Low), 60-79(Medium), 40-59(Elevated), <40(High)
 */
export function calculateRiskScoreV3(params: {
  modeledCLTV: number; // 实际使用后的 CLTV (as percentage)
  modeledCurrentDTI: number; // 实际使用后的 DTI (as decimal)
  creditScore: number;
  paymentShockRatio: number; // Payment Shock / 月收入 (as decimal)
  propertyType?: PropertyType;
  occupancyType?: OccupancyType;
}): RiskScoreV3Breakdown {
  const {
    modeledCLTV,
    modeledCurrentDTI,
    creditScore,
    paymentShockRatio,
    propertyType = 'Single-family',
    occupancyType = 'Primary residence',
  } = params;

  // 计算5个维度的扣分
  const cltvPenalty = calculateCltvPenalty(modeledCLTV);
  const dtiPenalty = calculateDtiPenalty(modeledCurrentDTI);
  const ficoPenalty = calculateFicoPenalty(creditScore);
  const paymentShockPenalty = calculatePaymentShockPenalty(paymentShockRatio);
  const collateralPenalty = calculateCollateralPenalty(propertyType, occupancyType);

  // 总扣分
  const totalPenalty =
    cltvPenalty + dtiPenalty + ficoPenalty + paymentShockPenalty + collateralPenalty;

  // 最终得分
  const totalScore = Math.max(0, Math.min(100, 100 - totalPenalty));

  // 风险等级（v3.0 新阈值：4个等级）
  let riskLevel: 'low' | 'medium' | 'elevated' | 'high';
  if (totalScore >= 80) {
    riskLevel = 'low';
  } else if (totalScore >= 60) {
    riskLevel = 'medium';
  } else if (totalScore >= 40) {
    riskLevel = 'elevated';
  } else {
    riskLevel = 'high';
  }

  return {
    totalScore: Math.round(totalScore),
    riskLevel,
    penalties: {
      cltvPenalty,
      dtiPenalty,
      ficoPenalty,
      paymentShockPenalty,
      collateralPenalty,
    },
  };
}

/**
 * 获取 v3.0 风险等级描述
 */
export function getRiskLevelV3Description(riskLevel: 'low' | 'medium' | 'elevated' | 'high'): string {
  switch (riskLevel) {
    case 'low':
      return 'Excellent financial health. Strong approval likelihood with competitive terms.';
    case 'medium':
      return 'Good financial position. Should qualify with standard terms.';
    case 'elevated':
      return 'Moderate risk. May face higher rates or lower approval amounts. Consider improving equity or debt ratios.';
    case 'high':
      return 'Significant risk factors. Focus on reducing debt, building equity, or improving credit before applying.';
  }
}

/**
 * 获取 v3.0 风险等级颜色
 */
export function getRiskLevelV3Color(riskLevel: 'low' | 'medium' | 'elevated' | 'high'): string {
  switch (riskLevel) {
    case 'low':
      return 'text-green-600';
    case 'medium':
      return 'text-emerald-600';
    case 'elevated':
      return 'text-yellow-600';
    case 'high':
      return 'text-red-600';
  }
}
