/**
 * Investment Scenario Prompt
 * 投资场景Prompt模板
 */

import { ADVISOR_PERSONA, ADVISOR_TONE_RULES, type PromptContext } from './base';
import type { InvestmentMetrics } from '@/types/heloc-ai';

export function getInvestmentPrompt(context: PromptContext): string {
  const { calculatedData, userInputs } = context;
  const metrics = calculatedData.scenarioMetrics as InvestmentMetrics;
  const toneRules = ADVISOR_TONE_RULES.map((rule) => `- ${rule}`).join('\n');

  return `Role Reminder (must follow):
"${ADVISOR_PERSONA}"

Tone Rules (must follow):
${toneRules}

Scenario stance:
- Speak like a professional quant-style risk analyst with respectful language.
- Focus on break-even math, downside scenarios, and cash-flow resilience.
- Keep advice practical for middle-class and blue-collar households.

Using home equity for investment leverage requires hard downside analysis.

## Your Financial Snapshot
- Home Value: $${userInputs.homeValue?.toLocaleString()}
- Mortgage Balance: $${userInputs.mortgageBalance?.toLocaleString()}
- Your HELOC Limit: $${calculatedData.coreMetrics.maxLimit.toLocaleString()}
- Your HELOC Rate: ${calculatedData.coreMetrics.helocRate}%
- Your CLTV: ${calculatedData.coreMetrics.cltv}%
- Your DTI: ${calculatedData.coreMetrics.dti}%

## Your Investment Analysis
- Investment Amount: $${userInputs.investmentAmount?.toLocaleString() || 'N/A'}
- Investment Type: ${userInputs.investmentType || 'N/A'}
- Hurdle Rate (Minimum ROI Needed): ${metrics?.hurdleRate || 'N/A'}%
- Equity Risk Ratio: ${metrics?.equityRiskRatio || 'N/A'}%

### Calculation Assumptions
- Hurdle rate = Your HELOC interest rate (break-even point)
- Equity risk ratio = Investment amount / Home equity
- Does not account for investment volatility

Provide your analysis covering:
1. Hurdle Rate Analysis: required net return to clear debt cost after tax drag.
2. Equity Risk Assessment: quantify how much home equity is exposed.
3. Leverage Strategy: identify strict conditions where leverage is defensible.
4. Risk-Adjusted Returns: include downside volatility and vacancy/market shock cases.
5. Critical Warnings: explain household budget stress if cash flow weakens.

Respond with ONLY a valid JSON object in this exact format:
{
  "summary": "2-3 sentence executive summary using 'You/Your' in professional, accessible tone",
  "diagnostic": "Risk diagnostic with special emphasis on leverage risks",
  "strategy": "Investment strategy with clear risk boundaries and practical safeguards",
  "actionPlan": ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"],
  "tips": [
    {"type": "info", "content": "Pro tip about leverage investing"},
    {"type": "danger", "content": "Critical warning about downside risks"}
  ],
  "stressTestCommentary": "Optional commentary"
}`;
}
