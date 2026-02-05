import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calculator, TrendingUp, Shield, FileText } from 'lucide-react';
import type { Locale } from '@/i18n/routing';

type PageProps = {
  params: { locale: Locale };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = params;

  if (locale === 'zh') {
    return {
      title: 'HELOC 计算器功能详解 | 完整使用指南',
      description: '深入了解 HELOC 计算器的所有功能：信用额度计算、月供模拟、风险评分系统、压力测试、还款计划等。包含详细的计算方法说明和使用技巧。',
      keywords: 'HELOC计算器, 房屋净值计算, 月供计算, 风险评分, 压力测试',
      openGraph: {
        title: 'HELOC 计算器功能详解',
        description: '了解如何使用我们的专业计算器',
        type: 'article',
      },
    };
  }

  return {
    title: 'HELOC Calculator Features | Complete User Guide',
    description: 'Explore all features of our HELOC Calculator: credit limit calculation, payment simulation, risk scoring system, stress testing, repayment planning, and more. Includes detailed calculation methods and usage tips.',
    keywords: 'HELOC calculator, home equity calculation, payment calculator, risk scoring, stress testing',
    openGraph: {
      title: 'HELOC Calculator Features | Complete Guide',
      description: 'Learn how to use our professional calculator',
      type: 'article',
    },
  };
}

