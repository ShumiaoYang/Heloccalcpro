import React from 'react';
import { Image as PdfImage, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { Heading1, Heading2, Paragraph, Divider } from '../components/base';
import { defaultPdfStyles } from '../styles';
import type { PdfData } from '../types';
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
  buildEmergencyGoalAmountVsApprovalChart,
  buildLiquidityMixChart,
  buildSurvivalRunwayChart,
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
    height: 220,
    marginBottom: defaultPdfStyles.spacing.md,
  },
  capacityChart: {
    width: '100%',
    height: 228,
    marginBottom: defaultPdfStyles.spacing.sm,
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
    height: 205,
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
  alertBox: {
    borderLeftWidth: 3,
    borderLeftColor: '#dc2626',
    backgroundColor: '#fef2f2',
    padding: 10,
    marginTop: defaultPdfStyles.spacing.sm,
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
});

const PROMPT_LEAKAGE_PATTERN = /(output_schema|case_data|instructions|schema|developer|must trigger|page\s*\d+)/i;

const calculateRepaymentPrincipalInterestPayment = (
  principal: number,
  annualRatePct: number,
  repaymentMonths: number
): number => {
  if (principal <= 0 || repaymentMonths <= 0) return 0;
  const monthlyRate = annualRatePct / 1200;
  if (monthlyRate === 0) return principal / repaymentMonths;
  const factor = Math.pow(1 + monthlyRate, repaymentMonths);
  return (principal * monthlyRate * factor) / (factor - 1);
};

