import React from 'react';
import { Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { Heading1, Heading2, Paragraph, Divider } from '../components/base';
import { defaultPdfStyles } from '../styles';
import type { PdfData } from '../types';
import type { HomeRenovationMetrics } from '@/types/heloc-ai';
import {
  asNumber,
  formatCurrency,
  formatPercent,
  getActionSteps,
  getCurrentMonthlyDebt,
  getHelocRate,
  getInterestOnlyPayment,
  getLoanAmount,
  getMonthlyIncome,
  sanitizePdfText,
} from './template-helpers';
import {
  buildBorrowingCapacityEnvelopeChart,
  buildCashFlowStressGroupedChart,
  buildGoalAmountVsApprovalChart,
  buildGoalDtiComparisonChart,
  buildRoiImpactChart,
} from '../charts/quickchart';
import { calculateCLTVCap } from '@/lib/heloc/credit-calculator';
import { calculateCreditDTILimit, calculateDynamicMaxDTI } from '@/lib/heloc/core-metrics';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: defaultPdfStyles.fonts.body,
  },
  section: {
    marginBottom: defaultPdfStyles.spacing.md,
  },
  chart: {
    width: '100%',
    height: 230,
    marginBottom: defaultPdfStyles.spacing.md,
  },
  capacityChart: {
    width: '100%',
    height: 228,
    marginBottom: defaultPdfStyles.spacing.sm,
  },
  chartStack: {
    gap: 10,
    marginBottom: defaultPdfStyles.spacing.md,
  },
  dualChartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: defaultPdfStyles.spacing.md,
  },
  dualChartCard: {
    width: '49%',
    borderWidth: 1,
    borderColor: defaultPdfStyles.colors.border,
    borderRadius: 4,
    padding: 6,
    backgroundColor: '#ffffff',
  },
  dualChartImage: {
    width: '100%',
    height: 220,
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: defaultPdfStyles.spacing.sm,
    marginTop: defaultPdfStyles.spacing.sm,
    marginBottom: defaultPdfStyles.spacing.md,
  },
  metricCard: {
    width: '48%',
    borderWidth: 1,
    borderColor: defaultPdfStyles.colors.border,
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#f8fafc',
  },
  metricLabel: {
    fontSize: 9,
    color: defaultPdfStyles.colors.textSecondary,
    marginBottom: 3,
  },
  metricValue: {
    fontSize: 12,
    fontFamily: defaultPdfStyles.fonts.heading,
    color: defaultPdfStyles.colors.text,
  },
  parameterRows: {
    marginBottom: defaultPdfStyles.spacing.sm,
    gap: 8,
  },
  parameterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  row3Card: {
    flex: 1,
    borderWidth: 1,
    borderColor: defaultPdfStyles.colors.border,
    borderRadius: 4,
    padding: 8,
    backgroundColor: '#f8fafc',
  },
  row2Card: {
    flex: 1,
    borderWidth: 1,
    borderColor: defaultPdfStyles.colors.border,
    borderRadius: 4,
    padding: 8,
    backgroundColor: '#f8fafc',
  },
  parameterLabel: {
    fontSize: 8,
    color: defaultPdfStyles.colors.textSecondary,
    marginBottom: 2,
  },
  parameterValue: {
    fontSize: 11,
    fontFamily: defaultPdfStyles.fonts.heading,
    color: defaultPdfStyles.colors.text,
  },
  noteBox: {
    borderLeftWidth: 3,
    borderLeftColor: defaultPdfStyles.colors.primary,
    backgroundColor: '#f0f9ff',
    padding: 10,
  },
  checklistBox: {
    marginTop: defaultPdfStyles.spacing.md,
    gap: 8,
  },
  checklistItem: {
    borderLeftWidth: 3,
    borderLeftColor: '#15803d',
    backgroundColor: '#f0fdf4',
    borderRadius: 2,
    padding: 10,
  },
  checklistText: {
    fontSize: 10,
    color: defaultPdfStyles.colors.text,
    lineHeight: 1.4,
  },
  stressTable: {
    width: '100%',
    marginBottom: defaultPdfStyles.spacing.md,
    borderTopWidth: 1,
    borderTopColor: defaultPdfStyles.colors.border,
  },
  stressTableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: defaultPdfStyles.colors.border,
    paddingVertical: 6,
    alignItems: 'center',
  },
  stressTableHeader: {
    backgroundColor: '#f8fafc',
  },
  stressCellBase: {
    fontSize: 9,
    fontFamily: defaultPdfStyles.fonts.body,
    color: defaultPdfStyles.colors.text,
    paddingRight: 4,
  },
  stressHeaderText: {
    fontFamily: defaultPdfStyles.fonts.heading,
    fontSize: 7,
    lineHeight: 1.25,
  },
  stressRight: {
    textAlign: 'right',
  },
  stressColScenario: {
    width: '22%',
  },
  stressColRate: {
    width: '11%',
  },
  stressColDraw: {
    width: '21%',
  },
  stressColRepayment: {
    width: '24%',
  },
  stressColDelta: {
    width: '22%',
  },
});

