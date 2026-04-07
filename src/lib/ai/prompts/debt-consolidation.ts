import { ADVISOR_PERSONA, ADVISOR_TONE_RULES } from './base';

export interface DebtConsolidationReportData {
  executiveVerdict: {
    status: 'APPROVED_ZONE' | 'CAUTION_ZONE' | 'DANGER_ZONE';
    headline: string;
    summary: string;
  };
  cashFlowAnalysis: { freedUpCashFlow: number; commentary: string; };
  radicalCandorWarning: { title: string; message: string; };
  actionPlan: { title: string; description: string; }[];
}

export const generateDebtConsolidationPrompt = (
  userData: {
    homeValue: number;
    maxBorrowingPower: number;
    requestedAmount: number;
    isMaxBorrowing: boolean;
    currentDti: number;
    newDti: number;
    estimatedHelocRate: number;
    currentMonthlyDebt: number;
    newHelocMonthlyPayment: number;
  }
) => {
  const toneRules = ADVISOR_TONE_RULES.map((rule) => `- ${rule}`).join('\n');
  const maxBorrowingContext = userData.isMaxBorrowing
    ? `The user selected max borrowing mode. Emphasize that approval capacity is not a draw recommendation.`
    : `The user requested ${userData.requestedAmount} for debt consolidation.`;

  return `<instructions>
Persona:
"${ADVISOR_PERSONA}"

Tone Rules:
${toneRules}

You are writing Debt Consolidation report content for everyday homeowners.
Focus: transparent math, budget relief potential, and repayment discipline.
Frame downside as budgeting challenges and stress-test vulnerabilities.
Do not output any meta-instruction text.
Do not output these XML tags.
Do not mention "schema", "prompt", "instruction", "CTA replacement", "architecture", or implementation notes.
Output valid JSON only.
</instructions>

<case_data>
home_value=${userData.homeValue}
max_limit=${userData.maxBorrowingPower}
requested_amount=${userData.requestedAmount}
current_dti=${userData.currentDti}%
new_dti=${userData.newDti}%
heloc_rate=${userData.estimatedHelocRate}%
current_non_mortgage_monthly_debt=${userData.currentMonthlyDebt}
new_heloc_interest_only_payment=${userData.newHelocMonthlyPayment}
context="${maxBorrowingContext}"
</case_data>

<output_schema>
{
  "executiveVerdict": {
    "status": "APPROVED_ZONE" | "CAUTION_ZONE" | "DANGER_ZONE",
    "headline": "[5-10 word clear verdict]",
    "summary": "[2-3 sentences. Acknowledge cash-flow relief potential, highlight DTI, and keep tone supportive.]"
  },
  "cashFlowAnalysis": {
    "freedUpCashFlow": [Number],
    "commentary": "[Explain immediate payment change and clarify debt is restructured, not eliminated.]"
  },
  "radicalCandorWarning": {
    "title": "[Professional risk warning title]",
    "message": "[Constructive warning about re-accumulation risk and practical controls.]"
  },
  "actionPlan": [
    { "title": "Request 'Direct Pay' Setup", "description": "[Explain why this reduces execution risk]" },
    { "title": "...", "description": "..." },
    { "title": "...", "description": "..." }
  ]
}
</output_schema>`;
};