export const EmergencyFundTemplate: React.FC<{ data: PdfData }> = ({ data }) => {
  const loanAmount = getLoanAmount(data);
  const helocRate = getHelocRate(data);
  const drawPayment = getInterestOnlyPayment(data);
  const annualIncome = asNumber(data.userInputs?.annualIncome, 0);
  const monthlyIncome = Math.max(getMonthlyIncome(data), 1);
  const currentMonthlyDebt = getCurrentMonthlyDebt(data);
  const currentDti = monthlyIncome > 0 ? (currentMonthlyDebt / monthlyIncome) * 100 : 0;
  const projectedDti = asNumber(data.calculatedData?.coreMetrics?.dti, currentDti);
  const homeValue = asNumber(data.userInputs?.homeValue, 0);
  const mortgageBalance = asNumber(data.userInputs?.mortgageBalance, 0);
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
  const { cltvCap } = calculateCLTVCap(creditScore, occupancyType, propertyType);
  const effectiveCltvPct = cltvCap;
  const effectiveDtiPct = calculateDynamicMaxDTI(creditScore, effectiveCltvPct) * 100;
  const cltvLimitAmount = Math.max(0, homeValue * (effectiveCltvPct / 100) - mortgageBalance);
  const dtiLimitAmount = calculateCreditDTILimit(
    annualIncome,
    currentMonthlyDebt,
    creditScore,
    effectiveCltvPct
  );
  const estimatedApprovalByModel = Math.max(0, Math.min(cltvLimitAmount, dtiLimitAmount));
  const projectedCltv = data.calculatedData.coreMetrics.cltv > 0
    ? data.calculatedData.coreMetrics.cltv
    : homeValue > 0
      ? ((mortgageBalance + loanAmount) / homeValue) * 100
      : 0;

  const monthlyNeed = Math.max(1, currentMonthlyDebt);
  const survivalMonths = loanAmount > 0 ? loanAmount / monthlyNeed : 0;
  const cashReserve = asNumber(
    data.userInputs?.cashReserve
    ?? data.userInputs?.liquidSavings
    ?? data.userInputs?.cashSavings
    ?? data.userInputs?.hysaBalance,
    0
  );
  const helocBackup = Math.max(0, estimatedApprovalByModel);

  const repaymentMonths = Math.max(1, Math.round(asNumber(data.userInputs?.repaymentMonths, 240)));
  const repaymentCurrent = calculateRepaymentPrincipalInterestPayment(loanAmount, helocRate, repaymentMonths);
  const drawPlus2Payment = (loanAmount * (helocRate + 2)) / 1200;
  const drawPlus4Payment = (loanAmount * (helocRate + 4)) / 1200;
  const repaymentPlus2 = calculateRepaymentPrincipalInterestPayment(loanAmount, helocRate + 2, repaymentMonths);
  const repaymentPlus4 = calculateRepaymentPrincipalInterestPayment(loanAmount, helocRate + 4, repaymentMonths);

  const v3 = data.aiAnalysis.emergencyFundV3;
  const resolveAiCopy = (value: unknown, fallback: string): string => {
    const candidate = sanitizePdfText(value, '');
    if (!candidate || PROMPT_LEAKAGE_PATTERN.test(candidate)) return fallback;
    return candidate;
  };

  const goalAssessment = resolveAiCopy(
    v3?.goalFeasibility?.overallAssessment,
    loanAmount <= estimatedApprovalByModel
      ? `Building defensive liquidity is a prudent decision. Your requested standby amount of ${formatCurrency(loanAmount)} appears feasible versus modeled approval near ${formatCurrency(estimatedApprovalByModel)}. If you do not draw funds, your monthly interest remains ${formatCurrency(0)}.`
      : `Your requested standby amount of ${formatCurrency(loanAmount)} is above modeled approval near ${formatCurrency(estimatedApprovalByModel)}. Accepting the highest approvable line can still provide meaningful emergency protection while keeping underwriting fit realistic.`
  );

  const goalCommentary = resolveAiCopy(
    v3?.goalFeasibility?.chartCommentary,
    `The left chart compares your desired emergency line with the modeled approved amount. The right chart translates your requested emergency line into a survival runway of about ${survivalMonths.toFixed(1)} months under a zero-income assumption using your current monthly obligations. The key advantage of this strategy is optionality: if the line is open but unused, interest cost stays at zero. Treat this as insurance capacity, not spending capacity. The quality of this safety net is strongest when paired with strict draw triggers and clear repayment discipline after any emergency draw.`
  );

  const borrowingVerdict = resolveAiCopy(
    v3?.borrowingCapacity?.executiveVerdict,
    `Even for a standby emergency line, lenders typically underwrite as if you could draw the full limit. Approval still depends on collateral capacity (CLTV) and payment capacity (DTI).`
  );

  const borrowingDetail = resolveAiCopy(
    v3?.borrowingCapacity?.parameterChartReview,
    loanAmount <= estimatedApprovalByModel
      ? 'Your requested emergency line marker is at or below the estimated approval marker, which is consistent with a feasible profile under current assumptions.'
      : 'Your requested emergency line marker is above the estimated approval marker, indicating a capacity gap driven by CLTV or DTI constraints.'
  );

  const borrowingNote = resolveAiCopy(
    v3?.borrowingCapacity?.advisorsNote,
    loanAmount <= estimatedApprovalByModel
      ? 'If available on comparable terms, consider requesting the full approved standby line because unused balance does not accrue interest.'
      : 'If the requested amount is above capacity, accept the highest approvable line as your backup shield and build complementary cash reserves.'
  );

  const immediateCashFlowSummary = resolveAiCopy(
    v3?.emergencyDrawStress?.summary,
    `If a crisis forces a full draw of ${formatCurrency(loanAmount)}, your immediate draw-period interest becomes about ${formatCurrency(drawPayment)} per month.`
  );

  const stressAssessment = resolveAiCopy(
    v3?.emergencyDrawStress?.stressTestAssessment,
    `At current rate, draw-period interest is ${formatCurrency(drawPayment)} per month. If repayment is still outstanding when principal-plus-interest begins, monthly payment rises to about ${formatCurrency(repaymentCurrent)}. In a +4% rate shock, repayment may rise to about ${formatCurrency(repaymentPlus4)}, creating a severe cash-flow squeeze in a stressed environment.`
  );

  const stressAdvisorNote = resolveAiCopy(
    v3?.emergencyDrawStress?.advisorsNote,
    'Use this line as a last defense layer, not a first response tool. After the emergency stabilizes, prioritize aggressive paydown to restore borrowing flexibility.'
  );

  const liquidityMixCommentary = resolveAiCopy(
    v3?.costCarryRisk?.liquidityMixCommentary,
    `Liquidity resilience is stronger when standby credit is paired with real cash reserves. Modeled mix here compares about ${formatCurrency(cashReserve)} in cash savings versus ${formatCurrency(helocBackup)} in HELOC backup capacity.`
  );

  const hiddenFeesWarning = resolveAiCopy(
    v3?.costCarryRisk?.hiddenFeesWarning,
    'No-draw does not always mean zero carrying cost. Some lenders apply annual fees, inactivity fees, or early closure penalties that reduce net safety value.'
  );

  const freezeRiskWarning = resolveAiCopy(
    v3?.costCarryRisk?.freezeRiskWarning,
    'HELOC is revocable credit, not guaranteed cash. During housing or credit stress, lenders may freeze or reduce unused lines. If you rely only on HELOC with no cash reserve, your safety net can fail when you need it most.'
  );

  const defensiveIntro = resolveAiCopy(
    v3?.defensivePlan?.intro,
    'Protect this line with hard rules so emergency liquidity remains available, affordable, and genuinely defensive.'
  );

  const stepsFromV3 = (v3?.defensivePlan?.checklist || [])
    .map((item) => sanitizePdfText(item, ''))
    .filter((item) => item.length > 0 && !PROMPT_LEAKAGE_PATTERN.test(item));

  const defensiveSteps = stepsFromV3.length > 0
    ? stepsFromV3.slice(0, 5)
    : getActionSteps(
      data.aiAnalysis,
      [
        'Before signing, request written disclosure for annual fees, inactivity fees, draw limits, and minimum draw rules.',
        'Define strict emergency-only triggers and prohibit lifestyle spending from this line.',
        'Maintain at least 3-6 months of separate cash reserves in HYSA to hedge line-freeze risk.',
        'After any emergency draw, prioritize fast repayment to restore standby capacity.',
      ],
      'Treat HELOC as the last defense layer, not the first source of monthly budget support.'
    );

  const goalAmountChartUrl = buildEmergencyGoalAmountVsApprovalChart({
    amountNeeded: loanAmount,
    approvedLimit: estimatedApprovalByModel,
  });
  const survivalRunwayChartUrl = buildSurvivalRunwayChart({
    survivalMonths,
  });
  const borrowingCapacityChartUrl = buildBorrowingCapacityEnvelopeChart({
    monthlyIncome,
    currentMonthlyDebt,
    homeValue,
    mortgageBalance,
    effectiveCltvPct,
    effectiveDtiPct,
    estimatedApproval: estimatedApprovalByModel,
    amountNeeded: loanAmount,
    helocPaymentCtrlRate: 0.0125,
  });
  const drawStressChartUrl = buildCashFlowStressGroupedChart({
    currentRate: helocRate,
    drawAtCurrent: drawPayment,
    repaymentAtCurrent: repaymentCurrent,
    drawAtPlus2: drawPlus2Payment,
    repaymentAtPlus2: repaymentPlus2,
    drawAtPlus4: drawPlus4Payment,
    repaymentAtPlus4: repaymentPlus4,
  });
  const liquidityMixChartUrl = buildLiquidityMixChart({
    cashReserve,
    helocBackup,
  });

  return (
    <>
      <Page size="A4" style={styles.page}>
        <Heading1>Goal Achievability Conclusion</Heading1>
        <Divider />
        <View style={styles.section}>
          <Heading2>Overall Assessment</Heading2>
          <Paragraph>{goalAssessment}</Paragraph>
        </View>

        <View style={styles.dualChartRow}>
          <View style={styles.dualChartCard}>
            <PdfImage src={goalAmountChartUrl} style={styles.dualChartImage} />
          </View>
          <View style={styles.dualChartCard}>
            <PdfImage src={survivalRunwayChartUrl} style={styles.dualChartImage} />
          </View>
        </View>

        <View style={styles.noteBox}>
          <Paragraph>{goalCommentary}</Paragraph>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <Heading1>Borrowing Capacity</Heading1>
        <Divider />
        <View style={styles.section}>
          <Heading2>The Executive Verdict</Heading2>
          <Paragraph>{borrowingVerdict}</Paragraph>
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

        <PdfImage src={borrowingCapacityChartUrl} style={styles.capacityChart} />
        <Paragraph>{borrowingDetail}</Paragraph>

        <View style={styles.noteBox}>
          <Paragraph>{borrowingNote}</Paragraph>
          <Paragraph light>
            Current check: projected CLTV {formatPercent(projectedCltv)} and projected DTI {formatPercent(projectedDti)}.
          </Paragraph>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <Heading1>Emergency Draw Stress Test</Heading1>
        <Divider />
        <View style={styles.section}>
          <Heading2>The Immediate Cash Flow Reality</Heading2>
          <Paragraph>{immediateCashFlowSummary}</Paragraph>
        </View>

        <PdfImage src={drawStressChartUrl} style={styles.chart} />

        <View style={styles.section}>
          <Heading2>Stress Test Breakdown</Heading2>
          <Paragraph>{stressAssessment}</Paragraph>
        </View>

        <View style={styles.noteBox}>
          <Paragraph>{stressAdvisorNote}</Paragraph>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <Heading1>Cost of Carry & Risks</Heading1>
        <Divider />
        <View style={styles.section}>
          <Heading2>Liquidity Mix</Heading2>
          <PdfImage src={liquidityMixChartUrl} style={styles.chart} />
          <Paragraph>{liquidityMixCommentary}</Paragraph>
        </View>

        <View style={styles.section}>
          <Heading2>The Hidden Fees</Heading2>
          <Paragraph>{hiddenFeesWarning}</Paragraph>
        </View>

        <View style={styles.alertBox}>
          <Heading2>Freeze Risk Alert</Heading2>
          <Paragraph>{freezeRiskWarning}</Paragraph>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <Heading1>Defensive Action Plan</Heading1>
        <Divider />
        <View style={styles.section}>
          <Heading2>Execution Checklist</Heading2>
          <Paragraph>{defensiveIntro}</Paragraph>
        </View>

        <View style={styles.checklistBox}>
          {defensiveSteps.map((step, index) => (
            <View key={`${index}-${step}`} style={styles.checklistItem}>
              <Text style={styles.checklistText}>{index + 1}. {step}</Text>
            </View>
          ))}
        </View>
      </Page>
    </>
  );
};
