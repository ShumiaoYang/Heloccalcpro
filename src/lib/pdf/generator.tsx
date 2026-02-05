/**
 * PDF Generator
 * PDF生成器主文件
 */

import React from 'react';
import { Document, pdf } from '@react-pdf/renderer';
import { Cover } from './sections/cover';
import { ExecutiveSummary } from './sections/executive-summary';
import { FinancialDashboard } from './sections/financial-dashboard';
import { ScenarioAnalysis } from './sections/scenario-analysis';
import { StrategyTips } from './sections/strategy-tips';
import { StressTest } from './sections/stress-test';
import { Appendix } from './sections/appendix';
import type { PdfData } from './types';

/**
 * HELOC Expert Report PDF Document
 */
const HelocReportDocument: React.FC<{ data: PdfData }> = ({ data }) => (
  <Document>
    <Cover data={data} />
    <ExecutiveSummary data={data} />
    <FinancialDashboard data={data} />
    <ScenarioAnalysis data={data} />
    <StrategyTips data={data} />
    <StressTest data={data} />
    <Appendix data={data} />
  </Document>
);

/**
 * 生成PDF并返回Buffer
 */
export async function generateHelocPdf(data: PdfData): Promise<Buffer> {
  const doc = <HelocReportDocument data={data} />;
  const asPdf = pdf(doc);
  const blob = await asPdf.toBlob();
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