export default function CalculatorFeaturesPage({ params }: PageProps) {
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
            {isZh ? 'HELOC 计算器功能' : 'HELOC Calculator Features'}
          </span>
        </nav>

        {/* Back Button */}
        <Link
          href={`/${locale}#features`}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600 transition mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          {isZh ? '返回主页' : 'Back to Home'}
        </Link>

        {/* Article Header */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800 mb-4">
            <Calculator className="h-4 w-4" />
            {isZh ? '专业工具' : 'Professional Tool'}
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">
            {isZh ? 'HELOC 计算器功能详解' : 'HELOC Calculator Features Explained'}
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            {isZh
              ? '我们的 HELOC 计算器提供全面的分析工具，帮助你准确评估房屋净值信用额度的各项指标。本指南将详细介绍每个功能的使用方法和计算原理。'
              : 'Our HELOC Calculator provides comprehensive analysis tools to help you accurately assess all aspects of your Home Equity Line of Credit. This guide explains how to use each feature and the calculation principles behind them.'
            }
          </p>
        </header>

        {/* Feature Overview */}
        <div className="mb-12 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            {isZh ? '核心功能概览' : 'Core Features Overview'}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Calculator className="h-5 w-5 text-emerald-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">{isZh ? '信用额度计算' : 'Credit Limit Calculation'}</h3>
                <p className="text-xs text-slate-600">{isZh ? '基于房屋价值和 LTV 比率' : 'Based on home value and LTV ratio'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-emerald-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">{isZh ? '月供模拟' : 'Payment Simulation'}</h3>
                <p className="text-xs text-slate-600">{isZh ? '30年完整还款计划' : '30-year complete repayment plan'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-emerald-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">{isZh ? '风险评分系统' : 'Risk Scoring System'}</h3>
                <p className="text-xs text-slate-600">{isZh ? '多维度风险评估' : 'Multi-dimensional risk assessment'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-emerald-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">{isZh ? 'PDF 报告生成' : 'PDF Report Generation'}</h3>
                <p className="text-xs text-slate-600">{isZh ? '完整的分析报告' : 'Complete analysis report'}</p>
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
            <li><a href="#credit-calculator" className="hover:text-emerald-600 transition">1. {isZh ? '信用额度计算器' : 'Credit Limit Calculator'}</a></li>
            <li><a href="#payment-calculator" className="hover:text-emerald-600 transition">2. {isZh ? '月供计算器' : 'Payment Calculator'}</a></li>
            <li><a href="#risk-scoring" className="hover:text-emerald-600 transition">3. {isZh ? '风险评分系统' : 'Risk Scoring System'}</a></li>
            <li><a href="#stress-testing" className="hover:text-emerald-600 transition">4. {isZh ? '压力测试功能' : 'Stress Testing Feature'}</a></li>
            <li><a href="#calculation-methods" className="hover:text-emerald-600 transition">{isZh ? '计算方法说明' : 'Calculation Methods'}</a></li>
            <li><a href="#usage-tips" className="hover:text-emerald-600 transition">{isZh ? '使用技巧' : 'Usage Tips'}</a></li>
          </ol>
        </div>

        {/* Main Content */}
        <article className="prose prose-slate max-w-none">
          {/* Section 1: Credit Calculator */}
          <section id="credit-calculator" className="mb-16 scroll-mt-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Calculator className="h-7 w-7 text-emerald-600" />
                {isZh ? '1. 信用额度计算器' : '1. Credit Limit Calculator'}
              </h2>

              <div className="space-y-6 text-slate-700 leading-relaxed">
                <p className="text-lg">
                  {isZh
                    ? '信用额度计算器帮助你确定可以从房屋净值中借款的最大金额。计算基于房屋当前价值、现有抵押贷款余额、信用评分和贷款价值比（LTV）。'
                    : 'The Credit Limit Calculator helps you determine the maximum amount you can borrow against your home equity. Calculations are based on current home value, existing mortgage balance, credit score, and loan-to-value (LTV) ratio.'
                  }
                </p>

                <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-4">
                  {isZh ? '关键输入参数' : 'Key Input Parameters'}
                </h3>
                <div className="space-y-4">
                  <div className="border border-slate-200 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">
                      {isZh ? '房屋价值 (Home Value)' : 'Home Value'}
                    </h4>
                    <p className="text-sm text-slate-600 mb-2">
                      {isZh
                        ? '输入你房屋的当前市场价值。建议使用最近的房屋估价或类似房产的成交价格作为参考。'
                        : 'Enter your home\'s current market value. Use recent appraisals or comparable sales as reference.'
                      }
                    </p>
                    <div className="bg-slate-50 rounded p-3 text-sm">
                      <p className="font-medium text-slate-900 mb-1">{isZh ? '💡 提示：' : '💡 Tip:'}</p>
                      <p className="text-slate-700">
                        {isZh
                          ? '可以使用 Zillow、Redfin 等网站获取房屋估值，但银行最终会进行正式评估。'
                          : 'Use Zillow, Redfin for estimates, but banks will conduct formal appraisals.'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">
                      {isZh ? '抵押贷款余额 (Mortgage Balance)' : 'Mortgage Balance'}
                    </h4>
                    <p className="text-sm text-slate-600 mb-2">
                      {isZh
                        ? '输入你当前的抵押贷款剩余本金。可以从最近的贷款对账单中找到这个数字。'
                        : 'Enter your current mortgage principal balance. Find this on your recent loan statement.'
                      }
                    </p>
                    <div className="bg-amber-50 border border-amber-200 rounded p-3 text-sm">
                      <p className="font-medium text-amber-900 mb-1">{isZh ? '⚠️ 注意：' : '⚠️ Note:'}</p>
                      <p className="text-amber-800">
                        {isZh
                          ? '如果你有多笔抵押贷款（如第二抵押），需要输入所有贷款的总余额。'
                          : 'If you have multiple mortgages (e.g., second mortgage), enter total balance of all loans.'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">
                      {isZh ? '信用评分 (Credit Score)' : 'Credit Score'}
                    </h4>
                    <p className="text-sm text-slate-600 mb-2">
                      {isZh
                        ? '输入你的 FICO 信用评分（300-850）。信用评分影响你的利率和可借金额。'
                        : 'Enter your FICO credit score (300-850). Credit score affects your rate and borrowing amount.'
                      }
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <div className="bg-emerald-50 border border-emerald-200 rounded p-2 text-xs">
                        <p className="font-semibold text-emerald-900">740+ {isZh ? '优秀' : 'Excellent'}</p>
                        <p className="text-emerald-700">{isZh ? '最佳利率' : 'Best rates'}</p>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded p-2 text-xs">
                        <p className="font-semibold text-blue-900">700-739 {isZh ? '良好' : 'Good'}</p>
                        <p className="text-blue-700">{isZh ? '标准利率' : 'Standard rates'}</p>
                      </div>
                      <div className="bg-amber-50 border border-amber-200 rounded p-2 text-xs">
                        <p className="font-semibold text-amber-900">660-699 {isZh ? '一般' : 'Fair'}</p>
                        <p className="text-amber-700">{isZh ? '较高利率' : 'Higher rates'}</p>
                      </div>
                      <div className="bg-red-50 border border-red-200 rounded p-2 text-xs">
                        <p className="font-semibold text-red-900">&lt;660 {isZh ? '较低' : 'Low'}</p>
                        <p className="text-red-700">{isZh ? '可能被拒' : 'May be denied'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">
                      {isZh ? '期望 LTV 比率 (Desired LTV)' : 'Desired LTV Ratio'}
                    </h4>
                    <p className="text-sm text-slate-600 mb-2">
                      {isZh
                        ? 'LTV（Loan-to-Value）是贷款总额与房屋价值的比率。大多数银行允许的最高 LTV 为 80-85%。'
                        : 'LTV (Loan-to-Value) is the ratio of total loans to home value. Most banks allow maximum LTV of 80-85%.'
                      }
                    </p>
                    <div className="bg-slate-50 rounded p-3 text-sm mt-3">
                      <p className="font-medium text-slate-900 mb-2">{isZh ? '📊 LTV 计算公式：' : '📊 LTV Formula:'}</p>
                      <div className="bg-white border border-slate-200 rounded p-3 font-mono text-xs">
                        LTV = (Mortgage Balance + HELOC Amount) / Home Value × 100%
                      </div>
                      <p className="text-slate-700 mt-2">
                        {isZh
                          ? '例如：房屋价值 $500,000，抵押贷款 $300,000，HELOC $100,000'
                          : 'Example: Home value $500,000, Mortgage $300,000, HELOC $100,000'
                        }
                      </p>
                      <p className="text-slate-700">
                        LTV = ($300,000 + $100,000) / $500,000 = 80%
                      </p>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-4">
                  {isZh ? '计算结果解读' : 'Understanding Results'}
                </h3>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                  <h4 className="font-semibold text-emerald-900 mb-3">
                    {isZh ? '📈 示例计算' : '📈 Example Calculation'}
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-emerald-800 font-medium">{isZh ? '输入参数：' : 'Input Parameters:'}</p>
                        <ul className="mt-2 space-y-1 text-emerald-700">
                          <li>• {isZh ? '房屋价值: $500,000' : 'Home Value: $500,000'}</li>
                          <li>• {isZh ? '抵押余额: $300,000' : 'Mortgage Balance: $300,000'}</li>
                          <li>• {isZh ? '信用评分: 750' : 'Credit Score: 750'}</li>
                          <li>• {isZh ? '期望 LTV: 80%' : 'Desired LTV: 80%'}</li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-emerald-800 font-medium">{isZh ? '计算结果：' : 'Calculation Results:'}</p>
                        <ul className="mt-2 space-y-1 text-emerald-700">
                          <li>• {isZh ? '最大贷款总额: $400,000' : 'Max Total Loans: $400,000'}</li>
                          <li>• {isZh ? '可用 HELOC: $100,000' : 'Available HELOC: $100,000'}</li>
                          <li>• {isZh ? '当前净值: $200,000' : 'Current Equity: $200,000'}</li>
                          <li>• {isZh ? '剩余净值: $100,000' : 'Remaining Equity: $100,000'}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Placeholder for remaining sections */}
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">
              {isZh ? '更多功能说明正在完善中...' : 'More feature documentation coming soon...'}
            </p>
            <Link
              href={`/${locale}#features`}
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
