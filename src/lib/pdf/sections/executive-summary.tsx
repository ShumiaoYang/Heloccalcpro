/**
 * Executive Summary Section
 * 执行摘要章节
 */

import React from 'react';
import { View, Page, StyleSheet, Text } from '@react-pdf/renderer';
import { Heading1, Heading2, Paragraph, Divider } from '../components/base';
import { MetricCard } from '../components/metric-card';
import { Badge } from '../components/badge';
import type { PdfData } from '../types';
import { defaultPdfStyles } from '../styles';
import { calculateConfidenceScore } from '@/lib/heloc/confidence-calculator';

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
  warningBox: {
    backgroundColor: '#fee2e2',
    borderLeft: '4pt solid #dc2626',
    padding: 15,
    marginBottom: 20,
  },
  warningTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#991b1b',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 10,
    color: '#7f1d1d',
    lineHeight: 1.5,
  },
});

interface ExecutiveSummaryProps {
  data: PdfData;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ data }) => {
  const { calculatedData, aiAnalysis, userInputs } = data;
  const { coreMetrics } = calculatedData;

  // Calculate confidence score
  const confidenceScore = calculateConfidenceScore(coreMetrics.cltv, coreMetrics.dti);

  // Check if user requested max borrowing power
  const isMaxBorrowing = !userInputs.amountNeeded || userInputs.amountNeeded === 0;
  const isDebtConsolidation = userInputs.scenario === 'debt_consolidation';

  return (
    <Page size="A4" style={styles.page}>
      <Heading1>Executive Summary</Heading1>
      <Divider />

      {/* Max Borrowing Power Warning */}
      {isMaxBorrowing && isDebtConsolidation && (
        <View style={styles.warningBox}>
          <Text style={styles.warningTitle}>⚠️ THE MAXIMUM LIMIT TRAP</Text>
          <Text style={styles.warningText}>
            You requested your maximum borrowing power. Remember: Just because the bank offers you this amount,
            does NOT mean you should take it all. Only draw exactly what you need to pay off existing debt.
          </Text>
        </View>
      )}

      {/* Radical Candor Warning from AI */}
      {aiAnalysis.v3Report?.radicalCandorWarning && (
        <View style={styles.warningBox}>
          <Text style={styles.warningTitle}>{aiAnalysis.v3Report.radicalCandorWarning.title}</Text>
          <Text style={styles.warningText}>{aiAnalysis.v3Report.radicalCandorWarning.message}</Text>
        </View>
      )}

      {/* Confidence Badge */}
      <Badge
        variant={confidenceScore.level === 'high' ? 'success' : confidenceScore.level === 'moderate' ? 'warning' : 'danger'}
        label={confidenceScore.level === 'high' ? 'High Confidence' : confidenceScore.level === 'moderate' ? 'Moderate Confidence' : 'Needs Attention'}
        description={confidenceScore.message}
      />

      {/* AI生成的摘要 */}
      <View style={styles.section}>
        <Heading2>Overview</Heading2>
        <Paragraph>{aiAnalysis.summary}</Paragraph>
      </View>

      {/* 核心指标 */}
      <View style={styles.section}>
        <Heading2>Key Metrics</Heading2>
        <View style={styles.metricsGrid}>
          <View style={styles.metricColumn}>
            <MetricCard
              label="HELOC Limit"
              value={`$${coreMetrics.maxLimit.toLocaleString()}`}
            />
          </View>
          <View style={styles.metricColumn}>
            <MetricCard
              label="HELOC Rate"
              value={`${coreMetrics.helocRate}%`}
            />
          </View>
        </View>
        <View style={styles.metricsGrid}>
          <View style={styles.metricColumn}>
            <MetricCard
              label="CLTV"
              value={`${coreMetrics.cltv}%`}
              variant={coreMetrics.cltv > 80 ? 'warning' : 'success'}
            />
          </View>
          <View style={styles.metricColumn}>
            <MetricCard
              label="DTI"
              value={`${coreMetrics.dti}%`}
              variant={coreMetrics.dti > 43 ? 'danger' : 'success'}
            />
          </View>
        </View>
      </View>

      {/* 风险诊断 */}
      <View style={styles.section}>
        <Heading2>Risk Diagnostic</Heading2>
        <Paragraph>{aiAnalysis.diagnostic}</Paragraph>
      </View>
    </Page>
  );
};
