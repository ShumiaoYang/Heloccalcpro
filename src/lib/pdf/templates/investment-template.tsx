import React from 'react';
import { ScenarioTemplateBase } from './scenario-template-base';
import type { PdfData } from '../types';
import type { InvestmentMetrics } from '@/types/heloc-ai';
import {
  formatCurrency,
  formatPercent,
  getActionSteps,
  getCurrentMonthlyDebt,
  getInterestOnlyPayment,
  getMonthlyIncome,
} from './template-helpers';

export const InvestmentTemplate: React.FC<{ data: PdfData }> = ({ data }) => {
  const metrics = data.calculatedData.scenarioMetrics as InvestmentMetrics;
  const rate = data.calculatedData.coreMetrics.helocRate;
  const hurdleRate = metrics?.hurdleRate ?? rate;
  const netRequiredReturn = hurdleRate + 1.25;

  const monthlyIncome = Math.max(getMonthlyIncome(data), 1);
  const currentDebt = getCurrentMonthlyDebt(data);
  const helocInterestOnly = getInterestOnlyPayment(data);
  const stressedDti = ((currentDebt + helocInterestOnly) / monthlyIncome) * 100;

  const steps = getActionSteps(
    data.aiAnalysis,
    [
      'Model downside cash flow with vacancy or return drawdown assumptions.',
      'Avoid using floating-rate line debt for long-duration speculative positions.',
      'Preserve emergency reserves outside the leveraged strategy.',
    ],
    'Ask your bank whether the drawn portion can be converted to a fixed-rate loan segment.'
  );

  return (
    <ScenarioTemplateBase
      config={{
        executive: {
          title: 'The Leverage & Yield Stress Test',
          sectionTitle: 'The Executive Verdict',
          coreCopy: 'You are leveraging primary-home collateral for risk assets. If return assumptions fail, your residence is directly exposed to repayment stress.',
          secondaryCopy: data.aiAnalysis.summary,
          metrics: [
            { label: 'HELOC Cost of Capital', value: formatPercent(rate, 2) },
            { label: 'Break-Even Return (After Tax Buffer)', value: formatPercent(netRequiredReturn, 2) },
            { label: 'Equity Risk Ratio', value: formatPercent(metrics?.equityRiskRatio ?? 0, 1) },
            { label: 'Current DTI', value: formatPercent(data.calculatedData.coreMetrics.dti) },
          ],
        },
        cashFlow: {
          title: 'The Arbitrage Math',
          sectionTitle: 'Yield Threshold vs. Debt Cost',
          coreCopy: `At a funding cost near ${formatPercent(rate, 2)}, your net annual return generally needs to exceed ${formatPercent(netRequiredReturn, 2)} to justify leverage.`,
          visualType: 'bar',
          beforeLabel: 'HELOC Funding Cost',
          afterLabel: 'Required Net Return',
          beforeValue: rate,
          afterValue: netRequiredReturn,
          secondaryCopy: data.aiAnalysis.diagnostic,
        },
        warning: {
          title: 'Cash Flow Bleeding Test',
          sectionTitle: 'Downside Stress Scenario',
          warningTitle: 'Liquidity Break Risk',
          coreCopy: `If investment cash flow stalls, combined debt service can push modeled DTI toward ${formatPercent(stressedDti)}. This is where forced asset sales start.`,
          secondaryCopy: 'Stress planning must be based on worst-case cash-flow continuity, not average return assumptions.',
        },
        action: {
          title: 'Risk Isolation Setup',
          sectionTitle: 'Execution Controls',
          coreCopy: 'Follow these execution controls before deploying leveraged capital from your home equity line.',
          steps,
        },
      }}
    />
  );
};
