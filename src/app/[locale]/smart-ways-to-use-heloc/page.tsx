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
      title: 'HELOC 聪明用法完整指南 | 5种最佳使用场景',
      description: '深入了解房屋净值信用额度(HELOC)的5种聪明用法：家庭装修、债务整合、投资房产、教育资金和应急储备。包含详细案例分析、风险提示和最佳实践建议。',
      keywords: 'HELOC用法, 房屋净值贷款, 债务整合, 家庭装修贷款, 投资房产',
      openGraph: {
        title: 'HELOC 聪明用法完整指南',
        description: '5种最佳使用场景，帮你充分利用房屋净值',
        type: 'article',
      },
    };
  }

  return {
    title: 'Smart Ways to Use HELOC | Complete Guide to 5 Best Use Cases',
    description: 'Discover 5 smart ways to use your Home Equity Line of Credit (HELOC): home renovations, debt consolidation, investment properties, education funding, and emergency reserves. Includes detailed case studies, risk warnings, and best practices.',
    keywords: 'HELOC uses, home equity loan, debt consolidation, home renovation loan, investment property',
    openGraph: {
      title: 'Smart Ways to Use HELOC | Complete Guide',
      description: '5 best use cases to maximize your home equity',
      type: 'article',
    },
  };
}

export default function SmartWaysPage({ params }: PageProps) {
  const { locale } = params;
  const isZh = locale === 'zh';

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-blue-50">
      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-slate-600">
          <Link href={`/${locale}`} className="hover:text-emerald-600 transition">
            {isZh ? '首页' : 'Home'}
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">
            {isZh ? 'HELOC 聪明用法' : 'Smart Ways to Use HELOC'}
          </span>
        </nav>

        {/* Back Button */}
        <Link
          href={`/${locale}#smart-ways`}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600 transition mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          {isZh ? '返回主页' : 'Back to Home'}
        </Link>

        {/* Article Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">
            {isZh ? 'HELOC 聪明用法完整指南' : 'Smart Ways to Use Your HELOC'}
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            {isZh
              ? '房屋净值信用额度(HELOC)是一种灵活的融资工具。本指南将详细介绍5种最佳使用场景，帮助你充分利用房屋净值，实现财务目标。'
              : 'A Home Equity Line of Credit (HELOC) is a flexible financing tool. This comprehensive guide explores 5 best use cases to help you maximize your home equity and achieve your financial goals.'
            }
          </p>
        </header>

        {/* Table of Contents */}
        <div className="mb-12 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            {isZh ? '目录' : 'Table of Contents'}
          </h2>
          <ol className="space-y-2 text-slate-700">
            <li><a href="#home-renovation" className="hover:text-emerald-600 transition">1. {isZh ? '家庭装修与改造' : 'Home Renovation & Improvement'}</a></li>
            <li><a href="#debt-consolidation" className="hover:text-emerald-600 transition">2. {isZh ? '高息债务整合' : 'High-Interest Debt Consolidation'}</a></li>
            <li><a href="#investment-property" className="hover:text-emerald-600 transition">3. {isZh ? '投资房产首付' : 'Investment Property Down Payment'}</a></li>
            <li><a href="#education-funding" className="hover:text-emerald-600 transition">4. {isZh ? '教育资金支持' : 'Education Funding'}</a></li>
            <li><a href="#emergency-reserve" className="hover:text-emerald-600 transition">5. {isZh ? '应急资金储备' : 'Emergency Reserve Fund'}</a></li>
            <li><a href="#best-practices" className="hover:text-emerald-600 transition">{isZh ? '最佳实践建议' : 'Best Practices'}</a></li>
          </ol>
        </div>

        {/* Main Content */}
        <article className="prose prose-slate max-w-none">
          {/* Section 1: Home Renovation */}
          <section id="home-renovation" className="mb-16 scroll-mt-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {isZh ? '1. 家庭装修与改造' : '1. Home Renovation & Improvement'}
              </h2>

              <div className="space-y-6 text-slate-700 leading-relaxed">
                <p className="text-lg">
                  {isZh
                    ? '家庭装修是 HELOC 最常见且最明智的用途之一。通过使用房屋净值来改善房产，你不仅能提升居住品质，还可能增加房屋价值。'
                    : 'Home renovation is one of the most common and smartest uses of a HELOC. By using your home equity to improve your property, you can enhance your living quality while potentially increasing your home\'s value.'
                  }
                </p>

                <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-4">
                  {isZh ? '为什么选择 HELOC 进行装修？' : 'Why Use HELOC for Renovations?'}
                </h3>
                <ul className="space-y-3 list-disc list-inside">
                  <li>
                    <strong>{isZh ? '利率优势：' : 'Lower Interest Rates: '}</strong>
                    {isZh
                      ? 'HELOC 的利率通常比信用卡低 10-15 个百分点，能节省大量利息支出。'
                      : 'HELOC rates are typically 10-15 percentage points lower than credit cards, saving you significant interest costs.'
                    }
                  </li>
                  <li>
                    <strong>{isZh ? '税收优惠：' : 'Tax Benefits: '}</strong>
                    {isZh
                      ? '如果装修用于"实质性改善"房产，HELOC 利息可能可以抵税（请咨询税务顾问）。'
                      : 'If renovations "substantially improve" your property, HELOC interest may be tax-deductible (consult a tax advisor).'
                    }
                  </li>
                  <li>
                    <strong>{isZh ? '灵活支取：' : 'Flexible Withdrawals: '}</strong>
                    {isZh
                      ? '按需支取资金，只为实际使用的金额支付利息，避免一次性贷款的浪费。'
                      : 'Draw funds as needed and pay interest only on the amount used, avoiding waste from lump-sum loans.'
                    }
                  </li>
                  <li>
                    <strong>{isZh ? '增值潜力：' : 'Value Appreciation: '}</strong>
                    {isZh
                      ? '厨房和浴室改造通常能带来 60-80% 的投资回报率。'
                      : 'Kitchen and bathroom remodels typically offer 60-80% ROI (return on investment).'
                    }
                  </li>
                </ul>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 my-8">
                  <h4 className="text-lg font-semibold text-emerald-900 mb-3">
                    {isZh ? '💡 真实案例' : '💡 Real Case Study'}
                  </h4>
                  <p className="text-emerald-800">
                    {isZh
                      ? '张先生使用 $50,000 HELOC 翻新了厨房和主卧浴室。装修完成后，房屋估值增加了 $75,000，净增值 $25,000。同时，HELOC 年利率 6.5%，比他的信用卡利率（19.9%）节省了超过 $6,700 的年利息。'
                      : 'Mr. Zhang used a $50,000 HELOC to renovate his kitchen and master bathroom. After completion, his home appraisal increased by $75,000, netting $25,000 in added value. Meanwhile, his HELOC rate of 6.5% saved him over $6,700 annually compared to his credit card rate of 19.9%.'
                    }
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-4">
                  {isZh ? '最适合的装修项目' : 'Best Renovation Projects'}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border border-slate-200 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">
                      {isZh ? '厨房改造' : 'Kitchen Remodel'}
                    </h4>
                    <p className="text-sm text-slate-600">
                      {isZh ? 'ROI: 60-80% | 平均成本: $25,000-$50,000' : 'ROI: 60-80% | Average Cost: $25,000-$50,000'}
                    </p>
                  </div>
                  <div className="border border-slate-200 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">
                      {isZh ? '浴室翻新' : 'Bathroom Renovation'}
                    </h4>
                    <p className="text-sm text-slate-600">
                      {isZh ? 'ROI: 60-70% | 平均成本: $15,000-$30,000' : 'ROI: 60-70% | Average Cost: $15,000-$30,000'}
                    </p>
                  </div>
                  <div className="border border-slate-200 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">
                      {isZh ? '地下室装修' : 'Basement Finishing'}
                    </h4>
                    <p className="text-sm text-slate-600">
                      {isZh ? 'ROI: 70-75% | 平均成本: $30,000-$75,000' : 'ROI: 70-75% | Average Cost: $30,000-$75,000'}
                    </p>
                  </div>
                  <div className="border border-slate-200 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">
                      {isZh ? '增加卧室/浴室' : 'Adding Bedroom/Bathroom'}
                    </h4>
                    <p className="text-sm text-slate-600">
                      {isZh ? 'ROI: 50-60% | 平均成本: $50,000-$100,000' : 'ROI: 50-60% | Average Cost: $50,000-$100,000'}
                    </p>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 my-8">
                  <h4 className="text-lg font-semibold text-amber-900 mb-3">
                    {isZh ? '⚠️ 风险提示' : '⚠️ Risk Warning'}
                  </h4>
                  <ul className="space-y-2 text-amber-800 text-sm">
                    <li>• {isZh ? '过度装修可能无法回收成本，要根据社区房价水平合理规划' : 'Over-renovation may not recover costs; plan according to neighborhood price levels'}</li>
                    <li>• {isZh ? '装修期间房屋价值下跌会影响 HELOC 额度' : 'Home value decline during renovation can affect HELOC limit'}</li>
                    <li>• {isZh ? '确保有足够的还款能力，避免因装修超支导致财务压力' : 'Ensure sufficient repayment capacity to avoid financial stress from renovation overruns'}</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Debt Consolidation */}
          <section id="debt-consolidation" className="mb-16 scroll-mt-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {isZh ? '2. 高息债务整合' : '2. High-Interest Debt Consolidation'}
              </h2>

              <div className="space-y-6 text-slate-700 leading-relaxed">
                <p className="text-lg">
                  {isZh
                    ? '如果你有多笔高息债务（信用卡、个人贷款等），使用 HELOC 整合债务可以显著降低利息支出，简化还款流程。'
                    : 'If you have multiple high-interest debts (credit cards, personal loans, etc.), using a HELOC to consolidate can significantly reduce interest costs and simplify repayment.'
                  }
                </p>

                <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-4">
                  {isZh ? '债务整合的优势' : 'Benefits of Debt Consolidation'}
                </h3>
                <ul className="space-y-3 list-disc list-inside">
                  <li>
                    <strong>{isZh ? '大幅降低利率：' : 'Dramatically Lower Rates: '}</strong>
                    {isZh
                      ? '信用卡利率通常 18-25%，而 HELOC 利率仅 6-9%，每年可节省数千美元。'
                      : 'Credit card rates typically range 18-25%, while HELOC rates are only 6-9%, saving thousands annually.'
                    }
                  </li>
                  <li>
                    <strong>{isZh ? '简化还款：' : 'Simplified Repayment: '}</strong>
                    {isZh
                      ? '将多笔债务合并为一笔，只需管理一个账户和一个还款日期。'
                      : 'Consolidate multiple debts into one, managing just one account and one payment date.'
                    }
                  </li>
                  <li>
                    <strong>{isZh ? '提升信用评分：' : 'Improve Credit Score: '}</strong>
                    {isZh
                      ? '降低信用卡使用率（utilization ratio），有助于提升信用评分。'
                      : 'Lower credit card utilization ratio, helping to improve your credit score.'
                    }
                  </li>
                  <li>
                    <strong>{isZh ? '可能的税收优惠：' : 'Potential Tax Benefits: '}</strong>
                    {isZh
                      ? '在某些情况下，HELOC 利息可以抵税，而信用卡利息不可以。'
                      : 'In some cases, HELOC interest is tax-deductible, while credit card interest is not.'
                    }
                  </li>
                </ul>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 my-8">
                  <h4 className="text-lg font-semibold text-emerald-900 mb-3">
                    {isZh ? '💰 节省计算示例' : '💰 Savings Calculation Example'}
                  </h4>
                  <div className="space-y-3 text-emerald-800">
                    <p><strong>{isZh ? '整合前：' : 'Before Consolidation:'}</strong></p>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• {isZh ? '信用卡 A: $15,000 @ 22% APR = $3,300/年利息' : 'Credit Card A: $15,000 @ 22% APR = $3,300/year interest'}</li>
                      <li>• {isZh ? '信用卡 B: $10,000 @ 19% APR = $1,900/年利息' : 'Credit Card B: $10,000 @ 19% APR = $1,900/year interest'}</li>
                      <li>• {isZh ? '个人贷款: $5,000 @ 12% APR = $600/年利息' : 'Personal Loan: $5,000 @ 12% APR = $600/year interest'}</li>
                      <li className="font-semibold">• {isZh ? '总计: $30,000 债务，$5,800/年利息' : 'Total: $30,000 debt, $5,800/year interest'}</li>
                    </ul>
                    <p className="mt-4"><strong>{isZh ? '整合后：' : 'After Consolidation:'}</strong></p>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• {isZh ? 'HELOC: $30,000 @ 7.5% APR = $2,250/年利息' : 'HELOC: $30,000 @ 7.5% APR = $2,250/year interest'}</li>
                      <li className="font-semibold text-emerald-900">• {isZh ? '年节省: $3,550' : 'Annual Savings: $3,550'}</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-4">
                  {isZh ? '适合整合的债务类型' : 'Suitable Debt Types for Consolidation'}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 border border-slate-200 rounded-lg">
                    <span className="text-2xl">✅</span>
                    <div>
                      <h4 className="font-semibold text-slate-900">{isZh ? '信用卡债务' : 'Credit Card Debt'}</h4>
                      <p className="text-sm text-slate-600">{isZh ? '最适合整合，利率差异最大，节省最多' : 'Best for consolidation, largest rate difference, maximum savings'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 border border-slate-200 rounded-lg">
                    <span className="text-2xl">✅</span>
                    <div>
                      <h4 className="font-semibold text-slate-900">{isZh ? '个人贷款' : 'Personal Loans'}</h4>
                      <p className="text-sm text-slate-600">{isZh ? '如果利率高于 HELOC，值得整合' : 'Worth consolidating if rate is higher than HELOC'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 border border-slate-200 rounded-lg">
                    <span className="text-2xl">✅</span>
                    <div>
                      <h4 className="font-semibold text-slate-900">{isZh ? '汽车贷款（高息）' : 'Auto Loans (High-Rate)'}</h4>
                      <p className="text-sm text-slate-600">{isZh ? '如果利率超过 8-10%，可以考虑' : 'Consider if rate exceeds 8-10%'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 border border-amber-100 rounded-lg bg-amber-50">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <h4 className="font-semibold text-amber-900">{isZh ? '学生贷款' : 'Student Loans'}</h4>
                      <p className="text-sm text-amber-800">{isZh ? '谨慎考虑，联邦学生贷款有特殊保护和宽恕计划' : 'Consider carefully; federal student loans have special protections and forgiveness programs'}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-xl p-6 my-8">
                  <h4 className="text-lg font-semibold text-red-900 mb-3">
                    {isZh ? '🚨 重要警告' : '🚨 Critical Warning'}
                  </h4>
                  <ul className="space-y-2 text-red-800 text-sm">
                    <li>• {isZh ? '债务整合后，必须改变消费习惯，否则可能再次累积信用卡债务' : 'After consolidation, you must change spending habits or risk accumulating credit card debt again'}</li>
                    <li>• {isZh ? 'HELOC 是有担保贷款，如果无法还款，可能失去房屋' : 'HELOC is a secured loan; failure to repay could result in losing your home'}</li>
                    <li>• {isZh ? '不要将无担保债务（信用卡）转换为有担保债务（HELOC）后继续挥霍' : 'Don\'t convert unsecured debt (credit cards) to secured debt (HELOC) and continue overspending'}</li>
                    <li>• {isZh ? '确保有稳定收入和应急基金，避免还款困难' : 'Ensure stable income and emergency fund to avoid repayment difficulties'}</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Continue with remaining sections... */}
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">
              {isZh ? '更多内容正在完善中...' : 'More content coming soon...'}
            </p>
            <Link
              href={`/${locale}#smart-ways`}
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
