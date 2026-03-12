import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, TrendingDown, Home, CreditCard, DollarSign } from 'lucide-react';
import type { Locale } from '@/i18n/routing';
import ArchitectNote from '@/components/content/ArchitectNote';
import { ArticleSchema } from '@/components/seo/structured-data';
import { getSeoMetadata } from '@/lib/seo';

type PageProps = {
  params: { locale: Locale };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = params;
  const isZh = locale === 'zh';

  const title = isZh ? 'HELOC 风险与常见问题完整指南 | 避坑必读' : 'HELOC Risks & Common Concerns | Complete Guide';
  const description = isZh
    ? '深入了解房屋净值信用额度(HELOC)的主要风险：利率波动、还款压力、房产价值下跌、信用评分影响等。包含详细的风险管理策略和常见问题解答。'
    : 'Understand the main risks of Home Equity Line of Credit (HELOC): interest rate fluctuations, repayment pressure, property value decline, credit score impact, and more. Includes detailed risk management strategies and FAQ.';

  const { metadata: baseMetadata } = getSeoMetadata('/heloc-concerns-and-risks', locale);

  return {
    ...baseMetadata,
    title,
    description,
    keywords: isZh ? 'HELOC风险, 房屋净值贷款风险, 利率风险, 还款压力, 房产贬值' : 'HELOC risks, home equity loan risks, interest rate risk, repayment pressure, property depreciation',
    openGraph: {
      ...baseMetadata.openGraph,
      title,
      description,
      type: 'article',
      publishedTime: '2026-03-12',
      authors: ['Sapling Yang'],
    },
  };
}

