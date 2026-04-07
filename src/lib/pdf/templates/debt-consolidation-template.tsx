import React from 'react';
import { Image as PdfImage, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { Heading1, Heading2, Paragraph, Divider } from '../components/base';
import { defaultPdfStyles } from '../styles';
import type { PdfData } from '../types';
import type { DebtConsolidationMetrics } from '@/types/heloc-ai';
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
  buildDebtRestructuringComparisonChart,
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
  reliefMetricRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: defaultPdfStyles.spacing.sm,
    marginBottom: defaultPdfStyles.spacing.md,
  },
  reliefMetricCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: defaultPdfStyles.colors.border,
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#f8fafc',
  },
  reliefMetricLabel: {
    fontSize: 9,
    color: defaultPdfStyles.colors.textSecondary,
    marginBottom: 3,
  },
  reliefMetricValue: {
    fontSize: 13,
    fontFamily: defaultPdfStyles.fonts.heading,
    color: defaultPdfStyles.colors.text,
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

const PROMPT_LEAKAGE_PATTERN = /(output_schema|case_data|instructions|schema|developer|must trigger|page\s*\d+|the bleeding|the cure|scheme c)/i;

const estimateCreditCardRate = (creditScore: number): number => {
  if (creditScore >= 750) return 18.9;
  if (creditScore >= 700) return 21.9;
  if (creditScore >= 650) return 24.9;
  return 27.9;
};

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

const calculatePayoffMonths = (
  principal: number,
  annualRatePct: number,
  monthlyPayment: number
): number => {
  if (principal <= 0 || monthlyPayment <= 0) return 0;
  const monthlyRate = annualRatePct / 1200;
  if (monthlyRate === 0) return principal / monthlyPayment;
  if (monthlyPayment <= principal * monthlyRate) return Number.POSITIVE_INFINITY;
  const months = Math.log(1 / (1 - (monthlyRate * principal) / monthlyPayment)) / Math.log(1 + monthlyRate);
  return Number.isFinite(months) ? months : Number.POSITIVE_INFINITY;
};

export const DebtConsolidationTemplate: React.FC<{ data: PdfData }> = ({ data }) => {
  const metrics = data.calculatedData.scenarioMetrics as DebtConsolidationMetrics;
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

  const creditCardBalance = asNumber(data.userInputs?.creditCardBalance, 0);
  const creditCardLimit = asNumber(data.userInputs?.creditCardLimit, 0);
  const transferAmount = Math.max(0, Math.min(loanAmount, creditCardBalance));
  const excessCashOut = Math.max(0, loanAmount - creditCardBalance);
  const excessMonthlyInterest = (excessCashOut * helocRate) / 1200;
  const assumedCardRate = estimateCreditCardRate(creditScore);
  const currentCardMinPayment = creditCardBalance > 0 ? creditCardBalance * 0.03 : loanAmount * 0.03;
  const monthlyInterestSavings = (transferAmount * assumedCardRate) / 1200 - (transferAmount * helocRate) / 1200;
  const repaymentMonths = Math.max(1, Math.round(asNumber(data.userInputs?.repaymentMonths, 240)));
  const repaymentCurrent = calculateRepaymentPrincipalInterestPayment(loanAmount, helocRate, repaymentMonths);
  const drawPlus2Payment = (loanAmount * (helocRate + 2)) / 1200;
  const drawPlus4Payment = (loanAmount * (helocRate + 4)) / 1200;
  const repaymentPlus2 = calculateRepaymentPrincipalInterestPayment(loanAmount, helocRate + 2, repaymentMonths);
  const repaymentPlus4 = calculateRepaymentPrincipalInterestPayment(loanAmount, helocRate + 4, repaymentMonths);
  const payoffMonthsReduced = Number.isFinite(metrics?.payoffMonthsReduced)
    ? asNumber(metrics?.payoffMonthsReduced, 0)
    : (() => {
      const ccMonths = calculatePayoffMonths(transferAmount, assumedCardRate, Math.max(1, transferAmount * 0.03));
      const helocMonths = calculatePayoffMonths(transferAmount, helocRate, Math.max(1, transferAmount * 0.03));
      if (!Number.isFinite(ccMonths) || !Number.isFinite(helocMonths)) return 0;
      return Math.max(0, Math.round(ccMonths - helocMonths));
    })();

  const v3 = data.aiAnalysis.debtConsolidationV3;
  const resolveAiCopy = (value: unknown, fallback: string): string => {
    const candidate = sanitizePdfText(value, '');
    if (!candidate || PROMPT_LEAKAGE_PATTERN.test(candidate)) return fallback;
    return candidate;
  };

  const goalAssessment = resolveAiCopy(
    v3?.goalFeasibility?.overallAssessment,
    loanAmount <= estimatedApprovalByModel
      ? `Your requested consolidation amount of ${formatCurrency(loanAmount)} appears feasible versus modeled approval capacity near ${formatCurrency(estimatedApprovalByModel)}. Paying off ${formatCurrency(Math.min(loanAmount, creditCardBalance))} of revolving debt can materially improve utilization and stabilize monthly budgeting.`
      : `Your requested amount of ${formatCurrency(loanAmount)} is above modeled approval capacity of about ${formatCurrency(estimatedApprovalByModel)}. Prioritize the most expensive revolving balances first and resize the request to maximize approval probability.`
  );

  const goalCommentary = resolveAiCopy(
    v3?.goalFeasibility?.chartCommentary,
    `The left chart compares your requested draw against modeled approval, with the lower half showing a safer 50% usage zone. The right chart compares current DTI (${formatPercent(currentDti)}) versus projected DTI after consolidation (${formatPercent(projectedDti)}). If your request fully covers card balances, utilization pressure can ease faster and support FICO recovery. If the request only partially covers balances, focus funds on highest-rate accounts first to maximize immediate cash-flow relief per dollar borrowed. Keep this as a disciplined restructuring move, not a spending expansion.`
  );

  const borrowingVerdict = resolveAiCopy(
    v3?.borrowingCapacity?.executiveVerdict,
    `Bank approval is constrained by two rails: collateral capacity (CLTV) and payment capacity (DTI). In your case, effective CLTV is ${formatPercent(effectiveCltvPct)} and effective DTI guardrail is ${formatPercent(effectiveDtiPct)}.`
  );

  const borrowingDetail = resolveAiCopy(
    v3?.borrowingCapacity?.parameterChartReview,
    loanAmount <= estimatedApprovalByModel
      ? 'Your requested amount marker is at or below the estimated approval marker, which is consistent with a feasible underwriting profile under current assumptions.'
      : 'Your requested amount marker is above the estimated approval marker, indicating a hard capacity gap driven by CLTV or DTI constraints.'
  );

  const borrowingNote = resolveAiCopy(
    v3?.borrowingCapacity?.advisorsNote,
    loanAmount <= estimatedApprovalByModel
      ? 'The plan is feasible. Keep scope tightly tied to debt payoff balances and avoid extra discretionary draw.'
      : 'Approval pressure is elevated. Reduce request size to cover highest-priority card balances first, then re-evaluate capacity.'
  );

  const cashFlowSummary = resolveAiCopy(
    v3?.cashFlowStress?.summary,
    `Immediately after restructuring, your draw-period HELOC interest is about ${formatCurrency(drawPayment)} per month. This may reduce short-term payment pressure, but the debt is now home-secured.`
  );

  const cashFlowWarning = resolveAiCopy(
    v3?.cashFlowStress?.paymentShockWarning,
    'This is immediate cash-flow optimization, not debt elimination. The balance remains and now carries collateral risk tied to your home.'
  );

  const stressAssessment = resolveAiCopy(
    v3?.cashFlowStress?.stressTestAssessment,
    `Baseline: at current rate, draw-period interest is ${formatCurrency(drawPayment)} per month. Repayment transition at the same rate increases monthly payment to about ${formatCurrency(repaymentCurrent)}. In the +4% case, repayment rises to about ${formatCurrency(repaymentPlus4)}, which is a jump of ${formatCurrency(Math.max(0, repaymentPlus4 - drawPayment))} versus current draw behavior.`
  );

  const stressAdvisorNote = resolveAiCopy(
    v3?.cashFlowStress?.advisorsNote,
    `Treat the monthly relief as defensive capital. If possible, auto-apply at least ${formatCurrency(Math.max(0, currentCardMinPayment - drawPayment))} of freed cash flow to HELOC principal to reduce future rate-shock exposure.`
  );

  const cureCommentary = resolveAiCopy(
    v3?.arbitrageDiagnosis?.cureCommentary,
    `Using ${formatCurrency(transferAmount)} to retire revolving balances can save about ${formatCurrency(monthlyInterestSavings)} in monthly interest spread under current assumptions and may shorten payoff time by roughly ${Math.max(0, Math.round(payoffMonthsReduced))} months.`
  );

  const bleedingCommentary = resolveAiCopy(
    v3?.arbitrageDiagnosis?.bleedingCommentary,
    excessCashOut > 0
      ? `Your requested amount exceeds card payoff need by ${formatCurrency(excessCashOut)}. That excess can add about ${formatCurrency(excessMonthlyInterest)} of avoidable monthly interest at current HELOC pricing.`
      : 'No excess cash-out detected. Borrowing scope is aligned to payoff need, which supports disciplined restructuring outcomes.'
  );

  const fiduciaryWarning = resolveAiCopy(
    v3?.arbitrageDiagnosis?.fiduciaryWarning,
    excessCashOut > 0
      ? `We detected excess cash-out of ${formatCurrency(excessCashOut)} beyond card payoff need. This excess adds about ${formatCurrency(excessMonthlyInterest)} in avoidable monthly interest. Unless this amount will immediately retire even higher-rate debt, reduce the request to match card balances and avoid negative arbitrage.`
      : 'Your draw request is tightly matched to debt payoff need. This is a fiduciary-positive structure with low arbitrage leakage.'
  );

  const executionIntro = resolveAiCopy(
    v3?.executionPlan?.intro,
    'The most common failure point is debt relapse after consolidation. Use hard controls so this restructuring permanently improves cash flow.'
  );

  const stepsFromV3 = (v3?.executionPlan?.checklist || [])
    .map((item) => sanitizePdfText(item, ''))
    .filter((item) => item.length > 0 && !PROMPT_LEAKAGE_PATTERN.test(item));

  const executionSteps = stepsFromV3.length > 0
    ? stepsFromV3.slice(0, 5)
    : getActionSteps(
      data.aiAnalysis,
      [
        'Demand Direct Pay so funds go directly to credit card issuers.',
        'After payoff, reduce or freeze card limits to block debt relapse.',
        'Auto-allocate monthly payment relief to HELOC principal reduction.',
        'Track all revolving balances weekly for the first 90 days.',
      ],
      'At funding, confirm each payoff account and amount with your lender in writing.'
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
  const restructuringChartUrl = buildDebtRestructuringComparisonChart({
    currentCardMinPayment,
    newHelocInterestOnlyPayment: drawPayment,
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
          <Paragraph>{cashFlowSummary}</Paragraph>
          <Paragraph light>{cashFlowWarning}</Paragraph>
        </View>

        <PdfImage src={cashFlowChartUrl} style={styles.chart} />

        <View style={styles.section}>
          <Heading2>Future Stress Test Breakdown</Heading2>
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
          <Heading2>Cash Flow Release Comparison</Heading2>
          <PdfImage src={restructuringChartUrl} style={styles.chart} />
        </View>

        <View style={styles.reliefMetricRow}>
          <View style={styles.reliefMetricCard}>
            <Text style={styles.reliefMetricLabel}>Monthly Interest Savings (Estimated)</Text>
            <Text style={styles.reliefMetricValue}>{formatCurrency(monthlyInterestSavings)}</Text>
          </View>
          <View style={styles.reliefMetricCard}>
            <Text style={styles.reliefMetricLabel}>Estimated Payoff-Time Improvement</Text>
            <Text style={styles.reliefMetricValue}>{Math.max(0, Math.round(payoffMonthsReduced))} months</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Heading2>Consolidation Benefit Assessment</Heading2>
          <Paragraph>{cureCommentary}</Paragraph>
        </View>

        <View style={styles.section}>
          <Heading2>Extra Capital Cost Analysis</Heading2>
          <Paragraph>{bleedingCommentary}</Paragraph>
        </View>

        <View style={styles.alertBox}>
          <Paragraph>{fiduciaryWarning}</Paragraph>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <Heading1>Execution & Relapse Prevention</Heading1>
        <Divider />
        <View style={styles.section}>
          <Heading2>Execution Checklist</Heading2>
          <Paragraph>{executionIntro}</Paragraph>
        </View>

        <View style={styles.checklistBox}>
          {executionSteps.map((step, index) => (
            <View key={`${index}-${step}`} style={styles.checklistItem}>
              <Text style={styles.checklistText}>{index + 1}. {step}</Text>
            </View>
          ))}
        </View>
      </Page>
    </>
  );
};
