/**
 * Alert Component
 * 提示块组件 - 用于显示不同类型的提示信息，支持"为什么"说明
 */

import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { defaultPdfStyles } from '../styles';

export type AlertType = 'info' | 'warning' | 'danger' | 'tip';

interface AlertProps {
  type: AlertType;
  title?: string;
  content: string;
  reason?: string; // "Why it matters" explanation
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  infoAlert: {
    backgroundColor: '#eff6ff',
    borderLeftColor: '#3b82f6',
  },
  warningAlert: {
    backgroundColor: '#fef3c7',
    borderLeftColor: defaultPdfStyles.colors.warning,
  },
  dangerAlert: {
    backgroundColor: '#fee2e2',
    borderLeftColor: defaultPdfStyles.colors.danger,
  },
  tipAlert: {
    backgroundColor: '#f0fdf4',
    borderLeftColor: defaultPdfStyles.colors.success,
  },
  title: {
    fontSize: 10,
    fontFamily: defaultPdfStyles.fonts.heading,
    marginBottom: 4,
  },
  infoTitle: {
    color: '#3b82f6',
  },
  warningTitle: {
    color: defaultPdfStyles.colors.warning,
  },
  dangerTitle: {
    color: defaultPdfStyles.colors.danger,
  },
  tipTitle: {
    color: defaultPdfStyles.colors.success,
  },
  content: {
    fontSize: 9,
    fontFamily: defaultPdfStyles.fonts.body,
    color: defaultPdfStyles.colors.text,
    lineHeight: 1.4,
  },
  reason: {
    fontSize: 8,
    fontFamily: defaultPdfStyles.fonts.body,
    color: defaultPdfStyles.colors.textLight,
    marginTop: 4,
    fontStyle: 'italic',
  },
});

export const Alert: React.FC<AlertProps> = ({ type, title, content, reason }) => {
  // Get type-specific styles
  const getContainerStyle = () => {
    switch (type) {
      case 'info':
        return [styles.container, styles.infoAlert];
      case 'warning':
        return [styles.container, styles.warningAlert];
      case 'danger':
        return [styles.container, styles.dangerAlert];
      case 'tip':
        return [styles.container, styles.tipAlert];
      default:
        return styles.container;
    }
  };

  const getTitleStyle = () => {
    switch (type) {
      case 'info':
        return [styles.title, styles.infoTitle];
      case 'warning':
        return [styles.title, styles.warningTitle];
      case 'danger':
        return [styles.title, styles.dangerTitle];
      case 'tip':
        return [styles.title, styles.tipTitle];
      default:
        return styles.title;
    }
  };

  const containerStyle = getContainerStyle();
  const titleStyle = getTitleStyle();

  // Icon prefix based on type
  const getIconPrefix = () => {
    switch (type) {
      case 'info':
        return 'ℹ️ ';
      case 'warning':
        return '⚠️ ';
      case 'danger':
        return '🚨 ';
      case 'tip':
        return '💡 ';
      default:
        return '';
    }
  };

  return (
    <View style={containerStyle}>
      {title && <Text style={titleStyle}>{getIconPrefix()}{title}</Text>}
      <Text style={styles.content}>{content}</Text>
      {reason && <Text style={styles.reason}>Why it matters: {reason}</Text>}
    </View>
  );
};
