/**
 * PDF Table Component
 * PDF表格组件
 */

import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { defaultPdfStyles } from '../styles';

const styles = StyleSheet.create({
  table: {
    width: '100%',
    marginBottom: defaultPdfStyles.spacing.md,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: defaultPdfStyles.colors.border,
    paddingVertical: defaultPdfStyles.spacing.sm,
  },
  tableHeader: {
    backgroundColor: '#f8fafc',
    fontFamily: defaultPdfStyles.fonts.heading,
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
    fontFamily: defaultPdfStyles.fonts.body,
    color: defaultPdfStyles.colors.text,
  },
  tableCellRight: {
    textAlign: 'right',
  },
});

interface TableProps {
  headers: string[];
  rows: (string | number)[][];
  alignRight?: number[]; // 右对齐的列索引
}

export const Table: React.FC<TableProps> = ({ headers, rows, alignRight = [] }) => (
  <View style={styles.table}>
    {/* 表头 */}
    <View style={[styles.tableRow, styles.tableHeader]}>
      {headers.map((header, index) => (
        <Text
          key={index}
          style={[
            styles.tableCell,
            alignRight.includes(index) ? styles.tableCellRight : undefined,
          ].filter((style): style is typeof styles.tableCell => style !== undefined)}
        >
          {header}
        </Text>
      ))}
    </View>

    {/* 表格行 */}
    {rows.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.tableRow}>
        {row.map((cell, cellIndex) => (
          <Text
            key={cellIndex}
            style={[
              styles.tableCell,
              alignRight.includes(cellIndex) ? styles.tableCellRight : undefined,
            ].filter((style): style is typeof styles.tableCell => style !== undefined)}
          >
            {cell}
          </Text>
        ))}
      </View>
    ))}
  </View>
);
