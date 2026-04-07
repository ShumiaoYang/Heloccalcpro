/**
 * Credit Optimization Scenario Prompt
 * 信用优化场景Prompt模板
 */

import { ADVISOR_PERSONA, ADVISOR_TONE_RULES, type PromptContext } from './base';
import type { CreditOptimizationMetrics } from '@/types/heloc-ai';

export function getCreditOptimizationPrompt(context: PromptContext): string {
  const { calculatedData, userInputs } = context;
  const metrics = calculatedData.scenarioMetrics as CreditOptimizationMetrics;
  const toneRules = ADVISOR_TONE_RULES.map((rule) => `- ${rule}`).join('\n');

  return `Role Reminder (must follow):
"${ADVISOR_PERSONA}"

Tone Rules (must follow):
${toneRules}

Scenario stance:
- Speak like a professional credit-risk reviewer.
- Explain utilization improvements without promoting extra debt.
- Emphasize sustainable repayment habits and relapse prevention.

## Your Financial Snapshot
- Home Value: $${userInputs.homeValue?.toLocaleString()}
- Your HELOC Limit: $${calculatedData.coreMetrics.maxLimit.toLocaleString()}
- Your Credit Score: ${userInputs.creditScore}
- Your CLTV: ${calculatedData.coreMetrics.cltv}%
- Your DTI: ${calculatedData.coreMetrics.dti}%

## Your Credit Optimization Opportunity
- Credit Limit Boost: $${metrics?.creditLimitBoost?.toLocaleString() || 'N/A'}
- Utilization Drop: ${metrics?.utilizationDrop || 'N/A'}%

### Calculation Assumptions
- HELOC adds to total available credit
- Lower utilization typically improves credit scores
- Assumes responsible credit management

Provide your analysis covering:
1. Liquidity Leverage: where line access helps and where it becomes hidden leverage.
2. Credit Score Impact: utilization math and realistic timeline expectations.
3. Strategic Management: practical guardrails to prevent re-accumulation.
4. Long-term Stability: how to preserve score improvements under stress.
5. Critical Warnings: why treating credit like income creates budget strain and collateral risk.

Respond with ONLY a valid JSON object in this exact format:
{
  "summary": "2-3 sentence executive summary using 'You/Your' with professional, empathetic tone",
  "diagnostic": "Risk diagnostic explaining CLTV and DTI in context of their security",
  "strategy": "Scenario-specific strategy for credit optimization",
  "actionPlan": ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"],
  "tips": [
    {"type": "info", "content": "Pro tip about credit utilization"},
    {"type": "danger", "content": "Critical warning about over-leveraging"}
  ],
  "stressTestCommentary": "Optional commentary on stress test results"
}`;
}
