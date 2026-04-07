/**
 * Radical Candor Warning Section - Page 4
 */

import React from 'react';
import { View, Page, StyleSheet } from '@react-pdf/renderer';
import { Heading1, Paragraph, Divider } from '../components/base';
import { Alert } from '../components/alert';
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
  warningBox: {
    backgroundColor: '#fee2e2',
    borderLeft: '4pt solid #dc2626',
    padding: 15,
    marginBottom: 20,
  },
});

interface RadicalCandorSectionProps {
  data: PdfData;
}

export const RadicalCandorSection: React.FC<RadicalCandorSectionProps> = ({ data }) => {
  const { aiAnalysis } = data;
  const v3 = aiAnalysis.v3Report;

  return (
    <Page size="A4" style={styles.page}>
      <Heading1>The Toxic Truth</Heading1>
      <Divider />

      {v3?.radicalCandorWarning && (
        <View style={styles.section}>
          <Alert type="danger" content={v3.radicalCandorWarning.title} />
          <Paragraph>{v3.radicalCandorWarning.message}</Paragraph>
        </View>
      )}

      <View style={styles.section}>
        <Paragraph>
          This is not a celebration. This is a rescue operation. The bank is offering you a lifeline,
          but only YOU can decide whether to use it wisely or make the same mistakes that got you here.
        </Paragraph>
      </View>
    </Page>
  );
};
