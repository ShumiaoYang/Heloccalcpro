import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Locale } from '@/i18n/routing';

type PageProps = {
  params: { locale: Locale };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = params;

  if (locale === 'zh') {
    return {
      title: 'HELOC 报告样本 | 专业财务策略报告',
      description: '查看我们的8页专业HELOC财务策略报告样本，了解我们如何帮助房主识别风险并制定20年生存策略。',
      openGraph: {
        title: 'HELOC 报告样本',
        description: '专业财务策略报告样本',
        type: 'article',
      },
    };
  }

  return {
    title: 'Sample HELOC Report | Professional Strategy Report',
    description: 'View our 8-page professional HELOC financial strategy report sample and see how we help homeowners identify risks and create 20-year survival strategies.',
    openGraph: {
      title: 'Sample HELOC Report',
      description: 'Professional Strategy Report Sample',
      type: 'article',
    },
  };
}

export default function SampleReportPage({ params }: PageProps) {
  const { locale } = params;
  const isZh = locale === 'zh';

  return (
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
                ? '在这份8页样本中，我们发现了45.65%的DTI高风险警告和业主未注意到的每月-$166现金流漏洞。然后我们制定了一个20年生存策略，将他们的财务状况扭转为盈利。这就是你只需$4.99就能获得的深度分析。'
                : 'In this 8-page sample, we caught a 45.65% DTI High-Risk warning and a -$166 monthly cash flow leak that the owner hadn\'t noticed. We then mapped out a 20-year survival strategy to flip their finances into the green. This is the level of depth you get for just $4.99.'
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
            <Link
              href={`/${locale}#calculator`}
              className="inline-block rounded-lg bg-emerald-600 px-8 py-3 text-base font-semibold text-white shadow-md transition hover:bg-emerald-700 hover:shadow-lg"
            >
              {isZh ? '开始计算' : 'Start Calculator'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
