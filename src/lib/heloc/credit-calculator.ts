// HELOC Credit Calculator - Calculate available credit line
// v3.0: Enhanced CLTV Cap calculation with multi-dimensional risk factors

import { PropertyType, OccupancyType, pctToDecimal } from './types';

export interface CreditInput {
  homeValue: number;
  mortgageBalance: number;
  creditScore: number;
  desiredLTV: number; // as percentage (e.g., 80 for 80%)
  // v3.0 新增字段
  propertyType?: PropertyType;
  occupancyType?: OccupancyType;
  annualIncome?: number;
  existingMonthlyDebt?: number;
}

export interface CreditResult {
  maxHelocAmount: number;
  currentEquity: number;
  availableEquity: number;
  currentLTV: number;
  projectedLTV: number;
  riskLevel: 'low' | 'medium' | 'high';
  riskScore: number; // 0-100
  // v3.0 新增字段
  cltvCap: number; // 最终 CLTV cap (as percentage)
  baseCLTVCap: number; // 基础 CLTV cap
  occupancyAdjustment: number; // 房屋用途调整
  propertyTypeAdjustment: number; // 房产类型调整
}

// ===== v3.0 CLTV Cap 计算规则 =====

/**
 * 获取基础 CLTV Cap（基于信用分）
 * v3.0 规范：4档位
 */
export function getBaseCLTVCap(creditScore: number): number {
  if (creditScore >= 760) return 90;  // 760+ → 90%
  if (creditScore >= 720) return 85;  // 720+ → 85%
  if (creditScore >= 680) return 80;  // 680+ → 80%
  if (creditScore >= 640) return 75;  // 640+ → 75%
  return 0; // 低于640不符合资格
}

/**
 * 获取房屋用途调整
 * v3.0 规范：Primary(0), Second home(-5%), Investment(-10%)
 */
export function getOccupancyAdjustment(occupancyType: OccupancyType = 'Primary residence'): number {
  switch (occupancyType) {
    case 'Primary residence':
      return 0;
    case 'Second home':
      return -5;
    case 'Investment property':
      return -10;
    default:
      return 0;
  }
}

/**
 * 获取房产类型调整
 * v3.0 规范：Single-family(0), Condo(-5%), Multi-family(-10%), Manufactured(-25%)
 */
export function getPropertyTypeAdjustment(propertyType: PropertyType = 'Single-family'): number {
  switch (propertyType) {
    case 'Single-family':
    case 'Townhouse':
      return 0;
    case 'Condo':
      return -5;
    case 'Multi-family':
      return -10;
    case 'Manufactured':
      return -25;
    default:
      return 0;
  }
}

/**
 * 计算最终 CLTV Cap
 * v3.0 规范：min(90%, baseCLTVCap + occupancyAdj + propertyTypeAdj)
 */
export function calculateCLTVCap(
  creditScore: number,
  occupancyType: OccupancyType = 'Primary residence',
  propertyType: PropertyType = 'Single-family'
): {
  cltvCap: number;
  baseCLTVCap: number;
  occupancyAdjustment: number;
  propertyTypeAdjustment: number;
} {
  const baseCLTVCap = getBaseCLTVCap(creditScore);
  const occupancyAdjustment = getOccupancyAdjustment(occupancyType);
  const propertyTypeAdjustment = getPropertyTypeAdjustment(propertyType);

  // 计算最终 CLTV cap，但不超过 90%
  const cltvCap = Math.min(90, baseCLTVCap + occupancyAdjustment + propertyTypeAdjustment);

  return {
    cltvCap,
    baseCLTVCap,
    occupancyAdjustment,
    propertyTypeAdjustment,
  };
}

// ===== 旧版兼容函数 =====

// Credit score ranges and their typical max LTV (旧版，保留向后兼容)
const CREDIT_SCORE_LTV_MAP = {
  excellent: { min: 740, maxLTV: 90 },
  good: { min: 670, maxLTV: 85 },
  fair: { min: 580, maxLTV: 80 },
  poor: { min: 0, maxLTV: 75 },
};

/**
 * Get maximum allowed LTV based on credit score (旧版函数，保留向后兼容)
 * @deprecated 使用 getBaseCLTVCap() 代替
 */
export function getMaxLTVByCredit(creditScore: number): number {
  if (creditScore >= CREDIT_SCORE_LTV_MAP.excellent.min) {
    return CREDIT_SCORE_LTV_MAP.excellent.maxLTV;
  }
  if (creditScore >= CREDIT_SCORE_LTV_MAP.good.min) {
    return CREDIT_SCORE_LTV_MAP.good.maxLTV;
  }
  if (creditScore >= CREDIT_SCORE_LTV_MAP.fair.min) {
    return CREDIT_SCORE_LTV_MAP.fair.maxLTV;
  }
  return CREDIT_SCORE_LTV_MAP.poor.maxLTV;
}

/**
 * Calculate risk score based on LTV and credit score
 */
function calculateRiskScore(ltv: number, creditScore: number): number {
  // LTV component (0-50 points, lower is better)
  const ltvScore = Math.max(0, 50 - (ltv / 100) * 50);

  // Credit score component (0-50 points, higher is better)
  const creditScoreNormalized = Math.min(850, Math.max(300, creditScore));
  const creditComponent = ((creditScoreNormalized - 300) / 550) * 50;

  return Math.round(ltvScore + creditComponent);
}

