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
  getMonthlyIncome,
} from './template-helpers';

export const MaxBorrowingTemplate: React.FC<{ data: PdfData }> = ({ data }) => {
  const maxLimit = data.calculatedData.coreMetrics.maxLimit;
  const cltv = data.calculatedData.coreMetrics.cltv;
  const dti = data.calculatedData.coreMetrics.dti;
  const monthlyIncome = Math.max(getMonthlyIncome(data), 1);
  const currentDebt = getCurrentMonthlyDebt(data);
  const maxDrawPayment = getInterestOnlyPayment(data);
  const maxDrawDti = ((currentDebt + maxDrawPayment) / monthlyIncome) * 100;

  const limitingFactor = dti >= 43
    ? 'Your income side is the hard constraint: DTI pressure is at or above typical underwriting guardrails.'
    : 'Your collateral side is the hard constraint: CLTV and property risk policy cap the line size.';

  const steps = getActionSteps(
    data.aiAnalysis,
    [
      'Reduce fixed monthly obligations 30-45 days before submission.',
      'Avoid new credit inquiries before lender hard pull.',
      'Collect income documentation that supports stable repayment capacity.',
    ],
    'Pay down a recurring monthly debt before submission to free DTI headroom.'
  );

  return (
    <ScenarioTemplateBase
      config={{
        executive: {
          title: 'The Maximum Equity Report',
          sectionTitle: 'The Absolute Ceiling',
          coreCopy: `Based on LTV and income constraints, your modeled absolute line ceiling is about ${formatCurrency(maxLimit)}.`,
          secondaryCopy: data.aiAnalysis.summary,
          metrics: [
            { label: 'Absolute HELOC Ceiling', value: formatCurrency(maxLimit) },
            { label: 'Current CLTV', value: formatPercent(cltv) },
            { label: 'Bank Stress DTI', value: formatPercent(dti) },
            { label: 'Monthly Income (Gross)', value: formatCurrency(monthlyIncome) },
          ],
        },
        cashFlow: {
          title: 'The Limiting Factor',
          sectionTitle: 'What Locks Your Line Size',
          coreCopy: limitingFactor,
          visualType: 'bar',
          beforeLabel: 'Current Monthly Debt',
          afterLabel: 'If Fully Drawn (Interest-Only)',
          beforeValue: currentDebt,
          afterValue: currentDebt + maxDrawPayment,
          secondaryCopy: data.aiAnalysis.diagnostic,
        },
        warning: {
          title: 'The Max Draw Reality',
          sectionTitle: 'Leverage Stress Warning',
          warningTitle: 'Drawing Everything Is Not a Plan',
          coreCopy: `If you draw the full line, modeled monthly burden rises by about ${formatCurrency(maxDrawPayment)} and projected DTI can reach ${formatPercent(maxDrawDti)}.`,
          secondaryCopy: 'Use line size as optionality, not as a mandatory draw target.',
        },
        action: {
          title: 'Credit Profile Optimization',
          sectionTitle: 'Pre-Submission Checklist',
          coreCopy: 'Complete these profile optimization steps before lender submission to improve approval headroom.',
          steps,
        },
      }}
    />
  );
};
