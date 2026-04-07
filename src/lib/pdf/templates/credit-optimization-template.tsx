import React from 'react';
import { ScenarioTemplateBase } from './scenario-template-base';
import type { PdfData } from '../types';
import type { CreditOptimizationMetrics } from '@/types/heloc-ai';
import {
  formatCurrency,
  formatPercent,
  getActionSteps,
  getCurrentMonthlyDebt,
  getInterestOnlyPayment,
} from './template-helpers';

export const CreditOptimizationTemplate: React.FC<{ data: PdfData }> = ({ data }) => {
  const metrics = data.calculatedData.scenarioMetrics as CreditOptimizationMetrics;
  const oldDebt = getCurrentMonthlyDebt(data);
  const newDebt = oldDebt + getInterestOnlyPayment(data);

  const steps = getActionSteps(
    data.aiAnalysis,
    [
      'Keep revolving utilization low after transfer and avoid re-loading cards.',
      'Monitor statement-level utilization, not only payment history.',
      'Do not treat added credit headroom as spendable income.',
    ],
    'Set hard utilization caps and automatic alerts before any transfer.'
  );

  return (
    <ScenarioTemplateBase
      config={{
        executive: {
          title: 'The Credit Profile Optimization Plan',
          sectionTitle: 'The Executive Verdict',
          coreCopy: 'This setup can improve revolving utilization math, but only if post-transfer credit behavior stays controlled.',
          secondaryCopy: data.aiAnalysis.summary,
          metrics: [
            { label: 'Estimated Credit Paydown via HELOC', value: formatCurrency(metrics?.creditLimitBoost ?? 0) },
            { label: 'Modeled Utilization Drop', value: formatPercent(metrics?.utilizationDrop ?? 0, 1) },
            { label: 'Current CLTV', value: formatPercent(data.calculatedData.coreMetrics.cltv) },
            { label: 'Current DTI', value: formatPercent(data.calculatedData.coreMetrics.dti) },
          ],
        },
        cashFlow: {
          title: 'The Monthly Cost Tradeoff',
          sectionTitle: 'Payment Shift View',
          coreCopy: 'You may reduce revolving pressure, but HELOC interest carrying cost still needs strict monthly controls.',
          visualType: 'bar',
          beforeLabel: 'Current Monthly Debt',
          afterLabel: 'Projected Monthly Debt',
          beforeValue: oldDebt,
          afterValue: newDebt,
          secondaryCopy: data.aiAnalysis.diagnostic,
        },
        warning: {
          title: 'Behavior Risk Warning',
          sectionTitle: 'Do Not Re-Leverage',
          warningTitle: 'Credit Score Gains Are Fragile',
          coreCopy: 'If card balances rebuild after transfer, utilization rebounds and risk accelerates.',
          secondaryCopy: data.aiAnalysis.strategy,
        },
        action: {
          title: 'Execution Checklist',
          sectionTitle: 'Credit Discipline Controls',
          coreCopy: 'Use this checklist to keep utilization gains and prevent post-transfer balance relapse.',
          steps,
        },
      }}
    />
  );
};
