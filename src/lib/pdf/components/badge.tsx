/**
 * Badge Component
 * 状态徽章组件 - 用于显示信心评分、风险等级等状态标识
 */

import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { defaultPdfStyles } from '../styles';

export type BadgeVariant = 'success' | 'warning' | 'danger';

interface BadgeProps {
  variant: BadgeVariant;
  label: string;
  description?: string;
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  successBg: {
    backgroundColor: '#f0fdf4',
    borderWidth: 2,
    borderColor: defaultPdfStyles.colors.success,
  },
  warningBg: {
    backgroundColor: '#fef3c7',
    borderWidth: 2,
    borderColor: defaultPdfStyles.colors.warning,
  },
  dangerBg: {
    backgroundColor: '#fee2e2',
    borderWidth: 2,
    borderColor: defaultPdfStyles.colors.danger,
  },
  label: {
    fontSize: 14,
    fontFamily: defaultPdfStyles.fonts.heading,
    marginBottom: 4,
  },
  successText: {
    color: defaultPdfStyles.colors.success,
  },
  warningText: {
    color: defaultPdfStyles.colors.warning,
  },
  dangerText: {
    color: defaultPdfStyles.colors.danger,
  },
  description: {
    fontSize: 10,
    fontFamily: defaultPdfStyles.fonts.body,
    color: defaultPdfStyles.colors.text,
    textAlign: 'center',
  },
});

export const Badge: React.FC<BadgeProps> = ({ variant, label, description }) => {
  const getContainerStyle = () => {
    switch (variant) {
      case 'success':
        return [styles.container, styles.successBg];
      case 'warning':
        return [styles.container, styles.warningBg];
      case 'danger':
        return [styles.container, styles.dangerBg];
      default:
        return styles.container;
    }
  };

  const getLabelStyle = () => {
    switch (variant) {
      case 'success':
        return [styles.label, styles.successText];
      case 'warning':
        return [styles.label, styles.warningText];
      case 'danger':
        return [styles.label, styles.dangerText];
      default:
        return styles.label;
    }
  };

  return (
    <View style={getContainerStyle()}>
      <Text style={getLabelStyle()}>{label}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
};