/**
 * Determine risk level based on risk score
 */
function getRiskLevel(riskScore: number): 'low' | 'medium' | 'high' {
  if (riskScore >= 70) return 'low';
  if (riskScore >= 50) return 'medium';
  return 'high';
}

/**
 * Calculate HELOC credit availability
 * v3.0: Enhanced with multi-dimensional CLTV Cap calculation
 */
export function calculateCredit(input: CreditInput): CreditResult {
  const {
    homeValue,
    mortgageBalance,
    creditScore,
    desiredLTV,
    propertyType = 'Single-family',
    occupancyType = 'Primary residence',
  } = input;

  // Validate inputs
  if (homeValue <= 0 || mortgageBalance < 0 || desiredLTV <= 0 || desiredLTV > 100) {
    throw new Error('Invalid input parameters');
  }

  // v3.0: 计算最终 CLTV Cap
  const cltvCapResult = calculateCLTVCap(creditScore, occupancyType, propertyType);
  const { cltvCap, baseCLTVCap, occupancyAdjustment, propertyTypeAdjustment } = cltvCapResult;

  // 使用 v3.0 CLTV Cap (较低的那个)
  const effectiveLTV = Math.min(desiredLTV, cltvCap);

  // Calculate current equity
  const currentEquity = homeValue - mortgageBalance;

  // Calculate maximum total loan amount (mortgage + HELOC)
  const maxTotalLoan = (homeValue * effectiveLTV) / 100;

  // Calculate maximum HELOC amount
  const maxHelocAmount = Math.max(0, maxTotalLoan - mortgageBalance);

  // Calculate available equity (considering LTV limit)
  const availableEquity = maxHelocAmount;

  // Calculate current LTV
  const currentLTV = mortgageBalance > 0 ? (mortgageBalance / homeValue) * 100 : 0;

  // Calculate projected LTV (with HELOC)
  const projectedLTV = ((mortgageBalance + maxHelocAmount) / homeValue) * 100;

  // Calculate risk score
  const riskScore = calculateRiskScore(projectedLTV, creditScore);
  const riskLevel = getRiskLevel(riskScore);

  return {
    maxHelocAmount,
    currentEquity,
    availableEquity,
    currentLTV,
    projectedLTV,
    riskLevel,
    riskScore,
    // v3.0 新增返回值
    cltvCap,
    baseCLTVCap,
    occupancyAdjustment,
    propertyTypeAdjustment,
  };
}

/**
 * Validate credit input
 */
export function validateCreditInput(input: Partial<CreditInput>): string[] {
  const errors: string[] = [];

  if (!input.homeValue || input.homeValue <= 0) {
    errors.push('Home value must be greater than 0');
  }

  if (input.mortgageBalance === undefined || input.mortgageBalance < 0) {
    errors.push('Mortgage balance cannot be negative');
  }

  if (input.mortgageBalance && input.homeValue && input.mortgageBalance >= input.homeValue) {
    errors.push('Mortgage balance cannot exceed home value');
  }

  if (!input.creditScore || input.creditScore < 300 || input.creditScore > 850) {
    errors.push('Credit score must be between 300 and 850');
  }

  if (!input.desiredLTV || input.desiredLTV <= 0 || input.desiredLTV > 100) {
    errors.push('LTV ratio must be between 0 and 100');
  }

  return errors;
}

/**
 * v3.0: 计算最终批准的信用额度（同时考虑 CLTV 和 DTI 限制）
 */
export function calculateApprovedCreditLimit(input: CreditInput): CreditResult & {
  approvedCreditLimit: number;
  cltvLimit: number;
  dtiLimit: number;
  limitingFactor: 'cltv' | 'dti' | 'none';
} {
  const baseResult = calculateCredit(input);

  // CLTV 限制的额度
  const cltvLimit = baseResult.maxHelocAmount;

  // DTI 限制的额度（如果提供了收入和债务信息）
  let dtiLimit = Infinity;
  let limitingFactor: 'cltv' | 'dti' | 'none' = 'none';

  if (input.annualIncome && input.existingMonthlyDebt !== undefined) {
    const { calculateCreditDTILimit, calculateDynamicMaxDTI } = require('./core-metrics');
    const projectedCLTV = baseResult.projectedLTV;
    dtiLimit = calculateCreditDTILimit(
      input.annualIncome,
      input.existingMonthlyDebt,
      input.creditScore,
      projectedCLTV
    );
  }

  // 取较小值
  const approvedCreditLimit = Math.min(cltvLimit, dtiLimit);

  if (approvedCreditLimit === cltvLimit && cltvLimit < dtiLimit) {
    limitingFactor = 'cltv';
  } else if (approvedCreditLimit === dtiLimit && dtiLimit < cltvLimit) {
    limitingFactor = 'dti';
  }

  return {
    ...baseResult,
    approvedCreditLimit,
    cltvLimit,
    dtiLimit: dtiLimit === Infinity ? cltvLimit : dtiLimit,
    limitingFactor,
  };
}
