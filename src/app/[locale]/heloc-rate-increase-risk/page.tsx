import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import type { Locale } from '@/i18n/routing';
import { getSeoMetadata } from '@/lib/seo';
import { getCurrentPrimeRate } from '@/lib/prime-rate/service';

type PageProps = {
  params: { locale: Locale };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = params;
  const isZh = locale === 'zh';

  const title = isZh ? 'HELOC 压力测试：保护您的家庭免受 Prime Rate 飙升影响' : 'The HELOC Stress Test: Protecting Your Family from Prime Rate Spikes';
  const description = isZh
    ? '了解可变利率风险以及如何通过压力测试保护您的财务安全。'
    : 'Understand variable rate risk and how to protect your finances through stress testing.';

  const { metadata: baseMetadata } = getSeoMetadata('/heloc-rate-increase-risk', locale);

  return {
    ...baseMetadata,
    title,
    description,
    keywords: isZh ? 'HELOC 利率风险, 压力测试, Prime Rate, 可变利率' : 'HELOC rate risk, stress test, Prime Rate, variable rate',
    openGraph: {
      ...baseMetadata.openGraph,
      title,
      description,
      type: 'article',
    },
  };
}

export default async function HelocRateIncreaseRiskPage({ params }: PageProps) {
  const { locale } = params;
  const isZh = locale === 'zh';
  const livePrimeRate = await getCurrentPrimeRate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-blue-50">
      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
        <nav className="mb-8 flex items-center gap-2 text-sm text-slate-600">
          <Link href={`/${locale}`} className="hover:text-emerald-600 transition">
            {isZh ? '首页' : 'Home'}
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">
            {isZh ? '利率上升风险' : 'Rate Increase Risk'}
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
          <div className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-800 mb-4">
            <TrendingUp className="h-4 w-4" />
            {isZh ? '风险分析' : 'Risk Analysis'}
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">
            {isZh ? 'The HELOC Stress Test: Protecting Your Family from Prime Rate Spikes' : 'The HELOC Stress Test: Protecting Your Family from Prime Rate Spikes'}
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed mb-6">
            {isZh
              ? '可变利率 HELOC 是一把双刃剑。了解如何通过压力测试保护您的财务安全，避免利率飙升带来的灾难性影响。'
              : 'Variable-rate HELOCs are a double-edged sword. Learn how to protect your finances through stress testing and avoid catastrophic rate spikes.'}
          </p>
          <Link
            href={`/${locale}#calculator`}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-base font-semibold text-white hover:bg-emerald-700 transition shadow-lg"
          >
            {isZh ? '立即进行压力测试 →' : 'Run Your Stress Test Now →'}
          </Link>
        </header>

        <article className="prose prose-slate max-w-none">
          {/* Section 1: Variable Rate Reality */}
          <section className="mb-12">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {isZh ? '1. The Variable Rate Reality' : '1. The Variable Rate Reality'}
              </h2>
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p className="text-lg">
                  {isZh
                    ? `今天的实时 WSJ Prime Rate 是 `
                    : `Today's live WSJ Prime Rate is `}
                  <strong>{livePrimeRate.toFixed(2)}%</strong>
                  {isZh
                    ? '。但与固定利率抵押贷款不同，这个数字完全受美联储的摆布。'
                    : '. But unlike a fixed mortgage, this number is entirely at the mercy of the Federal Reserve.'}
                </p>
                <p>
                  {isZh
                    ? '您的 HELOC 利率 = Prime Rate + Bank Margin。当美联储加息时，您的月供会立即上升。这不是假设，而是合同条款。'
                    : 'Your HELOC rate = Prime Rate + Bank Margin. When the Fed raises rates, your monthly payment rises immediately. This is not hypothetical—it is contractual.'}
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Historical Context */}
          <section className="mb-12">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {isZh ? '2. Historical Context: The 2022-2023 Rate Shock' : '2. Historical Context: The 2022-2023 Rate Shock'}
              </h2>
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p>
                  {isZh
                    ? '在 2022 年 3 月，Prime Rate 为 3.25%。到 2023 年 7 月，它飙升至 8.5%——在 16 个月内上涨了 525 个基点。'
                    : 'In March 2022, the Prime Rate was 3.25%. By July 2023, it had spiked to 8.5%—a 525 basis point increase in just 16 months.'}
                </p>
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-red-900 mb-3">
                    {isZh ? '⚠️ 真实案例' : '⚠️ Real-World Impact'}
                  </h3>
                  <p className="text-red-900 leading-relaxed">
                    {isZh
                      ? '一个 $100,000 的 HELOC，利率从 4.25% 跳升至 9.5%，仅利息月供从 $354 增加到 $792——每月增加 $438，或每年增加 $5,256。'
                      : 'A $100,000 HELOC at 4.25% jumping to 9.5% saw interest-only payments rise from $354 to $792 per month—an increase of $438/month or $5,256 annually.'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Visualization */}
          <section className="mb-12">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {isZh ? '3. Visualizing the Worst-Case Scenario' : '3. Visualizing the Worst-Case Scenario'}
              </h2>
              <div className="my-8 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                <Image
                  src="/images/rate_shock_stress_test_chart.png"
                  alt={isZh ? 'HELOC 利率冲击压力测试图表' : 'HELOC Rate Shock Stress Test Chart'}
                  width={800}
                  height={450}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </section>

          {/* Section 4: Stressed Payment */}
          <section className="mb-12">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {isZh ? '4. The Ultimate Underwriting Metric: The Stressed Payment' : '4. The Ultimate Underwriting Metric: The Stressed Payment'}
              </h2>
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p>
                  {isZh
                    ? '大多数 HELOC 合同包含 18% 的终身利率上限。这意味着无论 Prime Rate 如何飙升，您的利率都不会超过 18%。'
                    : 'Most HELOC contracts include an 18% lifetime rate cap. This means no matter how high the Prime Rate spikes, your rate cannot exceed 18%.'}
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">
                    {isZh ? '📐 压力测试公式' : '📐 Stressed Payment Formula'}
                  </h3>
                  <code className="block bg-white p-4 rounded border border-blue-300 text-sm text-slate-800 leading-relaxed overflow-x-auto">
                    StressedPayment = Balance × [StressedRate/12 × (1+StressedRate/12)^n] / [(1+StressedRate/12)^n-1]
                  </code>
                  <p className="text-sm text-blue-900 mt-3">
                    {isZh ? '其中 StressedRate = 18%，n = 剩余还款月数' : 'Where StressedRate = 18%, n = remaining repayment months'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Actionable Tactics */}
          <section className="mb-12">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {isZh ? '5. Actionable Tactics: Three Lines of Defense' : '5. Actionable Tactics: Three Lines of Defense'}
              </h2>
              <div className="space-y-6 text-slate-700 leading-relaxed">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                  <h3 className="text-base font-semibold text-emerald-900 mb-3">
                    {isZh ? '✅ Defense 1: The +5% Rule' : '✅ Defense 1: The +5% Rule'}
                  </h3>
                  <p className="text-sm text-emerald-900 leading-relaxed">
                    {isZh
                      ? '在借款前，计算如果利率上升 5% 时的月供。如果您无法承受，请减少借款金额。'
                      : 'Before borrowing, calculate your monthly payment if rates rise by 5%. If you cannot afford it, reduce your borrowing amount.'}
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-base font-semibold text-blue-900 mb-3">
                    {isZh ? '✅ Defense 2: Fixed-Rate Conversion Option' : '✅ Defense 2: Fixed-Rate Conversion Option'}
                  </h3>
                  <p className="text-sm text-blue-900 leading-relaxed">
                    {isZh
                      ? '许多银行允许您将 HELOC 余额的一部分转换为固定利率贷款。在利率上升周期中使用此选项。'
                      : 'Many banks allow you to convert a portion of your HELOC balance to a fixed-rate loan. Use this option during rising rate cycles.'}
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <h3 className="text-base font-semibold text-amber-900 mb-3">
                    {isZh ? '✅ Defense 3: Rapid Paydown Strategy' : '✅ Defense 3: Rapid Paydown Strategy'}
                  </h3>
                  <p className="text-sm text-amber-900 leading-relaxed">
                    {isZh
                      ? '将所有额外现金用于偿还 HELOC 本金。每减少 $10,000 余额，在 18% 利率下每月可节省 $150。'
                      : 'Direct all extra cash toward HELOC principal. Every $10,000 reduction saves $150/month at 18% rates.'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="mb-12">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 shadow-sm text-center">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                {isZh ? '立即进行压力测试' : 'Run Your Stress Test Now'}
              </h3>
              <p className="text-slate-700 mb-6">
                {isZh ? '使用我们的计算器了解您的 HELOC 在最坏情况下的月供。' : 'Use our calculator to understand your HELOC payment under worst-case scenarios.'}
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
