/**
 * Strategy & Tips Section
 * 策略与建议章节
 */

import React from 'react';
import { View, Page, StyleSheet, Text } from '@react-pdf/renderer';
import { Heading1, Heading2, Paragraph, Divider } from '../components/base';
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
    fontStyle: 'italic',
    marginLeft: 20,
    lineHeight: 1.4,
  },
});

interface StrategyTipsProps {
  data: PdfData;
}

export const StrategyTips: React.FC<StrategyTipsProps> = ({ data }) => {
  const { aiAnalysis } = data;

  return (
    <Page size="A4" style={styles.page}>
      <Heading1>Strategy & Recommendations</Heading1>
      <Divider />

      {/* AI生成的策略 */}
      <View style={styles.section}>
        <Heading2>Expert Strategy</Heading2>
        <Paragraph>{aiAnalysis.strategy}</Paragraph>
      </View>

      {/* 行动计划 */}
      <View style={styles.section}>
        <Heading2>Your Action Plan</Heading2>
        <Paragraph light>
          Follow these steps to move forward with confidence. Each step includes why it matters to your success.
        </Paragraph>
        {aiAnalysis.actionPlan.map((item, index) => {
          // 向后兼容：支持旧格式（string）和新格式（ActionItem）
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

      {/* 重要提示 */}
      <View style={styles.section}>
        <Heading2>Important Tips</Heading2>
        {aiAnalysis.tips.map((tip, index) => (
          <Alert
            key={index}
            type={tip.type === 'info' ? 'tip' : 'danger'}
            content={tip.content}
          />
        ))}
      </View>
    </Page>
  );
};
