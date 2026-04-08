import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import { getSeoMetadata } from '@/lib/seo';
import SampleReportClient from '@/components/sample-report/SampleReportClient';
import type { Locale } from '@/i18n/routing';

interface Props {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === 'zh';

  const title = isZh ? 'HELOC 报告样本 - 专业财务分析示例' : 'Sample HELOC Report - Professional Financial Analysis';
  const description = isZh
    ? '查看我们的专业HELOC分析报告样本。包含DTI风险评估、现金流分析、20年还款策略和压力测试。只需$4.99获取您的定制报告。'
    : 'View our professional HELOC analysis report sample. Includes DTI risk assessment, cash flow analysis, 20-year repayment strategy, and stress testing. Get your custom report for just $4.99.';

  const { metadata } = getSeoMetadata('/sample-report', locale);

  return {
    ...metadata,
    title,
    description,
  };
}

export default async function SampleReportPage({ params }: Props) {
  const { locale } = await params;
  const isZh = locale === 'zh';

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-blue-50">
      <div className="mx-auto max-w-5xl px-4 py-12 lg:px-8">
        <nav className="mb-8 flex items-center gap-2 text-sm text-slate-600">
          <Link href={`/${locale}`} className="hover:text-emerald-600 transition">
            {isZh ? '首页' : 'Home'}
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">
            {isZh ? '报告样本' : 'Sample Report'}
          </span>
        </nav>

        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600 transition mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          {isZh ? '返回主页' : 'Back to Home'}
        </Link>

        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">
            {isZh ? '看看为什么房主信任我们的洞察' : 'See Why Homeowners Trust Our Insights'}
          </h1>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-slate-700 leading-relaxed">
              {isZh
                ? '在这份样本中，我们发现了45.65%的DTI高风险警告和业主未注意到的每月-$208现金流漏洞。然后我们制定了一个20年生存策略，将他们的财务状况扭转为盈利。这就是你只需$4.99就能获得的深度分析。'
                : 'In this sample, we caught a 45.65% DTI High-Risk warning and a -$208 monthly cash flow leak that the owner hadn\'t noticed. We then mapped out a 20-year survival strategy to flip their finances into the green. This is the level of depth you get for just $4.99.'
              }
            </p>
          </div>
        </header>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden">
          <iframe
            src="/Sample-Report.pdf"
            className="w-full"
            style={{ height: '800px' }}
            title={isZh ? 'HELOC报告样本' : 'Sample HELOC Report'}
          />
        </div>

        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4">
            {isZh ? '这份专业报告包含哪些独家指标？' : 'What Exclusive Metrics Does This Professional Report Include?'}
          </h3>
          <ul className="space-y-3 text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span><strong>{isZh ? 'Payment Shock 真实还款压力测试' : 'Payment Shock Real Repayment Stress Test'}</strong> - {isZh ? '从仅付息期过渡到本息同还期时，月供可能翻倍的冲击分析' : 'Impact analysis when monthly payments potentially double transitioning from interest-only to principal+interest period'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span><strong>{isZh ? 'LTV & DTI 资产负债健康度矩阵' : 'LTV & DTI Asset-Liability Health Matrix'}</strong> - {isZh ? '贷款价值比和债务收入比的多维度风险评分' : 'Multi-dimensional risk scoring of Loan-to-Value and Debt-to-Income ratios'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span><strong>{isZh ? '信用评分影响模拟' : 'Credit Score Impact Simulation'}</strong> - {isZh ? '开设HELOC后对你信用评分的短期和长期影响预测' : 'Short-term and long-term credit score impact predictions after opening a HELOC'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span><strong>{isZh ? '压力测试场景分析' : 'Stress Test Scenario Analysis'}</strong> - {isZh ? '利率上涨、收入下降等极端情况下的财务生存能力评估' : 'Financial survival assessment under extreme scenarios like rate increases and income drops'}</span>
            </li>
          </ul>
        </div>

        <SampleReportClient locale={locale} isZh={isZh} />

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
  );
}
