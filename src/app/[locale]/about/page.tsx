import { Metadata } from 'next';
import Image from 'next/image';
import Script from 'next/script';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getSeoMetadata } from '@/lib/seo';

type Props = {
  params: { locale: 'en' | 'zh' };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { metadata } = getSeoMetadata('/about', params.locale);
  return metadata;
}

export default function AboutPage({ params: { locale } }: Props) {
  const isZh = locale === 'zh';

  const aboutPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: isZh ? '关于 HELOC Calculator Pro' : 'About HELOC Calculator Pro',
    url: 'https://heloccalculator.pro/about',
    description: isZh
      ? '将企业级银行系统的精准度，带入您的房屋净值决策。'
      : 'Bringing Enterprise-Grade Banking Precision to Your Home Equity Decisions.',
    author: {
      '@type': 'Person',
      name: 'Sapling Yang',
      jobTitle: 'Core Banking System Architect and PMP and Founder',
      sameAs: [
        'https://twitter.com/SaplingYang',
        'https://github.com/saplingyang'
      ],
      worksFor: {
        '@type': 'Organization',
        name: 'HELOC Calculator Pro'
      }
    },
    reviewedBy: {
      '@type': 'Person',
      name: 'Financial Advisor',
      jobTitle: 'Certified Financial Advisor'
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4">
      <Script
        id="about-page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />

      <div className="max-w-4xl mx-auto">
        <nav className="mb-8 flex items-center gap-2 text-sm text-slate-600">
          <Link href={`/${locale}`} className="hover:text-emerald-600 transition">
            {isZh ? '首页' : 'Home'}
          </Link>
          <span>/</span>
          <span className="text-emerald-600 font-medium">
            {isZh ? '关于我们' : 'About Us'}
          </span>
        </nav>

        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600 transition mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          {isZh ? '返回主页' : 'Back to Home'}
        </Link>

        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 border-b border-stone-200 pb-10 mb-10">
            <div className="w-32 h-32 relative shrink-0">
              <Image
                src="/images/profile-placeholder.jpg"
                alt="Sapling Yang - Core Banking Architect"
                fill
                className="rounded-full object-cover shadow-md"
              />
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-sm">
                <div className="w-10 h-10 bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                  PMP
                </div>
              </div>
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-stone-900 mb-2">
                {isZh ? '关于 HELOC Calculator Pro' : 'About HELOC Calculator Pro'}
              </h1>
              <h2 className="text-xl font-medium text-stone-600 mb-4">
                {isZh
                  ? '将企业级银行系统的精准度，带入您的房屋净值决策。'
                  : 'Bringing Enterprise-Grade Banking Precision to Your Home Equity Decisions.'}
              </h2>

              <div className="flex flex-col gap-2 mt-4">
                <div className="inline-flex items-center gap-2 bg-stone-100 px-3 py-1.5 rounded-md text-sm text-stone-700 font-medium w-fit">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Built by Sapling Yang, Core Banking Architect and Founder
                </div>
                <div className="inline-flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-md text-sm text-blue-800 font-medium w-fit border border-blue-100">
                  <span className="text-blue-500">🛡️</span>
                  Reviewed by Certified Financial Advisor
                </div>
              </div>
            </div>
          </div>

          <div className="prose prose-stone max-w-none mb-12">
            {isZh ? (
              <>
                <h3 className="text-xl font-semibold text-stone-900">行业痛点：银行贷款的&ldquo;黑匣子&rdquo;</h3>
                <p>
                  如今在网上搜索 HELOC（房屋净值信用额度）计算器，您会找到成百上千个结果。但行业内心照不宣的秘密是：市面上绝大多数工具只是为了收集潜在客户信息的&ldquo;营销玩具&rdquo;。它们使用最基础的数学公式，完全忽略了复利的复杂性、浮动利率的波动细节以及隐藏的风险因素。
                </p>
                <p>
                  当您向银行申请 HELOC 时，银行使用的是极其复杂的后端风控引擎来评估您的财务状况。作为房屋所有者，为什么您不能在踏入银行之前，就掌握同等精度的计算分析能力？
                </p>

                <h3 className="text-xl font-semibold text-stone-900 mt-8">我的故事：从核心银行系统到个人理财工具</h3>
                <p>
                  你好，我是 Sapling。在过去的 20 年里，我作为软件架构师和项目经理（PMP），一直致力于为大型金融机构设计和开发<strong>核心银行系统（Core Banking Systems）</strong>。
                </p>
                <p>
                  我的职业生涯深耕于银行的&ldquo;底层引擎&rdquo;。我曾负责编写处理账本对账、摊销计划、贷款价值比（LTV）风险建模以及财务压力测试的底层算法。我清楚地知道银行是如何计算您的最大借款能力，以及在利率上升时他们是如何评估您的违约风险的。
                </p>
                <p>
                  我开发 <strong>HELOC Calculator Pro</strong> 的初衷很简单：我认为房主理应获得绝对的数据透明度。我希望将银行后端的企业级计算逻辑和风控模型提取出来，直接、免费地交到普通用户手中。
                </p>

                <h3 className="text-xl font-semibold text-stone-900 mt-8">是什么让本工具与众不同？</h3>
                <ul className="space-y-2 mt-4">
                  <li><strong>核心银行级算法：</strong>我们的工具不止于简单的加减乘除。它真实复刻了银行底层的摊销算法，为您模拟最精确的还款时间表。</li>
                  <li><strong>机构级压力测试：</strong>我们不会只向您展示最乐观的场景。我们的计算器会自动模拟基准利率飙升的压力测试，让您清晰看到市场逆转时的真实财务风险。</li>
                  <li><strong>AI 驱动的风控评分：</strong>结合数十年的银行底层逻辑与现代 AI 技术，我们为您提供客观、深度的财务策略分析。</li>
                  <li><strong>绝对中立，拒绝倒卖数据：</strong>我们不是披着计算器外衣的贷款机构，也不会将您的信息倒卖给贷款中介。我们唯一的追求，就是为您提供最真实的财务数据。</li>
                </ul>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-stone-900">The Problem: The &ldquo;Black Box&rdquo; of Bank Lending</h3>
                <p>
                  If you search for a HELOC calculator online today, you&apos;ll find hundreds of them. But here is the industry secret: most of these tools are simple lead-generation toys. They use basic math that ignores the complex nuances of compound interest, variable rate fluctuations, and hidden risk factors.
                </p>
                <p>
                  When you apply for a Home Equity Line of Credit, banks evaluate your financial health using sophisticated backend risk engines. Why shouldn&apos;t you have access to that same level of precision before you walk into a branch?
                </p>

                <h3 className="text-xl font-semibold text-stone-900 mt-8">The Origin Story: From Core Banking Systems to Personal Finance</h3>
                <p>
                  Hi, I&apos;m Sapling. Over the past 20 years, I&apos;ve worked as a software architect and project manager (PMP) designing and developing <strong>Core Banking Systems</strong> for large financial institutions.
                </p>
                <p>
                  My career has been built deeply inside the &ldquo;engine room&rdquo; of banks. I&apos;ve written the algorithms that handle ledger reconciliation, amortization schedules, loan-to-value (LTV) risk modeling, and financial stress testing. I know exactly how banks calculate your borrowing power and how they assess your risk level when rates go up.
                </p>
                <p>
                  I built <strong>HELOC Calculator Pro</strong> because I believe homeowners deserve total transparency. I wanted to take the enterprise-grade calculation logic and risk-assessment models out of the bank&apos;s backend and put them directly into your hands, for free.
                </p>

                <h3 className="text-xl font-semibold text-stone-900 mt-8">What Makes Our Calculator Different?</h3>
                <ul className="space-y-2 mt-4">
                  <li><strong>Core Banking Algorithms:</strong> Our calculator doesn&apos;t just do simple division. It replicates real-world banking amortization algorithms to simulate exact payment timelines.</li>
                  <li><strong>Institutional-Grade Stress Testing:</strong> We don&apos;t just show you the best-case scenario. Our tool runs automated stress tests against prime rate hikes, showing you your exact financial exposure if the market turns.</li>
                  <li><strong>AI-Powered Risk Scoring:</strong> Combining decades of banking logic with modern AI, we provide an unbiased, comprehensive analysis of your HELOC strategy.</li>
                  <li><strong>Zero Bias, Zero Lead-Selling:</strong> We are not a lender disguised as a calculator. We don&apos;t sell your data to mortgage brokers. Our only product is the truth about your numbers.</li>
                </ul>
              </>
            )}
          </div>

          <hr className="border-stone-200 my-10" />

          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <section>
              <h2 className="text-lg font-semibold text-stone-900 mb-4">
                {isZh ? '计算方法与数据透明度' : 'Calculation Methodology'}
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-stone-800 text-sm">Credit Limit (LTV) Risk Modeling</h3>
                  <p className="text-stone-600 text-sm mt-1">
                    Maximum HELOC = (Home Value × LTV Ratio) - Mortgage Balance. Standard LTV applied at 85% for prime credit profiles.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-stone-800 text-sm">Amortization Algorithms</h3>
                  <p className="text-stone-600 text-sm mt-1">
                    Replicates standard 10-year interest-only draw periods followed by 20-year principal + interest repayment schedules.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-stone-800 text-sm">Data Sources</h3>
                  <ul className="list-disc list-inside text-stone-600 text-sm mt-1">
                    <li>Prime Rate benchmarks tracked against current market rates</li>
                    <li>LTV ratios aligned with industry standard lending guidelines</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-amber-50 border border-amber-200 rounded-lg p-6 h-fit">
              <h2 className="text-lg font-semibold text-stone-900 mb-3 flex items-center gap-2">
                <span className="text-amber-500">⚠️</span> {isZh ? '重要免责声明' : 'Important Disclaimer'}
              </h2>
              <p className="text-stone-700 text-sm leading-relaxed">
                {isZh
                  ? '此工具采用企业级逻辑构建，但仅供教育及财务模拟目的使用。所有结果均为基于您输入信息的估算值。实际贷款条件、利率和信用影响可能因放贷机构的最终承保标准而异。在做出财务决策前，请务必咨询合格的财务顾问或税务专家。'
                  : 'While built on enterprise-grade logic, this calculator is for educational and financial simulation purposes only. Results are estimates based on your inputs. Actual loan terms, rates, and credit impacts will vary based on final lender underwriting. Always consult with qualified financial advisors or tax professionals before making financial decisions.'}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
