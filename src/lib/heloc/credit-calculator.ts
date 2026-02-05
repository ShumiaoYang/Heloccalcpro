// HELOC Credit Calculator - Calculate available credit line

export interface CreditInput {
  homeValue: number;
  mortgageBalance: number;
  creditScore: number;
  desiredLTV: number; // as percentage (e.g., 80 for 80%)
}

export interface CreditResult {
  maxHelocAmount: number;
  currentEquity: number;
  availableEquity: number;
  currentLTV: number;
  projectedLTV: number;
  riskLevel: 'low' | 'medium' | 'high';
  riskScore: number; // 0-100
}

// Credit score ranges and their typical max LTV
const CREDIT_SCORE_LTV_MAP = {
  excellent: { min: 740, maxLTV: 90 },
  good: { min: 670, maxLTV: 85 },
  fair: { min: 580, maxLTV: 80 },
  poor: { min: 0, maxLTV: 75 },
};

/**
 * Get maximum allowed LTV based on credit score
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
 */
export function calculateCredit(input: CreditInput): CreditResult {
  const { homeValue, mortgageBalance, creditScore, desiredLTV } = input;

  // Validate inputs
  if (homeValue <= 0 || mortgageBalance < 0 || desiredLTV <= 0 || desiredLTV > 100) {
    throw new Error('Invalid input parameters');
  }

  // Get maximum allowed LTV based on credit score
  const maxAllowedLTV = getMaxLTVByCredit(creditScore);

  // Use the lower of desired LTV and max allowed LTV
  const effectiveLTV = Math.min(desiredLTV, maxAllowedLTV);

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
