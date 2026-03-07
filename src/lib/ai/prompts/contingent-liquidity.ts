/**
 * Contingent Liquidity Scenario Prompt
 * 应急流动性场景Prompt模板
 */

import type { PromptContext } from './base';
import type { ContingentLiquidityMetrics } from '@/types/heloc-ai';

export function getContingentLiquidityPrompt(context: PromptContext): string {
  const { calculatedData, userInputs } = context;
  const metrics = calculatedData.scenarioMetrics as ContingentLiquidityMetrics;

  return `Analyze this HELOC as contingent liquidity for financial emergencies.

## Financial Snapshot
- Home Value: $${userInputs.homeValue?.toLocaleString()}
- HELOC Limit: $${calculatedData.coreMetrics.maxLimit.toLocaleString()}
- Monthly Expenses: $${userInputs.monthlyExpenses?.toLocaleString()}
- CLTV: ${calculatedData.coreMetrics.cltv}%
- DTI: ${calculatedData.coreMetrics.dti}%

## Coverage Analysis
- Available Liquidity: $${metrics?.availableLiquidity?.toLocaleString() || 'N/A'}
- Months Covered: ${metrics?.monthsCovered || 'N/A'} months

Provide analysis covering:
1. **Liquidity Coverage**: How many months of expenses are covered?
2. **HELOC vs. Cash Savings**: Trade-offs and opportunity costs
3. **Critical Risk Warning**: HELOC lines can be frozen or reduced during economic downturns when you need them most
4. **Appropriate Usage**: When to use HELOC vs. other emergency resources
5. **Backup Plan**: Why you need additional emergency savings

Respond with ONLY valid JSON in this format:
{
  "summary": "2-3 sentence summary",
  "diagnostic": "Risk diagnostic with CLTV and DTI context",
  "strategy": "Strategy for contingent liquidity with risk warnings",
  "actionPlan": [{"action": "Step", "reason": "Why it matters"}],
  "tips": [
    {"type": "danger", "content": "WARNING: HELOC lines can be frozen/reduced during economic stress"},
    {"type": "info", "content": "Best practices for contingent liquidity"}
  ]
}`;
}
