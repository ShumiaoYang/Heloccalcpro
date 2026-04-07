/**
 * Emergency Fund Scenario Prompt
 * 应急基金场景Prompt模板
 */

import { ADVISOR_PERSONA, ADVISOR_TONE_RULES, type PromptContext } from './base';
import type { EmergencyFundMetrics } from '@/types/heloc-ai';

export function getEmergencyFundPrompt(context: PromptContext): string {
  const { calculatedData, userInputs } = context;
  const metrics = calculatedData.scenarioMetrics as EmergencyFundMetrics;
  const toneRules = ADVISOR_TONE_RULES.map((rule) => `- ${rule}`).join('\n');

  return `Role Reminder (must follow):
"${ADVISOR_PERSONA}"

Tone Rules (must follow):
${toneRules}

Scenario stance:
- Speak like a highly conservative defensive advisor.
- Praise preparedness but focus on hidden lender constraints and fee traps.

Analyze this HELOC as an emergency fund strategy with strict risk framing.

## Your Financial Snapshot
- Home Value: $${userInputs.homeValue?.toLocaleString()}
- Your HELOC Limit: $${calculatedData.coreMetrics.maxLimit.toLocaleString()}
- Monthly Expenses: $${userInputs.monthlyExpenses?.toLocaleString()}
- Your CLTV: ${calculatedData.coreMetrics.cltv}%
- Your DTI: ${calculatedData.coreMetrics.dti}%

## Your Emergency Fund Coverage
- Available Liquidity: $${metrics?.availableLiquidity?.toLocaleString() || 'N/A'}
- Months You're Covered: ${metrics?.monthsCovered || 'N/A'} months

### Calculation Assumptions
- Based on your monthly expenses
- HELOC provides on-demand liquidity
- Interest only charged when used

Provide your analysis covering:
1. **Survival Curve**: How many months of peace of mind does this provide?
2. **Liquidity Advantage**: HELOC vs. traditional savings (opportunity cost)
3. **Cost of Access**: Interest rate is the "insurance premium"
4. **Appropriate Usage**: When to tap this vs. other resources
5. **Critical Warnings**: The risks of using home equity for emergencies

Respond with ONLY a valid JSON object in this exact format:
{
  "summary": "2-3 sentence executive summary using 'You/Your' with supportive, objective tone",
  "diagnostic": "Risk diagnostic explaining CLTV and DTI",
  "strategy": "Strategy for using HELOC as emergency fund",
  "actionPlan": ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"],
  "tips": [
    {"type": "info", "content": "Pro tip about emergency fund strategy"},
    {"type": "danger", "content": "Critical warning about risks"}
  ],
  "stressTestCommentary": "Optional commentary"
}`;
}
