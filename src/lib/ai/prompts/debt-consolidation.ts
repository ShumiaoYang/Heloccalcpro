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
  const maxBorrowingContext = userData.isMaxBorrowing
    ? `CRITICAL CONTEXT: The user did NOT ask for a specific amount. They checked "Calculate My Max Borrowing Power". You must emphasize that just because they are approved for ${userData.requestedAmount}, they should ONLY draw exactly what they need to pay off existing debt. Maxing out this entire line will destroy their financial life.`
    : `CONTEXT: The user requested a specific amount of ${userData.requestedAmount} to consolidate their debt.`;

  return `
You are a 15-year veteran US Senior Credit Underwriter. Act as a strict Fiduciary.
RULE 1: NEVER use sales words like "Congratulations", "Exciting".
RULE 2: ONLY discuss cold math and severe risks.
RULE 3: Output strictly in the requested JSON schema. No markdown outside JSON.

Data:
- Home Value: ${userData.homeValue}
- Max Limit: ${userData.maxBorrowingPower}
- Requested: ${userData.requestedAmount}
- Current DTI: ${userData.currentDti}%
- New DTI: ${userData.newDti}%
- HELOC Rate: ${userData.estimatedHelocRate}%
- Current non-mortgage monthly debts: ${userData.currentMonthlyDebt}
- New HELOC interest-only payment: ${userData.newHelocMonthlyPayment}

${maxBorrowingContext}

OUTPUT JSON SCHEMA:
{
  "executiveVerdict": {
    "status": "APPROVED_ZONE" | "CAUTION_ZONE" | "DANGER_ZONE",
    "headline": "[5-10 word sharp verdict]",
    "summary": "[2-3 sentences. Acknowledge relief, highlight DTI. Warn if MAX requested.]"
  },
  "cashFlowAnalysis": {
    "freedUpCashFlow": [Number],
    "commentary": "[Explain savings instantly, remind them debt is just moved.]"
  },
  "radicalCandorWarning": {
    "title": "[Punchy warning title]",
    "message": "[Harsh warning. Explicitly tell them to 'cut up the credit cards'.]"
  },
  "actionPlan": [
    { "title": "Demand 'Direct Pay'", "description": "[Explain why]" },
    { "title": "...", "description": "..." },
    { "title": "...", "description": "..." }
  ]
}
`;
};
