/**
 * Debt Consolidation Scenario Prompt
 * 债务整合场景Prompt模板
 */

import type { PromptContext } from './base';
import type { DebtConsolidationMetrics } from '@/types/heloc-ai';

export function getDebtConsolidationPrompt(context: PromptContext): string {
  const { calculatedData, userInputs } = context;
  const metrics = calculatedData.scenarioMetrics as DebtConsolidationMetrics;

  return `It's exciting that you're considering using your HELOC to consolidate high-interest debt. Let's analyze your situation together.

## Your Financial Snapshot
- Home Value: $${userInputs.homeValue?.toLocaleString()}
- Mortgage Balance: $${userInputs.mortgageBalance?.toLocaleString()}
- Your HELOC Limit: $${calculatedData.coreMetrics.maxLimit.toLocaleString()}
- Your HELOC Rate: ${calculatedData.coreMetrics.helocRate}%
- Your CLTV: ${calculatedData.coreMetrics.cltv}%
- Your DTI: ${calculatedData.coreMetrics.dti}%

## Your Debt Consolidation Opportunity
- Credit Card Balance: $${userInputs.creditCardBalance?.toLocaleString()}
- Estimated Interest You Could Save: $${metrics?.interestSaved?.toLocaleString() || 'N/A'}
- Time You Could Save on Payoff: ${metrics?.payoffMonthsReduced || 'N/A'} months

### Calculation Assumptions
- Average credit card rate: 18-24% (based on credit score)
- HELOC rate advantage: ${calculatedData.coreMetrics.helocRate}% vs. credit card rates
- Payoff calculation assumes consistent monthly payments

Provide your analysis covering:
1. **Interest Rate Arbitrage**: Explain the savings in terms they can feel (e.g., "That's like getting a raise of $X per month")
2. **Debt Freedom Timeline**: How much faster can they become debt-free?
3. **Risk Management**: What happens if they continue using credit cards after consolidation?
4. **Discipline Strategy**: How to ensure this is a one-time reset, not a cycle
5. **Critical Warnings**: Be honest about the risks of converting unsecured to secured debt

Respond with ONLY a valid JSON object in this exact format:
{
  "summary": "2-3 sentence executive summary using 'You/Your' (acknowledge their goal with empathy)",
  "diagnostic": "Risk diagnostic explaining CLTV and DTI in context of their security",
  "strategy": "Scenario-specific strategy that feels like a roadmap, not orders",
  "actionPlan": ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"],
  "tips": [
    {"type": "info", "content": "Pro tip with explanation"},
    {"type": "danger", "content": "Critical warning with 'why it matters'"}
  ],
  "stressTestCommentary": "Optional commentary on stress test results"
}`;
}
