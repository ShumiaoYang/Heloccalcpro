import React from 'react';
import { ScenarioTemplateBase } from './scenario-template-base';
import type { PdfData } from '../types';
import type { EmergencyFundMetrics } from '@/types/heloc-ai';
import {
  formatCurrency,
  formatPercent,
  getActionSteps,
  getCurrentMonthlyDebt,
  getLoanAmount,
} from './template-helpers';

export const EmergencyFundTemplate: React.FC<{ data: PdfData }> = ({ data }) => {
  const metrics = data.calculatedData.scenarioMetrics as EmergencyFundMetrics;
  const availableLiquidity = metrics?.availableLiquidity ?? getLoanAmount(data);
  const monthlyNeed = Math.max(getCurrentMonthlyDebt(data), 1);
  const monthsCovered = metrics?.monthsCovered ?? availableLiquidity / monthlyNeed;

  const steps = getActionSteps(
    data.aiAnalysis,
    [
      'Request fee schedule in writing before signing.',
      'Set a calendar reminder to check line status and unused-line fees.',
      'Maintain a parallel cash reserve outside the HELOC line.',
    ],
    'Ask the loan officer to mark annual fee, inactivity fee, and early closure fee clauses.'
  );

  return (
    <ScenarioTemplateBase
      config={{
        executive: {
          title: 'The Financial Safety Net Assessment',
          sectionTitle: 'The Executive Verdict',
          coreCopy: `This is a defensive liquidity strategy. You can convert roughly ${formatCurrency(availableLiquidity)} of idle equity into accessible backup capital.`,
          secondaryCopy: 'If you do not draw funds, modeled HELOC monthly payment stays at $0.',
          metrics: [
            { label: 'Available Backup Liquidity', value: formatCurrency(availableLiquidity) },
            { label: 'Months of Runway', value: `${monthsCovered.toFixed(1)} months` },
            { label: 'Current CLTV', value: formatPercent(data.calculatedData.coreMetrics.cltv) },
            { label: 'Current DTI', value: formatPercent(data.calculatedData.coreMetrics.dti) },
          ],
        },
        cashFlow: {
          title: 'The Survival Runway',
          sectionTitle: 'No-Income Coverage Stress View',
          coreCopy: `Under a no-income emergency assumption, this line can support around ${monthsCovered.toFixed(1)} months of obligations.`,
          visualType: 'bar',
          beforeLabel: 'Monthly Obligation Need',
          afterLabel: 'Backup Liquidity / Month Equivalent',
          beforeValue: monthlyNeed,
          afterValue: monthsCovered > 0 ? availableLiquidity / monthsCovered : 0,
          secondaryCopy: data.aiAnalysis.diagnostic,
        },
        warning: {
          title: 'The Cost of Carry Warning',
          sectionTitle: 'Hidden Fee and Freeze Risk',
          warningTitle: 'No Free Lunch in Liquidity',
          coreCopy: 'Some lenders apply annual, inactivity, or closure fees and can reduce available lines during market stress.',
          secondaryCopy: data.aiAnalysis.strategy,
        },
        action: {
          title: 'Account Maintenance Rules',
          sectionTitle: 'Fee & Clause Checklist',
          coreCopy: 'Use this checklist before signing to control fee leakage and preserve emergency access quality.',
          steps,
        },
      }}
    />
  );
};
