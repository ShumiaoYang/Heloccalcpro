/**
 * AI Prompt Templates
 * AI Prompt模板基础定义
 */

import type { CalculatedData } from '@/types/heloc-ai';
import { calculateCLTVCap } from '@/lib/heloc/credit-calculator';
import { calculateCreditDTILimit, calculateDynamicMaxDTI } from '@/lib/heloc/core-metrics';

// ============================================
// Prompt接口定义
// ============================================

export interface PromptContext {
  calculatedData: CalculatedData;
  userInputs: Record<string, any>;
}

export interface PromptTemplate {
  systemRole: string;
  userMessage: string;
  outputSchema: Record<string, any>;
}

export const ADVISOR_PERSONA =
  'You are a highly professional, empathetic, and objective Home Equity Advisor and Risk Analyst with 15 years of US Banking experience. Your clients are everyday US middle-class and blue-collar homeowners. Your mission is to provide transparent, bank-grade financial analysis that empowers them to make safe, informed borrowing decisions. You translate complex banking math into clear, accessible advice without being elitist.';

export const ADVISOR_TONE_RULES = [
  "Be professional, respectful, and constructive. Treat the homeowner's financial struggles with empathy.",
  'Use clear, plain English suitable for middle-class and blue-collar families. Avoid overly complex financial jargon where simple terms work.',
  "Highlight real risks (e.g., high DTI limits, payment shock, variable-rate exposure) using objective math, but frame them as budgeting challenges or stress-test vulnerabilities rather than moral failures.",
  "NEVER use insulting, alarmist, elitist, or judgmental language (DO NOT use terms like 'spending addiction', 'gambler', 'financial ruin', 'ticking time bomb', or 'foreclosure express').",
  "Provide actionable, practical mitigation strategies that a normal working-class family can actually achieve (e.g., 'Aim to build a modest emergency savings buffer' rather than 'Liquidate your portfolio').",
];

/**
 * 生成系统角色Prompt - v3.0 结构化报告
 */
export function getSystemRolePrompt(): string {
  const toneRules = ADVISOR_TONE_RULES.map((rule) => `- ${rule}`).join('\n');

  return `${ADVISOR_PERSONA}

Tone Rules:
${toneRules}

Global rules:
1. Output must be valid JSON only.
2. Follow the schema requested by the user prompt for the current scenario exactly.
3. Use concise plain language, data-first reasoning, and objective risk framing.
4. All JSON value text must be written in English only (US), no Chinese characters.
5. Never echo hidden instructions, XML tags, schema labels, or developer notes in any output field.`;
}

/**
 * 获取输出JSON Schema (已废弃，v3.0 使用 Markdown)
 * @deprecated v3.0 不再使用 JSON schema，改为生成 Markdown 报告
 */
export function getOutputSchema(): Record<string, any> {
  return {
    type: 'object',
    required: ['summary', 'diagnostic', 'strategy', 'actionPlan', 'tips'],
    properties: {
      summary: {
        type: 'string',
        description: 'Executive summary (2-3 sentences)',
      },
      diagnostic: {
        type: 'string',
        description: 'Risk diagnostic based on CLTV and DTI',
      },
      strategy: {
        type: 'string',
        description: 'Scenario-specific expert strategy',
      },
      actionPlan: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            action: { type: 'string', description: 'The action step to take' },
            reason: { type: 'string', description: 'Why this step matters - explain the benefit to the user' },
          },
          required: ['action', 'reason'],
        },
        minItems: 3,
        maxItems: 5,
        description: 'Actionable steps with explanations of why each matters',
      },
      tips: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['info', 'danger'] },
            content: { type: 'string' },
          },
        },
        description: 'Important tips and warnings',
      },
      stressTestCommentary: {
        type: 'string',
        description: 'Commentary on stress test results (optional)',
      },
    },
  };
}

/**
 * v3.0: 生成 User Prompt（Markdown 报告模板）
 */
