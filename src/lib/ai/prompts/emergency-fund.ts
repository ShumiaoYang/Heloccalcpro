/**
 * Emergency Fund Scenario Prompt
 * 应急基金场景Prompt模板
 */

import { ADVISOR_PERSONA, ADVISOR_TONE_RULES, type PromptContext } from './base';
import { calculateCLTVCap } from '@/lib/heloc/credit-calculator';
import { calculateCreditDTILimit, calculateDynamicMaxDTI } from '@/lib/heloc/core-metrics';

export function getEmergencyFundPrompt(context: PromptContext): string {
  const { calculatedData, userInputs } = context;
  const toneRules = ADVISOR_TONE_RULES.map((rule) => `- ${rule}`).join('\n');
  const requestedAmount = Number(userInputs.amountNeeded || calculatedData.coreMetrics.maxLimit || 0);
  const annualIncome = Number(userInputs.annualIncome || 0);
  const monthlyIncome = annualIncome > 0 ? annualIncome / 12 : 0;
  const currentMonthlyDebt = Number(
    userInputs.currentMonthlyDebt
    ?? userInputs.monthlyDebt
    ?? ((userInputs.subjectHousingPayment || 0) + (userInputs.otherMonthlyDebt || 0))
  );
  const monthlyNeedForRunway = Math.max(1, currentMonthlyDebt);
  const survivalMonths = requestedAmount > 0 ? requestedAmount / monthlyNeedForRunway : 0;
  const currentDti = monthlyIncome > 0 ? (currentMonthlyDebt / monthlyIncome) * 100 : 0;
  const projectedDti = Number(calculatedData.coreMetrics.dti || currentDti);
  const helocRate = Number(calculatedData.coreMetrics.helocRate || 0);
  const drawInterestPayment = (requestedAmount * helocRate) / 100 / 12;
  const repaymentMonths = Number(userInputs.repaymentMonths || 240);
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

Scenario: Emergency Fund (V3, QuickChart layout)
Mission:
- Help homeowners quantify survival runway under a zero-income stress scenario.
- Explain the major advantage clearly: if no draw happens, interest cost remains $0.
- Warn clearly about hidden account fees and line-freeze risk under market stress.
- Keep language professional, empathetic, and practical for everyday homeowners.

Page-layout behavior rules:
- Page 2 = Goal Achievability Conclusion.
- Page 3 = Borrowing Capacity.
- Page 4 = Emergency Draw Stress Test.
- Page 5 = Cost of Carry & Freeze Risk.
- Page 6 = Defensive Action Plan.

Critical anti-bleed rule for Page 4:
- "The Immediate Cash Flow Reality" must discuss only immediate post-draw monthly pressure.
- It must NOT mention future rate spikes or draw-to-repayment transition.
- "Stress Test Breakdown" must discuss only future chart scenarios and quantitative shock.

Output guardrails:
- Output must be valid JSON only.
- Do NOT output meta-instructions, XML tags, schema text, or implementation notes.
- Never expose internal field names, prompt architecture notes, or developer instructions.
- All content text must be English only (US).
</instructions>

<case_data>
approved_limit=${Math.round(Number(calculatedData.coreMetrics.maxLimit || 0))}
requested_amount=${Math.round(requestedAmount)}
survival_months_requested_amount=${survivalMonths.toFixed(2)}
current_monthly_debt=${Math.round(currentMonthlyDebt)}
monthly_income=${Math.round(monthlyIncome)}
current_dti=${currentDti.toFixed(2)}%
projected_dti=${projectedDti.toFixed(2)}%
effective_cltv_pct=${cltvCap.toFixed(2)}%
effective_dti_pct=${effectiveDtiPct.toFixed(2)}%
cltv_limit=${Math.round(cltvLimitAmount)}
dti_limit=${Math.round(dtiLimitAmount)}
heloc_rate=${helocRate.toFixed(2)}%
draw_interest_payment_current=${Math.round(drawInterestPayment)}
draw_interest_payment_plus2=${Math.round((requestedAmount * (helocRate + 2)) / 100 / 12)}
draw_interest_payment_plus4=${Math.round((requestedAmount * (helocRate + 4)) / 100 / 12)}
repayment_payment_current=${Math.round(calcRepaymentPi(requestedAmount, helocRate, repaymentMonths))}
repayment_payment_plus2=${Math.round(calcRepaymentPi(requestedAmount, helocRate + 2, repaymentMonths))}
repayment_payment_plus4=${Math.round(calcRepaymentPi(requestedAmount, helocRate + 4, repaymentMonths))}
zero_draw_monthly_interest=0
</case_data>

<output_schema>
{
  "summary": "2-3 sentence executive summary for emergency fund viability",
  "diagnostic": "Cross-page diagnostic based on survival runway, CLTV/DTI limits, and draw-stress risk",
  "strategy": "Professional defensive-liquidity strategy with strict usage controls",
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
  "emergencyFundV3": {
    "goalFeasibility": {
      "overallAssessment": "Page 2 overall feasibility based on requested standby amount, approval capacity, and zero-draw payment advantage",
      "chartCommentary": "Page 2 chart commentary (100-150 words) explaining survival runway and approval fit"
    },
    "borrowingCapacity": {
      "executiveVerdict": "Page 3 borrowing-capacity verdict explaining LTV and DTI dual constraints even for standby lines",
      "parameterChartReview": "Page 3 explanation of capacity-envelope chart and marker positions",
      "advisorsNote": "Page 3 advisor note with pass/fail branch based on requested amount vs approved limit"
    },
    "emergencyDrawStress": {
      "summary": "Page 4 immediate-only emergency-draw cash-flow verdict; no future scenario language allowed",
      "stressTestAssessment": "Page 4 future-only chart breakdown with baseline, draw-to-repayment jump, and +4% worst-case math",
      "advisorsNote": "Page 4 tactical note: treat HELOC as last-line defense and refill balance aggressively after crisis"
    },
    "costCarryRisk": {
      "liquidityMixCommentary": "Page 5 liquidity mix commentary comparing cash reserves vs HELOC backup line",
      "hiddenFeesWarning": "Page 5 warning about annual fees, inactivity fees, and early closure fees",
      "freezeRiskWarning": "Page 5 severe warning that HELOC is revocable credit and can be frozen/reduced during housing or credit stress"
    },
    "defensivePlan": {
      "intro": "Page 6 protective intro focused on defensive usage rules and fee control",
      "checklist": [
        "Request written fee and draw-condition disclosure before signing",
        "Set strict emergency-only triggers and prohibit lifestyle use",
        "Maintain separate cash reserves to hedge HELOC freeze risk",
        "After crisis, prioritize rapid HELOC paydown"
      ]
    }
  }
}
</output_schema>

Return JSON only. No markdown, no code fences.`;
}
