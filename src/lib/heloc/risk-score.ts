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
