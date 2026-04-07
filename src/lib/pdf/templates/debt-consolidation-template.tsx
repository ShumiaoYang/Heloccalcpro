import React from 'react';
import { ScenarioTemplateBase } from './scenario-template-base';
import type { PdfData } from '../types';
import {
  formatCurrency,
  formatPercent,
  getActionSteps,
  getCurrentMonthlyDebt,
  getInterestOnlyPayment,
  getLoanAmount,
} from './template-helpers';

export const DebtConsolidationTemplate = ({ data }: { data: PdfData }) => {
  const loanAmount = getLoanAmount(data);
  const oldPayment = getCurrentMonthlyDebt(data);
  const newPayment = getInterestOnlyPayment(data);
  const monthlyRelief = Math.max(0, oldPayment - newPayment);

  const cltv = data.calculatedData.coreMetrics.cltv;
  const dti = data.calculatedData.coreMetrics.dti;
  const rate = data.calculatedData.coreMetrics.helocRate;

  const warningTitle = data.aiAnalysis.radicalCandorWarning?.title || 'WARNING: Do Not Turn Your Home Into an ATM';
  const warningBody = data.aiAnalysis.radicalCandorWarning?.message ||
    'The only acceptable use of this plan is disciplined debt payoff. Cut up your credit cards immediately and stop revolving balances.';

  const steps = getActionSteps(
    data.aiAnalysis,
    [
      'Freeze all revolving credit spending the same day the HELOC funds.',
      'Track debt payoff progress weekly and keep balances at $0 after payoff.',
      'Set automatic payment to avoid late fees and re-accumulation.',
    ],
    'Ask your bank for Direct Pay so funds go straight to credit card issuers.'
  );

  return (
    <ScenarioTemplateBase
      config={{
        executive: {
          title: 'The Debt Rescue Plan',
          sectionTitle: 'The Executive Verdict',
          coreCopy: `Your home equity can absorb about ${formatCurrency(loanAmount)} of high-interest debt. Mathematically, this immediately reduces credit-card interest drag on your monthly cash flow.`,
          secondaryCopy: data.aiAnalysis.summary || '',
          metrics: [
            { label: 'Target Debt Transfer', value: formatCurrency(loanAmount) },
            { label: 'Current DTI', value: formatPercent(dti) },
            { label: 'Post-Transfer CLTV', value: formatPercent(cltv) },
            { label: 'HELOC Rate', value: formatPercent(rate, 2) },
          ],
        },
        cashFlow: {
          title: 'The Bleeding vs. The Cure',
          sectionTitle: 'Before & After Cash Flow',
          coreCopy: `After transferring debt, your next monthly statement can drop by about ${formatCurrency(monthlyRelief)}. You did not erase debt, you moved debt onto your house.`,
          visualType: 'bar',
          beforeLabel: 'Before: Current Monthly Debt',
          afterLabel: 'After: HELOC Interest-Only',
          beforeValue: oldPayment,
          afterValue: newPayment,
          secondaryCopy: data.aiAnalysis.cashFlowAnalysis?.commentary,
        },
        warning: {
          title: 'The Radical Candor',
          sectionTitle: 'Behavior Risk Warning',
          warningTitle,
          coreCopy: warningBody,
          secondaryCopy: 'Historical behavior risk is the real failure point, not the initial transfer math.',
        },
        action: {
          title: 'Next Steps & Bank Prep',
          sectionTitle: 'Execution Checklist',
          coreCopy: 'Use this checklist when you speak with your loan officer to reduce execution risk and avoid debt relapse.',
          steps,
        },
      }}
    />
  );
};
