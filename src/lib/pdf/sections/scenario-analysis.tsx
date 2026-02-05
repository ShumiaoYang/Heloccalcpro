/**
 * Dynamic Scenario Analysis Section
 * 场景化深度解析章节
 */

import React from 'react';
import { View, Text, Page, StyleSheet } from '@react-pdf/renderer';
import { Heading1, Heading2, Paragraph, Divider } from '../components/base';
import { AssumptionBox } from '../components/assumption-box';
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
  highlightBox: {
    padding: defaultPdfStyles.spacing.md,
    backgroundColor: defaultPdfStyles.colors.bgLight,
    borderLeftWidth: 3,
    borderLeftColor: defaultPdfStyles.colors.primary,
    marginBottom: defaultPdfStyles.spacing.md,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  metricLabel: {
    fontSize: 10,
    color: defaultPdfStyles.colors.textSecondary,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: defaultPdfStyles.colors.primary,
  },
});

interface ScenarioAnalysisProps {
  data: PdfData;
}

// Debt Consolidation Scenario Component
const DebtConsolidationAnalysis: React.FC<{ data: PdfData }> = ({ data }) => {
  const { calculatedData, userInputs } = data;
  const metrics = calculatedData.scenarioMetrics as any;

  return (
    <View style={styles.section}>
      <Heading2>Debt Consolidation Analysis</Heading2>

      <View style={styles.highlightBox}>
        <Paragraph>
          By consolidating high-interest credit card debt into your HELOC, you can leverage the interest rate arbitrage opportunity.
        </Paragraph>
      </View>

      <View style={styles.metricRow}>
        <Text style={styles.metricLabel}>Credit Card Balance</Text>
        <Text style={styles.metricValue}>${userInputs.creditCardBalance?.toLocaleString() || 'N/A'}</Text>
      </View>

      <View style={styles.metricRow}>
        <Text style={styles.metricLabel}>Estimated Interest Saved</Text>
        <Text style={styles.metricValue}>${metrics?.interestSaved?.toLocaleString() || 'N/A'}</Text>
      </View>

      <View style={styles.metricRow}>
        <Text style={styles.metricLabel}>Payoff Time Reduced</Text>
        <Text style={styles.metricValue}>{metrics?.payoffMonthsReduced || 'N/A'} months</Text>
      </View>

      <AssumptionBox
        title="Calculation Assumptions"
        assumptions={[
          'Credit card APR: 18-24% (based on average US credit card rates)',
          'HELOC rate: Prime + margin (typically 6-8%)',
          'Interest savings calculated over 5-year payoff period',
          'Assumes no additional credit card charges during payoff',
        ]}
      />
    </View>
  );
};

// Home Renovation Scenario Component
const HomeRenovationAnalysis: React.FC<{ data: PdfData }> = ({ data }) => {
  const { calculatedData } = data;
  const metrics = calculatedData.scenarioMetrics as any;

  return (
    <View style={styles.section}>
      <Heading2>Home Renovation Investment Analysis</Heading2>

      <View style={styles.highlightBox}>
        <Paragraph>
          Strategic home improvements can increase your property value while leveraging low-cost HELOC financing.
        </Paragraph>
      </View>

      <View style={styles.metricRow}>
        <Text style={styles.metricLabel}>Future Equity Gain</Text>
        <Text style={styles.metricValue}>${metrics?.futureEquity?.toLocaleString() || 'N/A'}</Text>
      </View>

      <View style={styles.metricRow}>
        <Text style={styles.metricLabel}>Estimated Value Increase</Text>
        <Text style={styles.metricValue}>${metrics?.estValueIncrease?.toLocaleString() || 'N/A'}</Text>
      </View>

      <AssumptionBox
        title="ROI Assumptions"
        assumptions={[
          'Kitchen/bathroom renovations: 75% ROI (industry standard)',
          'Structural improvements: 75% ROI',
          'Cosmetic updates: 50% ROI',
          'ROI calculated based on comparable home sales in your area',
          'Value increase realized upon sale or refinance',
        ]}
      />
    </View>
  );
};

