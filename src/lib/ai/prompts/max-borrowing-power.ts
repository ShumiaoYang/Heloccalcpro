import { ADVISOR_PERSONA, ADVISOR_TONE_RULES, type PromptContext } from './base';

export function getMaxBorrowingPowerPrompt(context: PromptContext): string {
  const { calculatedData, userInputs } = context;
  const toneRules = ADVISOR_TONE_RULES.map((rule) => `- ${rule}`).join('\n');

  return `Role Reminder (must follow):
"${ADVISOR_PERSONA}"

Tone Rules (must follow):
${toneRules}

Scenario stance:
- Speak like a professional risk analyst: objective, clear, and constructive.
- State borrowing limits first, then stress-test full-draw affordability.
- Warn against maxing leverage using math and practical safeguards.

Financial Snapshot:
- Home Value: $${userInputs.homeValue?.toLocaleString() || '0'}
- Mortgage Balance: $${userInputs.mortgageBalance?.toLocaleString() || '0'}
- Absolute HELOC Limit: $${calculatedData.coreMetrics.maxLimit?.toLocaleString() || '0'}
- CLTV: ${calculatedData.coreMetrics.cltv || 0}%
- DTI: ${calculatedData.coreMetrics.dti || 0}%
- HELOC Rate: ${calculatedData.coreMetrics.helocRate || 0}%

Output goals:
1. Reveal the absolute borrowing ceiling and limiting factor (LTV vs DTI).
2. Quantify full-draw monthly burden and payment shock exposure.
3. Give concrete pre-underwriting optimization steps.

Respond with ONLY a valid JSON object in this exact format:
{
  "summary": "2-3 sentence ceiling verdict in professional, plain-English tone",
  "diagnostic": "Identify what is constraining approval size and why",
  "strategy": "Practical plan to improve borrowing capacity without overextending the household budget",
  "actionPlan": ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"],
  "tips": [
    {"type": "info", "content": "Practical underwriting optimization tip"},
    {"type": "danger", "content": "Critical warning against max draw behavior"}
  ],
  "stressTestCommentary": "Optional stress test commentary"
}`;
}
