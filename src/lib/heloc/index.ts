/**
 * HELOC Calculator Library
 * Main entry point for all HELOC calculation functions
 */

// Types
export type {
  HelocInput,
  HelocResult,
  StressTestInput,
  StressTestResult,
  CreditScoreRange,
} from './types';

export { CREDIT_SCORE_RANGES, DEFAULT_VALUES } from './types';

// Core Calculator
export {
  calculateHeloc,
  calculatePrincipalAndInterestPayment,
  formatCurrency,
  formatPercentage,
} from './calculator';

// Risk Score
export {
  calculateRiskScore,
  calculateRiskScoreBreakdown,
  getRiskLevel,
  getRiskLevelColor,
  getRiskLevelDescription,
  getLTVRating,
  getDTIRating,
  getCreditScoreRating,
} from './risk-score';

export type { RiskScoreBreakdown } from './risk-score';

// Stress Test
export {
  runStressTest,
  calculatePaymentChange,
  calculateAffordabilityThreshold,
  generateStressScenarios,
  calculateBreakEvenGrowth,
} from './stress-test';
