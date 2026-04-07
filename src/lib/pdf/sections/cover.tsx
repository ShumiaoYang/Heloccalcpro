/**
 * Cover Page Section
 * 封面页章节
 */

import React from 'react';
import { View, Page, StyleSheet, Text } from '@react-pdf/renderer';
import type { PdfData } from '../types';
import { defaultPdfStyles } from '../styles';
import { getScenarioDefinition, resolvePdfScenarioFromData } from '../templates/scenario-definitions';

const styles = StyleSheet.create({
  page: {
    padding: 0,
    fontFamily: defaultPdfStyles.fonts.body,
    backgroundColor: '#FFFFFF', // 白色背景
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  // 顶部装饰条
  topBar: {
    height: 8,
    backgroundColor: defaultPdfStyles.colors.primary,
    width: '100%',
  },
  container: {
    flex: 1,
    padding: 60,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // 标题区域
  titleSection: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 42,
    fontFamily: defaultPdfStyles.fonts.heading,
    color: defaultPdfStyles.colors.primary,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: defaultPdfStyles.fonts.body,
    color: defaultPdfStyles.colors.textLight,
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#F8FAFC', // 浅灰色背景
    borderRadius: 12,
    borderWidth: 2,
    borderColor: defaultPdfStyles.colors.primary,
    padding: 32,
    marginBottom: 40,
    width: '75%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 14,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 11,
    fontFamily: defaultPdfStyles.fonts.body,
    color: defaultPdfStyles.colors.textLight,
    width: '45%',
  },
  infoValue: {
    fontSize: 13,
    fontFamily: defaultPdfStyles.fonts.heading,
    color: defaultPdfStyles.colors.text,
    width: '55%',
  },
  footer: {
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    padding: 24,
    width: '100%',
  },
  footerText: {
    fontSize: 9,
    fontFamily: defaultPdfStyles.fonts.body,
    color: defaultPdfStyles.colors.textLight,
    textAlign: 'center',
    marginBottom: 4,
  },
});

interface CoverProps {
  data: PdfData;
}

export const Cover: React.FC<CoverProps> = ({ data }) => {
  const { userInputs, generatedAt, userInfo } = data;
  const scenarioDef = getScenarioDefinition(resolvePdfScenarioFromData(data));
  const reportEmail = userInfo?.email || userInputs?.email || 'N/A';

  return (
    <Page size="A4" style={styles.page}>
      {/* 顶部装饰条 */}
      <View style={styles.topBar} />

      {/* 主内容区域 */}
      <View style={styles.container}>
        {/* 标题区域 */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{scenarioDef.title}</Text>
          <Text style={styles.subtitle}>
            Professional Financial Analysis & Strategy
          </Text>
        </View>

        {/* 信息卡片 */}
        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{reportEmail}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Scenario:</Text>
            <Text style={styles.infoValue}>{scenarioDef.scenarioLabel}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Report Date:</Text>
            <Text style={styles.infoValue}>
              {generatedAt.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
        </View>
      </View>

      {/* 底部区域 */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          This report is for educational purposes only. Please consult with a
          financial advisor.
        </Text>
        <Text style={styles.footerText}>
          © {generatedAt.getFullYear()} HELOC Calculator Pro. All rights
          reserved.
        </Text>
      </View>
    </Page>
  );
};
