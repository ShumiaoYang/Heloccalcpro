/**
 * Appendix & Assumptions Section
 * 附录与假设章节
 */

import React from 'react';
import { View, Text, Page, StyleSheet } from '@react-pdf/renderer';
import { Heading1, Heading2, Divider } from '../components/base';
import type { PdfData } from '../types';
import { defaultPdfStyles } from '../styles';

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontFamily: defaultPdfStyles.fonts.body,
  },
  section: {
    marginBottom: defaultPdfStyles.spacing.md,
  },
  paramRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: defaultPdfStyles.colors.border,
  },
  paramLabel: {
    flex: 1,
    fontSize: 9,
    color: defaultPdfStyles.colors.textSecondary,
  },
  paramValue: {
    flex: 1,
    fontSize: 9,
    fontWeight: 'bold',
  },
  assumptionItem: {
    marginBottom: 6,
  },
  assumptionText: {
    fontSize: 9,
    fontFamily: defaultPdfStyles.fonts.body,
    color: defaultPdfStyles.colors.text,
    lineHeight: 1.35,
  },
  disclaimerSection: {
    marginTop: defaultPdfStyles.spacing.md,
    paddingTop: defaultPdfStyles.spacing.md,
    borderTop: `2px solid ${defaultPdfStyles.colors.border}`,
  },
  warningBox: {
    padding: 8,
    marginBottom: 8,
    borderWidth: 1.5,
    borderRadius: 4,
    borderColor: defaultPdfStyles.colors.warning,
    backgroundColor: '#fff7ed',
  },
  warningText: {
    fontSize: 8,
    fontFamily: defaultPdfStyles.fonts.body,
    color: defaultPdfStyles.colors.text,
    lineHeight: 1.3,
  },
  footer: {
    marginTop: 6,
    paddingTop: 6,
    borderTop: `1px solid ${defaultPdfStyles.colors.border}`,
  },
  footerText: {
    fontSize: 7,
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
  const isHomeRenovation = calculatedData.scenario === 'home_renovation';

  const formatCurrencySafe = (value: unknown): string => {
    const num = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(num)) return 'N/A';
    return `$${Math.round(num).toLocaleString('en-US')}`;
  };

  const formatTextSafe = (value: unknown, fallback = 'N/A'): string => {
    if (typeof value === 'string' && value.trim()) return value;
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
    return fallback;
  };

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
          <Text style={styles.paramValue}>{formatCurrencySafe(userInputs.homeValue)}</Text>
        </View>

        <View style={styles.paramRow}>
          <Text style={styles.paramLabel}>Mortgage Balance</Text>
          <Text style={styles.paramValue}>{formatCurrencySafe(userInputs.mortgageBalance)}</Text>
        </View>

        <View style={styles.paramRow}>
          <Text style={styles.paramLabel}>Annual Income</Text>
          <Text style={styles.paramValue}>{formatCurrencySafe(userInputs.annualIncome)}</Text>
        </View>

        <View style={styles.paramRow}>
          <Text style={styles.paramLabel}>Housing Payment</Text>
          <Text style={styles.paramValue}>{formatCurrencySafe(userInputs.subjectHousingPayment)}</Text>
        </View>

        <View style={styles.paramRow}>
          <Text style={styles.paramLabel}>Other Debt</Text>
          <Text style={styles.paramValue}>{formatCurrencySafe(userInputs.otherMonthlyDebt)}</Text>
        </View>

        <View style={styles.paramRow}>
          <Text style={styles.paramLabel}>Credit Score</Text>
          <Text style={styles.paramValue}>{formatTextSafe(userInputs.creditScore)}</Text>
        </View>

        <View style={styles.paramRow}>
          <Text style={styles.paramLabel}>Property Type</Text>
          <Text style={styles.paramValue}>{formatTextSafe(userInputs.propertyType, 'Single Family')}</Text>
        </View>

        <View style={styles.paramRow}>
          <Text style={styles.paramLabel}>Occupancy</Text>
          <Text style={styles.paramValue}>{formatTextSafe(userInputs.occupancy, 'Primary Residence')}</Text>
        </View>

        <View style={styles.paramRow}>
          <Text style={styles.paramLabel}>Amount Needed</Text>
          <Text style={styles.paramValue}>
            {formatCurrencySafe(userInputs.amountNeeded ?? userInputs.drawAmount)}
          </Text>
        </View>

        {isHomeRenovation && (
          <View style={styles.paramRow}>
            <Text style={styles.paramLabel}>Renovation Type</Text>
            <Text style={styles.paramValue}>{formatTextSafe(userInputs.renovationType)}</Text>
          </View>
        )}

        {isHomeRenovation && (
          <View style={styles.paramRow}>
            <Text style={styles.paramLabel}>Renovation Duration</Text>
            <Text style={styles.paramValue}>{formatTextSafe(userInputs.renovationDuration)} months</Text>
          </View>
        )}

        <View style={styles.paramRow}>
          <Text style={styles.paramLabel}>Scenario</Text>
          <Text style={styles.paramValue}>{formatTextSafe(calculatedData.scenario)}</Text>
        </View>
      </View>

      {/* Calculation Assumptions */}
      <View style={styles.section}>
        <Heading2>Calculation Assumptions</Heading2>

        <View style={styles.assumptionItem}>
          <Text style={styles.assumptionText}>
            <Text style={{ fontWeight: 'bold' }}>1. Bank Approved Limit: </Text>
            Maximum estimated HELOC approval limit in this report is {formatCurrencySafe(calculatedData.coreMetrics.maxLimit)}.
          </Text>
        </View>

        <View style={styles.assumptionItem}>
          <Text style={styles.assumptionText}>
            <Text style={{ fontWeight: 'bold' }}>2. Credit Card Interest Rate: </Text>
            Assumed at {getCreditCardRateAssumption(userInputs.creditScore || 700)} based on credit score of {formatTextSafe(userInputs.creditScore)}.
          </Text>
        </View>

        <View style={styles.assumptionItem}>
          <Text style={styles.assumptionText}>
            <Text style={{ fontWeight: 'bold' }}>3. Property Type Impact: </Text>
            Condos typically have 7% lower LTV limits compared to Single Family homes due to lender risk policies.
          </Text>
        </View>

        <View style={styles.assumptionItem}>
          <Text style={styles.assumptionText}>
            <Text style={{ fontWeight: 'bold' }}>4. Occupancy Impact: </Text>
            Investment properties typically have 1.5% higher HELOC rates and tighter credit limits compared to primary residences.
          </Text>
        </View>

        <View style={styles.assumptionItem}>
          <Text style={styles.assumptionText}>
            <Text style={{ fontWeight: 'bold' }}>5. System Defaults: </Text>
            Draw period defaults to 10 years, repayment period defaults to 20 years, and underwriting DTI guardrail is typically treated around 43%.
          </Text>
        </View>

        <View style={styles.assumptionItem}>
          <Text style={styles.assumptionText}>
            <Text style={{ fontWeight: 'bold' }}>6. Prime + Margin Model: </Text>
            Effective HELOC rate is estimated from Prime ({formatTextSafe(userInputs.primeRate, 'N/A')}%) + Margin ({formatTextSafe(userInputs.margin, 'N/A')}%) and modeled as {formatTextSafe(calculatedData.coreMetrics.helocRate, 'N/A')}%.
          </Text>
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
