/**
 * Home Renovation Scenario Prompt
 * 房屋翻新场景Prompt模板
 */

import type { PromptContext } from './base';
import type { HomeRenovationMetrics } from '@/types/heloc-ai';

export function getHomeRenovationPrompt(context: PromptContext): string {
  const { calculatedData, userInputs } = context;
  const metrics = calculatedData.scenarioMetrics as HomeRenovationMetrics;

  return `It's exciting that you're planning to invest in your home! Let's explore how your HELOC can help you build real wealth in your walls.

## Your Financial Snapshot
- Home Value: $${userInputs.homeValue?.toLocaleString()}
- Mortgage Balance: $${userInputs.mortgageBalance?.toLocaleString()}
- Your HELOC Limit: $${calculatedData.coreMetrics.maxLimit.toLocaleString()}
- Your HELOC Rate: ${calculatedData.coreMetrics.helocRate}%
- Your CLTV: ${calculatedData.coreMetrics.cltv}%
- Your DTI: ${calculatedData.coreMetrics.dti}%

## Your Renovation Investment
- Renovation Cost: $${userInputs.renovationCost?.toLocaleString() || 'N/A'}
- Renovation Type: ${userInputs.renovationType || 'N/A'}
- Estimated Value Increase: $${metrics?.estValueIncrease?.toLocaleString() || 'N/A'}
- Your Future Equity: $${metrics?.futureEquity?.toLocaleString() || 'N/A'}

### Calculation Assumptions
- ROI based on industry averages: 50% (simple), 75% (kitchen/bath or structural)
- Value increase reflects immediate equity gain
- Market conditions assumed stable

Provide your analysis covering:
1. **Investment-to-Value Model**: Explain ROI in terms of building wealth (e.g., "Your investment translates into $X in immediate home equity")
2. **Equity Position**: How does this strengthen their financial foundation?
3. **Timeline Considerations**: Cash flow during renovation and interest-only period
4. **Market Risk Factors**: What if home values decline?
5. **Strategic Advice**: Which renovations give the best return?

Respond with ONLY a valid JSON object in this exact format:
{
  "summary": "2-3 sentence executive summary using 'You/Your' (acknowledge their renovation goal with enthusiasm)",
  "diagnostic": "Risk diagnostic explaining CLTV and DTI in context of their security",
  "strategy": "Scenario-specific strategy that feels like a roadmap for building wealth",
  "actionPlan": ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"],
  "tips": [
    {"type": "info", "content": "Pro tip about maximizing ROI"},
    {"type": "danger", "content": "Critical warning about over-improving"}
  ],
  "stressTestCommentary": "Optional commentary on stress test results"
}`;
}
