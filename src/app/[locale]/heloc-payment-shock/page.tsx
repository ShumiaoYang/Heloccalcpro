import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import type { Locale } from '@/i18n/routing';
import { ArticleSchema } from '@/components/seo/structured-data';
import { getSeoMetadata } from '@/lib/seo';
import { getCurrentPrimeRate } from '@/lib/prime-rate/service';

type PageProps = {
  params: { locale: Locale };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = params;
  const isZh = locale === 'zh';

  const title = isZh ? 'HELOC Payment Shock：现金流陷阱分析' : 'HELOC Payment Shock: The Cash Flow Trap Analysis';
  const description = isZh
    ? '了解从提款期到还款期的月供跳升风险，以及如何提前规划避免财务危机。'
    : 'Understand the payment jump risk from draw to repayment period and how to plan ahead to avoid financial crisis.';

  const { metadata: baseMetadata } = getSeoMetadata('/heloc-payment-shock', locale);

  return {
    ...baseMetadata,
    title,
    description,
    keywords: isZh ? 'HELOC Payment Shock, 月供跳升, 现金流风险, 还款期' : 'HELOC Payment Shock, payment jump, cash flow risk, repayment period',
    openGraph: {
      ...baseMetadata.openGraph,
      title,
      description,
      type: 'article',
    },
  };
}