const getRenovationRoiFallback = (renovationType: string): number => {
  switch (renovationType) {
    case 'simple':
      return 0.5;
    case 'kitchen_bath':
    case 'structural':
      return 0.75;
    default:
      return 0.65;
  }
};

const calculateRepaymentPrincipalInterestPayment = (
  principal: number,
  annualRatePct: number,
  repaymentMonths: number
): number => {
  if (principal <= 0 || repaymentMonths <= 0) return 0;
  const monthlyRate = annualRatePct / 1200;
  if (monthlyRate === 0) {
    return principal / repaymentMonths;
  }
  const factor = Math.pow(1 + monthlyRate, repaymentMonths);
  return (principal * monthlyRate * factor) / (factor - 1);
};

const PROMPT_LEAKAGE_PATTERN = /(draw_payment_current|repayment_payment_plus4|payment_shock_plus4_vs_current_draw|output_schema|case_data|instructions|schema|must cite)/i;

export const HomeRenovationTemplate: React.FC<{ data: PdfData }> = ({ data }) => {
  const metrics = data.calculatedData.scenarioMetrics as HomeRenovationMetrics;
  const annualIncome = asNumber(data.userInputs?.annualIncome, 0);
  const creditScore = asNumber(data.userInputs?.creditScore, 700);
  const propertyType = (data.userInputs?.propertyType as
    | 'Single-family'
    | 'Townhouse'
    | 'Condo'
    | 'Multi-family'
    | 'Manufactured') || 'Single-family';
  const occupancyType = (data.userInputs?.occupancy as
    | 'Primary residence'
    | 'Second home'
    | 'Investment property') || 'Primary residence';
  const loanAmount = getLoanAmount(data);
  const oldDebt = getCurrentMonthlyDebt(data);
  const helocRate = getHelocRate(data);
  const newInterestPayment = getInterestOnlyPayment(data);
  const monthlyIncome = Math.max(getMonthlyIncome(data), 1);
  const maxLimit = asNumber(data.calculatedData.coreMetrics.maxLimit, 0);
  const homeValue = asNumber(data.userInputs?.homeValue, 0);
  const mortgageBalance = asNumber(data.userInputs?.mortgageBalance, 0);
  const oldDti = monthlyIncome > 0 ? (oldDebt / monthlyIncome) * 100 : 0;
  const projectedCltv = data.calculatedData.coreMetrics.cltv > 0
    ? data.calculatedData.coreMetrics.cltv
    : homeValue > 0
      ? ((mortgageBalance + loanAmount) / homeValue) * 100
      : 0;
  const projectedDti = asNumber(data.calculatedData.coreMetrics.dti, oldDti);
  const { cltvCap } = calculateCLTVCap(creditScore, occupancyType, propertyType);
  const effectiveCltvPct = cltvCap;
  const effectiveDtiPct = calculateDynamicMaxDTI(creditScore, effectiveCltvPct) * 100;
  const cltvLimitAmount = Math.max(0, homeValue * (effectiveCltvPct / 100) - mortgageBalance);
  const dtiLimitAmount = calculateCreditDTILimit(
    annualIncome,
    oldDebt,
    creditScore,
    effectiveCltvPct
  );
  const estimatedApprovalByModel = Math.max(0, Math.min(cltvLimitAmount, dtiLimitAmount));

  const renovationType = String(data.userInputs?.renovationType || 'simple');
  const valueIncrease = metrics?.estValueIncrease ?? Math.round(loanAmount * getRenovationRoiFallback(renovationType));
  const netEquityImpact = valueIncrease - loanAmount;
  const roi = loanAmount > 0 ? (valueIncrease / loanAmount) * 100 : 0;
  const stress2Payment = (loanAmount * (helocRate + 2)) / 1200;
  const stress4Payment = (loanAmount * (helocRate + 4)) / 1200;
  const repaymentMonths = Math.max(1, Math.round(asNumber(data.userInputs?.repaymentMonths, 240)));
  const currentRepaymentPI = calculateRepaymentPrincipalInterestPayment(loanAmount, helocRate, repaymentMonths);
  const stress2RepaymentPI = calculateRepaymentPrincipalInterestPayment(loanAmount, helocRate + 2, repaymentMonths);
  const stress4RepaymentPI = calculateRepaymentPrincipalInterestPayment(loanAmount, helocRate + 4, repaymentMonths);
  const withinApprovedLimit = loanAmount <= maxLimit;

  const v2 = data.aiAnalysis.homeRenovationV2;
  const resolveAiCopy = (value: unknown, fallback: string): string => {
    const candidate = sanitizePdfText(value, '');
    if (!candidate || PROMPT_LEAKAGE_PATTERN.test(candidate)) {
      return fallback;
    }
    return candidate;
  };

  const stepsFromV2 = (v2?.contractorPlan?.checklist || [])
    .map((item) => sanitizePdfText(item, ''))
    .filter((item) => !PROMPT_LEAKAGE_PATTERN.test(item))
    .filter((item) => item.length > 0);

  const fallbackSteps = getActionSteps(
    data.aiAnalysis,
    [
      'Never release the full HELOC amount on day one. Use milestone-based draws.',
      'Require lien waivers from contractors before final payment.',
      'Keep 10%-15% contingency uncommitted to absorb overruns.',
    ],
    'Confirm your HELOC allows multiple no-fee draws and document draw rules in writing.'
  );
  const steps = stepsFromV2.length > 0 ? stepsFromV2.slice(0, 5) : fallbackSteps;

  const goalOverallAssessment = resolveAiCopy(
    v2?.goalFeasibility?.overallAssessment,
    withinApprovedLimit
      ? `Based on your funding goal of ${formatCurrency(loanAmount)} versus an estimated approval of ${formatCurrency(maxLimit)}, this renovation plan appears feasible. Your projected DTI moves from ${formatPercent(oldDti)} to about ${formatPercent(projectedDti)}, so the key watchpoint is near-term monthly cash pressure and credit utilization sensitivity.`
      : `Your requested funding of ${formatCurrency(loanAmount)} is above the estimated approval of ${formatCurrency(maxLimit)}. This means part of the plan is likely to hit underwriting guardrails unless scope or debt structure is adjusted before application.`
  );

  const goalChartCommentary = resolveAiCopy(
    v2?.goalFeasibility?.chartCommentary,
    `The funding chart shows where your requested budget stands against the modeled bank limit, with a highlighted safety zone at 50% utilization to reduce overdraw risk. The DTI chart shows your current debt load and your projected post-draw debt load on a fixed 0%-100% scale, so the increase is visually explicit. Treat these charts as an early approval screen, not a guarantee. If your requested amount remains close to the limit, preserve at least 10%-15% contingency outside the initial contractor scope, and avoid committing the full line at once. This keeps flexibility if bids run over budget or if rate conditions tighten during construction.`
  );

  const borrowingVerdict = resolveAiCopy(
    v2?.borrowingCapacity?.executiveVerdict,
    withinApprovedLimit
      ? 'Your borrowing profile is inside current guardrails, with approval capacity supported by both CLTV and DTI under the modeled assumptions.'
      : 'Your plan is near or above current approval limits, so underwriting pressure is likely unless debt mix or request size is adjusted.'
  );

  const borrowingDetail = resolveAiCopy(
    v2?.borrowingCapacity?.parameterChartReview,
    withinApprovedLimit
      ? 'Your requested amount marker is at or below the estimated approval marker, which indicates your current income and collateral profile can likely support this budget. Keep attention on DTI drift after draw utilization.'
      : 'Your requested amount marker sits above the estimated approval marker, signaling that either the DTI curve or CLTV ceiling is limiting approval. A smaller initial draw or debt cleanup can move approval odds materially.'
  );

  const borrowingNote = resolveAiCopy(
    v2?.borrowingCapacity?.advisorsNote,
    withinApprovedLimit
      ? 'Preserve 10%-15% of available line as contingency to avoid emergency high-cost borrowing.'
      : 'Capacity pressure is likely coming from DTI or CLTV limits. A targeted debt payoff before application can reopen borrowing room.'
  );

  const cashFlowSummary = resolveAiCopy(
    v2?.cashFlowStress?.summary,
    `At the current modeled rate (${helocRate.toFixed(2)}%), this renovation adds about ${formatCurrency(newInterestPayment)} of real monthly interest outflow during draw usage.`
  );

  const paymentShockWarning = resolveAiCopy(
    v2?.cashFlowStress?.paymentShockWarning,
    'When draw-only behavior ends, moving into principal-plus-interest repayment can create a material payment jump that must be budgeted in advance.'
  );

  const stressAssessment = resolveAiCopy(
    v2?.cashFlowStress?.stressTestAssessment,
    `Under current assumptions, draw-period payment is ${formatCurrency(newInterestPayment)} and repayment-period payment is ${formatCurrency(currentRepaymentPI)}. In a +4% scenario, repayment can rise to ${formatCurrency(stress4RepaymentPI)}, creating a monthly jump of ${formatCurrency(Math.max(0, stress4RepaymentPI - newInterestPayment))} versus current draw behavior.`
  );

  const cashFlowAdvisorNote = resolveAiCopy(
    v2?.cashFlowStress?.advisorsNote,
    `Do not anchor on the low draw-period number. If your cash flow allows it, start paying close to ${formatCurrency(Math.round(((currentRepaymentPI + stress4RepaymentPI) / 2) / 10) * 10)} per month during draw and route the extra directly to principal to build a rate-shock buffer.`
  );

  const roiSummary = resolveAiCopy(
    v2?.roiEquity?.summary,
    `Estimated value added is ${formatCurrency(valueIncrease)} on ${formatCurrency(loanAmount)} cost, which implies modeled recovery near ${formatPercent(roi)}.`
  );

  const roiGuidance = resolveAiCopy(
    v2?.roiEquity?.budgetingGuidance,
    netEquityImpact >= 0
      ? 'If this upgrade is for long-term quality of life, this can be reasonable. Keep the repayment plan conservative.'
      : 'If the plan is resale-driven, this is financially weak under current assumptions and should be resized.'
  );

  const contractorIntro = resolveAiCopy(
    v2?.contractorPlan?.intro,
    data.aiAnalysis.strategy || 'Protect your cash and collateral by controlling draw timing and contractor payout conditions.'
  );
  const compactVerdict = borrowingVerdict.length > 260 ? `${borrowingVerdict.slice(0, 257)}...` : borrowingVerdict;
  const compactNote = borrowingNote.length > 240 ? `${borrowingNote.slice(0, 237)}...` : borrowingNote;

  const goalAmountChartUrl = buildGoalAmountVsApprovalChart({
    amountNeeded: loanAmount,
    approvedLimit: estimatedApprovalByModel,
  });
  const goalDtiChartUrl = buildGoalDtiComparisonChart({
    currentDti: oldDti,
    projectedDti,
  });
  const borrowingCapacityChartUrl = buildBorrowingCapacityEnvelopeChart({
    monthlyIncome,
    currentMonthlyDebt: oldDebt,
    homeValue,
    mortgageBalance,
    effectiveCltvPct,
    effectiveDtiPct,
    estimatedApproval: estimatedApprovalByModel,
    amountNeeded: loanAmount,
    helocPaymentCtrlRate: 0.0125,
  });
  const cashFlowChartUrl = buildCashFlowStressGroupedChart({
    currentRate: helocRate,
    drawAtCurrent: newInterestPayment,
    repaymentAtCurrent: currentRepaymentPI,
    drawAtPlus2: stress2Payment,
    repaymentAtPlus2: stress2RepaymentPI,
    drawAtPlus4: stress4Payment,
    repaymentAtPlus4: stress4RepaymentPI,
  });
  const roiImpactChartUrl = buildRoiImpactChart({
    renovationCost: loanAmount,
    estimatedValueAdded: valueIncrease,
    netEquityImpact,
  });

  return (
    <>
      <Page size="A4" style={styles.page}>
        <Heading1>Goal Achievability Conclusion</Heading1>
        <Divider />
        <View style={styles.section}>
          <Heading2>Overall Assessment</Heading2>
          <Paragraph>{goalOverallAssessment}</Paragraph>
        </View>

        <View style={styles.dualChartRow}>
          <View style={styles.dualChartCard}>
            <Image src={goalAmountChartUrl} alt="" style={styles.dualChartImage} />
          </View>
          <View style={styles.dualChartCard}>
            <Image src={goalDtiChartUrl} alt="" style={styles.dualChartImage} />
          </View>
        </View>

        <View style={styles.noteBox}>
          <Paragraph>{goalChartCommentary}</Paragraph>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <Heading1>Borrowing Capacity</Heading1>
        <Divider />
        <View style={styles.section}>
          <Heading2>The Executive Verdict</Heading2>
          <Paragraph>{compactVerdict}</Paragraph>
        </View>

        <View style={styles.parameterRows}>
          <View style={styles.parameterRow}>
            <View style={styles.row3Card}>
              <Text style={styles.parameterLabel}>Amount Needed</Text>
              <Text style={styles.parameterValue}>{formatCurrency(loanAmount)}</Text>
            </View>
            <View style={styles.row3Card}>
              <Text style={styles.parameterLabel}>Effective CLTV</Text>
              <Text style={styles.parameterValue}>{formatPercent(effectiveCltvPct)}</Text>
            </View>
            <View style={styles.row3Card}>
              <Text style={styles.parameterLabel}>Effective DTI</Text>
              <Text style={styles.parameterValue}>{formatPercent(effectiveDtiPct)}</Text>
            </View>
          </View>
          <View style={styles.parameterRow}>
            <View style={styles.row2Card}>
              <Text style={styles.parameterLabel}>CLTV Limit</Text>
              <Text style={styles.parameterValue}>{formatCurrency(cltvLimitAmount)}</Text>
            </View>
            <View style={styles.row2Card}>
              <Text style={styles.parameterLabel}>DTI Limit</Text>
              <Text style={styles.parameterValue}>{formatCurrency(dtiLimitAmount)}</Text>
            </View>
          </View>
        </View>

        <Image src={borrowingCapacityChartUrl} alt="" style={styles.capacityChart} />
        <Paragraph>{borrowingDetail}</Paragraph>

        <View style={styles.noteBox}>
          <Paragraph>{compactNote}</Paragraph>
          <Paragraph light>
            Current usage check: Projected CLTV {formatPercent(projectedCltv)} and projected DTI {formatPercent(projectedDti)}.
          </Paragraph>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <Heading1>Cash Flow & Stress Test</Heading1>
        <Divider />
        <View style={styles.section}>
          <Heading2>The Cash Flow Reality</Heading2>
          <Paragraph>{cashFlowSummary}</Paragraph>
          <Paragraph light>{paymentShockWarning}</Paragraph>
        </View>

        <Image src={cashFlowChartUrl} alt="" style={styles.chart} />

        <View style={styles.section}>
          <Heading2>Chart Interpretation</Heading2>
          <Paragraph>{stressAssessment}</Paragraph>
        </View>

        <View style={styles.noteBox}>
          <Paragraph>{cashFlowAdvisorNote}</Paragraph>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <Heading1>ROI & Equity Impact</Heading1>
        <Divider />
        <View style={styles.section}>
          <Heading2>Reality Check</Heading2>
          <Paragraph>{roiSummary}</Paragraph>
        </View>

        <Image src={roiImpactChartUrl} alt="" style={styles.chart} />

        <View style={styles.metricGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Renovation Cost</Text>
            <Text style={styles.metricValue}>{formatCurrency(loanAmount)}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Estimated Value Added</Text>
            <Text style={styles.metricValue}>{formatCurrency(valueIncrease)}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Net Equity Impact</Text>
            <Text style={styles.metricValue}>{formatCurrency(netEquityImpact)}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Estimated ROI</Text>
            <Text style={styles.metricValue}>{formatPercent(roi)}</Text>
          </View>
        </View>

        <Paragraph>{roiGuidance}</Paragraph>
      </Page>

      <Page size="A4" style={styles.page}>
        <Heading1>Contractor Action Plan</Heading1>
        <Divider />
        <View style={styles.section}>
          <Heading2>Execution Checklist</Heading2>
          <Paragraph>{contractorIntro}</Paragraph>
        </View>

        <View style={styles.checklistBox}>
          {steps.map((step, index) => (
            <View key={`${index}-${step}`} style={styles.checklistItem}>
              <Text style={styles.checklistText}>{index + 1}. {step}</Text>
            </View>
          ))}
        </View>
      </Page>
    </>
  );
};
