import React from 'react';
import { Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { Divider, Heading1, Heading2, Paragraph } from './base';
import { defaultPdfStyles } from '../styles';
import { sanitizePdfText } from '../templates/template-helpers';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: defaultPdfStyles.fonts.body,
  },
  section: {
    marginBottom: defaultPdfStyles.spacing.lg,
  },
  metricsGrid: {
    marginTop: defaultPdfStyles.spacing.sm,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: defaultPdfStyles.spacing.sm,
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
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 12,
    fontFamily: defaultPdfStyles.fonts.heading,
    color: defaultPdfStyles.colors.text,
  },
  compareRow: {
    marginTop: defaultPdfStyles.spacing.md,
    flexDirection: 'row',
    gap: defaultPdfStyles.spacing.sm,
  },
  compareCard: {
    flex: 1,
    borderRadius: 4,
    padding: 12,
  },
  compareLabel: {
    fontSize: 9,
    marginBottom: 4,
    color: '#334155',
  },
  compareValue: {
    fontSize: 18,
    fontFamily: defaultPdfStyles.fonts.heading,
  },
  barTrack: {
    marginTop: 10,
    width: '100%',
    height: 10,
    backgroundColor: '#e2e8f0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  barFill: {
    height: 10,
    borderRadius: 5,
  },
  pieLegend: {
    marginTop: defaultPdfStyles.spacing.md,
    gap: 6,
  },
  pieRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pieDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  pieText: {
    fontSize: 10,
    color: defaultPdfStyles.colors.textSecondary,
  },
  warningBox: {
    borderWidth: 1.5,
    borderColor: '#dc2626',
    borderRadius: 4,
    backgroundColor: '#fef2f2',
    padding: 14,
    marginTop: defaultPdfStyles.spacing.md,
  },
  warningTitle: {
    color: '#991b1b',
    fontSize: 12,
    fontFamily: defaultPdfStyles.fonts.heading,
    marginBottom: 6,
  },
  warningText: {
    color: '#7f1d1d',
    fontSize: 10,
    lineHeight: 1.5,
  },
  actionItem: {
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: defaultPdfStyles.colors.primary,
    paddingLeft: 10,
  },
  actionText: {
    fontSize: 10,
    color: defaultPdfStyles.colors.text,
    lineHeight: 1.45,
  },
});

interface ScenarioMetric {
  label: string;
  value: string;
}

interface ExecutivePageProps {
  title: string;
  sectionTitle: string;
  coreCopy: string;
  secondaryCopy?: string;
  metrics?: ScenarioMetric[];
}

interface CashFlowPageProps {
  title: string;
  sectionTitle: string;
  coreCopy: string;
  visualType: 'bar' | 'pie';
  beforeLabel: string;
  afterLabel: string;
  beforeValue: number;
  afterValue: number;
  secondaryCopy?: string;
}

interface WarningPageProps {
  title: string;
  sectionTitle: string;
  warningTitle: string;
  coreCopy: string;
  secondaryCopy?: string;
}

interface ActionPageProps {
  title: string;
  sectionTitle: string;
  coreCopy: string;
  steps: string[];
}

export const ScenarioExecutivePage: React.FC<ExecutivePageProps> = ({
  title,
  sectionTitle,
  coreCopy,
  secondaryCopy,
  metrics = [],
}) => {
  const safeCore = sanitizePdfText(coreCopy, 'Risk narrative unavailable for this section.');
  const safeSecondary = sanitizePdfText(secondaryCopy, '');

  return (
    <Page size="A4" style={styles.page}>
      <Heading1>{title}</Heading1>
      <Divider />
      <View style={styles.section}>
        <Heading2>{sectionTitle}</Heading2>
        <Paragraph>{safeCore}</Paragraph>
        {safeSecondary ? <Paragraph light>{safeSecondary}</Paragraph> : null}
      </View>
      {metrics.length > 0 && (
        <View style={styles.metricsGrid}>
          {metrics.map((metric) => (
            <View style={styles.metricCard} key={metric.label}>
              <Text style={styles.metricLabel}>{metric.label}</Text>
              <Text style={styles.metricValue}>{metric.value}</Text>
            </View>
          ))}
        </View>
      )}
    </Page>
  );
};