export default async function HelocPaymentShockPage({ params }: PageProps) {
  const { locale } = params;
  const isZh = locale === 'zh';
  const livePrimeRate = await getCurrentPrimeRate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-blue-50">
      <ArticleSchema
        title={isZh ? 'HELOC Payment Shock' : 'HELOC Payment Shock'}
        description={isZh
          ? '现金流陷阱分析'
          : 'The Cash Flow Trap Analysis'}
        datePublished="2026-03-26"
        author="Sapling Yang"
      />
      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
        <nav className="mb-8 flex items-center gap-2 text-sm text-slate-600">
          <Link href={`/${locale}`} className="hover:text-emerald-600 transition">
            {isZh ? '首页' : 'Home'}
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">
            {isZh ? 'Payment Shock' : 'Payment Shock'}
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
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-800 mb-4">
            <AlertTriangle className="h-4 w-4" />
            {isZh ? '现金流警告' : 'Cash Flow Warning'}
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">
            {isZh ? 'HELOC Payment Shock: The Cash Flow Trap You Must Understand' : 'HELOC Payment Shock: The Cash Flow Trap You Must Understand'}
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed mb-6">
            {isZh
              ? '提款期的低月供看起来很诱人，但第 121 个月会发生什么？了解 Payment Shock 如何影响您的家庭现金流。'
              : 'The low payments during the draw period look tempting, but what happens in Month 121? Understand how Payment Shock impacts your family cash flow.'}
          </p>
          <Link
            href={`/${locale}#calculator`}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-base font-semibold text-white hover:bg-emerald-700 transition shadow-lg"
          >
            {isZh ? '立即计算您的 Payment Shock →' : 'Calculate Your Payment Shock Now →'}
          </Link>
        </header>

        <article className="prose prose-slate max-w-none">
          {/* Section 1: The Anatomy of Payment Shock */}
          <section className="mb-12">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {isZh ? '1. The Anatomy of Payment Shock (The Math)' : '1. The Anatomy of Payment Shock (The Math)'}
              </h2>
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p className="text-lg">
                  {isZh
                    ? `假设一个标准的 $100,000 余额，当前动态利率（Prime `
                    : `Assuming a standard $100,000 balance at today's dynamic rate (Prime `}
                  <strong>{livePrimeRate.toFixed(2)}%</strong>
                  {isZh
                    ? ` + 银行 Margin），您的仅利息月供可能看起来可以承受。但第 121 个月会发生什么？`
                    : ` + Bank Margin), your interest-only payment might seem manageable. But what happens in Month 121?`}
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">
                    {isZh ? '📊 提款期（仅利息）' : '📊 Draw Period (Interest-Only)'}
                  </h3>
                  <p className="text-sm text-blue-900 leading-relaxed">
                    {isZh
                      ? '在 7.25% 利率下，$100,000 余额的仅利息月供约为 $604.17/月。'
                      : 'At 7.25%, a $100,000 balance costs roughly $604.17/month in interest-only payments.'}
                  </p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-red-900 mb-3">
                    {isZh ? '⚠️ 还款期（本金+利息）' : '⚠️ Repayment Period (Principal + Interest)'}
                  </h3>
                  <p className="text-sm text-red-900 leading-relaxed">
                    {isZh
                      ? '当您进入 20 年摊销期时，月供重新计算为 $790.38/月。'
                      : 'When you enter the 20-year amortization period, the payment recalculates to $790.38/month.'}
                  </p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-amber-900 mb-3">
                    {isZh ? '💥 Payment Shock' : '💥 Payment Shock'}
                  </h3>
                  <p className="text-amber-900 leading-relaxed">
                    {isZh
                      ? '这是一个不可协商的 $186 月供跳升（+30.8%），一夜之间发生。'
                      : 'This is a non-negotiable $186 monthly jump (+30.8%) overnight.'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Visualization */}
          <section className="mb-12">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {isZh ? '2. Visualizing the Truth: Nominal Payment vs. Real Burden' : '2. Visualizing the Truth: Nominal Payment vs. Real Burden'}
              </h2>
              <div className="my-8 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                <Image
                  src="/images/payment_shock_vs_burden_chart.png"
                  alt={isZh ? 'Payment Shock vs 负担比率图表' : 'Payment Shock vs Burden Ratio Chart'}
                  width={800}
                  height={450}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </section>

          {/* Section 3: The Inflation Buffer */}
          <section className="mb-12">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {isZh ? '3. The Inflation Buffer: Why the Jump Isn\'t a Disaster' : '3. The Inflation Buffer: Why the Jump Isn\'t a Disaster'}
              </h2>
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p>
                  {isZh
                    ? '虽然名义月供跳升看起来很可怕，但通货膨胀和收入增长会随着时间推移降低实际负担。'
                    : 'While the nominal payment jump looks scary, inflation and income growth reduce the real burden over time.'}
                </p>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-emerald-900 mb-4">
                    {isZh ? '📊 负担比率分析' : '📊 Burden Ratio Analysis'}
                  </h3>
                  <dl className="text-sm text-emerald-900 space-y-3">
                    <div>
                      <dt className="font-semibold">{isZh ? 'Year 1（提款期）：' : 'Year 1 (Draw Period):'}</dt>
                      <dd>{isZh ? '如果您的月收入为 $10,000，$604 的月供是 6.0% 的负担比率。' : 'If you earn $10,000/month, the $604 payment is a 6.0% Burden Ratio.'}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold">{isZh ? 'Year 11 Shock（还款期）：' : 'Year 11 Shock (Repayment Period):'}</dt>
                      <dd>{isZh ? '当月供在第 11 年跳升至 $790 时（经过标准 3% 收入增长后），它仅占您新收入（$13,439）的 5.9%。' : 'When the payment jumps to $790 in Year 11 (after standard 3% income growth), it is only 5.9% of your new income ($13,439).'}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="mb-12">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 shadow-sm text-center">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                {isZh ? '计算您的 Payment Shock' : 'Calculate Your Payment Shock'}
              </h3>
              <p className="text-slate-700 mb-6">
                {isZh ? '使用我们的计算器了解您的月供跳升风险。' : 'Use our calculator to understand your payment jump risk.'}
              </p>
              <Link
                href={`/${locale}#calculator`}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-3 text-base font-semibold text-white hover:bg-emerald-700 transition shadow-lg"
              >
                {isZh ? '立即计算 →' : 'Calculate Now →'}
              </Link>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
