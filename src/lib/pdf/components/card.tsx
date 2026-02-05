/**
 * Card Component
 * 圆角卡片容器 - 用于替代硬边框表格，提升视觉层次
 */

import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { defaultPdfStyles } from '../styles';

export type CardVariant = 'default' | 'success' | 'warning' | 'danger';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  variant?: CardVariant;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  defaultCard: {
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
  },
  successCard: {
    backgroundColor: '#f0fdf4',
    borderColor: defaultPdfStyles.colors.success,
  },
  warningCard: {
    backgroundColor: '#fef3c7',
    borderColor: defaultPdfStyles.colors.warning,
  },
  dangerCard: {
    backgroundColor: '#fee2e2',
    borderColor: defaultPdfStyles.colors.danger,
  },
  title: {
    fontSize: 12,
    fontFamily: defaultPdfStyles.fonts.heading,
    color: defaultPdfStyles.colors.text,
    marginBottom: 12,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
  },
});

export const Card: React.FC<CardProps> = ({ title, children, variant = 'default' }) => {
  const getContainerStyle = () => {
    switch (variant) {
      case 'default':
        return [styles.container, styles.defaultCard];
      case 'success':
        return [styles.container, styles.successCard];
      case 'warning':
        return [styles.container, styles.warningCard];
      case 'danger':
        return [styles.container, styles.dangerCard];
      default:
        return styles.container;
    }
  };

  return (
    <View style={getContainerStyle()}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.content}>{children}</View>
    </View>
  );
};
