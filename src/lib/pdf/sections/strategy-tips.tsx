import React from 'react';
import { View, Text, Page, StyleSheet } from '@react-pdf/renderer';
import { Heading1, Heading2, Paragraph, Divider } from '../components/base';
import { defaultPdfStyles } from '../styles';
import type { PdfData } from '../types';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: defaultPdfStyles.fonts.body },
  section: { marginBottom: defaultPdfStyles.spacing.lg },
  warningBox: { padding: 20, backgroundColor: '#fef2f2', borderLeft: '6px solid #ef4444', marginTop: 20 },
  warningTitle: { fontSize: 16, fontWeight: 'bold', color: '#dc2626', marginBottom: 10 },
  warningText: { fontSize: 12, color: '#450a0a', lineHeight: 1.6 },
  tipBox: { marginBottom: 15, padding: 15, backgroundColor: '#f8fafc', borderRadius: 4, borderLeft: '4px solid #3b82f6' },
  tipTitle: { fontSize: 13, fontWeight: 'bold', color: '#0f172a', marginBottom: 6 },
  tipDesc: { fontSize: 11, color: '#334155', lineHeight: 1.5 }
});

export const StrategyTips = ({ data }: { data: PdfData }) => {
  const analysis = data.aiAnalysis;
  if (typeof analysis === 'string') return null;

  const warning = analysis?.radicalCandorWarning;
  const actionPlan = analysis?.actionPlan || [];

  return (
    <>
      {/* Page 4: 毒舌理财师的严重警告 */}
      <Page size="A4" style={styles.page}>
        <Heading1>The Brutal Truth</Heading1>
        <Divider />
        <View style={styles.section}>
          <Heading2>Stop The Bleeding Now</Heading2>
          <View style={styles.warningBox}>
            <Text style={styles.warningTitle}>{warning?.title || 'WARNING: The Plastic Trap'}</Text>
            <Text style={styles.warningText}>
              {warning?.message || 'Cut up your credit cards immediately. Treating your home like an ATM is the fastest path to foreclosure.'}
            </Text>
          </View>
        </View>
      </Page>

      {/* Page 5: 银行面谈清单 */}
      <Page size="A4" style={styles.page}>
        <Heading1>Next Steps & Bank Prep</Heading1>
        <Divider />
        <View style={styles.section}>
          <Heading2>Your Action Plan</Heading2>
          <Paragraph>Take these exact steps when speaking with your loan officer to ensure maximum protection.</Paragraph>
          <View style={{ marginTop: 15 }}>
            {actionPlan.map((tip: any, index: number) => (
              <View key={index} style={styles.tipBox}>
                <Text style={styles.tipTitle}>{index + 1}. {tip.title}</Text>
                <Text style={styles.tipDesc}>{tip.description}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </>
  );
};