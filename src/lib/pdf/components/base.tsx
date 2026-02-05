/**
 * PDF Base Components
 * PDF基础组件
 */

import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { defaultPdfStyles } from '../styles';

const styles = StyleSheet.create({
  heading1: {
    fontSize: 24,
    fontFamily: defaultPdfStyles.fonts.heading,
    color: defaultPdfStyles.colors.text,
    marginBottom: defaultPdfStyles.spacing.md,
  },
  heading2: {
    fontSize: 18,
    fontFamily: defaultPdfStyles.fonts.heading,
    color: defaultPdfStyles.colors.text,
    marginBottom: defaultPdfStyles.spacing.sm,
  },
  heading3: {
    fontSize: 14,
    fontFamily: defaultPdfStyles.fonts.heading,
    color: defaultPdfStyles.colors.text,
    marginBottom: defaultPdfStyles.spacing.sm,
  },
  paragraph: {
    fontSize: 11,
    fontFamily: defaultPdfStyles.fonts.body,
    color: defaultPdfStyles.colors.text,
    lineHeight: 1.5,
    marginBottom: defaultPdfStyles.spacing.sm,
  },
  textLight: {
    color: defaultPdfStyles.colors.textLight,
  },
});

/**
 * 标题组件
 */
export const Heading1: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Text style={styles.heading1}>{children}</Text>
);

export const Heading2: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Text style={styles.heading2}>{children}</Text>
);

export const Heading3: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Text style={styles.heading3}>{children}</Text>
);

/**
 * 段落组件
 */
export const Paragraph: React.FC<{ children: React.ReactNode; light?: boolean }> = ({
  children,
  light = false
}) => (
  <Text style={light ? [styles.paragraph, styles.textLight] : styles.paragraph}>{children}</Text>
);

/**
 * 分隔线组件
 */
const dividerStyles = StyleSheet.create({
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: defaultPdfStyles.colors.border,
    marginVertical: defaultPdfStyles.spacing.md,
  },
});

export const Divider: React.FC = () => <View style={dividerStyles.divider} />;
