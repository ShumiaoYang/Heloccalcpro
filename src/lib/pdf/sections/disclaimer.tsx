/**
 * Disclaimer Section
 * 免责声明章节
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
  bulletPoint: {
    fontSize: 11,
    fontFamily: defaultPdfStyles.fonts.body,
    color: defaultPdfStyles.colors.text,
    marginBottom: defaultPdfStyles.spacing.sm,
    paddingLeft: defaultPdfStyles.spacing.md,
  },
  warningBox: {
    padding: defaultPdfStyles.spacing.md,
    marginBottom: defaultPdfStyles.spacing.md,
    borderWidth: 2,
    borderRadius: 4,
    borderColor: defaultPdfStyles.colors.warning,
    backgroundColor: '#fff7ed',
  },
  warningText: {
    fontSize: 11,
    fontFamily: defaultPdfStyles.fonts.body,
    color: defaultPdfStyles.colors.text,
    lineHeight: 1.5,
  },
  footer: {
    marginTop: defaultPdfStyles.spacing.xl,
    paddingTop: defaultPdfStyles.spacing.md,
    borderTop: `1px solid ${defaultPdfStyles.colors.border}`,
  },
  footerText: {
    fontSize: 9,
    fontFamily: defaultPdfStyles.fonts.body,
    color: defaultPdfStyles.colors.textLight,
    textAlign: 'center',
  },
});

interface DisclaimerProps {
  data: PdfData;
}

export const Disclaimer: React.FC<DisclaimerProps> = ({ data }) => {
  const { generatedAt } = data;

  return (
    <Page size="A4" style={styles.page}>
      <Heading1>Important Disclaimer</Heading1>
      <Divider />

      {/* Warning Box */}
      <View style={styles.warningBox}>
        <Text style={styles.warningText}>
          ⚠️ This HELOC Financial Report is provided for educational and
          informational purposes only. It should not be considered as financial,
          legal, or tax advice.
        </Text>
      </View>

      {/* General Disclaimer */}
      <View style={styles.section}>
        <Heading2>General Information</Heading2>
        <Paragraph>
          The calculations and projections in this report are based on the
          information you provided and certain assumptions. Actual results may
          vary based on market conditions, lender requirements, and your specific
          financial situation.
        </Paragraph>
        <Paragraph>
          This report uses AI-powered analysis to provide insights and
          recommendations. While we strive for accuracy, AI-generated content
          should be reviewed and verified by qualified professionals.
        </Paragraph>
      </View>

      {/* Professional Consultation */}
      <View style={styles.section}>
        <Heading2>Professional Consultation Required</Heading2>
        <Paragraph>
          Before making any financial decisions, we strongly recommend consulting
          with qualified professionals including:
        </Paragraph>
        <Text style={styles.bulletPoint}>• A licensed financial advisor</Text>
        <Text style={styles.bulletPoint}>• A mortgage specialist or loan officer</Text>
        <Text style={styles.bulletPoint}>• A certified tax professional (CPA or EA)</Text>
        <Text style={styles.bulletPoint}>• A legal advisor or real estate attorney</Text>
      </View>

      {/* Tax Information */}
      <View style={styles.section}>
        <Heading2>Tax Deduction Information</Heading2>
        <Paragraph>
          HELOC interest may be tax-deductible if the funds are used to buy,
          build, or substantially improve your home that secures the loan. The Tax
          Cuts and Jobs Act of 2017 modified the rules for HELOC interest
          deductibility.
        </Paragraph>
        <Paragraph>
          Please refer to IRS Publication 936 (Home Mortgage Interest Deduction)
          and consult with a tax professional for specific guidance on your
          situation.
        </Paragraph>
      </View>

      {/* Risk Warnings */}
      <View style={styles.section}>
        <Heading2>Risk Warnings</Heading2>
        <Text style={styles.bulletPoint}>
          • Your home is used as collateral. Failure to repay could result in
          foreclosure.
        </Text>
        <Text style={styles.bulletPoint}>
          • Variable interest rates can increase your monthly payments.
        </Text>
        <Text style={styles.bulletPoint}>
          • Borrowing against home equity reduces your ownership stake.
        </Text>
        <Text style={styles.bulletPoint}>
          • Market conditions can affect your home&apos;s value and available equity.
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © {generatedAt.getFullYear()} HELOC Calculator Pro. All rights reserved.
        </Text>
        <Text style={styles.footerText}>
          Report generated on {generatedAt.toLocaleDateString('en-US')} at{' '}
          {generatedAt.toLocaleTimeString('en-US')}
        </Text>
      </View>
    </Page>
  );
};
