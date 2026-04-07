'use client';

import { useState } from 'react';
import PdfReportCTA from '@/components/calculator/PdfReportCTA';

interface SampleReportClientProps {
  locale: string;
  isZh: boolean;
}

export default function SampleReportClient({ locale, isZh }: SampleReportClientProps) {
  const [showPdfModal, setShowPdfModal] = useState(false);

  const defaultValues = {
    homeValue: 500000,
    mortgageBalance: 350000,
    creditScore: 740,
    propertyType: 'Single-family' as const,
    occupancyType: 'Primary residence' as const,
    utilizationRatio: 45,
    primeRate: 8.5,
    margin: 1.0,
    annualIncome: 120000,
    monthlyDebt: 3000,
    subjectHousingPayment: 1800,
    otherMonthlyDebt: 1200,
    maxHelocAmount: 75000,
    availableAmount: 33750,
  };

  return (
    <>
      <div className="mt-12 text-center">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            {isZh ? '准备好获取您的专业报告了吗？' : 'Ready to Get Your Professional Report?'}
          </h2>
          <p className="text-slate-700 mb-6">
            {isZh
              ? '只需$4.99，获取针对您财务状况的完整8页策略报告'
              : 'Get your complete 8-page strategy report tailored to your finances for just $4.99'
            }
          </p>
          <button
            onClick={() => setShowPdfModal(true)}
            className="inline-block rounded-lg bg-emerald-600 px-8 py-3 text-base font-semibold text-white shadow-md transition hover:bg-emerald-700 hover:shadow-lg"
          >
            {isZh ? '获取我的报告' : 'Get My Report'}
          </button>
        </div>
      </div>

      <PdfReportCTA
        isOpen={showPdfModal}
        onClose={() => setShowPdfModal(false)}
        homeValue={defaultValues.homeValue}
        mortgageBalance={defaultValues.mortgageBalance}
        creditScore={defaultValues.creditScore}
        propertyType={defaultValues.propertyType}
        occupancyType={defaultValues.occupancyType}
        primeRate={defaultValues.primeRate}
        margin={defaultValues.margin}
        annualIncome={defaultValues.annualIncome}
        monthlyDebt={defaultValues.monthlyDebt}
        subjectHousingPayment={defaultValues.subjectHousingPayment}
        otherMonthlyDebt={defaultValues.otherMonthlyDebt}
        maxHelocAmount={defaultValues.maxHelocAmount}
        availableAmount={defaultValues.availableAmount}
      />
    </>
  );
}
