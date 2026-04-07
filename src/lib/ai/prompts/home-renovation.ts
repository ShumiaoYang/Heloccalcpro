/**
 * Home Renovation Scenario Prompt
 * 房屋翻新场景Prompt模板
 */

import { ADVISOR_PERSONA, ADVISOR_TONE_RULES, type PromptContext } from './base';
import type { HomeRenovationMetrics } from '@/types/heloc-ai';

export function getHomeRenovationPrompt(context: PromptContext): string {
  const { calculatedData, userInputs } = context;
  const metrics = calculatedData.scenarioMetrics as HomeRenovationMetrics;
  const toneRules = ADVISOR_TONE_RULES.map((rule) => `- ${rule}`).join('\n');
  const amountNeeded = userInputs.amountNeeded || userInputs.drawAmount || calculatedData.coreMetrics.maxLimit || 0;
  const approvedLimit = calculatedData.coreMetrics.maxLimit || 0;
  const safeUsage = approvedLimit * 0.5;
  const monthlyIncome = (userInputs.annualIncome || 0) / 12;
  const currentMonthlyDebt = userInputs.currentMonthlyDebt
    ?? userInputs.monthlyDebt
    ?? ((userInputs.subjectHousingPayment || 0) + (userInputs.otherMonthlyDebt || 0));
  const oldDti = monthlyIncome > 0 ? (currentMonthlyDebt / monthlyIncome) * 100 : 0;
  const fallbackValueIncrease = amountNeeded * (
    userInputs.renovationType === 'simple'
      ? 0.5
      : 0.75
  );
  const repaymentMonths = Math.max(1, userInputs.repaymentMonths || 240);
  const calculateRepaymentPI = (principal: number, annualRatePct: number, months: number): number => {
    if (principal <= 0 || months <= 0) return 0;
    const monthlyRate = annualRatePct / 1200;
    if (monthlyRate === 0) return principal / months;
    const factor = Math.pow(1 + monthlyRate, months);
    return (principal * monthlyRate * factor) / (factor - 1);
  };
  const currentRate = calculatedData.coreMetrics.helocRate || 0;
  const drawPaymentCurrent = (amountNeeded * currentRate) / 1200;
  const repaymentCurrent = calculateRepaymentPI(amountNeeded, currentRate, repaymentMonths);
  const repaymentPlus4 = calculateRepaymentPI(amountNeeded, currentRate + 4, repaymentMonths);
  const shockPlus4VsCurrentDraw = repaymentPlus4 - drawPaymentCurrent;
  const drawPaymentPlus2 = (amountNeeded * (currentRate + 2)) / 1200;
  const drawPaymentPlus4 = (amountNeeded * (currentRate + 4)) / 1200;
  const repaymentPlus2 = calculateRepaymentPI(amountNeeded, currentRate + 2, repaymentMonths);
  const estimatedValueIncrease = metrics?.estValueIncrease ?? fallbackValueIncrease;
  const withinLimit = amountNeeded <= (calculatedData.coreMetrics.maxLimit || 0);
  const projectedDti = calculatedData.coreMetrics.dti || oldDti;
  const projectedCltv = calculatedData.coreMetrics.cltv || 0;
  const immediateDtiDelta = projectedDti - oldDti;
  const disposableIncomeBefore = monthlyIncome - currentMonthlyDebt;
  const disposableIncomeAfterDraw = disposableIncomeBefore - drawPaymentCurrent;

  return `<instructions>
System role reminder (must follow):
"${ADVISOR_PERSONA}"

Tone Rules (must follow):
${toneRules}

Scenario: Home Renovation
Mission:
- Explain true renovation financing cost in plain language.
- Protect middle-class and blue-collar homeowners from budget stress and contractor execution risk.
- Keep the tone empathetic, practical, and objective.
- Follow the V3 page semantics exactly:
  - Goal Achievability
  - Borrowing Capacity
  - Cash Flow & Stress Test
  - ROI & Equity Impact
  - Contractor Action Plan
- Page 4 split-scope rule (strict):
  - "The Immediate Cash Flow Reality" must only discuss immediate monthly pressure after drawing funds (current DTI, DTI delta, and disposable income squeeze).
  - It must NOT mention future rate hikes, +2%/+4% scenarios, or post-draw repayment transition.
  - "Future Stress Test Breakdown" must discuss only future quantitative stress outcomes from chart scenarios.
- For stress-test commentary, avoid vague wording. Cite explicit dollars and highlight the dual-hit risk (rate spike + repayment transition).
- Keep wording plain, respectful, and action-oriented for everyday homeowners.

Page 2 hard constraints (Goal Achievability):
- Overall Assessment must be exactly 2-3 sentences, around 50 words total.
- Sentence 1 must provide direct feasibility judgment using the user's requested amount.
- Sentence 2 must explicitly convey empathetic advisor support and explain how the funding helps the homeowner's renovation goal.
- Chart Interpretation must be exactly 3-4 sentences and 100-130 words total.
- Never use generic machine phrasing like "The chart shows..." or similar filler.
- Chart Interpretation must follow this 3-step logic:
  1) Funding buffer analysis: compare amount_needed vs approved_limit and state strategic cushion depth (include usage ratio percent if possible).
  2) DTI impact diagnosis: cite the modeled DTI jump with specific numbers and classify underwriting meaning (strong/pass/caution/red-flag).
  3) Advisor CTA: give one concrete behavioral action, such as pausing other large discretionary spending during renovation to absorb DTI pressure.

Output guardrails:
- Output must be valid JSON only.
- Do NOT output any meta-instruction text.
- Do NOT output XML tags.
- Do NOT mention prompt architecture, schema notes, implementation notes, or developer instructions.
- Do NOT echo words like "instructions", "schema", "cta replacement", "architecture", "developer note".
- Never expose internal field names or keys (for example: draw_payment_current, repayment_payment_plus4, payment_shock_plus4_vs_current_draw).
- Output text values in English only (US).
</instructions>

<case_data>
home_value=${userInputs.homeValue || 0}
mortgage_balance=${userInputs.mortgageBalance || 0}
annual_income=${userInputs.annualIncome || 0}
current_monthly_debt=${currentMonthlyDebt}
current_dti=${oldDti.toFixed(2)}%
immediate_dti_delta=${immediateDtiDelta.toFixed(2)}%
approved_limit=${approvedLimit}
safe_usage_50pct=${Math.round(safeUsage)}
heloc_rate=${currentRate}%
projected_cltv=${projectedCltv}%
projected_dti=${projectedDti}%
amount_needed=${amountNeeded}
renovation_type=${userInputs.renovationType || 'simple'}
renovation_duration_months=${userInputs.renovationDuration || 6}
repayment_months=${repaymentMonths}
estimated_value_increase=${Math.round(estimatedValueIncrease)}
future_equity=${metrics?.futureEquity || 0}
within_approved_limit=${withinLimit}
current draw payment usd=${Math.round(drawPaymentCurrent)}
draw payment plus2 usd=${Math.round(drawPaymentPlus2)}
draw payment plus4 usd=${Math.round(drawPaymentPlus4)}
repayment payment at current rate usd=${Math.round(repaymentCurrent)}
repayment payment at plus2 rate usd=${Math.round(repaymentPlus2)}
repayment payment at plus4 rate usd=${Math.round(repaymentPlus4)}
payment shock at plus4 vs current draw usd=${Math.round(shockPlus4VsCurrentDraw)}
disposable_income_before_draw=${Math.round(disposableIncomeBefore)}
disposable_income_after_draw=${Math.round(disposableIncomeAfterDraw)}
</case_data>

<output_schema>
{
  "summary": "2-3 sentence executive summary",
  "diagnostic": "Cross-page diagnostic using approval capacity, DTI movement, and payment shock",
  "strategy": "Risk-contained strategy for renovation financing and draw discipline with practical household safeguards",
  "actionPlan": [
    "Action step 1",
    "Action step 2",
    "Action step 3",
    "Action step 4"
  ],
  "tips": [
    {"type": "info", "content": "Practical tip"},
    {"type": "danger", "content": "Critical warning"}
  ],
  "stressTestCommentary": "Optional stress-test commentary",
  "homeRenovationV2": {
    "goalFeasibility": {
      "overallAssessment": "Page 2 Overall Assessment: exactly 2-3 sentences (~50 words). Sentence 1 gives feasibility judgment with amount_needed; sentence 2 must include empathetic support and explain how funding helps renovation goals.",
      "chartCommentary": "Page 2 Chart Interpretation: exactly 3-4 sentences (100-130 words), no 'The chart shows...' phrasing. Must follow 3-step logic: funding buffer depth, DTI jump with underwriting classification, and one concrete advisor call-to-action."
    },
    "borrowingCapacity": {
      "executiveVerdict": "Page 3 borrowing-capacity verdict explaining underwriting red lines in plain terms",
      "parameterChartReview": "Page 3 explanation of key parameters and capacity-envelope chart, including requested vs estimated-approval marker relationship",
      "advisorsNote": "Page 3 advisor note with either 10%-15% contingency guidance or CLTV/DTI-driven optimization path"
    },
    "cashFlowStress": {
      "summary": "Page 4 The Immediate Cash Flow Reality (immediate-only): evaluate current DTI, immediate_dti_delta, and disposable_income_after_draw. Forbidden here: future rate changes, +2/+4 scenarios, repayment-period jump, or any long-term stress narrative.",
      "paymentShockWarning": "Page 4 immediate cash-pressure addendum (still immediate-only): one concise line quantifying near-term lifestyle/savings squeeze from current draw-period interest outflow. Forbidden here: future scenarios and repayment transition.",
      "stressTestAssessment": "Page 4 Future Stress Test Breakdown (future-only, must be progressive): 1) baseline current-rate draw interest as minimum cost; 2) same-rate draw vs repayment jump after draw period; 3) worst-case comparison between current-rate repayment and +4% repayment with explicit dollar deltas.",
      "advisorsNote": "Page 4 fixed tactic in plain English: do not anchor on draw-only payment; if cash flow allows, pay close to repayment-period level during draw and route extra to principal as a rate-shock firewall."
    },
    "roiEquity": {
      "summary": "Page 5 ROI and equity-impact truth with direct cost-vs-value framing",
      "budgetingGuidance": "Page 5 budget-fit recommendation tied to DTI and long-term occupancy intent"
    },
    "contractorPlan": {
      "intro": "Page 6 protective action intro",
      "checklist": [
        "Milestone-based draws only",
        "Collect lien waivers before final payment",
        "Keep 10%-15% contingency uncommitted",
        "Confirm no-fee multiple draws with lender"
      ]
    }
  }
}
</output_schema>

Return JSON only. No markdown, no code fences.`;
}
