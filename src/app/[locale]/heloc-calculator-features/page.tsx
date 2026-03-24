import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calculator } from 'lucide-react';
import type { Locale } from '@/i18n/routing';
import ArchitectNote from '@/components/content/ArchitectNote';
import { ArticleSchema } from '@/components/seo/structured-data';
import { getSeoMetadata } from '@/lib/seo';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

type PageProps = {
  params: { locale: Locale };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = params;
  const isZh = locale === 'zh';

  const title = isZh ? 'HELOC 计算器功能详解 | 完整使用指南' : 'HELOC Calculator Features | Complete User Guide';
  const description = isZh
    ? '深入了解 HELOC 计算器的所有功能：信用额度计算、月供模拟、风险评分系统、压力测试、还款计划等。包含详细的计算方法说明和使用技巧。'
    : 'Explore all features of our HELOC Calculator: credit limit calculation, payment simulation, risk scoring system, stress testing, repayment planning, and more. Includes detailed calculation methods and usage tips.';

  const { metadata: baseMetadata } = getSeoMetadata('/heloc-calculator-features', locale);

  return {
    ...baseMetadata,
    title,
    description,
    keywords: isZh ? 'HELOC计算器, 房屋净值计算, 月供计算, 风险评分, 压力测试' : 'HELOC calculator, home equity calculation, payment calculator, risk scoring, stress testing',
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

export default function CalculatorFeaturesPage({ params }: PageProps) {
  const { locale } = params;
  const isZh = locale === 'zh';

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-blue-50">
      <ArticleSchema
        title={isZh ? 'HELOC 计算器功能详解' : 'HELOC Calculator Features'}
        description={isZh
          ? '深入了解 HELOC 计算器的所有功能：信用额度计算、月供模拟、风险评分系统、压力测试、还款计划等。'
          : 'Explore all features of our HELOC Calculator: credit limit calculation, payment simulation, risk scoring system, stress testing, repayment planning, and more.'}
        datePublished="2026-03-12"
        author="Sapling Yang"
      />
      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
        <nav className="mb-8 flex items-center gap-2 text-sm text-slate-600">
          <Link href={`/${locale}`} className="hover:text-emerald-600 transition">
            {isZh ? '首页' : 'Home'}
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">
            {isZh ? 'HELOC 计算器功能' : 'HELOC Calculator Features'}
          </span>
        </nav>

        <Link
          href={`/${locale}#features`}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600 transition mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          {isZh ? '返回主页' : 'Back to Home'}
        </Link>

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

        <article className="prose prose-slate max-w-none">
          {/* Section 1: Credit Limit Calculator */}
          <section id="credit-limit-calculator" className="mb-16 scroll-mt-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {isZh ? 'Credit Limit Calculator' : 'Credit Limit Calculator'}
              </h2>

              <div className="space-y-6 text-slate-700 leading-relaxed">
                <p className="text-lg">
                  {isZh
                    ? '银行使用"双闸门机制"（Dual-Gate Mechanism）计算你的最大可批额度，确保既有足够的资产抵押（CLTV 约束），又有合理的还款能力（DTI 约束）。'
                    : 'Banks use a "Dual-Gate Mechanism" to calculate your maximum approved limit, ensuring both sufficient asset collateral (CLTV constraint) and reasonable repayment capacity (DTI constraint).'
                  }
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">
                    {isZh ? '🔐 银行级核保公式（Bank-Grade Underwriting Formulas）' : '🔐 Bank-Grade Underwriting Formulas'}
                  </h3>

                  <div className="space-y-4 text-sm text-blue-900">
                    <div className="bg-white rounded-lg p-4">
                      <p className="font-semibold mb-2">{isZh ? '双闸门机制：' : 'Dual-Gate Mechanism:'}</p>
                      <div className="overflow-x-auto">
                        <BlockMath math="\text{MaxCreditLimit} = \min(\text{MaxCreditLimit}_{\text{CLTV}}, \text{MaxCreditLimit}_{\text{DTI}})" />
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <p className="font-semibold mb-2">{isZh ? 'Gate 1 - 资产净值限额（Asset Equity Limit）：' : 'Gate 1 - Asset Equity Limit:'}</p>
                      <div className="overflow-x-auto">
                        <BlockMath math="\text{MaxCreditLimit}_{\text{CLTV}} = \text{HomeValue} \times \text{CLTV} - \text{MortgageBalance}" />
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <p className="font-semibold mb-2">{isZh ? 'Gate 2 - 现金流限额（Cash Flow Limit）：' : 'Gate 2 - Cash Flow Limit:'}</p>
                      <div className="overflow-x-auto">
                        <BlockMath math="\text{MaxCreditLimit}_{\text{DTI}} = \frac{\text{MonthlyIncome} \times \text{DTI} - \text{CurrentMonthlyDebt}}{\text{HelocPaymentCtrlRate}}" />
                      </div>
                    </div>
                  </div>
                </div>

                <ArchitectNote isZh={isZh}>
                  {isZh
                    ? '在核心银行系统中，这两个公式是硬编码在审批引擎中的。即使你的房屋净值充足（CLTV 通过），如果月供负担过重（DTI 不通过），系统也会自动降低批准额度。这确保了借款人不会因过度借贷而陷入财务困境。'
                    : 'In core banking systems, these two formulas are hardcoded in the approval engine. Even if your home equity is sufficient (CLTV passes), if the payment burden is too heavy (DTI fails), the system automatically reduces the approved limit. This ensures borrowers don\'t fall into financial distress from over-borrowing.'
                  }
                </ArchitectNote>
              </div>
            </div>
          </section>

          {/* Section 2: Payment Calculator */}
          <section id="payment-calculator" className="mb-16 scroll-mt-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {isZh ? 'Payment Calculator' : 'Payment Calculator'}
              </h2>

              <div className="space-y-6 text-slate-700 leading-relaxed">
                <p className="text-lg">
                  {isZh
                    ? 'HELOC 分为提款期（Draw Period）和还款期（Repayment Period）。月供计算器帮助你了解每个阶段的月供金额和 Payment Shock 风险。'
                    : 'HELOC has two phases: Draw Period and Repayment Period. The Payment Calculator helps you understand monthly payments for each phase and Payment Shock risk.'
                  }
                </p>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-emerald-900 mb-4">
                    {isZh ? '📊 月供计算公式（Payment Calculation Formulas）' : '📊 Payment Calculation Formulas'}
                  </h3>

                  <div className="space-y-4 text-sm text-emerald-900">
                    <div className="bg-white rounded-lg p-4">
                      <p className="font-semibold mb-2">{isZh ? '提款期月供（Interest-Only Payment）：' : 'Draw Period Payment (Interest-Only):'}</p>
                      <div className="overflow-x-auto">
                        <BlockMath math="\text{DrawPayment} = \text{Balance} \times \frac{\text{effectiveRate}}{12}" />
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <p className="font-semibold mb-2">{isZh ? '还款期月供（Principal + Interest）：' : 'Repayment Period Payment (P&I):'}</p>
                      <div className="overflow-x-auto">
                        <BlockMath math="\text{RepaymentPayment} = \text{Balance} \times \frac{r(1+r)^n}{(1+r)^n-1}" />
                      </div>
                      <p className="text-xs text-emerald-700 mt-2">
                        {isZh ? '其中 r = effectiveRate/12, n = 剩余月数' : 'where r = effectiveRate/12, n = remaining months'}
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <p className="font-semibold mb-2">{isZh ? '有效利率（Effective Rate）：' : 'Effective Rate:'}</p>
                      <div className="overflow-x-auto">
                        <BlockMath math="\text{effectiveRate} = \max(\text{primeRate} + \text{finalMargin}, \text{floorRate})" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-red-900 mb-4">
                    {isZh ? '⚠️ Payment Shock 风险指标' : '⚠️ Payment Shock Risk Metric'}
                  </h3>
                  <div className="bg-white rounded-lg p-4">
                    <div className="overflow-x-auto">
                      <BlockMath math="\text{PaymentShock} = \frac{\text{RepaymentPayment} - \text{DrawPayment}}{\text{MonthlyIncome}}" />
                    </div>
                    <p className="text-sm text-red-800 mt-3">
                      {isZh
                        ? '这个比率衡量月供跳升占收入的百分比。银行通常要求 Payment Shock < 5% 才会批准高额度 HELOC。'
                        : 'This ratio measures the payment jump as a percentage of income. Banks typically require Payment Shock < 5% to approve high-limit HELOCs.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Stress Testing */}
          <section id="stress-testing" className="mb-16 scroll-mt-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {isZh ? 'Stress Testing' : 'Stress Testing'}
              </h2>

              <div className="space-y-6 text-slate-700 leading-relaxed">
                <p className="text-lg">
                  {isZh
                    ? '压力测试模拟极端市场情况（如利率飙升、收入下降），帮助你评估财务韧性。'
                    : 'Stress testing simulates extreme market conditions (e.g., rate spikes, income drops) to help you assess financial resilience.'
                  }
                </p>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-amber-900 mb-4">
                    {isZh ? '🧪 压力测试公式（Stress Testing Formulas）' : '🧪 Stress Testing Formulas'}
                  </h3>

                  <div className="space-y-4 text-sm text-amber-900">
                    <div className="bg-white rounded-lg p-4">
                      <p className="font-semibold mb-2">{isZh ? '利率上升情景（Rate Increase Scenario）：' : 'Rate Increase Scenario:'}</p>
                      <div className="overflow-x-auto">
                        <BlockMath math="\text{StressedRate} = \text{currentRate} + \Delta\text{rate}" />
                      </div>
                      <div className="overflow-x-auto mt-2">
                        <BlockMath math="\text{StressedPayment} = \text{Balance} \times \frac{\text{StressedRate}/12 \times (1+\text{StressedRate}/12)^n}{(1+\text{StressedRate}/12)^n-1}" />
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <p className="font-semibold mb-2">{isZh ? '收入增长情景（Income Growth Scenario）：' : 'Income Growth Scenario:'}</p>
                      <div className="overflow-x-auto">
                        <BlockMath math="\text{FutureIncome}_t = \text{CurrentIncome} \times (1 + g)^t" />
                      </div>
                      <div className="overflow-x-auto mt-2">
                        <BlockMath math="\text{FutureDTI}_t = \frac{\text{MonthlyDebt}}{\text{FutureIncome}_t / 12}" />
                      </div>
                    </div>
                  </div>
                </div>

                <ArchitectNote isZh={isZh}>
                  {isZh
                    ? '在银行的风控系统中，我们会模拟"3-Sigma 事件"（极端情况）——比如利率在 12 个月内上升 3%。如果在这些极端场景下，借款人的 DTI 超过 50% 或 CLTV 超过 95%，系统会自动标记为"高风险"并降低批准额度。'
                    : 'In banking risk control systems, we simulate "3-Sigma Events" (extreme scenarios)—such as rates rising 3% within 12 months. If under these extreme scenarios the borrower\'s DTI exceeds 50% or CLTV exceeds 95%, the system automatically flags as "high risk" and reduces approved limit.'
                  }
                </ArchitectNote>
              </div>
            </div>
          </section>

          {/* Section 4: Risk Scoring System */}
          <section id="risk-scoring-system" className="mb-16 scroll-mt-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {isZh ? 'Risk Scoring System' : 'Risk Scoring System'}
              </h2>

              <div className="space-y-6 text-slate-700 leading-relaxed">
                <p className="text-lg">
                  {isZh
                    ? '我们的风险评分系统从 5 个维度评估你的 HELOC 风险，每个维度 0-20 分，总分 0-100 分。'
                    : 'Our risk scoring system evaluates your HELOC risk from 5 dimensions, each scored 0-20 points, totaling 0-100 points.'
                  }
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    {isZh ? '🎯 风险评分公式（Risk Scoring Formulas）' : '🎯 Risk Scoring Formulas'}
                  </h3>

                  <div className="space-y-4 text-sm text-slate-900">
                    <div className="bg-white rounded-lg p-4">
                      <p className="font-semibold mb-2">{isZh ? '总风险评分：' : 'Total Risk Score:'}</p>
                      <div className="overflow-x-auto">
                        <BlockMath math="\text{TotalScore} = \sum_{i=1}^{5} \text{Score}_i" />
                      </div>
                      <p className="text-xs text-slate-600 mt-2">
                        {isZh ? '5个维度：CLTV风险、DTI风险、信用分风险、Payment Shock风险、抵押物风险' : '5 dimensions: CLTV Risk, DTI Risk, Credit Score Risk, Payment Shock Risk, Collateral Risk'}
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <p className="font-semibold mb-2">{isZh ? 'CLTV 风险评分（0-20分）：' : 'CLTV Risk Score (0-20):'}</p>
                      <div className="overflow-x-auto">
                        <BlockMath math="\text{Score}_{\text{CLTV}} = 20 \times \left(1 - \frac{\text{CLTV}}{100}\right)" />
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <p className="font-semibold mb-2">{isZh ? 'DTI 风险评分（0-20分）：' : 'DTI Risk Score (0-20):'}</p>
                      <div className="overflow-x-auto">
                        <BlockMath math="\text{Score}_{\text{DTI}} = 20 \times \left(1 - \frac{\text{DTI}}{50}\right)" />
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <p className="font-semibold mb-2">{isZh ? 'Payment Shock 风险评分（0-20分）：' : 'Payment Shock Risk Score (0-20):'}</p>
                      <div className="overflow-x-auto">
                        <BlockMath math="\text{Score}_{\text{Shock}} = 20 \times \left(1 - \frac{\text{PaymentShock}}{10}\right)" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <h4 className="font-semibold text-slate-900 mb-3">{isZh ? '风险等级划分' : 'Risk Level Classification'}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="bg-emerald-50 border border-emerald-200 rounded p-3">
                      <p className="font-bold text-emerald-900 text-lg">80-100</p>
                      <p className="text-emerald-700 font-semibold">{isZh ? '低风险' : 'Low Risk'}</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded p-3">
                      <p className="font-bold text-blue-900 text-lg">60-79</p>
                      <p className="text-blue-700 font-semibold">{isZh ? '中风险' : 'Medium Risk'}</p>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded p-3">
                      <p className="font-bold text-amber-900 text-lg">40-59</p>
                      <p className="text-amber-700 font-semibold">{isZh ? '偏高风险' : 'Elevated Risk'}</p>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded p-3">
                      <p className="font-bold text-red-900 text-lg">&lt;40</p>
                      <p className="text-red-700 font-semibold">{isZh ? '高风险' : 'High Risk'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="text-center py-12">
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
