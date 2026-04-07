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
  buildArbitrageSpreadChart,
  buildBorrowingCapacityEnvelopeChart,
  buildCashFlowStressGroupedChart,
  buildGoalAmountVsApprovalChart,
  buildGoalDtiComparisonChart,
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

const PROMPT_LEAKAGE_PATTERN = /(output_schema|case_data|instructions|schema|developer|must trigger|page\s*\d+|internal logic|the spread|\[cite)/i;

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

export const InvestmentTemplate: React.FC<{ data: PdfData }> = ({ data }) => {
  const loanAmount = getLoanAmount(data);
  const helocRate = getHelocRate(data);
  const drawPayment = getInterestOnlyPayment(data);
  const expectedReturnRate = asNumber(
    data.userInputs?.expectedReturnRate ?? data.userInputs?.expectedReturn,
    8
  );
  const investmentType = String(data.userInputs?.investmentType || 'General Investment');
  const netSpread = expectedReturnRate - helocRate;
  const annualDebtCost = loanAmount * (helocRate / 100);
  const annualExpectedReturn = loanAmount * (expectedReturnRate / 100);

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

  const repaymentMonths = Math.max(1, Math.round(asNumber(data.userInputs?.repaymentMonths, 240)));
  const repaymentCurrent = calculateRepaymentPrincipalInterestPayment(loanAmount, helocRate, repaymentMonths);
  const drawPlus2Payment = (loanAmount * (helocRate + 2)) / 1200;
  const drawPlus4Payment = (loanAmount * (helocRate + 4)) / 1200;
  const repaymentPlus2 = calculateRepaymentPrincipalInterestPayment(loanAmount, helocRate + 2, repaymentMonths);
  const repaymentPlus4 = calculateRepaymentPrincipalInterestPayment(loanAmount, helocRate + 4, repaymentMonths);

  const v3 = data.aiAnalysis.investmentV3;
  const resolveAiCopy = (value: unknown, fallback: string): string => {
    const candidate = sanitizePdfText(value, '');
    if (!candidate || PROMPT_LEAKAGE_PATTERN.test(candidate)) return fallback;
    return candidate;
  };

  const goalAssessment = resolveAiCopy(
    v3?.goalFeasibility?.overallAssessment,
    loanAmount <= estimatedApprovalByModel
      ? `Bank math may approve your requested ${investmentType} draw of ${formatCurrency(loanAmount)}, but approval is not endorsement of investment quality. This draw can move household DTI from ${formatPercent(currentDti)} to about ${formatPercent(projectedDti)}, reducing resilience to income shocks.`
      : `Your requested draw of ${formatCurrency(loanAmount)} is above modeled approval near ${formatCurrency(estimatedApprovalByModel)}. If leverage is pursued, reducing size is necessary before this plan becomes structurally financeable.`
  );

  const goalCommentary = resolveAiCopy(
    v3?.goalFeasibility?.chartCommentary,
    `The left chart compares your requested draw to modeled approval capacity, with a safer 50% usage zone highlighted for control. The right chart visualizes DTI deterioration from ${formatPercent(currentDti)} to ${formatPercent(projectedDti)} if this leverage is executed. This matters because debt service is fixed and monthly, while investment outcomes are uncertain and often non-monthly. If market returns are delayed or negative, the cash-flow burden still arrives on schedule. Use this section as a household survivability test, not as a green light to maximize leverage.`
  );

  const borrowingVerdict = resolveAiCopy(
    v3?.borrowingCapacity?.executiveVerdict,
    `Bank approval is constrained by collateral capacity (CLTV) and payment capacity (DTI). In your case, effective CLTV is ${formatPercent(effectiveCltvPct)} and effective DTI guardrail is ${formatPercent(effectiveDtiPct)}.`
  );

  const borrowingDetail = resolveAiCopy(
    v3?.borrowingCapacity?.parameterChartReview,
    loanAmount <= estimatedApprovalByModel
      ? 'Your requested amount marker is at or below the estimated approval marker, which is mathematically feasible. Feasible capacity is not equivalent to prudent investment sizing.'
      : 'Your requested amount marker is above the estimated approval marker, indicating that CLTV or DTI limits are blocking this leverage size.'
  );

  const borrowingNote = resolveAiCopy(
    v3?.borrowingCapacity?.advisorsNote,
    loanAmount <= estimatedApprovalByModel
      ? 'Even if approvable, avoid max draw by default. Maintain optionality and preserve household liquidity buffer.'
      : 'Resize leverage down to approvable range and reassess downside tolerance before proceeding.'
  );

  const immediateCashFlowSummary = resolveAiCopy(
    v3?.cashFlowStress?.summary,
    `Immediately after draw, monthly interest outflow is about ${formatCurrency(drawPayment)}. This is a fixed monthly cash drain regardless of investment performance.`
  );

  const stressAssessment = resolveAiCopy(
    v3?.cashFlowStress?.stressTestAssessment,
    `Baseline draw interest is ${formatCurrency(drawPayment)} per month. If balance persists into repayment, monthly payment rises to about ${formatCurrency(repaymentCurrent)}. In a +4% rate scenario, repayment can rise to ${formatCurrency(repaymentPlus4)}, which can erase projected return buffer quickly.`
  );

  const stressAdvisorNote = resolveAiCopy(
    v3?.cashFlowStress?.advisorsNote,
    `Before leveraging, hold at least 6-12 months of HELOC payment buffer in cash so loan servicing does not depend on immediate investment payouts.`
  );

  const spreadAssessment = resolveAiCopy(
    v3?.arbitrageDiagnosis?.spreadAssessment,
    `At ${formatPercent(helocRate, 2)} borrowing cost and ${formatPercent(expectedReturnRate, 2)} expected return, modeled net spread is ${formatPercent(netSpread, 2)}. Expected annual return is ${formatCurrency(annualExpectedReturn)} versus annual debt cost of ${formatCurrency(annualDebtCost)}.`
  );

  const fiduciaryWarningFallback = netSpread <= 0
    ? `Your expected return of ${formatPercent(expectedReturnRate, 2)} does not cover current debt cost of ${formatPercent(helocRate, 2)}. This is negative arbitrage from day one. Do not proceed unless assumptions materially change.`
    : netSpread < 3
      ? `Your modeled net spread is only ${formatPercent(netSpread, 2)}. This thin buffer can be wiped out by volatility, taxes, fees, or rate resets, turning the plan into negative arbitrage.`
      : `Modeled net spread is ${formatPercent(netSpread, 2)}, but risk remains asymmetric: debt service is fixed while investment returns are volatile. A drawdown can combine asset losses with persistent loan burden.`;

  const fiduciaryWarning = resolveAiCopy(
    v3?.arbitrageDiagnosis?.fiduciaryWarning,
    fiduciaryWarningFallback
  );

  const guardrailsIntro = resolveAiCopy(
    v3?.guardrailsPlan?.intro,
    'If leverage is pursued, execution discipline is non-negotiable. Protect household solvency before return chasing.'
  );

  const stepsFromV3 = (v3?.guardrailsPlan?.checklist || [])
    .map((item) => sanitizePdfText(item, ''))
    .filter((item) => item.length > 0 && !PROMPT_LEAKAGE_PATTERN.test(item));

  const guardrailSteps = stepsFromV3.length > 0
    ? stepsFromV3.slice(0, 5)
    : getActionSteps(
      data.aiAnalysis,
      [
        'Avoid cross-collateralized structures that can transmit investment loss into home-loss risk.',
        'Maintain strict tax documentation and separate investment funds from household spending.',
        'Predefine hard stop-loss and exit thresholds before capital deployment.',
        'Keep dedicated cash buffer for HELOC servicing independent from investment cash flow.',
      ],
      'Do not rely on first-year investment returns to service HELOC payments.'
    );

  const goalAmountChartUrl = buildGoalAmountVsApprovalChart({
    amountNeeded: loanAmount,
    approvedLimit: estimatedApprovalByModel,
  });
  const goalDtiChartUrl = buildGoalDtiComparisonChart({
    currentDti,
    projectedDti,
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
  const cashFlowChartUrl = buildCashFlowStressGroupedChart({
    currentRate: helocRate,
    drawAtCurrent: drawPayment,
    repaymentAtCurrent: repaymentCurrent,
    drawAtPlus2: drawPlus2Payment,
    repaymentAtPlus2: repaymentPlus2,
    drawAtPlus4: drawPlus4Payment,
    repaymentAtPlus4: repaymentPlus4,
  });
  const spreadChartUrl = buildArbitrageSpreadChart({
    costOfDebtRate: helocRate,
    expectedReturnRate,
    netSpreadRate: netSpread,
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
            <PdfImage src={goalDtiChartUrl} style={styles.dualChartImage} />
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
        <Heading1>Cash Flow & Stress Test</Heading1>
        <Divider />
        <View style={styles.section}>
          <Heading2>The Immediate Cash Flow Reality</Heading2>
          <Paragraph>{immediateCashFlowSummary}</Paragraph>
        </View>

        <PdfImage src={cashFlowChartUrl} style={styles.chart} />

        <View style={styles.section}>
          <Heading2>Stress Test Breakdown</Heading2>
          <Paragraph>{stressAssessment}</Paragraph>
        </View>

        <View style={styles.noteBox}>
          <Paragraph>{stressAdvisorNote}</Paragraph>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <Heading1>Arbitrage Diagnosis</Heading1>
        <Divider />
        <View style={styles.section}>
          <Heading2>Arbitrage Spread Assessment</Heading2>
          <PdfImage src={spreadChartUrl} style={styles.chart} />
          <Paragraph>{spreadAssessment}</Paragraph>
        </View>

        <View style={styles.alertBox}>
          <Heading2>Leverage Risk Warning</Heading2>
          <Paragraph>{fiduciaryWarning}</Paragraph>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <Heading1>Leverage Guardrails & Action Plan</Heading1>
        <Divider />
        <View style={styles.section}>
          <Heading2>Execution Checklist</Heading2>
          <Paragraph>{guardrailsIntro}</Paragraph>
        </View>

        <View style={styles.checklistBox}>
          {guardrailSteps.map((step, index) => (
            <View key={`${index}-${step}`} style={styles.checklistItem}>
              <Text style={styles.checklistText}>{index + 1}. {step}</Text>
            </View>
          ))}
        </View>
      </Page>
    </>
  );
};