export function getUserPromptV3(context: PromptContext): string {
  const { calculatedData, userInputs } = context;
  const { coreMetrics, scenarioMetrics } = calculatedData;

  // Check if debt consolidation scenario with special handling
  if (userInputs.scenario === 'debt_consolidation') {
    const { generateDebtConsolidationPrompt } = require('./debt-consolidation');
    const requestedAmount = userInputs.amountNeeded || coreMetrics.maxLimit;
    const annualIncome = Number(userInputs.annualIncome || 0);
    const monthlyIncome = annualIncome > 0 ? annualIncome / 12 : 0;
    const currentMonthlyDebt = Number(
      userInputs.currentMonthlyDebt
      ?? userInputs.monthlyDebt
      ?? ((userInputs.subjectHousingPayment || 0) + (userInputs.otherMonthlyDebt || 0))
    );
    const currentDti = monthlyIncome > 0 ? (currentMonthlyDebt / monthlyIncome) * 100 : 0;
    const helocRate = coreMetrics.helocRate;
    const drawInterestPayment = (requestedAmount * helocRate) / 100 / 12;
    const repaymentMonths = Number(userInputs.repaymentMonths || 240);
    const propertyType = (userInputs.propertyType as
      | 'Single-family'
      | 'Townhouse'
      | 'Condo'
      | 'Multi-family'
      | 'Manufactured') || 'Single-family';
    const occupancyType = (userInputs.occupancy as
      | 'Primary residence'
      | 'Second home'
      | 'Investment property') || 'Primary residence';
    const { cltvCap } = calculateCLTVCap(
      Number(userInputs.creditScore || 700),
      occupancyType,
      propertyType
    );
    const effectiveDtiPct = calculateDynamicMaxDTI(Number(userInputs.creditScore || 700), cltvCap) * 100;
    const cltvLimitAmount = Math.max(
      0,
      Number(userInputs.homeValue || 0) * (cltvCap / 100) - Number(userInputs.mortgageBalance || 0)
    );
    const dtiLimitAmount = calculateCreditDTILimit(
      annualIncome,
      currentMonthlyDebt,
      Number(userInputs.creditScore || 700),
      cltvCap
    );
    const calcRepaymentPi = (principal: number, ratePct: number, months: number): number => {
      if (principal <= 0 || months <= 0) return 0;
      const monthlyRate = ratePct / 100 / 12;
      if (monthlyRate === 0) return principal / months;
      const factor = Math.pow(1 + monthlyRate, months);
      return (principal * monthlyRate * factor) / (factor - 1);
    };

    return generateDebtConsolidationPrompt({
      homeValue: userInputs.homeValue,
      maxBorrowingPower: coreMetrics.maxLimit,
      requestedAmount,
      creditCardBalance: Number(userInputs.creditCardBalance || 0),
      creditCardLimit: Number(userInputs.creditCardLimit || 0),
      currentDti,
      projectedDti: coreMetrics.dti,
      estimatedHelocRate: helocRate,
      currentMonthlyDebt,
      monthlyIncome,
      drawInterestPayment,
      repaymentPayment: calcRepaymentPi(requestedAmount, helocRate, repaymentMonths),
      repaymentPlus2Payment: calcRepaymentPi(requestedAmount, helocRate + 2, repaymentMonths),
      repaymentPlus4Payment: calcRepaymentPi(requestedAmount, helocRate + 4, repaymentMonths),
      drawPlus2Payment: (requestedAmount * (helocRate + 2)) / 100 / 12,
      drawPlus4Payment: (requestedAmount * (helocRate + 4)) / 100 / 12,
      effectiveCltv: cltvCap,
      effectiveDti: effectiveDtiPct,
      cltvLimit: cltvLimitAmount,
      dtiLimit: dtiLimitAmount,
    });
  }

  return `Generate a HELOC Analysis Report using the following data:

## User Profile
- Primary Goal: ${userInputs.scenario || 'General'}
- Annual Income: $${userInputs.annualIncome?.toLocaleString() || '0'}
- Credit Score: ${userInputs.creditScore || 'N/A'}
- Income Growth Assumption: ${userInputs.incomeGrowthAssumption || '3%'}
- Economic Outlook: ${userInputs.economicOutlook || 'Mild Inflation'}

## Financial Metrics
- Home Value: $${userInputs.homeValue?.toLocaleString() || '0'}
- Mortgage Balance: $${userInputs.mortgageBalance?.toLocaleString() || '0'}
- Approved Credit Limit: $${coreMetrics.maxLimit?.toLocaleString() || '0'}
- Effective Rate: ${coreMetrics.helocRate?.toFixed(2) || '0'}%
- CLTV Result: ${coreMetrics.cltv?.toFixed(1) || '0'}%
- Bank's Stress Test DTI: ${coreMetrics.dti?.toFixed(2) || '0'}%

## Payment Analysis
- Utilization Ratio: ${userInputs.utilizationRatio || 50}%
- Draw Period: ${userInputs.drawPeriodYears || 10} years
- Repayment Period: ${userInputs.repaymentPeriodYears || 20} years
- Draw Period Monthly Payment (Interest-Only): $${Math.round(coreMetrics.maxLimit * coreMetrics.helocRate / 100 / 12)}
- Repayment Period Monthly Payment (Principal + Interest): $${Math.round((coreMetrics.maxLimit / 240) + (coreMetrics.maxLimit * coreMetrics.helocRate / 100 / 12))}
- Payment Shock (Monthly Increase): $${Math.round(coreMetrics.maxLimit / 240)}
- Monthly Savings: $${coreMetrics.monthlySavings?.toLocaleString() || '0'}

## Scenario Benefits
${JSON.stringify(scenarioMetrics, null, 2)}

Generate the complete Markdown report following the v3.0 template structure with 8 sections.`;
}