export const ScenarioCashFlowPage: React.FC<CashFlowPageProps> = ({
  title,
  sectionTitle,
  coreCopy,
  visualType,
  beforeLabel,
  afterLabel,
  beforeValue,
  afterValue,
  secondaryCopy,
}) => {
  const safeCore = sanitizePdfText(coreCopy, 'Cash flow comparison is based on current debt and projected HELOC carrying cost.');
  const safeSecondary = sanitizePdfText(secondaryCopy, '');

  const maxValue = Math.max(beforeValue, afterValue, 1);
  const beforePct = Math.min(100, (beforeValue / maxValue) * 100);
  const afterPct = Math.min(100, (afterValue / maxValue) * 100);
  const total = Math.max(beforeValue + afterValue, 1);
  const beforeShare = (beforeValue / total) * 100;
  const afterShare = (afterValue / total) * 100;

  return (
    <Page size="A4" style={styles.page}>
      <Heading1>{title}</Heading1>
      <Divider />
      <View style={styles.section}>
        <Heading2>{sectionTitle}</Heading2>
        <Paragraph>{safeCore}</Paragraph>
        {safeSecondary ? <Paragraph light>{safeSecondary}</Paragraph> : null}
      </View>

      <View style={styles.compareRow}>
        <View style={[styles.compareCard, { backgroundColor: '#fee2e2' }]}>
          <Text style={styles.compareLabel}>{beforeLabel}</Text>
          <Text style={[styles.compareValue, { color: '#dc2626' }]}>${Math.round(beforeValue).toLocaleString('en-US')}</Text>
          {visualType === 'bar' && (
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${beforePct}%`, backgroundColor: '#ef4444' }]} />
            </View>
          )}
        </View>

        <View style={[styles.compareCard, { backgroundColor: '#dcfce7' }]}>
          <Text style={styles.compareLabel}>{afterLabel}</Text>
          <Text style={[styles.compareValue, { color: '#16a34a' }]}>${Math.round(afterValue).toLocaleString('en-US')}</Text>
          {visualType === 'bar' && (
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${afterPct}%`, backgroundColor: '#22c55e' }]} />
            </View>
          )}
        </View>
      </View>

      {visualType === 'pie' && (
        <View style={styles.pieLegend}>
          <View style={styles.pieRow}>
            <View style={[styles.pieDot, { backgroundColor: '#ef4444' }]} />
            <Text style={styles.pieText}>{beforeLabel}: {beforeShare.toFixed(1)}%</Text>
          </View>
          <View style={styles.pieRow}>
            <View style={[styles.pieDot, { backgroundColor: '#22c55e' }]} />
            <Text style={styles.pieText}>{afterLabel}: {afterShare.toFixed(1)}%</Text>
          </View>
        </View>
      )}
    </Page>
  );
};

export const ScenarioWarningPage: React.FC<WarningPageProps> = ({
  title,
  sectionTitle,
  warningTitle,
  coreCopy,
  secondaryCopy,
}) => {
  const safeWarningTitle = sanitizePdfText(warningTitle, 'Risk Warning');
  const safeCore = sanitizePdfText(coreCopy, 'Risk commentary is unavailable. Please review core metrics and stress assumptions carefully.');
  const safeSecondary = sanitizePdfText(secondaryCopy, '');

  return (
    <Page size="A4" style={styles.page}>
      <Heading1>{title}</Heading1>
      <Divider />
      <View style={styles.section}>
        <Heading2>{sectionTitle}</Heading2>
        <View style={styles.warningBox}>
          <Text style={styles.warningTitle}>{safeWarningTitle}</Text>
          <Text style={styles.warningText}>{safeCore}</Text>
        </View>
        {safeSecondary ? <Paragraph>{safeSecondary}</Paragraph> : null}
      </View>
    </Page>
  );
};

export const ScenarioActionPage: React.FC<ActionPageProps> = ({
  title,
  sectionTitle,
  coreCopy,
  steps,
}) => {
  const safeCore = sanitizePdfText(coreCopy, 'Follow this checklist to reduce underwriting and execution risk.');
  const safeSteps = steps
    .map((step) => sanitizePdfText(step))
    .filter((step) => step.length > 0);

  return (
    <Page size="A4" style={styles.page}>
      <Heading1>{title}</Heading1>
      <Divider />
      <View style={styles.section}>
        <Heading2>{sectionTitle}</Heading2>
        <Paragraph>{safeCore}</Paragraph>
        {safeSteps.map((step, index) => (
          <View key={`${index}-${step}`} style={styles.actionItem}>
            <Text style={styles.actionText}>{index + 1}. {step}</Text>
          </View>
        ))}
      </View>
    </Page>
  );
};