export default function ConcernsRisksPage({ params }: PageProps) {
  const { locale } = params;
  const isZh = locale === 'zh';

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-blue-50">
      <ArticleSchema
        title={isZh ? 'HELOC 风险与常见问题完整指南' : 'HELOC Risks & Common Concerns'}
        description={isZh
          ? '深入了解房屋净值信用额度(HELOC)的主要风险：利率波动、还款压力、房产价值下跌、信用评分影响等。'
          : 'Understand the main risks of Home Equity Line of Credit (HELOC): interest rate fluctuations, repayment pressure, property value decline, credit score impact, and more.'}
        datePublished="2026-03-12"
        author="Sapling Yang"
      />
      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-slate-600">
          <Link href={`/${locale}`} className="hover:text-emerald-600 transition">
            {isZh ? '首页' : 'Home'}
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">
            {isZh ? 'HELOC 风险与常见问题' : 'HELOC Risks & Concerns'}
          </span>
        </nav>

        {/* Back Button */}
        <Link
          href={`/${locale}#concerns-help`}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600 transition mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          {isZh ? '返回主页' : 'Back to Home'}
        </Link>

        {/* Article Header */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-800 mb-4">
            <AlertTriangle className="h-4 w-4" />
            {isZh ? '风险提示' : 'Risk Warning'}
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">
            {isZh ? 'HELOC 风险与常见问题完整指南' : 'HELOC Risks & Common Concerns'}
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            {isZh
              ? '房屋净值信用额度(HELOC)是一种强大的金融工具，但也伴随着重要风险。本指南将帮助你全面了解潜在风险，做出明智的财务决策。'
              : 'A Home Equity Line of Credit (HELOC) is a powerful financial tool, but it comes with important risks. This guide helps you understand potential risks and make informed financial decisions.'
            }
          </p>
        </header>

        {/* Risk Overview */}
        <div className="mb-12 rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            {isZh ? '核心风险概览' : 'Core Risk Overview'}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <TrendingDown className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-900 text-sm">{isZh ? '利率波动风险' : 'Interest Rate Risk'}</h3>
                <p className="text-xs text-red-800">{isZh ? '可变利率可能大幅上升' : 'Variable rates may rise significantly'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Home className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-900 text-sm">{isZh ? '房产价值风险' : 'Property Value Risk'}</h3>
                <p className="text-xs text-red-800">{isZh ? '房价下跌影响额度' : 'Declining prices affect credit limit'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-900 text-sm">{isZh ? '还款压力风险' : 'Repayment Pressure'}</h3>
                <p className="text-xs text-red-800">{isZh ? '收入减少导致违约' : 'Income loss leads to default'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CreditCard className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-900 text-sm">{isZh ? '信用评分影响' : 'Credit Score Impact'}</h3>
                <p className="text-xs text-red-800">{isZh ? '高使用率降低评分' : 'High utilization lowers score'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="mb-12 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            {isZh ? '目录' : 'Table of Contents'}
          </h2>
          <ol className="space-y-2 text-slate-700">
            <li><a href="#interest-rate-risk" className="hover:text-emerald-600 transition">1. {isZh ? '利率波动风险' : 'Interest Rate Fluctuation Risk'}</a></li>
            <li><a href="#property-value-risk" className="hover:text-emerald-600 transition">2. {isZh ? '房产价值下跌风险' : 'Property Value Decline Risk'}</a></li>
            <li><a href="#repayment-pressure" className="hover:text-emerald-600 transition">3. {isZh ? '还款压力与违约风险' : 'Repayment Pressure & Default Risk'}</a></li>
            <li><a href="#credit-score-impact" className="hover:text-emerald-600 transition">4. {isZh ? '信用评分影响' : 'Credit Score Impact'}</a></li>
            <li><a href="#foreclosure-risk" className="hover:text-emerald-600 transition">5. {isZh ? '房屋丧失抵押权风险' : 'Foreclosure Risk'}</a></li>
            <li><a href="#faq" className="hover:text-emerald-600 transition">{isZh ? '常见问题解答' : 'Frequently Asked Questions'}</a></li>
            <li><a href="#risk-management" className="hover:text-emerald-600 transition">{isZh ? '风险管理策略' : 'Risk Management Strategies'}</a></li>
          </ol>
        </div>

        {/* Main Content */}
        <article className="prose prose-slate max-w-none">
          {/* Section 1: Interest Rate Risk */}
          <section id="interest-rate-risk" className="mb-16 scroll-mt-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {isZh ? '当美联储加息时，我的 HELOC 月供会增加多少？' : 'How Much Will My HELOC Payment Increase When the Fed Raises Rates?'}
              </h2>

              <div className="space-y-6 text-slate-700 leading-relaxed">
                <p className="text-lg">
                  {isZh
                    ? 'HELOC 最大的风险之一是可变利率。与固定利率贷款不同，HELOC 的利率会随着市场利率（通常是 Prime Rate）的变化而波动，这可能导致你的月供大幅增加。'
                    : 'One of the biggest risks of a HELOC is the variable interest rate. Unlike fixed-rate loans, HELOC rates fluctuate with market rates (typically Prime Rate), which can cause your monthly payment to increase significantly.'
                  }
                </p>

                <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-4">
                  {isZh ? '利率如何影响你的还款？' : 'How Do Rate Changes Affect Your Payment?'}
                </h3>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 my-6">
                  <h4 className="font-semibold text-slate-900 mb-4">
                    {isZh ? '📊 实际案例：利率上升的影响' : '📊 Real Example: Impact of Rate Increase'}
                  </h4>
                  <div className="space-y-3 text-sm">
                    <p><strong>{isZh ? '假设条件：' : 'Assumptions:'}</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• {isZh ? 'HELOC 余额: $100,000' : 'HELOC Balance: $100,000'}</li>
                      <li>• {isZh ? '初始利率: 6.5% (Prime 5% + Margin 1.5%)' : 'Initial Rate: 6.5% (Prime 5% + Margin 1.5%)'}</li>
                      <li>• {isZh ? '仅付息期（Draw Period）' : 'Interest-Only Period (Draw Period)'}</li>
                    </ul>

                    <div className="mt-4 grid md:grid-cols-3 gap-4">
                      <div className="border border-emerald-200 bg-emerald-50 rounded-lg p-4">
                        <p className="text-xs text-emerald-800 mb-1">{isZh ? '初始利率 6.5%' : 'Initial Rate 6.5%'}</p>
                        <p className="text-2xl font-bold text-emerald-900">$542</p>
                        <p className="text-xs text-emerald-700">{isZh ? '月供' : 'Monthly Payment'}</p>
                      </div>
                      <div className="border border-amber-200 bg-amber-50 rounded-lg p-4">
                        <p className="text-xs text-amber-800 mb-1">{isZh ? '利率上升至 8.5%' : 'Rate Rises to 8.5%'}</p>
                        <p className="text-2xl font-bold text-amber-900">$708</p>
                        <p className="text-xs text-amber-700">{isZh ? '月供 (+$166)' : 'Monthly Payment (+$166)'}</p>
                      </div>
                      <div className="border border-red-200 bg-red-50 rounded-lg p-4">
                        <p className="text-xs text-red-800 mb-1">{isZh ? '利率上升至 10.5%' : 'Rate Rises to 10.5%'}</p>
                        <p className="text-2xl font-bold text-red-900">$875</p>
                        <p className="text-xs text-red-700">{isZh ? '月供 (+$333)' : 'Monthly Payment (+$333)'}</p>
                      </div>
                    </div>

                    <p className="mt-4 text-amber-800 font-semibold">
                      {isZh
                        ? '⚠️ 利率上升 4%，月供增加 61%（$333/月，$3,996/年）'
                        : '⚠️ A 4% rate increase means 61% higher payment ($333/month, $3,996/year)'
                      }
                    </p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-4">
                  {isZh ? 'Prime Rate 在过去 20 年波动了多少？' : 'How Much Has Prime Rate Fluctuated Over the Past 20 Years?'}
                </h3>
                <p>
                  {isZh
                    ? '据美联储（Federal Reserve）公布的宏观经济数据显示，Prime Rate 在过去 20 年间经历了剧烈波动：'
                    : 'According to macroeconomic data published by the Federal Reserve, Prime Rate has experienced dramatic fluctuations over the past 20 years:'
                  }
                </p>
                <ul className="space-y-2 list-disc list-inside mt-4">
                  <li>
                    <strong>2008-2015:</strong> {isZh ? '金融危机后，Prime Rate 降至历史低点 3.25%' : 'After financial crisis, Prime Rate dropped to historic low of 3.25%'}
                  </li>
                  <li>
                    <strong>2016-2019:</strong> {isZh ? '逐步上升至 5.5%' : 'Gradually rose to 5.5%'}
                  </li>
                  <li>
                    <strong>2020-2021:</strong> {isZh ? '疫情期间再次降至 3.25%' : 'Dropped again to 3.25% during pandemic'}
                  </li>
                  <li>
                    <strong>2022-2024:</strong> {isZh ? '快速上升至 8.5%（上升 5.25%）' : 'Rapidly rose to 8.5% (increase of 5.25%)'
                  }</li>
                  <li>
                    <strong>2025:</strong> {isZh ? '预计维持在 7-8% 区间' : 'Expected to remain in 7-8% range'}
                  </li>
                </ul>

                <div className="bg-red-50 border border-red-200 rounded-xl p-6 my-8">
                  <h4 className="text-lg font-semibold text-red-900 mb-3">
                    {isZh ? '🚨 最坏情况：还款期利率飙升' : '🚨 Worst Case: Rate Spike During Repayment'}
                  </h4>
                  <p className="text-red-800 mb-4">
                    {isZh
                      ? '最危险的情况是在 Draw Period 结束、进入 Repayment Period 时，利率大幅上升。此时不仅要开始偿还本金，还要面对更高的利率。'
                      : 'The most dangerous scenario is when rates spike as you transition from Draw Period to Repayment Period. You must start repaying principal while facing higher rates.'
                    }
                  </p>
                  <div className="bg-white border border-red-300 rounded-lg p-4">
                    <p className="text-sm font-semibold text-red-900 mb-2">{isZh ? '极端案例：' : 'Extreme Case:'}</p>
                    <ul className="text-sm text-red-800 space-y-1">
                      <li>• {isZh ? 'HELOC 余额: $100,000' : 'HELOC Balance: $100,000'}</li>
                      <li>• {isZh ? 'Draw Period 利率: 6.5%，月供 $542（仅付息）' : 'Draw Period Rate: 6.5%, Payment $542 (interest-only)'}</li>
                      <li>• {isZh ? 'Repayment Period 利率: 10.5%，月供 $1,398（本金+利息）' : 'Repayment Period Rate: 10.5%, Payment $1,398 (principal + interest)'}</li>
                      <li className="font-bold text-red-900">• {isZh ? '月供暴增 158%（+$856/月）' : 'Payment surges 158% (+$856/month)'}</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-4">
                  {isZh ? 'HELOC 可变利率 vs. 固定利率贷款对比' : 'HELOC Variable Rate vs. Fixed-Rate Loan Comparison'}
                </h3>

                <div className="overflow-x-auto my-6">
                  <table className="w-full border-collapse border border-slate-300 text-sm">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border border-slate-300 px-4 py-3 text-left font-semibold text-slate-900">
                          {isZh ? '对比维度' : 'Comparison Factor'}
                        </th>
                        <th className="border border-slate-300 px-4 py-3 text-left font-semibold text-slate-900">
                          {isZh ? 'HELOC（可变利率）' : 'HELOC (Variable Rate)'}
                        </th>
                        <th className="border border-slate-300 px-4 py-3 text-left font-semibold text-emerald-900">
                          {isZh ? '固定利率贷款' : 'Fixed-Rate Loan'}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-300 px-4 py-3 font-medium text-slate-900">
                          {isZh ? '利率稳定性' : 'Rate Stability'}
                        </td>
                        <td className="border border-slate-300 px-4 py-3 text-red-700">
                          {isZh ? '随市场波动' : 'Fluctuates with market'}
                        </td>
                        <td className="border border-slate-300 px-4 py-3 bg-emerald-50 text-emerald-900 font-semibold">
                          {isZh ? '锁定不变' : 'Locked in'}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-4 py-3 font-medium text-slate-900">
                          {isZh ? '初始利率' : 'Initial Rate'}
                        </td>
                        <td className="border border-slate-300 px-4 py-3 bg-emerald-50 text-emerald-900 font-semibold">
                          {isZh ? '通常较低（6-9%）' : 'Usually lower (6-9%)'}
                        </td>
                        <td className="border border-slate-300 px-4 py-3 text-slate-700">
                          {isZh ? '通常较高（7-10%）' : 'Usually higher (7-10%)'}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-4 py-3 font-medium text-slate-900">
                          {isZh ? '月供可预测性' : 'Payment Predictability'}
                        </td>
                        <td className="border border-slate-300 px-4 py-3 text-red-700">
                          {isZh ? '低（每月可能变化）' : 'Low (may change monthly)'}
                        </td>
                        <td className="border border-slate-300 px-4 py-3 bg-emerald-50 text-emerald-900 font-semibold">
                          {isZh ? '高（固定月供）' : 'High (fixed payment)'}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-4 py-3 font-medium text-slate-900">
                          {isZh ? '利率上升风险' : 'Rate Increase Risk'}
                        </td>
                        <td className="border border-slate-300 px-4 py-3 text-red-700 font-semibold">
                          {isZh ? '高（无上限或有限上限）' : 'High (no cap or limited cap)'}
                        </td>
                        <td className="border border-slate-300 px-4 py-3 bg-emerald-50 text-emerald-900">
                          {isZh ? '无（已锁定）' : 'None (locked in)'}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-4 py-3 font-medium text-slate-900">
                          {isZh ? '灵活性' : 'Flexibility'}
                        </td>
                        <td className="border border-slate-300 px-4 py-3 bg-emerald-50 text-emerald-900 font-semibold">
                          {isZh ? '高（按需提款）' : 'High (draw as needed)'}
                        </td>
                        <td className="border border-slate-300 px-4 py-3 text-slate-700">
                          {isZh ? '低（一次性放款）' : 'Low (lump sum)'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <ArchitectNote isZh={isZh}>
                  {isZh
                    ? '在我开发核心银行系统时，我们的压力测试算法（Stress-test Algorithms）对 HELOC 的"提款期"（Draw Period）到"还款期"（Repayment Period）的转换期给予了最高风险权重。银行知道这是违约率激增的临界点（Payment Shock）。这也是为什么我们的计算器强制要求模拟这一利率跃升场景——千万不要只看前 10 年的利息支出。'
                    : 'When I developed core banking systems, our stress-test algorithms assigned the highest risk weight to the transition from HELOC\'s Draw Period to Repayment Period. Banks know this is the critical point where default rates surge (Payment Shock). This is why our calculator mandates simulating this rate jump scenario—never focus only on the first 10 years of interest payments.'
                  }
                </ArchitectNote>

                <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-4">
                  {isZh ? '如何应对利率风险？' : 'How to Manage Interest Rate Risk?'}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 border border-emerald-200 bg-emerald-50 rounded-lg">
                    <span className="text-2xl">✅</span>
                    <div>
                      <h4 className="font-semibold text-emerald-900">{isZh ? '压力测试' : 'Stress Test'}</h4>
                      <p className="text-sm text-emerald-800">
                        {isZh
                          ? '在申请前，计算如果利率上升 2-3%，你是否仍能负担月供。使用我们的 HELOC 计算器进行模拟。'
                          : 'Before applying, calculate if you can still afford payments if rates rise 2-3%. Use our HELOC calculator to simulate.'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 border border-emerald-200 bg-emerald-50 rounded-lg">
                    <span className="text-2xl">✅</span>
                    <div>
                      <h4 className="font-semibold text-emerald-900">{isZh ? '考虑利率上限' : 'Consider Rate Caps'}</h4>
                      <p className="text-sm text-emerald-800">
                        {isZh
                          ? '选择有利率上限（Rate Cap）的 HELOC 产品，限制利率最高涨幅。'
                          : 'Choose HELOC products with rate caps that limit maximum rate increases.'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 border border-emerald-200 bg-emerald-50 rounded-lg">
                    <span className="text-2xl">✅</span>
                    <div>
                      <h4 className="font-semibold text-emerald-900">{isZh ? '提前还款计划' : 'Early Repayment Plan'}</h4>
                      <p className="text-sm text-emerald-800">
                        {isZh
                          ? '在 Draw Period 期间，尽量偿还本金，减少利率上升时的风险敞口。'
                          : 'During Draw Period, try to repay principal to reduce exposure when rates rise.'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 border border-emerald-200 bg-emerald-50 rounded-lg">
                    <span className="text-2xl">✅</span>
                    <div>
                      <h4 className="font-semibold text-emerald-900">{isZh ? '转换为固定利率' : 'Convert to Fixed Rate'}</h4>
                      <p className="text-sm text-emerald-800">
                        {isZh
                          ? '部分银行允许将 HELOC 余额转换为固定利率贷款，锁定利率。'
                          : 'Some banks allow converting HELOC balance to fixed-rate loan to lock in rates.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Placeholder for remaining sections */}
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">
              {isZh ? '更多风险分析内容正在完善中...' : 'More risk analysis content coming soon...'}
            </p>
            <Link
              href={`/${locale}#concerns-help`}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition"
            >
              {isZh ? '返回主页' : 'Back to Home'}
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
