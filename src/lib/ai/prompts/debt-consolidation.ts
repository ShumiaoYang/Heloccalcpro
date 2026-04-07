import { ADVISOR_PERSONA, ADVISOR_TONE_RULES } from './base';

export const generateDebtConsolidationPrompt = (
  userData: {
    homeValue: number;
    maxBorrowingPower: number;
    requestedAmount: number;
    creditCardBalance: number;
    creditCardLimit: number;
    currentDti: number;
    projectedDti: number;
    estimatedHelocRate: number;
    currentMonthlyDebt: number;
    monthlyIncome: number;
    drawInterestPayment: number;
    repaymentPayment: number;
    repaymentPlus2Payment: number;
    repaymentPlus4Payment: number;
    drawPlus2Payment: number;
    drawPlus4Payment: number;
    effectiveCltv: number;
    effectiveDti: number;
    cltvLimit: number;
    dtiLimit: number;
  }
) => {
  const toneRules = ADVISOR_TONE_RULES.map((rule) => `- ${rule}`).join('\n');
  const safeUsage = Math.round(userData.maxBorrowingPower * 0.5);
  const transferAmount = Math.max(0, Math.min(userData.requestedAmount, userData.creditCardBalance));
  const excessCashOut = Math.max(0, userData.requestedAmount - userData.creditCardBalance);
  const excessMonthlyInterest = (excessCashOut * userData.estimatedHelocRate) / 100 / 12;
  const freedCashFlowNow = Math.max(0, userData.currentMonthlyDebt - userData.drawInterestPayment);
  const currentUtilization = userData.creditCardLimit > 0
    ? (userData.creditCardBalance / userData.creditCardLimit) * 100
    : 0;
  const postTransferUtilization = userData.creditCardLimit > 0
    ? (Math.max(0, userData.creditCardBalance - transferAmount) / userData.creditCardLimit) * 100
    : 0;

  return `<instructions>
Persona:
"${ADVISOR_PERSONA}"

Tone Rules:
${toneRules}

Scenario: Debt Consolidation (V3, QuickChart layout)
Mission:
- Use math to stop high-interest debt bleeding while preserving homeowner dignity.
- Explain clearly that unsecured debt is being transferred onto home-secured debt.
- Keep language professional, empathetic, and practical for everyday homeowners.
- Never use insulting, alarmist, or judgmental labels.

Page-layout behavior rules:
- Page 2 = Goal Achievability Conclusion.
- Page 3 = Borrowing Capacity.
- Page 4 = Cash Flow & Stress Test.
- Page 5 = Financial Restructuring & Arbitrage Diagnosis.
- Page 6 = Execution & Relapse Prevention.

Critical anti-bleed rule for Page 4:
- "The Immediate Cash Flow Reality" must discuss only immediate post-transfer monthly pressure.
- It must NOT mention future rate spikes or draw-to-repayment transition.
- "Future Stress Test Breakdown" must discuss only future chart scenarios and quantitative shock.

Critical Scheme C rule for Page 5:
- Internal calculation directives for Page 5 (never print these labels):
  - [INTERNAL ONLY - NEVER PRINT] Consolidation Benefit Assessment (internal logic alias only): use Math.min(requested_amount, credit_card_balance) to compute monthly interest savings and payoff improvement.
  - [INTERNAL ONLY - NEVER PRINT] Extra Capital Cost Analysis (internal logic alias only): use Excess Cash-Out = requested_amount - credit_card_balance.
- Anti-bleed rule for user-facing PDF text:
  - NEVER output these internal codenames in any visible title/body text: "The Bleeding", "The Cure", "Scheme C".
  - If a subtitle is needed, use neutral professional titles like "Consolidation Benefit Assessment" or "Extra Capital Cost Analysis".
- Compute Excess Cash-Out = requested_amount - credit_card_balance.
- If Excess Cash-Out <= 0: praise disciplined borrowing scope.
- If Excess Cash-Out > 0: must trigger fiduciary warning with explicit dollars:
  - excess cash-out amount
  - excess monthly interest burden
  - recommendation to reduce borrowing to card payoff need unless paying higher-rate debt.

Output guardrails:
- Output must be valid JSON only.
- Do NOT output meta-instructions, XML tags, schema text, or implementation notes.
- Never expose internal field names, prompt architecture notes, or developer instructions.
- All content text must be English only (US).
</instructions>

<case_data>
home_value=${userData.homeValue}
approved_limit=${userData.maxBorrowingPower}
safe_usage_50pct=${safeUsage}
requested_amount=${userData.requestedAmount}
credit_card_balance=${userData.creditCardBalance}
credit_card_limit=${userData.creditCardLimit}
transfer_amount_min(requested,balance)=${Math.round(transferAmount)}
excess_cash_out=${Math.round(excessCashOut)}
excess_cashout_monthly_interest_cost=${Math.round(excessMonthlyInterest)}
current_utilization_pct=${currentUtilization.toFixed(2)}%
post_transfer_utilization_pct=${postTransferUtilization.toFixed(2)}%
current_dti=${userData.currentDti.toFixed(2)}%
projected_dti=${userData.projectedDti.toFixed(2)}%
effective_cltv_pct=${userData.effectiveCltv.toFixed(2)}%
effective_dti_pct=${userData.effectiveDti.toFixed(2)}%
cltv_limit=${Math.round(userData.cltvLimit)}
dti_limit=${Math.round(userData.dtiLimit)}
monthly_income=${Math.round(userData.monthlyIncome)}
current_monthly_debt=${Math.round(userData.currentMonthlyDebt)}
heloc_rate=${userData.estimatedHelocRate.toFixed(2)}%
draw_interest_payment_current=${Math.round(userData.drawInterestPayment)}
draw_interest_payment_plus2=${Math.round(userData.drawPlus2Payment)}
draw_interest_payment_plus4=${Math.round(userData.drawPlus4Payment)}
repayment_payment_current=${Math.round(userData.repaymentPayment)}
repayment_payment_plus2=${Math.round(userData.repaymentPlus2Payment)}
repayment_payment_plus4=${Math.round(userData.repaymentPlus4Payment)}
immediate_freed_cashflow=${Math.round(freedCashFlowNow)}
</case_data>

<output_schema>
{
  "summary": "2-3 sentence executive summary for debt consolidation viability",
  "diagnostic": "Cross-page diagnostic based on utilization improvement, CLTV/DTI limits, and payment-shock risk",
  "strategy": "Professional debt-restructuring strategy with relapse prevention focus",
  "actionPlan": [
    "Action step 1",
    "Action step 2",
    "Action step 3",
    "Action step 4"
  ],
  "tips": [
    { "type": "info", "content": "Practical tip" },
    { "type": "danger", "content": "Critical warning" }
  ],
  "stressTestCommentary": "Optional global stress commentary",
  "debtConsolidationV3": {
    "goalFeasibility": {
      "overallAssessment": "Page 2 overall feasibility based on requested amount, card balance, approved limit, and utilization improvement",
      "chartCommentary": "Page 2 chart commentary (100-150 words) explaining coverage and DTI movement"
    },
    "borrowingCapacity": {
      "executiveVerdict": "Page 3 borrowing-capacity verdict explaining LTV and DTI dual constraints",
      "parameterChartReview": "Page 3 explanation of capacity-envelope chart and marker positions",
      "advisorsNote": "Page 3 advisor note with pass/fail branch based on requested amount vs approved limit"
    },
    "cashFlowStress": {
      "summary": "Page 4 immediate-only cash-flow verdict; no future scenario language allowed",
      "paymentShockWarning": "Page 4 immediate-only warning about secured-debt risk and near-term payment pressure",
      "stressTestAssessment": "Page 4 future-only chart breakdown with baseline, draw-to-repayment jump, and +4% worst-case math",
      "advisorsNote": "Page 4 tactical note: save or prepay principal with freed cash flow to defend against future hikes"
    },
    "arbitrageDiagnosis": {
      "cureCommentary": "Page 5 consolidation benefit assessment using transfer_amount and interest-savings math",
      "bleedingCommentary": "Page 5 extra capital cost analysis for Excess Cash-Out diagnosis",
      "fiduciaryWarning": "Page 5 fiduciary warning text. Must trigger strong warning if excess_cash_out > 0, with explicit $X and $Y."
    },
    "executionPlan": {
      "intro": "Page 6 protective intro focused on relapse prevention",
      "checklist": [
        "Demand direct pay to card issuers",
        "Reduce or freeze revolving lines after payoff",
        "Auto-apply monthly surplus to HELOC principal",
        "Track balances weekly for relapse control"
      ]
    }
  }
}
</output_schema>

Return JSON only. No markdown, no code fences.`;
};
