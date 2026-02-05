/**
 * Credit Optimization Scenario Prompt
 * 信用优化场景Prompt模板
 */

import type { PromptContext } from './base';
import type { CreditOptimizationMetrics } from '@/types/heloc-ai';

export function getCreditOptimizationPrompt(context: PromptContext): string {
  const { calculatedData, userInputs } = context;
  const metrics = calculatedData.scenarioMetrics as CreditOptimizationMetrics;

  return `Smart thinking! Using your HELOC strategically can boost your credit profile and financial flexibility. Let's explore how.

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
1. **Liquidity Leverage**: How does this HELOC expand your financial flexibility?
2. **Credit Score Impact**: Explain utilization ratio in terms they understand
3. **Strategic Management**: How to use this tool without over-leveraging
4. **Long-term Benefits**: Building a stronger credit profile
5. **Critical Warnings**: The risks of treating credit like income

Respond with ONLY a valid JSON object in this exact format:
{
  "summary": "2-3 sentence executive summary using 'You/Your' (acknowledge their strategic thinking)",
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
