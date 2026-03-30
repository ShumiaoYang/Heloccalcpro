/**
 * Stress Test Section
 * 压力测试章节
 */

import React from 'react';
import { View, Text, Page, StyleSheet, Image } from '@react-pdf/renderer';
import { Heading1, Heading2, Paragraph, Divider } from '../components/base';
import type { PdfData } from '../types';
import { defaultPdfStyles } from '../styles';
import { explainPaymentChange } from '@/lib/heloc/life-cost-translator';

const getPaymentShockChartUrl = (drawPayment: number, shockedPayment: number) => {
  const chartConfig = {
    type: 'line',
    data: {
      labels: ['Year 1', 'Year 5', 'Year 10 (Draw)', 'Year 11 (Shock)', 'Year 15'],
      datasets: [{
        label: 'Monthly Payment ($)',
        data: [drawPayment, drawPayment, drawPayment, shockedPayment, shockedPayment],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 3,
        fill: true,
      }]
    },
    options: {
      title: { display: true, text: 'The Year 11 Payment Shock Reality', fontSize: 16 },
      scales: { yAxes: [{ ticks: { beginAtZero: true } }] }
    }
  };
  return `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartConfig))}&w=600&h=300`;
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: defaultPdfStyles.fonts.body,
  },
  section: {
    marginBottom: defaultPdfStyles.spacing.lg,
  },
  table: {
    marginTop: defaultPdfStyles.spacing.md,
    marginBottom: defaultPdfStyles.spacing.md,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: defaultPdfStyles.colors.border,
    paddingVertical: 8,
  },
  tableHeader: {
    backgroundColor: defaultPdfStyles.colors.bgLight,
    fontWeight: 'bold',
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
    paddingHorizontal: 8,
  },
  tableCellHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
  },
  // Status color backgrounds for stress test rows
  successRow: {
    backgroundColor: defaultPdfStyles.colors.bgSuccess,
  },
  warningRow: {
    backgroundColor: defaultPdfStyles.colors.bgWarning,
  },
  dangerRow: {
    backgroundColor: defaultPdfStyles.colors.bgDanger,
  },
  commentary: {
    marginTop: defaultPdfStyles.spacing.md,
    padding: defaultPdfStyles.spacing.md,
    backgroundColor: defaultPdfStyles.colors.bgLight,
    borderRadius: 4,
  },
});

interface StressTestProps {
  data: PdfData;
}

export const StressTest: React.FC<StressTestProps> = ({ data }) => {
  const { calculatedData, aiAnalysis } = data;
  const { helocRate } = calculatedData.coreMetrics;

  // Calculate stress test scenarios
  const baseRate = helocRate;
  const scenario1Rate = baseRate + 1.0; // +1%
  const scenario2Rate = baseRate + 2.0; // +2%

  // Assume a typical HELOC balance for calculation
  const assumedBalance = calculatedData.coreMetrics.maxLimit * 0.5; // 50% utilization
  const baseMonthlyPayment = (assumedBalance * (baseRate / 100)) / 12;
  const scenario1Payment = (assumedBalance * (scenario1Rate / 100)) / 12;
  const scenario2Payment = (assumedBalance * (scenario2Rate / 100)) / 12;

  return (
    <Page size="A4" style={styles.page}>
      <Heading1>Stress Test Analysis</Heading1>
      <Divider />

      <View style={styles.section}>
        <Heading2>Interest Rate Sensitivity</Heading2>
        <Paragraph>
          This analysis shows how your monthly payment would change if the Prime Rate increases.
          Assuming 50% utilization of your HELOC limit (${assumedBalance.toLocaleString()}).
        </Paragraph>

        {/* Payment Shock Chart */}
        <Image
          src={getPaymentShockChartUrl(baseMonthlyPayment, scenario2Payment)}
          style={{ width: '100%', height: 200, marginVertical: 15 }}
        />
      </View>

      {/* Stress Test Table */}
      <View style={styles.table}>
        {/* Table Header */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCellHeader, { flex: 2 }]}>Scenario</Text>
          <Text style={[styles.tableCellHeader, { flex: 1 }]}>Interest Rate</Text>
          <Text style={[styles.tableCellHeader, { flex: 1 }]}>Monthly Payment</Text>
          <Text style={[styles.tableCellHeader, { flex: 1 }]}>Change</Text>
        </View>

        {/* Base Scenario */}
        <View style={[styles.tableRow, styles.successRow]}>
          <Text style={[styles.tableCell, { flex: 2 }]}>Current Rate</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>{baseRate.toFixed(2)}%</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>${baseMonthlyPayment.toFixed(2)}</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>-</Text>
        </View>

        {/* Scenario 1: +1% */}
        <View style={[styles.tableRow, styles.warningRow]}>
          <Text style={[styles.tableCell, { flex: 2 }]}>Prime Rate +1.0%</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>{scenario1Rate.toFixed(2)}%</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>${scenario1Payment.toFixed(2)}</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>
            +${(scenario1Payment - baseMonthlyPayment).toFixed(2)}
          </Text>
        </View>

        {/* Scenario 2: +2% */}
        <View style={[styles.tableRow, styles.dangerRow]}>
          <Text style={[styles.tableCell, { flex: 2 }]}>Prime Rate +2.0%</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>{scenario2Rate.toFixed(2)}%</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>${scenario2Payment.toFixed(2)}</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>
            +${(scenario2Payment - baseMonthlyPayment).toFixed(2)}
          </Text>
        </View>
      </View>

      {/* AI Commentary */}
      {aiAnalysis.stressTestCommentary && (
        <View style={styles.section}>
          <Heading2>Expert Commentary</Heading2>
          <View style={styles.commentary}>
            <Paragraph>{aiAnalysis.stressTestCommentary}</Paragraph>
          </View>
        </View>
      )}

      {/* Life Cost Translation */}
      <View style={styles.section}>
        <Heading2>What This Means for Your Budget</Heading2>
        <Paragraph>
          {explainPaymentChange(scenario1Payment - baseMonthlyPayment)}
        </Paragraph>
        <View style={{ marginTop: 8 }}>
          <Paragraph>
            In a worst-case scenario (+2%), {explainPaymentChange(scenario2Payment - baseMonthlyPayment)}
          </Paragraph>
        </View>
      </View>

      {/* Key Takeaways */}
      <View style={styles.section}>
        <Heading2>Key Takeaways</Heading2>
        <Paragraph>
          • A 1% rate increase would add ${(scenario1Payment - baseMonthlyPayment).toFixed(2)} to your monthly payment
        </Paragraph>
        <Paragraph>
          • A 2% rate increase would add ${(scenario2Payment - baseMonthlyPayment).toFixed(2)} to your monthly payment
        </Paragraph>
        <Paragraph>
          • Ensure you have sufficient cash flow buffer to handle potential rate increases
        </Paragraph>
      </View>
    </Page>
  );
};
