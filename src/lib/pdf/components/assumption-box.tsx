/**
 * AssumptionBox Component
 * 计算假设展示框 - 用于透明化展示计算逻辑和假设条件
 */

import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { defaultPdfStyles } from '../styles';

interface AssumptionBoxProps {
  assumptions: string[];
  title?: string;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fefce8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fde047',
    padding: 12,
    marginTop: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 9,
    fontFamily: defaultPdfStyles.fonts.heading,
    color: '#854d0e',
    marginBottom: 6,
  },
  assumptionItem: {
    fontSize: 8,
    fontFamily: defaultPdfStyles.fonts.body,
    color: '#713f12',
    marginBottom: 3,
    paddingLeft: 8,
  },
});

export const AssumptionBox: React.FC<AssumptionBoxProps> = ({
  assumptions,
  title = 'Calculation Assumptions'
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {assumptions.map((assumption, index) => (
        <Text key={index} style={styles.assumptionItem}>
          • {assumption}
        </Text>
      ))}
    </View>
  );
};
