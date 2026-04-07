import type { PdfData } from '../types';

export type PdfScenarioKey =
  | 'debt_consolidation'
  | 'home_renovation'
  | 'max_borrowing_power'
  | 'emergency_fund'
  | 'investment'
  | 'credit_optimization';

export interface ScenarioDefinition {
  key: PdfScenarioKey;
  title: string;
  scenarioLabel: string;
}

const SCENARIO_DEFINITIONS: Record<PdfScenarioKey, ScenarioDefinition> = {
  debt_consolidation: {
    key: 'debt_consolidation',
    title: 'The Debt Rescue Plan',
    scenarioLabel: 'Debt Consolidation',
  },
  home_renovation: {
    key: 'home_renovation',
    title: 'Home Upgrade & Financial Health Assessment',
    scenarioLabel: 'Home Renovation',
  },
  max_borrowing_power: {
    key: 'max_borrowing_power',
    title: 'The Maximum Equity Report',
    scenarioLabel: 'Max Borrowing Power',
  },
  emergency_fund: {
    key: 'emergency_fund',
    title: 'The Financial Safety Net Assessment',
    scenarioLabel: 'Emergency Fund',
  },
  investment: {
    key: 'investment',
    title: 'The Leverage & Yield Stress Test',
    scenarioLabel: 'Investment / Real Estate',
  },
  credit_optimization: {
    key: 'credit_optimization',
    title: 'The Credit Profile Optimization Plan',
    scenarioLabel: 'Credit Optimization',
  },
};

export function resolvePdfScenario(rawScenario?: string, isMaxBorrowing?: boolean): PdfScenarioKey {
  if (isMaxBorrowing) {
    return 'max_borrowing_power';
  }

  switch (rawScenario) {
    case 'debt_consolidation':
      return 'debt_consolidation';
    case 'home_renovation':
      return 'home_renovation';
    case 'emergency_fund':
      return 'emergency_fund';
    case 'investment':
      return 'investment';
    case 'credit_optimization':
      return 'credit_optimization';
    default:
      return 'debt_consolidation';
  }
}

export function resolvePdfScenarioFromData(data: PdfData): PdfScenarioKey {
  const inferredMaxBorrowing = data.isMaxBorrowing
    || (!data.userInputs?.amountNeeded || Number(data.userInputs?.amountNeeded) === 0);

  return resolvePdfScenario(
    (data.scenario as string) || (data.userInputs?.scenario as string),
    inferredMaxBorrowing
  );
}

export function getScenarioDefinition(scenario: PdfScenarioKey): ScenarioDefinition {
  return SCENARIO_DEFINITIONS[scenario];
}
