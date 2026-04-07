import React from 'react';
import { View, Text, Page, StyleSheet } from '@react-pdf/renderer';
import { Heading1, Heading2, Divider } from '../components/base';
import { defaultPdfStyles } from '../styles';
import type { PdfData } from '../types';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: defaultPdfStyles.fonts.body },
  section: { marginBottom: defaultPdfStyles.spacing.lg },
  compareContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  boxBefore: { flex: 1, padding: 15, backgroundColor: '#fee2e2', marginRight: 10, borderRadius: 4, borderTop: '4px solid #ef4444' },
  boxAfter: { flex: 1, padding: 15, backgroundColor: '#dcfce3', marginLeft: 10, borderRadius: 4, borderTop: '4px solid #22c55e' },
  boxLabel: { fontSize: 12, fontWeight: 'bold', marginBottom: 8, color: '#334155' },
  boxValue: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  commentary: { marginTop: 25, padding: 15, backgroundColor: '#f1f5f9', borderRadius: 4 },
  commentTitle: { fontSize: 13, fontWeight: 'bold', color: '#0f172a', marginBottom: 5 },
  commentText: { fontSize: 11, color: '#334155', lineHeight: 1.5 }
});

export const FinancialDashboard = ({ data }: { data: PdfData }) => {
  const analysis = data.aiAnalysis;
  // 如果解析失败，直接返回空
  if (typeof analysis === 'string') return null;

  const cashFlow = analysis?.cashFlowAnalysis;
  const oldPayment = Number(
    data.userInputs?.currentMonthlyDebt ?? data.userInputs?.monthlyDebt ?? 0
  );

  const drawAmount = Number(
    data.userInputs?.drawAmount ??
      data.userInputs?.amountNeeded ??
      data.calculatedData?.coreMetrics?.maxLimit ??
      0
  );
  const helocRate = Number(data.calculatedData?.coreMetrics?.helocRate ?? 0);
  const derivedInterestOnlyPayment = drawAmount > 0 && helocRate > 0
    ? (drawAmount * helocRate) / 1200
    : 0;

  const newPayment = Number(derivedInterestOnlyPayment);
  const freedUp = Number(cashFlow?.freedUpCashFlow ?? (oldPayment - newPayment));

  return (
    <Page size="A4" style={styles.page}>
      <Heading1>The Cash Flow Reality Check</Heading1>
      <Divider />
      <View style={styles.section}>
        <Heading2>Monthly Debt Obligations (Before vs. After)</Heading2>
        <View style={styles.compareContainer}>
          <View style={styles.boxBefore}>
            <Text style={styles.boxLabel}>BEFORE (Current Bleeding)</Text>
            <Text style={[styles.boxValue, { color: '#ef4444' }]}>${oldPayment.toLocaleString()}</Text>
            <Text style={{ fontSize: 10, color: '#7f1d1d' }}>High-interest minimums</Text>
          </View>
          <View style={styles.boxAfter}>
            <Text style={styles.boxLabel}>AFTER (The Rescue Plan)</Text>
            <Text style={[styles.boxValue, { color: '#22c55e' }]}>${newPayment.toFixed(0)}</Text>
            <Text style={{ fontSize: 10, color: '#14532d' }}>HELOC Interest-only</Text>
          </View>
        </View>

        <View style={styles.commentary}>
          <Text style={styles.commentTitle}>Immediate Relief: ${freedUp.toLocaleString()} / month</Text>
          <Text style={styles.commentText}>
            {cashFlow?.commentary || "You are saving money instantly, but remember, you haven't 'paid off' anything—you just moved the debt to your house."}
          </Text>
        </View>
      </View>
    </Page>
  );
};
