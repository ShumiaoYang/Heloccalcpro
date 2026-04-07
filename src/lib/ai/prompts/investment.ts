/**
 * Investment Scenario Prompt
 * 投资场景Prompt模板
 */

import { ADVISOR_PERSONA, ADVISOR_TONE_RULES, type PromptContext } from './base';
import { calculateCLTVCap } from '@/lib/heloc/credit-calculator';
import { calculateCreditDTILimit, calculateDynamicMaxDTI } from '@/lib/heloc/core-metrics';

export function getInvestmentPrompt(context: PromptContext): string {
  const { calculatedData, userInputs } = context;
  const toneRules = ADVISOR_TONE_RULES.map((rule) => `- ${rule}`).join('\n');
  const requestedAmount = Number(userInputs.amountNeeded || calculatedData.coreMetrics.maxLimit || 0);
  const expectedReturnRate = Number(
    userInputs.expectedReturnRate
    ?? userInputs.expectedReturn
    ?? 8
  );
  const investmentType = String(userInputs.investmentType || 'General Investment');
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
  const netSpread = expectedReturnRate - helocRate;
  const expectedAnnualReturnAmount = requestedAmount * (expectedReturnRate / 100);
  const annualDebtCostAmount = requestedAmount * (helocRate / 100);

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

Scenario: Investment (V3, QuickChart layout)
Mission:
- Pressure-test leveraged investing with cold math before execution.
- Quantify spread, leverage risk, and household cash-flow drain clearly.
- Explain that lender approval is not investment endorsement.
- Keep language professional, empathetic, and practical for everyday homeowners.

Page-layout behavior rules:
- Page 2 = Goal Achievability Conclusion.
- Page 3 = Borrowing Capacity.
- Page 4 = Cash Flow & Stress Test.
- Page 5 = Arbitrage Diagnosis & Leverage Risk.
- Page 6 = Leverage Guardrails & Action Plan.

Critical anti-bleed rule for Page 4:
- "The Immediate Cash Flow Reality" must discuss only immediate post-draw monthly pressure.
- It must NOT mention future rate spikes or draw-to-repayment transition.
- "Stress Test Breakdown" must discuss only future chart scenarios and quantitative shock.

Critical isolation rule for Page 5:
- Internal math directives (never print these labels):
  - [INTERNAL ONLY - NEVER PRINT] Expected Return math block.
  - [INTERNAL ONLY - NEVER PRINT] Net Spread math block.
- NEVER output internal labels such as "Internal Logic", "The Spread", or similar architecture tags in any visible title/body text.
- User-facing subtitles must stay neutral and professional.

Output guardrails:
- Output must be valid JSON only.
- Do NOT output meta-instructions, XML tags, schema text, or implementation notes.
- Never expose internal field names, prompt architecture notes, or developer instructions.
- All content text must be English only (US).
</instructions>

<case_data>
approved_limit=${Math.round(Number(calculatedData.coreMetrics.maxLimit || 0))}
requested_amount=${Math.round(requestedAmount)}
investment_type=${investmentType}
expected_return_rate=${expectedReturnRate.toFixed(2)}%
heloc_rate=${helocRate.toFixed(2)}%
net_spread_rate=${netSpread.toFixed(2)}%
expected_annual_return_amount=${Math.round(expectedAnnualReturnAmount)}
annual_debt_cost_amount=${Math.round(annualDebtCostAmount)}
current_dti=${currentDti.toFixed(2)}%
projected_dti=${projectedDti.toFixed(2)}%
effective_cltv_pct=${cltvCap.toFixed(2)}%
effective_dti_pct=${effectiveDtiPct.toFixed(2)}%
cltv_limit=${Math.round(cltvLimitAmount)}
dti_limit=${Math.round(dtiLimitAmount)}
monthly_income=${Math.round(monthlyIncome)}
current_monthly_debt=${Math.round(currentMonthlyDebt)}
draw_interest_payment_current=${Math.round(drawInterestPayment)}
draw_interest_payment_plus2=${Math.round((requestedAmount * (helocRate + 2)) / 100 / 12)}
draw_interest_payment_plus4=${Math.round((requestedAmount * (helocRate + 4)) / 100 / 12)}
repayment_payment_current=${Math.round(calcRepaymentPi(requestedAmount, helocRate, repaymentMonths))}
repayment_payment_plus2=${Math.round(calcRepaymentPi(requestedAmount, helocRate + 2, repaymentMonths))}
repayment_payment_plus4=${Math.round(calcRepaymentPi(requestedAmount, helocRate + 4, repaymentMonths))}
</case_data>

<output_schema>
{
  "summary": "2-3 sentence executive summary for leveraged-investment viability",
  "diagnostic": "Cross-page diagnostic based on leverage risk, spread quality, CLTV/DTI limits, and payment-shock exposure",
  "strategy": "Professional leverage strategy with clear risk boundaries and household protection controls",
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
  "investmentV3": {
    "goalFeasibility": {
      "overallAssessment": "Page 2 feasibility based on requested amount, approval capacity, and DTI movement",
      "chartCommentary": "Page 2 chart commentary (100-150 words) explaining approval fit and DTI deterioration risk"
    },
    "borrowingCapacity": {
      "executiveVerdict": "Page 3 borrowing-capacity verdict explaining LTV and DTI dual constraints",
      "parameterChartReview": "Page 3 explanation of capacity-envelope chart and marker positions",
      "advisorsNote": "Page 3 advisor note with pass/fail branch based on requested amount vs approved limit"
    },
    "cashFlowStress": {
      "summary": "Page 4 immediate-only cash-flow verdict; no future scenario language allowed",
      "stressTestAssessment": "Page 4 future-only chart breakdown with baseline, draw-to-repayment jump, and +4% worst-case math",
      "advisorsNote": "Page 4 tactical note requiring 6-12 months payment buffer before leveraging"
    },
    "arbitrageDiagnosis": {
      "spreadAssessment": "Page 5 analysis of debt cost vs expected return vs net spread using professional neutral subtitles only",
      "fiduciaryWarning": "Page 5 warning branch by spread quality: net spread <=0, net spread <3%, net spread >=3%"
    },
    "guardrailsPlan": {
      "intro": "Page 6 protective intro focused on leverage survival rules",
      "checklist": [
        "Prevent cross-collateralization failure paths",
        "Keep tax documentation and fund-use segregation clean",
        "Define hard stop-loss and mandatory exit thresholds",
        "Maintain separate cash buffer before deploying leverage"
      ]
    }
  }
}
</output_schema>

Return JSON only. No markdown, no code fences.`;
}
