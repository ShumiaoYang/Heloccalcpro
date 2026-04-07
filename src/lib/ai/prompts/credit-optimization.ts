/**
 * Credit Optimization Scenario Prompt
 * 信用优化场景Prompt模板
 */

import { ADVISOR_PERSONA, ADVISOR_TONE_RULES, type PromptContext } from './base';
import { calculateCLTVCap } from '@/lib/heloc/credit-calculator';
import { calculateCreditDTILimit, calculateDynamicMaxDTI } from '@/lib/heloc/core-metrics';

export function getCreditOptimizationPrompt(context: PromptContext): string {
  const { calculatedData, userInputs } = context;
  const toneRules = ADVISOR_TONE_RULES.map((rule) => `- ${rule}`).join('\n');
  const requestedAmount = Number(userInputs.amountNeeded || calculatedData.coreMetrics.maxLimit || 0);
  const creditCardBalance = Number(userInputs.creditCardBalance || 0);
  const creditCardLimit = Number(userInputs.creditCardLimit || 0);
  const annualIncome = Number(userInputs.annualIncome || 0);
  const monthlyIncome = annualIncome > 0 ? annualIncome / 12 : 0;
  const currentMonthlyDebt = Number(
    userInputs.currentMonthlyDebt
    ?? userInputs.monthlyDebt
    ?? ((userInputs.subjectHousingPayment || 0) + (userInputs.otherMonthlyDebt || 0))
  );
  const currentDti = monthlyIncome > 0 ? (currentMonthlyDebt / monthlyIncome) * 100 : 0;
  const projectedDti = Number(calculatedData.coreMetrics.dti || currentDti);
  const helocRate = Number(calculatedData.coreMetrics.helocRate || 0);
  const drawInterestPayment = (requestedAmount * helocRate) / 100 / 12;
  const repaymentMonths = Number(userInputs.repaymentMonths || 240);
  const transferAmount = Math.max(0, Math.min(requestedAmount, creditCardBalance));
  const excessCashOut = Math.max(0, requestedAmount - creditCardBalance);
  const excessMonthlyInterest = (excessCashOut * helocRate) / 1200;
  const currentUtilization = creditCardLimit > 0 ? (creditCardBalance / creditCardLimit) * 100 : 0;
  const projectedUtilization = creditCardLimit > 0
    ? (Math.max(0, creditCardBalance - transferAmount) / creditCardLimit) * 100
    : 0;
  const utilizationDrop = Math.max(0, currentUtilization - projectedUtilization);

  const propertyType = (userInputs.propertyType as
    | 'Single-family'
    | 'Townhouse'
    | 'Condo'
    | 'Multi-family'
    | 'Manufactured') || 'Single-family';
  const occupancyType = (userInputs.occupancy as
    | 'Primary residence'
    | 'Second home'
    | 'Investment property') || 'Primary residence';
  const { cltvCap } = calculateCLTVCap(
    Number(userInputs.creditScore || 700),
    occupancyType,
    propertyType
  );
  const effectiveDtiPct = calculateDynamicMaxDTI(Number(userInputs.creditScore || 700), cltvCap) * 100;
  const cltvLimitAmount = Math.max(
    0,
    Number(userInputs.homeValue || 0) * (cltvCap / 100) - Number(userInputs.mortgageBalance || 0)
  );
  const dtiLimitAmount = calculateCreditDTILimit(
    annualIncome,
    currentMonthlyDebt,
    Number(userInputs.creditScore || 700),
    cltvCap
  );
  const calcRepaymentPi = (principal: number, ratePct: number, months: number): number => {
    if (principal <= 0 || months <= 0) return 0;
    const monthlyRate = ratePct / 100 / 12;
    if (monthlyRate === 0) return principal / months;
    const factor = Math.pow(1 + monthlyRate, months);
    return (principal * monthlyRate * factor) / (factor - 1);
  };

  return `<instructions>
"${ADVISOR_PERSONA}"

Tone Rules:
${toneRules}

Scenario: Credit/Asset Optimization (V3, QuickChart layout)
Mission:
- Use HELOC as a controlled springboard to reduce revolving utilization and support FICO recovery.
- Explain clearly that unsecured debt is being moved into home-secured debt.
- Keep language professional, empathetic, and practical for everyday homeowners.
- Never use insulting, alarmist, or judgmental labels.

Page-layout behavior rules:
- Page 2 = Goal Achievability Conclusion.
- Page 3 = Borrowing Capacity.
- Page 4 = Cash Flow & Stress Test.
- Page 5 = Financial Restructuring & Arbitrage Diagnosis.
- Page 6 = Credit Repair Action Plan.

Critical anti-bleed rule for Page 4:
- "The Immediate Cash Flow Reality" must discuss only immediate post-transfer monthly pressure.
- It must NOT mention future rate spikes or draw-to-repayment transition.
- "Future Stress Test Breakdown" must discuss only future chart scenarios and quantitative shock.

Critical Scheme C rule for Page 5:
- Internal calculation directives for Page 5 (never print these labels):
  - [INTERNAL ONLY - NEVER PRINT] Consolidation Benefit Assessment (internal logic alias only): use Math.min(requested_amount, credit_card_balance) to compute monthly interest savings.
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
approved_limit=${Math.round(Number(calculatedData.coreMetrics.maxLimit || 0))}
requested_amount=${Math.round(requestedAmount)}
credit_card_balance=${Math.round(creditCardBalance)}
credit_card_limit=${Math.round(creditCardLimit)}
transfer_amount_min(requested,balance)=${Math.round(transferAmount)}
excess_cash_out=${Math.round(excessCashOut)}
excess_cashout_monthly_interest_cost=${Math.round(excessMonthlyInterest)}
current_utilization_pct=${currentUtilization.toFixed(2)}%
projected_utilization_pct=${projectedUtilization.toFixed(2)}%
utilization_drop_pct=${utilizationDrop.toFixed(2)}%
current_dti=${currentDti.toFixed(2)}%
projected_dti=${projectedDti.toFixed(2)}%
effective_cltv_pct=${cltvCap.toFixed(2)}%
effective_dti_pct=${effectiveDtiPct.toFixed(2)}%
cltv_limit=${Math.round(cltvLimitAmount)}
dti_limit=${Math.round(dtiLimitAmount)}
monthly_income=${Math.round(monthlyIncome)}
current_monthly_debt=${Math.round(currentMonthlyDebt)}
heloc_rate=${helocRate.toFixed(2)}%
draw_interest_payment_current=${Math.round(drawInterestPayment)}
draw_interest_payment_plus2=${Math.round((requestedAmount * (helocRate + 2)) / 100 / 12)}
draw_interest_payment_plus4=${Math.round((requestedAmount * (helocRate + 4)) / 100 / 12)}
repayment_payment_current=${Math.round(calcRepaymentPi(requestedAmount, helocRate, repaymentMonths))}
repayment_payment_plus2=${Math.round(calcRepaymentPi(requestedAmount, helocRate + 2, repaymentMonths))}
repayment_payment_plus4=${Math.round(calcRepaymentPi(requestedAmount, helocRate + 4, repaymentMonths))}
</case_data>

<output_schema>
{
  "summary": "2-3 sentence executive summary for credit optimization viability",
  "diagnostic": "Cross-page diagnostic based on utilization improvement, CLTV/DTI limits, and payment-shock risk",
  "strategy": "Professional springboard strategy for utilization reduction and relapse prevention",
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
  "creditOptimizationV3": {
    "goalFeasibility": {
      "overallAssessment": "Page 2 overall feasibility based on requested amount, card balance, approved limit, and utilization improvement",
      "chartCommentary": "Page 2 chart commentary (100-150 words) explaining approval fit and utilization movement"
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
    "creditRepairPlan": {
      "intro": "Page 6 protective intro focused on score recovery and relapse prevention",
      "checklist": [
        "Demand direct pay to card issuers",
        "Zero out cards but do not close accounts",
        "Respect the 30-45 day bureau update window",
        "Avoid new credit applications during recovery window"
      ]
    }
  }
}
</output_schema>

Return JSON only. No markdown, no code fences.`;
}
