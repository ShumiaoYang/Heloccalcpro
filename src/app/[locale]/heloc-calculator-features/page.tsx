import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calculator, TrendingUp, Shield, FileText } from 'lucide-react';
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
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {isZh ? '银行如何计算我的 HELOC 最大借款额度？' : 'How Do Banks Calculate My Maximum HELOC Borrowing Limit?'}
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

                </div>

                <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-4">
                  {isZh ? '计算方法' : 'Calculation Method'}
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                  <h4 className="font-semibold text-blue-900 mb-3">
                    {isZh ? '🔍 CLTV Cap 计算逻辑' : '🔍 CLTV Cap Calculation Logic'}
                  </h4>
                  <p className="text-sm text-blue-800 mb-4">
                    {isZh
                      ? '我们使用多因素 CLTV Cap 模型，综合考虑信用评分、房产类型和用途，计算最大可批额度。'
                      : 'We use a multi-factor CLTV Cap model that considers credit score, property type, and occupancy to calculate maximum approved credit limit.'
                    }
                  </p>
                  <div className="space-y-3 text-sm text-blue-900">
                    <div>
                      <p className="font-semibold mb-2">{isZh ? '步骤 1: 信用分档位基础 CLTV' : 'Step 1: Credit Score Base CLTV'}</p>
                      <p className="text-blue-800">
                        {isZh
                          ? '根据你的信用评分确定基础 CLTV 上限。信用分越高，允许的 CLTV 比率越高。'
                          : 'Determine base CLTV cap based on your credit score. Higher credit scores allow higher CLTV ratios.'
                        }
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold mb-2">{isZh ? '步骤 2: 房产类型调整' : 'Step 2: Property Type Adjustment'}</p>
                      <p className="text-blue-800">
                        {isZh
                          ? '不同房产类型有不同的风险特征。Single-family 和 Townhouse 风险较低，Condo、Multi-family 和 Manufactured 会有相应调整。'
                          : 'Different property types have different risk profiles. Single-family and Townhouse have lower risk, while Condo, Multi-family, and Manufactured require adjustments.'
                        }
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold mb-2">{isZh ? '步骤 3: 用途调整' : 'Step 3: Occupancy Adjustment'}</p>
                      <p className="text-blue-800">
                        {isZh
                          ? '自住房（Primary Residence）风险最低，Second Home 和 Investment Property 会有额外的风险调整。'
                          : 'Primary Residence has lowest risk. Second Home and Investment Property require additional risk adjustments.'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
                  <h4 className="font-semibold text-amber-900 mb-3">
                    {isZh ? '⚖️ DTI 约束' : '⚖️ DTI Constraint'}
                  </h4>
                  <p className="text-sm text-amber-800 mb-3">
                    {isZh
                      ? '除了 CLTV 限制，我们还使用 DTI（债务收入比）进行双重约束，确保月供负担在合理范围内。系统会根据你的信用评分和 CLTV 水平动态调整允许的最大 DTI。'
                      : 'In addition to CLTV limits, we use DTI (Debt-to-Income) as a dual constraint to ensure monthly payment burden is reasonable. The system dynamically adjusts maximum allowed DTI based on your credit score and CLTV level.'
                    }
                  </p>
                  <p className="text-sm text-amber-800">
                    {isZh
                      ? '最终可批额度取 CLTV 限额和 DTI 限额中的较小值，确保你的财务安全。'
                      : 'Final approved limit is the minimum of CLTV limit and DTI limit to ensure your financial safety.'
                    }
                  </p>
                </div>

                <ArchitectNote isZh={isZh}>
                  {isZh
                    ? '在我设计核心银行系统的 HELOC 审批引擎时，CLTV Cap 和 DTI 的双重约束是风控的核心。银行内部称之为"双闸门机制"（Dual-Gate Mechanism）——即使你的房屋净值充足（CLTV 通过），如果月供负担过重（DTI 不通过），系统也会自动降低批准额度。这确保了借款人不会因过度借贷而陷入财务困境。'
                    : 'When I designed the HELOC approval engine for core banking systems, the dual constraint of CLTV Cap and DTI was the core of risk control. Banks internally call this the "Dual-Gate Mechanism"—even if your home equity is sufficient (CLTV passes), if the payment burden is too heavy (DTI fails), the system automatically reduces the approved limit. This ensures borrowers don\'t fall into financial distress from over-borrowing.'
                  }
                </ArchitectNote>

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
                          <li>• {isZh ? '年收入: $120,000' : 'Annual Income: $120,000'}</li>
                          <li>• {isZh ? '月债务: $3,000' : 'Monthly Debt: $3,000'}</li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-emerald-800 font-medium">{isZh ? '计算结果：' : 'Calculation Results:'}</p>
                        <ul className="mt-2 space-y-1 text-emerald-700">
                          <li>• {isZh ? 'CLTV Cap: 85%' : 'CLTV Cap: 85%'}</li>
                          <li>• {isZh ? 'CLTV 限额: $125,000' : 'CLTV Limit: $125,000'}</li>
                          <li>• {isZh ? 'DTI 限额: $144,000' : 'DTI Limit: $144,000'}</li>
                          <li>• {isZh ? '最终批准: $125,000' : 'Final Approved: $125,000'}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Payment Calculator */}
          <section id="payment-calculator" className="mb-16 scroll-mt-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {isZh ? '从提款期到还款期，我的月供会增加多少？' : 'How Much Will My Payment Increase from Draw Period to Repayment Period?'}
              </h2>

              <div className="space-y-6 text-slate-700 leading-relaxed">
                <p className="text-lg">
                  {isZh
                    ? 'HELOC 分为两个阶段：提款期（Draw Period）和还款期（Repayment Period）。月供计算器帮助你了解每个阶段的月供金额和 Payment Shock 风险。'
                    : 'HELOC has two phases: Draw Period and Repayment Period. The Payment Calculator helps you understand monthly payments for each phase and Payment Shock risk.'
                  }
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h4 className="font-semibold text-blue-900 mb-3">
                    {isZh ? '📅 提款期（前 10 年）' : '📅 Draw Period (First 10 Years)'}
                  </h4>
                  <p className="text-sm text-blue-800 mb-3">
                    {isZh
                      ? '在提款期内，你只需支付利息，不需要偿还本金。可以随时提款和还款，月供金额会根据你的实际使用余额和当前利率计算。'
                      : 'During the draw period, you only pay interest, not principal. You can draw and repay at any time. Monthly payment is calculated based on your actual balance and current rate.'
                    }
                  </p>
                  <div className="mt-3 bg-blue-100 rounded p-3 text-sm text-blue-900">
                    <p className="font-semibold mb-1">{isZh ? '示例：' : 'Example:'}</p>
                    <p>{isZh ? '如果你使用了 $100,000，当前 APR 为 8.4%，提款期月供约为 $700' : 'If you use $100,000 at 8.4% APR, draw period payment is approximately $700/month'}</p>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <h4 className="font-semibold text-red-900 mb-3">
                    {isZh ? '📅 还款期（第 11-30 年）' : '📅 Repayment Period (Years 11-30)'}
                  </h4>
                  <p className="text-sm text-red-800 mb-3">
                    {isZh
                      ? '还款期开始后，不能再提款，必须按月偿还本金和利息，类似传统贷款。月供会显著高于提款期。'
                      : 'After repayment period starts, you cannot draw anymore and must pay principal + interest monthly, like a traditional loan. Payment will be significantly higher than draw period.'
                    }
                  </p>
                  <div className="mt-3 bg-red-100 rounded p-3 text-sm text-red-900">
                    <p className="font-semibold mb-1">{isZh ? '示例：' : 'Example:'}</p>
                    <p>{isZh ? '同样 $100,000 余额，还款期月供约为 $860，比提款期增加 $160' : 'Same $100,000 balance, repayment payment is approximately $860/month, $160 more than draw period'}</p>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                  <h4 className="font-semibold text-amber-900 mb-3">
                    {isZh ? '⚠️ Payment Shock 警告' : '⚠️ Payment Shock Warning'}
                  </h4>
                  <p className="text-sm text-amber-800 mb-3">
                    {isZh
                      ? 'Payment Shock 是指从提款期切换到还款期时，月供的突然上涨。这是 HELOC 最大的风险之一。我们的计算器会评估这个跳升占你收入的比例，帮助你提前规划。'
                      : 'Payment Shock refers to the sudden increase in monthly payment when transitioning from draw to repayment period. This is one of the biggest HELOC risks. Our calculator evaluates this jump as a percentage of your income to help you plan ahead.'
                    }
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-emerald-100 border border-emerald-300 rounded p-2">
                      <p className="font-semibold text-emerald-900">{isZh ? '低风险' : 'Low Risk'}</p>
                      <p className="text-emerald-800">{isZh ? '月供跳升较小' : 'Small payment jump'}</p>
                    </div>
                    <div className="bg-amber-100 border border-amber-300 rounded p-2">
                      <p className="font-semibold text-amber-900">{isZh ? '中风险' : 'Medium Risk'}</p>
                      <p className="text-amber-800">{isZh ? '需要提前准备' : 'Need to prepare'}</p>
                    </div>
                    <div className="bg-red-100 border border-red-300 rounded p-2">
                      <p className="font-semibold text-red-900">{isZh ? '高风险' : 'High Risk'}</p>
                      <p className="text-red-800">{isZh ? '建议降低借款' : 'Reduce borrowing'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Risk Scoring */}
          <section id="risk-scoring" className="mb-16 scroll-mt-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {isZh ? '风险评分低于 60 分意味着什么？' : 'What Does a Risk Score Below 60 Mean?'}
              </h2>

              <div className="space-y-6 text-slate-700 leading-relaxed">
                <p className="text-lg">
                  {isZh
                    ? '我们的风险评分系统从 5 个维度评估你的 HELOC 风险，帮助你了解当前财务状况的健康程度。'
                    : 'Our risk scoring system evaluates your HELOC risk from 5 dimensions to help you understand your financial health.'
                  }
                </p>

                <div className="space-y-4">
                  <div className="border border-slate-200 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">1. {isZh ? 'CLTV 风险' : 'CLTV Risk'}</h4>
                    <p className="text-sm text-slate-600">
                      {isZh ? '评估你使用 HELOC 后的总负债率。CLTV 越高，风险越大。' : 'Evaluates your total debt ratio after using HELOC. Higher CLTV means higher risk.'}
                    </p>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">2. {isZh ? 'DTI 风险' : 'DTI Risk'}</h4>
                    <p className="text-sm text-slate-600">
                      {isZh ? '评估月供占收入的比例。DTI 越高，月供压力越大。' : 'Evaluates monthly payment as percentage of income. Higher DTI means greater payment burden.'}
                    </p>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">3-5. {isZh ? '其他风险因素' : 'Other Risk Factors'}</h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>• {isZh ? '信用分风险：信用评分越低，风险越高' : 'Credit Score Risk: Lower scores indicate higher risk'}</li>
                      <li>• {isZh ? 'Payment Shock 风险：月供跳升幅度越大，风险越高' : 'Payment Shock Risk: Larger payment jumps indicate higher risk'}</li>
                      <li>• {isZh ? '抵押物风险：不同房产类型和用途有不同风险等级' : 'Collateral Risk: Different property types and occupancy have different risk levels'}</li>
                    </ul>
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

          {/* Section 4: Stress Testing */}
          <section id="stress-testing" className="mb-16 scroll-mt-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {isZh ? '压力测试能帮我避免哪些财务风险？' : 'What Financial Risks Can Stress Testing Help Me Avoid?'}
              </h2>

              <div className="space-y-6 text-slate-700 leading-relaxed">
                <p className="text-lg">
                  {isZh
                    ? '压力测试帮助你了解在利率上升或收入下降等不利情况下，你的财务状况会受到多大影响。'
                    : 'Stress testing helps you understand how your finances would be affected by adverse scenarios like rate increases or income reduction.'
                  }
                </p>

                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <h4 className="font-semibold text-red-900 mb-3">
                    {isZh ? '📈 利率上升情景' : '📈 Rate Increase Scenario'}
                  </h4>
                  <p className="text-sm text-red-800 mb-3">
                    {isZh
                      ? '测试如果 Prime Rate 上升，你的月供会增加多少。帮助你评估利率风险，确保在不利情况下仍能负担月供。'
                      : 'Test how much your monthly payment would increase if Prime Rate rises. Helps you assess rate risk and ensure you can afford payments in adverse scenarios.'
                    }
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h4 className="font-semibold text-blue-900 mb-3">
                    {isZh ? '💰 收入增长情景' : '💰 Income Growth Scenario'}
                  </h4>
                  <p className="text-sm text-blue-800 mb-3">
                    {isZh
                      ? '测试如果你的收入持续增长，你的 DTI 会如何改善。帮助你了解长期财务健康趋势。'
                      : 'Test how your DTI would improve if your income grows over time. Helps you understand long-term financial health trends.'
                    }
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                  <h4 className="font-semibold text-amber-900 mb-3">
                    {isZh ? '🎯 使用建议' : '🎯 Usage Tips'}
                  </h4>
                  <ul className="text-sm text-amber-800 space-y-2">
                    <li>• {isZh ? '建议确保在 +2% 利率情景下仍能负担月供' : 'Ensure you can afford payments under +2% rate scenario'}</li>
                    <li>• {isZh ? '如果压力测试显示高风险，考虑降低借款金额' : 'If stress test shows high risk, consider reducing borrowing amount'}</li>
                    <li>• {isZh ? '保持应急储备金至少 6 个月月供' : 'Maintain emergency fund of at least 6 months of payments'}</li>
                  </ul>
                </div>

                <ArchitectNote isZh={isZh}>
                  {isZh
                    ? '在银行的风控系统中，压力测试是贷款审批的必经环节。我们会模拟"3-Sigma 事件"（极端情况）——比如利率在 12 个月内上升 3%，或借款人收入下降 20%。如果在这些极端场景下，借款人的 DTI 超过 50% 或 CLTV 超过 95%，系统会自动标记为"高风险"并降低批准额度。我们的计算器复刻了这套逻辑，让你在申请前就能看到银行眼中的风险。'
                    : 'In banking risk control systems, stress testing is a mandatory step in loan approval. We simulate "3-Sigma Events" (extreme scenarios)—such as rates rising 3% within 12 months, or borrower income dropping 20%. If under these extreme scenarios the borrower\'s DTI exceeds 50% or CLTV exceeds 95%, the system automatically flags as "high risk" and reduces approved limit. Our calculator replicates this logic, letting you see the risk through the bank\'s eyes before applying.'
                  }
                </ArchitectNote>
              </div>
            </div>
          </section>

          {/* Back to Home */}
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
