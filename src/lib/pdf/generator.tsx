/**
 * PDF Generator - v3.0 Professional Report
 */

import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import type { PdfData } from './types';
import { StressTest } from './sections/stress-test';
import { ExecutiveSummary } from './sections/executive-summary';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottom: '2pt solid #059669',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 3,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottom: '1pt solid #e5e7eb',
  },
  text: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#374151',
    marginBottom: 12,
  },
  highlight: {
    backgroundColor: '#d1fae5',
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
  },
  metric: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingVertical: 4,
  },
  metricLabel: {
    fontSize: 11,
    color: '#6b7280',
  },
  metricValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#059669',
  },
  table: {
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1pt solid #e5e7eb',
    paddingVertical: 6,
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
    fontWeight: 'bold',
  },
  tableCell: {
    flex: 1,
    fontSize: 9,
    paddingHorizontal: 4,
  },
  checklist: {
    marginLeft: 10,
  },
  checklistItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  checklistBullet: {
    width: 20,
    fontSize: 10,
    color: '#059669',
  },
  checklistText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.5,
    color: '#374151',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: '#9ca3af',
    textAlign: 'center',
    borderTop: '1pt solid #e5e7eb',
    paddingTop: 10,
  },
  dashboardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 15,
    padding: 15,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
  },
  dashboardItem: {
    alignItems: 'center',
    flex: 1,
  },
  dashboardLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 5,
  },
  dashboardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dashboardStatus: {
    fontSize: 9,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 120,
    marginVertical: 15,
    padding: 15,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
  },
  chartBar: {
    width: 60,
    backgroundColor: '#059669',
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 5,
  },
  chartLabel: {
    fontSize: 9,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  chartCaption: {
    fontSize: 9,
    color: '#6b7280',
    marginTop: 5,
    textAlign: 'center',
  },
});

