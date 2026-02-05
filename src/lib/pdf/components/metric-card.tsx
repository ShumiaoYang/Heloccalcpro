/**
 * PDF Metric Card Component
 * PDF指标卡片组件
 */

import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { defaultPdfStyles } from '../styles';

const styles = StyleSheet.create({
  card: {
    padding: defaultPdfStyles.spacing.md,
    marginBottom: defaultPdfStyles.spacing.sm,
    borderWidth: 1,
    borderColor: defaultPdfStyles.colors.border,
    borderRadius: 4,
  },
  cardLabel: {
    fontSize: 9,
    fontFamily: defaultPdfStyles.fonts.body,
    color: defaultPdfStyles.colors.textLight,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 18,
    fontFamily: defaultPdfStyles.fonts.heading,
    color: defaultPdfStyles.colors.text,
  },
  cardSuccess: {
    color: defaultPdfStyles.colors.success,
  },
  cardWarning: {
    color: defaultPdfStyles.colors.warning,
  },
  cardDanger: {
    color: defaultPdfStyles.colors.danger,
  },
});

interface MetricCardProps {
  label: string;
  value: string | number;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  variant = 'default',
}) => {
  const valueStyle = [
    styles.cardValue,
    variant === 'success' ? styles.cardSuccess : undefined,
    variant === 'warning' ? styles.cardWarning : undefined,
    variant === 'danger' ? styles.cardDanger : undefined,
  ].filter((style): style is typeof styles.cardValue => style !== undefined);

  return (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={valueStyle}>{value}</Text>
    </View>
  );
};
