import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import type { Locale } from '@/i18n/routing';
import { ArticleSchema } from '@/components/seo/structured-data';
import { getSeoMetadata } from '@/lib/seo';
import CLTVComparisonChart from '@/components/charts/CLTVComparisonChart';

type PageProps = {
  params: { locale: Locale };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = params;
  const isZh = locale === 'zh';

  const title = isZh ? 'HELOC CLTV 限额详解 | 解锁最大借款能力' : 'Understanding HELOC CLTV Limits | Your Key to Unlocking Max Borrowing Power';
  const description = isZh
    ? '深入了解 CLTV（综合贷款价值比）如何决定您的 HELOC 最大额度。了解信用评分、房产类型和占用状态如何影响您的借款上限。'
    : 'Deep dive into how CLTV (Combined Loan-to-Value) determines your maximum HELOC limit. Learn how credit score, property type, and occupancy affect your borrowing ceiling.';

  const { metadata: baseMetadata } = getSeoMetadata('/heloc-cltv-limits', locale);

  return {
    ...baseMetadata,
    title,
    description,
    openGraph: {
      ...baseMetadata.openGraph,
      title,
      description,
      type: 'article',
    },
  };
}

export default function HelocCLTVLimitsPage({ params }: PageProps) {
  const { locale } = params;
  const isZh = locale === 'zh';

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-blue-50">
      <ArticleSchema
        title={isZh ? 'HELOC CLTV 限额详解' : 'Understanding HELOC CLTV Limits'}
        description={isZh
          ? '深入了解 CLTV 如何决定您的 HELOC 最大额度'
          : 'Deep dive into how CLTV determines your maximum HELOC limit'}
        datePublished="2026-03-24"
        author="Sapling Yang"
      />
      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
        <nav className="mb-8 flex items-center gap-2 text-sm text-slate-600">
          <Link href={`/${locale}`} className="hover:text-emerald-600 transition">
            {isZh ? '首页' : 'Home'}
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">
            {isZh ? 'CLTV 限额' : 'CLTV Limits'}
          </span>
        </nav>

        <Link
          href={`/${locale}/heloc-calculator-features`}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600 transition mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          {isZh ? '返回功能页' : 'Back to Features'}
        </Link>

        <header className="mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800 mb-4">
            <TrendingUp className="h-4 w-4" />
            {isZh ? '深度分析' : 'Deep Dive'}
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">
            {isZh ? 'Understanding HELOC CLTV Limits: Your Key to Unlocking Max Borrowing Power' : 'Understanding HELOC CLTV Limits: Your Key to Unlocking Max Borrowing Power'}
          </h1>
        </header>

        <article className="prose prose-slate max-w-none">
          {/* Introduction */}
          <section className="mb-12">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {isZh ? 'LTV vs. CLTV: What\'s the Difference?' : 'LTV vs. CLTV: What\'s the Difference?'}
              </h2>
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p className="text-lg">
                  {isZh
                    ? 'LTV（Loan-to-Value）仅考虑单一贷款与房产价值的比率，而 CLTV（Combined Loan-to-Value）则计算所有抵押贷款的总和。对于 HELOC，银行使用 CLTV 来确定您的最大借款额度。'
                    : 'LTV (Loan-to-Value) considers only a single loan against property value, while CLTV (Combined Loan-to-Value) calculates the sum of all mortgages. For HELOCs, banks use CLTV to determine your maximum borrowing limit.'}
                </p>
                <p>
                  {isZh
                    ? '标准 CLTV 默认为 80%，适用于大多数中产阶级借款人。但这不是固定值——它是一个动态矩阵，由信用评分、房产类型和占用状态共同决定。'
                    : 'The standard CLTV defaults to 80% for middle-class borrowers. But this isn\'t a fixed number—it\'s a dynamic matrix determined by credit score, property type, and occupancy status.'}
                </p>
              </div>
            </div>
          </section>

          {/* Chart Section */}
          <section className="mb-12">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {isZh ? 'CLTV Impact: Two Property Comparison' : 'CLTV Impact: Two Property Comparison'}
              </h2>
              <CLTVComparisonChart locale={locale} />
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900 leading-relaxed">
                  {isZh
                    ? '💡 关键洞察：房屋净值获取是非线性的。第一抵押贷款是一个固定障碍——无论 CLTV 如何变化，您必须先"跨越"这个门槛才能获得 HELOC 额度。高房产价值和低抵押余额的组合能够显著提升您的借款能力。'
                    : '💡 Key Insight: Equity access is non-linear. The first mortgage is a fixed barrier—regardless of CLTV changes, you must "cross" this threshold before accessing HELOC funds. The combination of high property value and low mortgage balance dramatically amplifies your borrowing power.'}
                </p>
              </div>
            </div>
          </section>

          {/* Underwriting Factors */}
          <section className="mb-12">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {isZh ? 'Deep Dive: 3 Unnegotiable Factors Lenders Use to Set Your Max CLTV' : 'Deep Dive: 3 Unnegotiable Factors Lenders Use to Set Your Max CLTV'}
              </h2>

              <div className="space-y-8 text-slate-700 leading-relaxed">
                {/* Factor 1: Credit Score */}
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">
                    {isZh ? '1. Credit Score (FICO) Tiers' : '1. Credit Score (FICO) Tiers'}
                  </h3>
                  <p className="mb-4">
                    {isZh
                      ? '您的信用评分直接决定银行愿意承担的风险水平。以下是精确的 CLTV 分层：'
                      : 'Your credit score directly determines the risk level banks are willing to take. Here are the precise CLTV tiers:'}
                  </p>
                  <dl className="bg-slate-50 rounded-lg p-6 space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                      <dt className="font-semibold text-slate-900">FICO 760+</dt>
                      <dd className="text-emerald-600 font-bold">90% CLTV</dd>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                      <dt className="font-semibold text-slate-900">FICO 720-759</dt>
                      <dd className="text-blue-600 font-bold">85% CLTV</dd>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                      <dt className="font-semibold text-slate-900">FICO 680-719</dt>
                      <dd className="text-amber-600 font-bold">80% CLTV</dd>
                    </div>
                    <div className="flex justify-between items-center">
                      <dt className="font-semibold text-slate-900">FICO 640-679</dt>
                      <dd className="text-red-600 font-bold">75% CLTV</dd>
                    </div>
                  </dl>
                  <p className="mt-4 text-sm text-slate-600">
                    {isZh
                      ? '注意：这是基础 CLTV。实际批准额度还需要叠加房产类型和占用状态的调整。'
                      : 'Note: This is the base CLTV. Actual approved limits require additional adjustments for property type and occupancy status.'}
                  </p>
                </div>

                {/* Factor 2: Occupancy Type */}
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">
                    {isZh ? '2. Occupancy Type Penalties' : '2. Occupancy Type Penalties'}
                  </h3>
                  <p className="mb-4">
                    {isZh
                      ? '银行对非自住房产收取"风险溢价"，因为这些房产在经济衰退时更容易被放弃：'
                      : 'Banks charge a "risk premium" for non-owner-occupied properties because these are more likely to be abandoned during economic downturns:'}
                  </p>
                  <dl className="bg-slate-50 rounded-lg p-6 space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                      <dt className="font-semibold text-slate-900">{isZh ? '主要住宅' : 'Primary Residence'}</dt>
                      <dd className="text-emerald-600 font-bold">0% {isZh ? '调整' : 'Adjustment'}</dd>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                      <dt className="font-semibold text-slate-900">{isZh ? '第二住宅' : 'Second Home'}</dt>
                      <dd className="text-amber-600 font-bold">-5% {isZh ? '调整' : 'Adjustment'}</dd>
                    </div>
                    <div className="flex justify-between items-center">
                      <dt className="font-semibold text-slate-900">{isZh ? '投资房产' : 'Investment Property'}</dt>
                      <dd className="text-red-600 font-bold">-10% {isZh ? '调整' : 'Adjustment'}</dd>
                    </div>
                  </dl>
                </div>

                {/* Factor 3: Property Type */}
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">
                    {isZh ? '3. Property Type Penalties' : '3. Property Type Penalties'}
                  </h3>
                  <p className="mb-4">
                    {isZh
                      ? '不同房产类型的流动性和维护成本差异巨大，银行据此调整 CLTV：'
                      : 'Different property types have vastly different liquidity and maintenance costs, which banks factor into CLTV adjustments:'}
                  </p>
                  <dl className="bg-slate-50 rounded-lg p-6 space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                      <dt className="font-semibold text-slate-900">{isZh ? '独立屋' : 'Single-family'}</dt>
                      <dd className="text-emerald-600 font-bold">0% {isZh ? '调整' : 'Adjustment'}</dd>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                      <dt className="font-semibold text-slate-900">{isZh ? '公寓' : 'Condo'}</dt>
                      <dd className="text-amber-600 font-bold">-5% {isZh ? '调整' : 'Adjustment'}</dd>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                      <dt className="font-semibold text-slate-900">{isZh ? '多户型' : 'Multi-family'}</dt>
                      <dd className="text-orange-600 font-bold">-10% {isZh ? '调整' : 'Adjustment'}</dd>
                    </div>
                    <div className="flex justify-between items-center">
                      <dt className="font-semibold text-slate-900">{isZh ? '活动房屋' : 'Manufactured'}</dt>
                      <dd className="text-red-600 font-bold">-25% {isZh ? '调整' : 'Adjustment'}</dd>
                    </div>
                  </dl>
                </div>

                {/* Hard Cap */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-red-900 mb-3">
                    {isZh ? '⚠️ 绝对硬上限：90%' : '⚠️ Absolute Hard Cap: 90%'}
                  </h3>
                  <p className="text-red-800">
                    {isZh
                      ? '无论您的信用评分多高、房产多优质，CLTV 的绝对上限是 90%。这是监管要求和银行风控的双重约束。超过 90% 的 CLTV 被视为"水下抵押"风险区域，几乎不可能获得批准。'
                      : 'Regardless of how high your credit score is or how premium your property, the absolute CLTV ceiling is 90%. This is a dual constraint from regulatory requirements and bank risk controls. CLTVs exceeding 90% are considered "underwater mortgage" risk zones and are virtually impossible to approve.'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="mb-12">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 shadow-sm text-center">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                {isZh ? 'Ready to Calculate Your Exact Limit?' : 'Ready to Calculate Your Exact Limit?'}
              </h3>
              <p className="text-slate-700 mb-6 leading-relaxed">
                {isZh
                  ? '使用我们的专业 HELOC 计算器，输入您的具体情况，立即获得精确的借款上限。'
                  : 'Use our Pro HELOC Calculator to input your specific situation and get your precise borrowing ceiling instantly.'}
              </p>
              <Link
                href={`/${locale}#calculator`}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-3 text-base font-semibold text-white hover:bg-emerald-700 transition shadow-lg"
              >
                {isZh ? '计算您的精确借款上限' : 'Calculate your exact borrowing ceiling with our Pro HELOC Calculator'}
              </Link>
            </div>
          </section>

          <div className="text-center py-8">
            <Link
              href={`/${locale}/heloc-calculator-features`}
              className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              {isZh ? '返回功能页' : 'Back to Features'}
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
