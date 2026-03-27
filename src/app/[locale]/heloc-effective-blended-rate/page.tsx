import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calculator } from 'lucide-react';
import type { Locale } from '@/i18n/routing';
import { getSeoMetadata } from '@/lib/seo';

type PageProps = {
  params: { locale: Locale };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = params;
  const isZh = locale === 'zh';

  const title = isZh ? 'HELOC 有效混合利率计算 | 揭示真实资本成本' : 'Calculating Your HELOC Effective Blended Rate | Uncovering Your True Cost of Capital';
  const description = isZh
    ? '不要让高 HELOC 利率吓到你。学习如何计算有效混合利率，发现保护低利率首次抵押贷款的智慧。'
    : 'Don\'t let high HELOC rates scare you. Learn how to calculate your Effective Blended Rate and discover the wisdom of protecting your low-rate first mortgage.';

  const { metadata: baseMetadata } = getSeoMetadata('/heloc-effective-blended-rate', locale);

  return {
    ...baseMetadata,
    title,
    description,
    keywords: isZh ? 'HELOC 混合利率, 有效利率, 资本成本, 抵押贷款策略' : 'HELOC blended rate, effective rate, cost of capital, mortgage strategy',
    openGraph: {
      ...baseMetadata.openGraph,
      title,
      description,
      type: 'article',
    },
  };
}

