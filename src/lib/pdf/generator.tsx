import React from 'react';
import { Document, pdf } from '@react-pdf/renderer';
import { Cover } from './sections/cover';
import { Appendix } from './sections/appendix';
import { DebtConsolidationTemplate } from './templates/debt-consolidation-template';
import { HomeRenovationTemplate } from './templates/home-renovation-template';
import { MaxBorrowingTemplate } from './templates/max-borrowing-template';
import { EmergencyFundTemplate } from './templates/emergency-fund-template';
import { InvestmentTemplate } from './templates/investment-template';
import { CreditOptimizationTemplate } from './templates/credit-optimization-template';
import { resolvePdfScenarioFromData } from './templates/scenario-definitions';
import type { PdfData } from './types';

export const HelocReportPDF = ({ data }: { data: PdfData }) => {
  const resolvedScenario = resolvePdfScenarioFromData(data);

  const renderScenarioTemplate = () => {
    switch (resolvedScenario) {
      case 'debt_consolidation':
        return <DebtConsolidationTemplate data={data} />;
      case 'home_renovation':
        return <HomeRenovationTemplate data={data} />;
      case 'max_borrowing_power':
        return <MaxBorrowingTemplate data={data} />;
      case 'emergency_fund':
        return <EmergencyFundTemplate data={data} />;
      case 'investment':
        return <InvestmentTemplate data={data} />;
      case 'credit_optimization':
        return <CreditOptimizationTemplate data={data} />;
      default:
        return <DebtConsolidationTemplate data={data} />;
    }
  };

  return (
    <Document>
      {/* Page 1 */}
      <Cover data={data} />
      
      {/* Scenario pages (Home Renovation now renders Pages 2-6) */}
      {renderScenarioTemplate()} 
      
      {/* Final appendix page */}
      <Appendix data={data} /> 
    </Document>
  );
};

export async function generateHelocPdf(data: PdfData): Promise<Buffer> {
  const doc = <HelocReportPDF data={data} />;
  const asPdf = pdf(doc);
  const blob = await asPdf.toBlob();
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
