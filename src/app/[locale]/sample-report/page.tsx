'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import PdfReportCTA from '@/components/calculator/PdfReportCTA';
import type { Locale } from '@/i18n/routing';

export default function SampleReportPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'en';
  const isZh = locale === 'zh';
  const [showPdfModal, setShowPdfModal] = useState(false);

  // Default values for the modal
  const defaultValues = {
    homeValue: 500000,
    mortgageBalance: 350000,
    creditScore: 740,
    desiredLTV: 80,
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
      <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-blue-50">
        <div className="mx-auto max-w-5xl px-4 py-12 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-slate-600">
            <Link href={`/${locale}`} className="hover:text-emerald-600 transition">
              {isZh ? '首页' : 'Home'}
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">
              {isZh ? '报告样本' : 'Sample Report'}
            </span>
          </nav>

          {/* Back Button */}
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600 transition mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            {isZh ? '返回主页' : 'Back to Home'}
          </Link>

          {/* Header */}
          <header className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">
              {isZh ? '看看为什么房主信任我们的洞察' : 'See Why Homeowners Trust Our Insights'}
            </h1>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-slate-700 leading-relaxed">
                {isZh
                  ? '在这份8页样本中，我们发现了45.65%的DTI高风险警告和业主未注意到的每月-$208现金流漏洞。然后我们制定了一个20年生存策略，将他们的财务状况扭转为盈利。这就是你只需$4.99就能获得的深度分析。'
                  : 'In this 8-page sample, we caught a 45.65% DTI High-Risk warning and a -$208 monthly cash flow leak that the owner hadn\'t noticed. We then mapped out a 20-year survival strategy to flip their finances into the green. This is the level of depth you get for just $4.99.'
                }
              </p>
            </div>
          </header>

          {/* PDF Viewer */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden">
            <iframe
              src="/Sample-Report.pdf"
              className="w-full"
              style={{ height: '800px' }}
              title={isZh ? 'HELOC报告样本' : 'Sample HELOC Report'}
            />
          </div>

          {/* CTA Section */}
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

          {/* Back to Home */}
          <div className="text-center py-12">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition"
            >
              {isZh ? '返回主页' : 'Back to Home'}
            </Link>
          </div>
        </div>
      </div>

      {/* PDF Purchase Modal */}
      <PdfReportCTA
        isOpen={showPdfModal}
        onClose={() => setShowPdfModal(false)}
        homeValue={defaultValues.homeValue}
        mortgageBalance={defaultValues.mortgageBalance}
        creditScore={defaultValues.creditScore}
        desiredLTV={defaultValues.desiredLTV}
        propertyType={defaultValues.propertyType}
        occupancyType={defaultValues.occupancyType}
        utilizationRatio={defaultValues.utilizationRatio}
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