export default function HelocEffectiveBlendedRatePage({ params }: PageProps) {
  const { locale } = params;
  const isZh = locale === 'zh';

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-blue-50">
      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
        <nav className="mb-8 flex items-center gap-2 text-sm text-slate-600">
          <Link href={`/${locale}`} className="hover:text-emerald-600 transition">
            {isZh ? '首页' : 'Home'}
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">
            {isZh ? '有效混合利率' : 'Effective Blended Rate'}
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
            <Calculator className="h-4 w-4" />
            {isZh ? '深度分析' : 'Deep Dive'}
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">
            {isZh ? 'Calculating Your HELOC Effective Blended Rate: Uncovering Your True Cost of Capital' : 'Calculating Your HELOC Effective Blended Rate: Uncovering Your True Cost of Capital'}
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed mb-6">
            {isZh
              ? '不要让今天的高 HELOC 利率吓到你而放弃使用房屋净值。美国房地产财富的秘密是保护您的主要抵押贷款利率，同时战略性地使用 HELOC。了解如何计算您的有效混合利率。'
              : 'Don\'t let today\'s high HELOC rates scare you out of accessing your home equity. The secret to US real estate wealth is protecting your primary mortgage rate while strategically using a HELOC. Discover how to calculate your Effective Blended Rate.'}
          </p>
          <Link
            href={`/${locale}#calculator`}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-base font-semibold text-white hover:bg-emerald-700 transition shadow-lg"
          >
            {isZh ? '立即计算您的混合利率 →' : 'Calculate Your Blended Rate Now →'}
          </Link>
        </header>

        <article className="prose prose-slate max-w-none">
          {/* Section 1: Rate Shock Illusion */}
          <section className="mb-12">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {isZh ? '1. The Rate Shock Illusion: What is an Effective Blended Rate?' : '1. The Rate Shock Illusion: What is an Effective Blended Rate?'}
              </h2>
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p className="text-lg">
                  {isZh
                    ? '当拥有 3.0% 首次抵押贷款的房主看到 7.17% 的 HELOC 利率时，他们常常会恐慌。但这是一种错觉。在金融核保中，您必须查看您的有效混合利率——所有房屋担保债务的加权平均资本成本。'
                    : 'When homeowners with a 3.0% first mortgage see a 7.17% HELOC rate, they often panic. But this is an illusion. In financial underwriting, you must look at your Effective Blended Rate—the weighted average cost of capital across ALL your home-secured debt.'}
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-amber-900 mb-3">
                    {isZh ? '💡 核心概念' : '💡 Core Concept'}
                  </h3>
                  <p className="text-amber-900 leading-relaxed">
                    {isZh
                      ? '7.17% 的 HELOC 利率看起来很高，但如果它只占您总债务的 20%，而您的 80% 债务仍然锁定在 3.0%，那么您的真实借款成本要低得多。这就是有效混合利率的力量。'
                      : 'A 7.17% HELOC rate looks expensive, but if it represents only 20% of your total debt while 80% remains locked at 3.0%, your true borrowing cost is far lower. This is the power of the Effective Blended Rate.'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Core Formula */}
          <section className="mb-12">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {isZh ? '2. The Core Formula: How to Calculate Your True Borrowing Cost' : '2. The Core Formula: How to Calculate Your True Borrowing Cost'}
              </h2>

              <div className="space-y-6 text-slate-700 leading-relaxed">
                <p className="text-lg">
                  {isZh
                    ? '有效混合利率是所有房屋担保债务的加权平均成本。这是您真实的资本成本。'
                    : 'The Effective Blended Rate is the weighted average cost of all your home-secured debt. This is your true cost of capital.'}
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">
                    {isZh ? '📐 核心公式' : '📐 Core Formula'}
                  </h3>
                  <code className="block bg-white p-4 rounded border border-blue-300 text-sm text-slate-800 leading-relaxed overflow-x-auto">
                    Effective Blended Rate = [(First Mortgage Balance × Mortgage Rate) + (HELOC Balance × HELOC Rate)] / (Total Combined Debt)
                  </code>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-slate-900 mb-2">{isZh ? '示例：' : 'Example:'}</h4>
                  <ul className="text-sm text-slate-700 space-y-1">
                    <li><strong>{isZh ? '首次抵押贷款：' : 'First Mortgage:'}</strong> $400,000 @ 3.0%</li>
                    <li><strong>HELOC:</strong> $100,000 @ 7.17%</li>
                    <li><strong>{isZh ? '总债务：' : 'Total Debt:'}</strong> $500,000</li>
                    <li><strong>{isZh ? '有效混合利率：' : 'Effective Blended Rate:'}</strong> [($400k × 3%) + ($100k × 7.17%)] / $500k = <span className="text-emerald-600 font-bold">3.83%</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Case Study */}
          <section className="mb-12">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {isZh ? '3. Case Study: Uncovering the 3.8% Reality (HELOC vs. Cash-Out Refinance)' : '3. Case Study: Uncovering the 3.8% Reality (HELOC vs. Cash-Out Refinance)'}
              </h2>

              <div className="space-y-6 text-slate-700 leading-relaxed">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-red-900 mb-3">
                    {isZh ? '⚠️ 场景设定' : '⚠️ The Scenario'}
                  </h3>
                  <p className="text-red-900 leading-relaxed">
                    {isZh
                      ? '让我们计算一下。您有一笔锁定在 3.0% 的 $400,000 抵押贷款。您需要 $100,000 用于装修。经纪人可能会推动您进行现金提取再融资，以今天的 6.58% 市场利率"整合"您的债务。这就是为什么这是金融自杀。'
                      : 'Let\'s run the math. You have a $400k mortgage locked at 3.0%. You need $100k for renovations. A broker might push you toward a Cash-Out Refinance at today\'s 6.58% market rate to "consolidate" your debt. Here is why that is financial suicide.'}
                  </p>
                </div>

                <div className="my-8 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                  <Image
                    src="/images/blended_rate_comparison_chart.png"
                    alt={isZh ? 'HELOC 混合利率对比图表' : 'HELOC Blended Rate Comparison Chart'}
                    width={1200}
                    height={675}
                    className="w-full h-auto"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                    <h4 className="text-base font-semibold text-emerald-900 mb-3">
                      {isZh ? '✅ HELOC 策略（保持 3%）' : '✅ HELOC Strategy (Keep the 3%)'}
                    </h4>
                    <ul className="text-sm text-emerald-900 space-y-2">
                      <li><strong>{isZh ? '抵押贷款利息：' : 'Mortgage Interest:'}</strong> $400k @ 3% = $12,000</li>
                      <li><strong>{isZh ? 'HELOC 利息：' : 'HELOC Interest:'}</strong> $100k @ 7.17% = $7,170</li>
                      <li><strong>{isZh ? '年度总利息：' : 'Total Annual Interest:'}</strong> $19,170</li>
                      <li className="pt-2 border-t border-emerald-300"><strong>{isZh ? '混合利率：' : 'Blended Rate:'}</strong> <span className="text-xl font-bold">3.83%</span></li>
                    </ul>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h4 className="text-base font-semibold text-red-900 mb-3">
                      {isZh ? '❌ 现金提取再融资策略' : '❌ Cash-Out Refi Strategy'}
                    </h4>
                    <ul className="text-sm text-red-900 space-y-2">
                      <li><strong>{isZh ? '新总贷款：' : 'New Total Loan:'}</strong> $500k @ 6.58%</li>
                      <li><strong>{isZh ? '年度总利息：' : 'Total Annual Interest:'}</strong> $32,900</li>
                      <li className="pt-2 border-t border-red-300"><strong>{isZh ? '混合利率：' : 'Blended Rate:'}</strong> <span className="text-xl font-bold">6.58%</span></li>
                    </ul>
                  </div>
                </div>

                <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-emerald-900 mb-2">
                    {isZh ? '💰 结论' : '💰 The Bottom Line'}
                  </h4>
                  <p className="text-emerald-900 text-lg leading-relaxed">
                    {isZh
                      ? '通过接受"昂贵的" 7.17% HELOC，您实际上每年节省 $13,730 的纯利息，相比再融资。'
                      : 'By accepting the "expensive" 7.17% HELOC, you are actually saving $13,730 per year in pure interest compared to a refinance.'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: HELOC Rate Determination */}
          <section className="mb-12">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {isZh ? '4. How Underwriters Determine Your Specific HELOC Rate' : '4. How Underwriters Determine Your Specific HELOC Rate'}
              </h2>

              <div className="space-y-6 text-slate-700 leading-relaxed">
                <p className="text-lg">
                  {isZh
                    ? '虽然 Prime Rate 决定宏观市场趋势，但您的具体 HELOC 利率是高度个性化的计算。'
                    : 'While the Prime Rate dictates macro market trends, your specific HELOC rate is a highly personalized calculation.'}{' '}
                  <Link href={`/${locale}/heloc-concerns-and-risks`} className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline">
                    {isZh ? '了解更多关于利率风险。' : 'Learn more about rate risks.'}
                  </Link>
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">
                    {isZh ? '🏦 核心银行逻辑' : '🏦 Core Banking Logic'}
                  </h3>
                  <code className="block bg-white p-3 rounded border border-blue-300 text-sm text-slate-800 mb-4">
                    Effective Rate = max(Floor Rate, Prime Rate + Final Margin)
                  </code>
                  <p className="text-sm text-blue-900 mb-3">
                    {isZh ? 'Final Margin 由以下因素决定：' : 'The Final Margin is determined by:'}
                  </p>
                  <ul className="space-y-3 text-sm text-blue-900">
                    <li>
                      <strong className="block mb-1">{isZh ? 'Base Matrix (FICO & CLTV)：' : 'The Base Matrix (FICO & CLTV):'}</strong>
                      {isZh ? '高信用评分和低利用率降低您的 Margin。' : 'High credit and low utilization lower your margin.'}
                    </li>
                    <li>
                      <strong className="block mb-1">{isZh ? 'Occupancy Adjustments：' : 'Occupancy Adjustments:'}</strong>
                      {isZh ? '主要住宅 (0%)，第二住宅 (+0.25%)，投资物业 (+1.0%)。' : 'Primary residences (0%), Second homes (+0.25%), Investment properties (+1.0%).'}
                    </li>
                    <li>
                      <strong className="block mb-1">{isZh ? 'Property Type Adjustments：' : 'Property Type Adjustments:'}</strong>
                      {isZh ? '独栋住宅 (0%)，公寓 (+0.25%)，多户型 (+1.0%)。' : 'Single-family (0%), Condos (+0.25%), Multi-family (+1.0%).'}
                    </li>
                    <li>
                      <strong className="block mb-1">{isZh ? 'Loan Size Adjustments：' : 'Loan Size Adjustments:'}</strong>
                      {isZh ? '借款超过 $500k 获得折扣 (-0.5%)，而非常小的额度 (<$50k) 会产生罚金 (+0.5%)。' : 'Borrowing over $500k earns a discount (-0.5%), while very small lines (<$50k) incur a penalty (+0.5%).'}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Actionable Tactics */}
          <section className="mb-12">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {isZh ? '5. Actionable Tactics: How to Dynamically Lower Your Blended Rate' : '5. Actionable Tactics: How to Dynamically Lower Your Blended Rate'}
              </h2>

              <div className="space-y-6 text-slate-700 leading-relaxed">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                  <h3 className="text-base font-semibold text-emerald-900 mb-3">
                    {isZh ? '✅ Tactic 1: Aggressive HELOC Paydown' : '✅ Tactic 1: Aggressive HELOC Paydown'}
                  </h3>
                  <p className="text-sm text-emerald-900 leading-relaxed">
                    {isZh
                      ? '因为 HELOC 是循环的、可变利率的信用额度，任何额外的现金都应该直接用于 HELOC 本金，立即将您的混合利率降低到接近 3% 的基线。'
                      : 'Because a HELOC is a revolving, variable-rate line, any extra cash should go directly toward the HELOC principal, immediately dropping your Blended Rate closer to your 3% baseline.'}
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <h3 className="text-base font-semibold text-amber-900 mb-3">
                    {isZh ? '⚠️ Tactic 2: Never Accelerate the 3% Mortgage' : '⚠️ Tactic 2: Never Accelerate the 3% Mortgage'}
                  </h3>
                  <p className="text-sm text-amber-900 leading-relaxed">
                    {isZh
                      ? '在高通胀、高收益环境中，提前偿还 3.0% 的固定抵押贷款会摧毁您的流动性。'
                      : 'In a high-inflation, high-yield environment, prepaying a 3.0% fixed mortgage destroys your liquidity.'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="mb-12">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 shadow-sm text-center">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                {isZh ? '计算您的实际资本成本' : 'Calculate Your Actual Cost of Capital'}
              </h3>
              <p className="text-slate-700 mb-6">
                {isZh ? '使用我们的加权混合利率工具了解您的实际资本成本。' : 'Find out your actual cost of capital with our Weighted Blended Rate Tool.'}
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
