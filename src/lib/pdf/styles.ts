/**
 * PDF Styles Configuration
 * PDF样式配置
 */

import type { PdfStyles } from './types';

/**
 * 默认PDF样式
 */
export const defaultPdfStyles: PdfStyles = {
  colors: {
    primary: '#16A34A',      // 美元绿色 (Dollar Green)
    secondary: '#15803D',    // 深绿色
    success: '#16A34A',      // 成功绿色
    warning: '#f59e0b',      // 橙色
    danger: '#ef4444',       // 红色
    info: '#3b82f6',         // 蓝色 (Pro Tip)
    text: '#0B3B24',         // 深森林绿文字
    textLight: '#64748b',    // 浅灰色文字
    textSecondary: '#475569', // 次要文字颜色
    background: '#ffffff',   // 白色背景
    border: '#BBF7D0',       // 浅绿色边框
    bgLight: '#f8fafc',      // 浅灰背景
    bgSuccess: '#f0fdf4',    // 浅绿背景
    bgWarning: '#fef3c7',    // 浅黄背景
    bgDanger: '#fee2e2',     // 浅红背景
  },
  fonts: {
    heading: 'Helvetica-Bold',
    body: 'Helvetica',
    mono: 'Courier',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
  },
};