const HelocReportDocument: React.FC<{ data: PdfData }> = ({ data }) => {
  const { userInputs, calculatedData, aiAnalysis } = data;
  const v3 = aiAnalysis.v3Report;
  const metrics = calculatedData.coreMetrics;

  const formatCurrency = (value: number) =>
    `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

  const formatPercent = (value: number) =>
    `${value.toFixed(2)}%`;

  // Calculate repayment period payment
  const drawPeriodPayment = (metrics.maxLimit * metrics.helocRate / 100 / 12);
  const repaymentPayment = (metrics.maxLimit / 240) + drawPeriodPayment;

  // Calculate relative bar heights (max 70, proportional)
  const maxPayment = Math.max(drawPeriodPayment, repaymentPayment);
  const drawBarHeight = (drawPeriodPayment / maxPayment) * 70;
  const repaymentBarHeight = (repaymentPayment / maxPayment) * 70;

  // Get dashboard colors
  const getDashboardColor = (color: string) => {
    if (color === 'green') return { bg: '#d1fae5', text: '#059669' };
    if (color === 'yellow') return { bg: '#fef3c7', text: '#d97706' };
    return { bg: '#fee2e2', text: '#dc2626' };
  };

  const dtiColors = getDashboardColor(v3?.riskDashboard?.dtiColor || 'green');
  const cltvColors = getDashboardColor(v3?.riskDashboard?.cltvColor || 'green');

  return (
    <Document>
      {/* Page 1: Cover & Executive Brief */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>HELOC Financial Strategy Report</Text>
          <Text style={styles.subtitle}>Date: {new Date().toLocaleDateString('en-US')}</Text>
          <Text style={styles.subtitle}>Primary Goal: {userInputs.scenario || 'Financial Planning'}</Text>
        </View>

        {/* Max Borrowing Power Warning */}
        {(!userInputs.amountNeeded || userInputs.amountNeeded === 0) && userInputs.scenario === 'debt_consolidation' && (
          <View style={{ backgroundColor: '#fee2e2', borderLeft: '4pt solid #dc2626', padding: 15, marginBottom: 20 }}>
            <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#991b1b', marginBottom: 8 }}>
              ⚠️ THE MAXIMUM LIMIT TRAP
            </Text>
            <Text style={{ fontSize: 10, color: '#7f1d1d', lineHeight: 1.5 }}>
              You requested your maximum borrowing power. Remember: Just because the bank offers you this amount, does NOT mean you should take it all. Only draw exactly what you need to pay off existing debt.
            </Text>
          </View>
        )}

        {/* Radical Candor Warning from AI */}
        {v3?.radicalCandorWarning && (
          <View style={{ backgroundColor: '#fee2e2', borderLeft: '4pt solid #dc2626', padding: 15, marginBottom: 20 }}>
            <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#991b1b', marginBottom: 8 }}>
              {v3.radicalCandorWarning.title}
            </Text>
            <Text style={{ fontSize: 10, color: '#7f1d1d', lineHeight: 1.5 }}>
              {v3.radicalCandorWarning.message}
            </Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>01. Executive Brief: The Advisor&apos;s View</Text>
          <View style={styles.highlight}>
            <Text style={styles.text}>{v3?.executiveBrief || aiAnalysis.summary}</Text>
          </View>

          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Maximum Estimated Credit Line:</Text>
            <Text style={styles.metricValue}>{formatCurrency(metrics.maxLimit)}</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Estimated Starting APR:</Text>
            <Text style={styles.metricValue}>{formatPercent(metrics.helocRate)}</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>CLTV Ratio:</Text>
            <Text style={styles.metricValue}>{formatPercent(metrics.cltv)}</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>DTI Ratio:</Text>
            <Text style={styles.metricValue}>{formatPercent(metrics.dti)}</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          HELOC Financial Strategy Report | Page 1 | Confidential
        </Text>
      </Page>

      {/* Page 2: Goal Analysis */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>02. Goal Analysis</Text>
          <Text style={styles.text}>
            <Text style={{ fontWeight: 'bold' }}>Economic Impact: </Text>
            {v3?.goalAnalysis?.economicImpact || 'Analyzing your financial goals...'}
          </Text>
          <Text style={styles.text}>
            <Text style={{ fontWeight: 'bold' }}>Advisor&apos;s Note: </Text>
            {v3?.goalAnalysis?.advisorNote || aiAnalysis.strategy}
          </Text>
        </View>

        <Text style={styles.footer}>
          HELOC Financial Strategy Report | Page 2 | Confidential
        </Text>
      </Page>

      {/* Page 3: Comparison & Bank Evaluation */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>03. The Ultimate Comparison: Why a HELOC?</Text>

          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>Tool</Text>
              <Text style={styles.tableCell}>Est. Rate</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>Pros</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>Cons</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 1.5, fontWeight: 'bold' }]}>HELOC</Text>
              <Text style={styles.tableCell}>{formatPercent(metrics.helocRate)}</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>Extreme flexibility. Pay only for what you use.</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>Variable rates can increase costs.</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>Home Equity Loan</Text>
              <Text style={styles.tableCell}>Higher</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>Fixed rates. Predictable payments.</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>Less flexibility; interest on full amount.</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>Cash-out Refi</Text>
              <Text style={styles.tableCell}>Market</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>High cash access.</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>Replaces your low 1st mortgage rate.</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footer}>
          HELOC Financial Strategy Report | Page 3 | Confidential
        </Text>
      </Page>

      {/* Page 4: Bank Evaluation with Dashboard */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>04. The Bank&apos;s Evaluation: The Three Pillars</Text>

          {/* Risk Dashboard */}
          <View style={styles.dashboardContainer}>
            <View style={styles.dashboardItem}>
              <Text style={styles.dashboardLabel}>DTI Ratio</Text>
              <Text style={[styles.dashboardValue, { color: dtiColors.text }]}>{formatPercent(metrics.dti)}</Text>
              <Text style={[styles.dashboardStatus, { backgroundColor: dtiColors.bg, color: dtiColors.text }]}>
                {v3?.riskDashboard?.dtiLabel || 'Healthy'}
              </Text>
            </View>
            <View style={styles.dashboardItem}>
              <Text style={styles.dashboardLabel}>CLTV Ratio</Text>
              <Text style={[styles.dashboardValue, { color: cltvColors.text }]}>{formatPercent(metrics.cltv)}</Text>
              <Text style={[styles.dashboardStatus, { backgroundColor: cltvColors.bg, color: cltvColors.text }]}>
                {v3?.riskDashboard?.cltvLabel || 'Healthy'}
              </Text>
            </View>
          </View>

          <Text style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 6 }}>Pillar 1: Your Equity Cushion (CLTV)</Text>
          <Text style={styles.text}>
            Your Result: {formatPercent(metrics.cltv)}
          </Text>
          <Text style={styles.text}>
            {v3?.bankEvaluation?.cltvInsight || 'Your CLTV indicates your equity position.'}
          </Text>

          <Text style={{ fontSize: 11, fontWeight: 'bold', marginTop: 10, marginBottom: 6 }}>Pillar 2: Cash Flow Resilience (DTI)</Text>
          <Text style={styles.text}>
            Underwriting Stress Test: {formatPercent(metrics.dti)}
          </Text>
          <Text style={styles.text}>
            {v3?.bankEvaluation?.dtiInsight || aiAnalysis.diagnostic}
          </Text>

          <Text style={{ fontSize: 11, fontWeight: 'bold', marginTop: 10, marginBottom: 6 }}>Pillar 3: Your Credit Pricing</Text>
          <Text style={styles.text}>
            {v3?.bankEvaluation?.marginInsight || 'Your rate is based on credit score and market conditions.'}
          </Text>
        </View>

        <Text style={styles.footer}>
          HELOC Financial Strategy Report | Page 4 | Confidential
        </Text>
      </Page>

      {/* Page 5: Roadmap & Lifecycle */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>05. The 240-Month Roadmap: A Lifetime View</Text>

          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>Phase</Text>
              <Text style={styles.tableCell}>Monthly Payment</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>Advisor&apos;s View</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>Draw Period (Yrs 1-10)</Text>
              <Text style={styles.tableCell}>{formatCurrency(metrics.maxLimit * metrics.helocRate / 100 / 12)}</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>
                {v3?.lifetimeRoadmap?.drawPeriodView || 'Interest-only payments during draw period.'}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>Repayment (Yrs 11-30)</Text>
              <Text style={styles.tableCell}>{formatCurrency(repaymentPayment)}</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>
                {v3?.lifetimeRoadmap?.repaymentPeriodView || 'Principal + interest payments begin.'}
              </Text>
            </View>
          </View>

          {/* Payment Comparison Chart */}
          <View style={styles.chartContainer}>
            <View>
              <View style={[styles.chartBar, { height: drawBarHeight }]}>
                <Text style={styles.chartLabel}>{formatCurrency(drawPeriodPayment)}</Text>
              </View>
              <Text style={styles.chartCaption}>Draw Period</Text>
            </View>
            <View>
              <View style={[styles.chartBar, { height: repaymentBarHeight, backgroundColor: '#dc2626' }]}>
                <Text style={styles.chartLabel}>{formatCurrency(repaymentPayment)}</Text>
              </View>
              <Text style={styles.chartCaption}>Repayment Period</Text>
            </View>
          </View>

          <View style={styles.highlight}>
            <Text style={styles.text}>
              <Text style={{ fontWeight: 'bold' }}>Payment Shock Warning: </Text>
              {v3?.lifetimeRoadmap?.paymentShockWarning || 'Be prepared for payment increases in the repayment period.'}
            </Text>
          </View>

          {/* Personalized Lifecycle Analysis */}
          {v3?.lifecyclePersonalized && (
            <View style={{ marginTop: 15 }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 8, color: '#1f2937' }}>
                Your 20-Year Journey
              </Text>
              <Text style={styles.text}>{v3.lifecyclePersonalized}</Text>
            </View>
          )}
        </View>

        <Text style={styles.footer}>
          HELOC Financial Strategy Report | Page 5 | Confidential
        </Text>
      </Page>

      {/* Page 6: Stress Test */}
      <StressTest data={data} />

      {/* Page 7: Bank Readiness Checklist */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>07. Your &quot;Bank Readiness&quot; Checklist</Text>
          <View style={styles.checklist}>
            {(v3?.bankReadiness || aiAnalysis.actionPlan || []).map((item, index) => (
              <View key={index} style={styles.checklistItem}>
                <Text style={styles.checklistBullet}>-</Text>
                <Text style={styles.checklistText}>
                  {typeof item === 'string' ? item : item.action}
                </Text>
              </View>
            ))}
          </View>

          {/* Special Recommendation */}
          {v3?.specialRecommendation && (
            <View style={{ marginTop: 20, padding: 15, backgroundColor: '#fef3c7', borderRadius: 4 }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 8, color: '#92400e' }}>
                Special Recommendation for Your Situation
              </Text>
              <Text style={[styles.text, { color: '#92400e' }]}>{v3.specialRecommendation}</Text>
            </View>
          )}
        </View>

        <Text style={styles.footer}>
          HELOC Financial Strategy Report | Page 7 | Confidential
        </Text>
      </Page>

      {/* Page 8: Appendix */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>08. Appendix & Assumptions</Text>

          <Text style={styles.text}>
            <Text style={{ fontWeight: 'bold' }}>Model: </Text>
            HELOC Risk-Exposure Engine v3.0
          </Text>

          <Text style={styles.text}>
            <Text style={{ fontWeight: 'bold' }}>Key Inputs:</Text>
          </Text>
          <View style={{ marginLeft: 15 }}>
            <Text style={styles.text}>• Home Value: {formatCurrency(userInputs.homeValue)}</Text>
            <Text style={styles.text}>• Mortgage Balance: {formatCurrency(userInputs.mortgageBalance)}</Text>
            <Text style={styles.text}>• Credit Score: {userInputs.creditScore}</Text>
            <Text style={styles.text}>• Annual Income: {formatCurrency(userInputs.annualIncome)}</Text>
            <Text style={styles.text}>• Monthly Debt: {formatCurrency(userInputs.monthlyDebt)}</Text>
          </View>

          <View style={{ marginTop: 20, padding: 15, backgroundColor: '#fef3c7', borderRadius: 4 }}>
            <Text style={{ fontSize: 9, lineHeight: 1.5, color: '#92400e' }}>
              <Text style={{ fontWeight: 'bold' }}>Disclaimer: </Text>
              This report is for educational planning purposes only. It is not a loan commitment or financial advice.
              HELOC rates are variable and actual terms depend on the final lender contract. Consult with a licensed
              financial advisor before making any financial decisions.
            </Text>
          </View>
        </View>

        <Text style={styles.footer}>
          HELOC Financial Strategy Report | Page 8 | End of Report
        </Text>
      </Page>
    </Document>
  );
};

export async function generateHelocPdf(data: PdfData): Promise<Buffer> {
  const doc = <HelocReportDocument data={data} />;
  const asPdf = pdf(doc);
  const blob = await asPdf.toBlob();
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
