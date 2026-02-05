/**
 * Executive Summary Section
 * 执行摘要章节
 */

import React from 'react';
import { View, Page, StyleSheet } from '@react-pdf/renderer';
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
});

interface ExecutiveSummaryProps {
  data: PdfData;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ data }) => {
  const { calculatedData, aiAnalysis } = data;
  const { coreMetrics } = calculatedData;

  // Calculate confidence score
  const confidenceScore = calculateConfidenceScore(coreMetrics.cltv, coreMetrics.dti);

  return (
    <Page size="A4" style={styles.page}>
      <Heading1>Executive Summary</Heading1>
      <Divider />

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
