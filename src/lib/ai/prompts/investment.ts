/**
 * Investment Scenario Prompt
 * 投资场景Prompt模板
 */

import type { PromptContext } from './base';
import type { InvestmentMetrics } from '@/types/heloc-ai';

export function getInvestmentPrompt(context: PromptContext): string {
  const { calculatedData, userInputs } = context;
  const metrics = calculatedData.scenarioMetrics as InvestmentMetrics;

  return `Using your home equity to invest is a bold strategy. Let's carefully analyze the opportunity and risks together.

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
1. **Hurdle Rate Analysis**: Your investment must beat ${calculatedData.coreMetrics.helocRate}% just to break even
2. **Equity Risk Assessment**: What percentage of your home equity are you putting at risk?
3. **Leverage Strategy**: When does leveraging home equity make sense?
4. **Risk-Adjusted Returns**: Account for volatility and downside scenarios
5. **Critical Warnings**: Be brutally honest about the risks of losing your home

Respond with ONLY a valid JSON object in this exact format:
{
  "summary": "2-3 sentence executive summary using 'You/Your' (acknowledge the bold strategy)",
  "diagnostic": "Risk diagnostic with special emphasis on leverage risks",
  "strategy": "Investment strategy with clear risk warnings",
  "actionPlan": ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"],
  "tips": [
    {"type": "info", "content": "Pro tip about leverage investing"},
    {"type": "danger", "content": "Critical warning about downside risks"}
  ],
  "stressTestCommentary": "Optional commentary"
}`;
}
