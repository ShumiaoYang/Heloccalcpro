/**
 * Appendix & Assumptions Section
 * 附录与假设章节
 */

import React from 'react';
import { View, Text, Page, StyleSheet } from '@react-pdf/renderer';
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
  paramRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: defaultPdfStyles.colors.border,
  },
  paramLabel: {
    flex: 1,
    fontSize: 10,
    color: defaultPdfStyles.colors.textSecondary,
  },
  paramValue: {
    flex: 1,
    fontSize: 10,
    fontWeight: 'bold',
  },
  assumptionItem: {
    marginBottom: defaultPdfStyles.spacing.sm,
  },
  disclaimerSection: {
    marginTop: defaultPdfStyles.spacing.xl,
    paddingTop: defaultPdfStyles.spacing.lg,
    borderTop: `2px solid ${defaultPdfStyles.colors.border}`,
  },
  warningBox: {
    padding: defaultPdfStyles.spacing.sm,
    marginBottom: defaultPdfStyles.spacing.md,
    borderWidth: 1.5,
    borderRadius: 4,
    borderColor: defaultPdfStyles.colors.warning,
    backgroundColor: '#fff7ed',
  },
  warningText: {
    fontSize: 9,
    fontFamily: defaultPdfStyles.fonts.body,
    color: defaultPdfStyles.colors.text,
    lineHeight: 1.4,
  },
  bulletPoint: {
    fontSize: 9,
    fontFamily: defaultPdfStyles.fonts.body,
    color: defaultPdfStyles.colors.text,
    marginBottom: 4,
    paddingLeft: defaultPdfStyles.spacing.sm,
  },
  footer: {
    marginTop: defaultPdfStyles.spacing.md,
    paddingTop: defaultPdfStyles.spacing.sm,
    borderTop: `1px solid ${defaultPdfStyles.colors.border}`,
  },
  footerText: {
    fontSize: 8,
    fontFamily: defaultPdfStyles.fonts.body,
    color: defaultPdfStyles.colors.textLight,
    textAlign: 'center',
  },
});

interface AppendixProps {
  data: PdfData;
}

export const Appendix: React.FC<AppendixProps> = ({ data }) => {
  const { userInputs, calculatedData, generatedAt } = data;

  // Helper function to get credit score assumption
  const getCreditCardRateAssumption = (creditScore: number) => {
    if (creditScore >= 750) return '18.9%';
    if (creditScore >= 700) return '21.9%';
    if (creditScore >= 650) return '24.9%';
    return '27.9%';
  };

  return (
    <Page size="A4" style={styles.page}>
      <Heading1>Appendix & Assumptions</Heading1>
      <Divider />

      {/* User Input Parameters */}
      <View style={styles.section}>
        <Heading2>Input Parameters</Heading2>

        <View style={styles.paramRow}>
          <Text style={styles.paramLabel}>Home Value (FMV)</Text>
          <Text style={styles.paramValue}>${userInputs.homeValue?.toLocaleString()}</Text>
        </View>

        <View style={styles.paramRow}>
          <Text style={styles.paramLabel}>Mortgage Balance</Text>
          <Text style={styles.paramValue}>${userInputs.mortgageBalance?.toLocaleString()}</Text>
        </View>

        <View style={styles.paramRow}>
          <Text style={styles.paramLabel}>Annual Income</Text>
          <Text style={styles.paramValue}>${userInputs.annualIncome?.toLocaleString()}</Text>
        </View>

        <View style={styles.paramRow}>
          <Text style={styles.paramLabel}>Credit Score</Text>
          <Text style={styles.paramValue}>{userInputs.creditScore}</Text>
        </View>

        <View style={styles.paramRow}>
          <Text style={styles.paramLabel}>Property Type</Text>
          <Text style={styles.paramValue}>{userInputs.propertyType || 'Single Family'}</Text>
        </View>

        <View style={styles.paramRow}>
          <Text style={styles.paramLabel}>Occupancy</Text>
          <Text style={styles.paramValue}>{userInputs.occupancy || 'Primary Residence'}</Text>
        </View>

        <View style={styles.paramRow}>
          <Text style={styles.paramLabel}>Scenario</Text>
          <Text style={styles.paramValue}>{calculatedData.scenario}</Text>
        </View>
      </View>

      {/* Calculation Assumptions */}
      <View style={styles.section}>
        <Heading2>Calculation Assumptions</Heading2>

        <View style={styles.assumptionItem}>
          <Paragraph>
            <Text style={{ fontWeight: 'bold' }}>1. Credit Card Interest Rate: </Text>
            Assumed at {getCreditCardRateAssumption(userInputs.creditScore || 700)} based on credit score of {userInputs.creditScore}.
          </Paragraph>
        </View>

        <View style={styles.assumptionItem}>
          <Paragraph>
            <Text style={{ fontWeight: 'bold' }}>2. Property Type Impact: </Text>
            Condos typically have 7% lower LTV limits compared to Single Family homes due to lender risk policies.
          </Paragraph>
        </View>

        <View style={styles.assumptionItem}>
          <Paragraph>
            <Text style={{ fontWeight: 'bold' }}>3. Occupancy Impact: </Text>
            Investment properties typically have 1.5% higher HELOC rates and tighter credit limits compared to primary residences.
          </Paragraph>
        </View>
      </View>

      {/* Disclaimer Section - Compact */}
      <View style={styles.disclaimerSection}>
        {/* Warning Box */}
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            Disclaimer: This report is for educational purposes only and should not be considered financial, legal, or tax advice.
            Consult qualified professionals before making financial decisions. Your home is collateral—failure to repay may result in foreclosure.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © {generatedAt.getFullYear()} HELOC Calculator Pro. All rights reserved. |
            Generated on {generatedAt.toLocaleDateString('en-US')} at {generatedAt.toLocaleTimeString('en-US')}
          </Text>
        </View>
      </View>
    </Page>
  );
};