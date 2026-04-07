/**
 * Bank Action Plan Section - Page 5
 */

import React from 'react';
import { View, Page, StyleSheet, Text } from '@react-pdf/renderer';
import { Heading1, Heading2, Paragraph, Divider } from '../components/base';
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
  actionItemContainer: {
    marginBottom: defaultPdfStyles.spacing.md,
    paddingLeft: defaultPdfStyles.spacing.md,
  },
  actionItemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  checkbox: {
    width: 12,
    height: 12,
    borderWidth: 1.5,
    borderColor: defaultPdfStyles.colors.primary,
    borderRadius: 2,
    marginRight: 8,
    marginTop: 2,
  },
  actionText: {
    flex: 1,
    fontSize: 11,
    fontFamily: defaultPdfStyles.fonts.body,
    color: defaultPdfStyles.colors.text,
    fontWeight: 'bold',
  },
  reasonText: {
    fontSize: 10,
    fontFamily: defaultPdfStyles.fonts.body,
    color: defaultPdfStyles.colors.textSecondary,
    marginLeft: 20,
    lineHeight: 1.4,
  },
});

interface BankActionPlanSectionProps {
  data: PdfData;
}

export const BankActionPlanSection: React.FC<BankActionPlanSectionProps> = ({ data }) => {
  const { aiAnalysis } = data;

  return (
    <Page size="A4" style={styles.page}>
      <Heading1>Bank Preparation Checklist</Heading1>
      <Divider />

      <View style={styles.section}>
        <Heading2>Your Action Plan</Heading2>
        <Paragraph light>
          Follow these steps to move forward with confidence. Each step includes why it matters to your success.
        </Paragraph>
        {aiAnalysis.actionPlan.map((item, index) => {
          const actionText = typeof item === 'string' ? item : item.action;
          const reasonText = typeof item === 'string' ? null : (item.reason || null);

          return (
            <View key={index} style={styles.actionItemContainer}>
              <View style={styles.actionItemHeader}>
                <View style={styles.checkbox} />
                <Text style={styles.actionText}>{actionText}</Text>
              </View>
              {reasonText && reasonText.trim() !== '' && (
                <Text style={styles.reasonText}>
                  Why it matters: {reasonText}
                </Text>
              )}
            </View>
          );
        })}
      </View>
    </Page>
  );
};
