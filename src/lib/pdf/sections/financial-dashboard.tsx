/**
 * Financial Dashboard Section
 * 财务仪表盘章节
 */

import React from 'react';
import { View, Page, StyleSheet, Text } from '@react-pdf/renderer';
import { Heading1, Heading2, Paragraph, Divider } from '../components/base';
import { Card } from '../components/card';
import { MetricCard } from '../components/metric-card';
import type { PdfData } from '../types';
import { defaultPdfStyles } from '../styles';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: defaultPdfStyles.fonts.body,
  },
  section: {
    marginBottom: defaultPdfStyles.spacing.lg,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: defaultPdfStyles.spacing.sm,
    marginBottom: defaultPdfStyles.spacing.md,
  },
  metricColumn: {
    flex: 1,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  label: {
    fontSize: 10,
    color: defaultPdfStyles.colors.textSecondary,
  },
  value: {
    fontSize: 11,
    fontWeight: 'bold',
    color: defaultPdfStyles.colors.text,
  },
});

interface FinancialDashboardProps {
  data: PdfData;
}

export const FinancialDashboard: React.FC<FinancialDashboardProps> = ({ data }) => {
  const { userInputs, calculatedData } = data;
  const { coreMetrics } = calculatedData;

  // Calculate current equity
  const currentEquity = (userInputs.homeValue || 0) - (userInputs.mortgageBalance || 0);

  // Determine risk levels for CLTV and DTI
  const cltvVariant = coreMetrics.cltv > 80 ? 'danger' : coreMetrics.cltv > 70 ? 'warning' : 'success';
  const dtiVariant = coreMetrics.dti > 43 ? 'danger' : coreMetrics.dti > 36 ? 'warning' : 'success';

  return (
    <Page size="A4" style={styles.page}>
      <Heading1>Your Financial Dashboard</Heading1>
      <Divider />

      {/* 房产信息 */}
      <View style={styles.section}>
        <Heading2>Your Property Overview</Heading2>
        <Card variant="default">
          <View style={styles.cardContent}>
            <Text style={styles.label}>Home Value</Text>
            <Text style={styles.value}>${userInputs.homeValue?.toLocaleString() || 'N/A'}</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.label}>Mortgage Balance</Text>
            <Text style={styles.value}>${userInputs.mortgageBalance?.toLocaleString() || 'N/A'}</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.label}>Current Equity</Text>
            <Text style={styles.value}>${currentEquity.toLocaleString()}</Text>
          </View>
        </Card>
      </View>

      {/* HELOC信息 */}
      <View style={styles.section}>
        <Heading2>Your HELOC Details</Heading2>
        <Card variant="default">
          <View style={styles.cardContent}>
            <Text style={styles.label}>Maximum HELOC Limit</Text>
            <Text style={styles.value}>${coreMetrics.maxLimit.toLocaleString()}</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.label}>HELOC Interest Rate</Text>
            <Text style={styles.value}>{coreMetrics.helocRate}%</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.label}>Monthly Savings Potential</Text>
            <Text style={styles.value}>${coreMetrics.monthlySavings.toLocaleString()}</Text>
          </View>
        </Card>
      </View>

      {/* 核心风险指标 - 使用 MetricCard 和警示色 */}
      <View style={styles.section}>
        <Heading2>Key Risk Indicators</Heading2>
        <Paragraph>
          These metrics help us assess your financial position and borrowing capacity.
        </Paragraph>
        <View style={styles.metricsGrid}>
          <View style={styles.metricColumn}>
            <MetricCard
              label="CLTV (Combined Loan-to-Value)"
              value={`${coreMetrics.cltv}%`}
              variant={cltvVariant}
            />
          </View>
          <View style={styles.metricColumn}>
            <MetricCard
              label="DTI (Debt-to-Income)"
              value={`${coreMetrics.dti}%`}
              variant={dtiVariant}
            />
          </View>
        </View>
      </View>
    </Page>
  );
};