// Credit Optimization Scenario Component
const CreditOptimizationAnalysis: React.FC<{ data: PdfData }> = ({ data }) => {
  const { calculatedData } = data;
  const metrics = calculatedData.scenarioMetrics as any;

  return (
    <View style={styles.section}>
      <Heading2>Credit Optimization Strategy</Heading2>

      <View style={styles.highlightBox}>
        <Paragraph>
          Using your HELOC strategically can boost your credit profile by reducing credit card utilization and increasing available credit.
        </Paragraph>
      </View>

      <View style={styles.metricRow}>
        <Text style={styles.metricLabel}>Credit Limit Boost</Text>
        <Text style={styles.metricValue}>${metrics?.creditLimitBoost?.toLocaleString() || 'N/A'}</Text>
      </View>

      <View style={styles.metricRow}>
        <Text style={styles.metricLabel}>Utilization Drop</Text>
        <Text style={styles.metricValue}>{metrics?.utilizationDrop || 'N/A'}%</Text>
      </View>

      <AssumptionBox
        title="Credit Score Assumptions"
        assumptions={[
          'Credit utilization below 30% is considered good',
          'Utilization below 10% can significantly boost your score',
          'HELOC counts as installment debt, not revolving credit',
          'Payment history remains the most important factor (35% of score)',
          'Credit score improvements typically visible within 30-60 days',
        ]}
      />
    </View>
  );
};

// Emergency Fund Scenario Component
const EmergencyFundAnalysis: React.FC<{ data: PdfData }> = ({ data }) => {
  const { calculatedData } = data;
  const metrics = calculatedData.scenarioMetrics as any;

  return (
    <View style={styles.section}>
      <Heading2>Emergency Fund Safety Net</Heading2>

      <View style={styles.highlightBox}>
        <Paragraph>
          Your HELOC can serve as a financial safety net, providing quick access to funds when unexpected expenses arise.
        </Paragraph>
      </View>

      <View style={styles.metricRow}>
        <Text style={styles.metricLabel}>Months of Expenses Covered</Text>
        <Text style={styles.metricValue}>{metrics?.monthsCovered || 'N/A'} months</Text>
      </View>

      <View style={styles.metricRow}>
        <Text style={styles.metricLabel}>Available Liquidity</Text>
        <Text style={styles.metricValue}>${metrics?.availableLiquidity?.toLocaleString() || 'N/A'}</Text>
      </View>

      <AssumptionBox
        title="Emergency Fund Assumptions"
        assumptions={[
          'Financial experts recommend 3-6 months of expenses in emergency savings',
          'HELOC provides backup liquidity without tying up cash',
          'Average monthly expenses calculated from your debt-to-income ratio',
          'HELOC funds available within 24-48 hours when needed',
          'Only pay interest on funds actually drawn, not the full credit line',
        ]}
      />
    </View>
  );
};

// Investment Scenario Component
const InvestmentAnalysis: React.FC<{ data: PdfData }> = ({ data }) => {
  const { calculatedData } = data;
  const metrics = calculatedData.scenarioMetrics as any;

  return (
    <View style={styles.section}>
      <Heading2>Investment Opportunity Analysis</Heading2>

      <View style={styles.highlightBox}>
        <Paragraph>
          Using home equity to invest is a bold strategy that requires careful analysis. Your investment must outperform your HELOC cost to make financial sense.
        </Paragraph>
      </View>

      <View style={styles.metricRow}>
        <Text style={styles.metricLabel}>Minimum Required Return (Hurdle Rate)</Text>
        <Text style={styles.metricValue}>{metrics?.hurdleRate || 'N/A'}%</Text>
      </View>

      <View style={styles.metricRow}>
        <Text style={styles.metricLabel}>Equity Risk Ratio</Text>
        <Text style={styles.metricValue}>{metrics?.equityRiskRatio?.toFixed(2) || 'N/A'}</Text>
      </View>

      <AssumptionBox
        title="Investment Risk Assumptions"
        assumptions={[
          'Your investment must return more than your HELOC rate to profit',
          'Market volatility can impact returns - diversification is key',
          'Consider tax implications: HELOC interest may not be deductible for investments',
          'Recommended only for experienced investors with high risk tolerance',
          'Always maintain emergency reserves separate from investment capital',
        ]}
      />
    </View>
  );
};

// Main Scenario Analysis Component
export const ScenarioAnalysis: React.FC<ScenarioAnalysisProps> = ({ data }) => {
  const { calculatedData } = data;
  const scenario = calculatedData.scenario;

  // Normalize scenario to uppercase for comparison
  const normalizedScenario = scenario?.toUpperCase().replace(/-/g, '_');

  return (
    <Page size="A4" style={styles.page}>
      <Heading1>Scenario-Specific Analysis</Heading1>
      <Divider />

      {normalizedScenario === 'DEBT_CONSOLIDATION' && <DebtConsolidationAnalysis data={data} />}
      {normalizedScenario === 'HOME_RENOVATION' && <HomeRenovationAnalysis data={data} />}
      {normalizedScenario === 'CREDIT_OPTIMIZATION' && <CreditOptimizationAnalysis data={data} />}
      {normalizedScenario === 'EMERGENCY_FUND' && <EmergencyFundAnalysis data={data} />}
      {normalizedScenario === 'INVESTMENT' && <InvestmentAnalysis data={data} />}
    </Page>
  );
};

