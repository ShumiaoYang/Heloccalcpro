import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calculator } from 'lucide-react';
import type { Locale } from '@/i18n/routing';
import { ArticleSchema } from '@/components/seo/structured-data';
import { getSeoMetadata } from '@/lib/seo';

type PageProps = {
  params: { locale: Locale };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = params;
  const isZh = locale === 'zh';

  const title = isZh ? 'HELOC DTI 要求详解 | 隐藏的现金流测试' : 'Mastering HELOC DTI Requirements | The Hidden Cash Flow Test';
  const description = isZh
    ? '了解 HELOC 后端 DTI 要求如何决定您的最大借款额度。掌握动态 DTI 计算、代理月供因子和收入资格标准。'
    : 'Understand how HELOC back-end DTI requirements determine your maximum borrowing limit. Master dynamic DTI calculations, proxy payment factors, and income qualification standards.';

  const { metadata: baseMetadata } = getSeoMetadata('/heloc-dti-requirements', locale);

  return {
    ...baseMetadata,
    title,
    description,
    keywords: isZh ? 'HELOC DTI, 债务收入比, 最大DTI, HELOC收入要求' : 'HELOC DTI, debt-to-income ratio, maximum DTI for HELOC, HELOC income requirements',
    openGraph: {
      ...baseMetadata.openGraph,
      title,
      description,
      type: 'article',
    },
  };
}

export default function HelocDTIRequirementsPage({ params }: PageProps) {
  const { locale } = params;
  const isZh = locale === 'zh';

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-blue-50">
      <ArticleSchema
        title={isZh ? 'HELOC DTI 要求详解' : 'Mastering HELOC DTI Requirements'}
        description={isZh
          ? '了解 HELOC 后端 DTI 要求如何决定您的最大借款额度'
          : 'Understand how HELOC back-end DTI requirements determine your maximum borrowing limit'}
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
            {isZh ? 'DTI 要求' : 'DTI Requirements'}
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
            {isZh ? 'Mastering HELOC DTI Requirements: The Hidden Cash Flow Test' : 'Mastering HELOC DTI Requirements: The Hidden Cash Flow Test'}
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed mb-6">
            {isZh
              ? 'DTI（债务收入比）是银行用来评估您现金流还款能力的关键指标。即使您拥有价值 10 亿美元的城堡，如果 DTI 不通过，银行批准额度仍然是零。'
              : 'DTI (Debt-to-Income ratio) is the critical metric banks use to assess your cash flow repayment capacity. Even if you own a $1 billion castle, if your DTI fails, your bank approval is still zero.'}
          </p>
          <Link
            href={`/${locale}#calculator`}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-base font-semibold text-white hover:bg-emerald-700 transition shadow-lg"
          >
            {isZh ? '立即计算您的精确 HELOC 借款能力 →' : 'Calculate your exact HELOC borrowing power now →'}
          </Link>
        </header>

        <article className="prose prose-slate max-w-none">
          {/* Section 1: What is DTI */}
          <section className="mb-12">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {isZh ? '1. What is DTI, and Why is it Critical in Underwriting?' : '1. What is DTI, and Why is it Critical in Underwriting?'}
              </h2>
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p className="text-lg">
                  {isZh
                    ? 'CLTV 关注您的抵押物，而 DTI（债务收入比）严格评估您的现金流。银行使用 DTI 确保您有实际的月度还款能力来承担新债务而不会违约。'
                    : 'While CLTV looks at your collateral, DTI (Debt-to-Income) strictly evaluates your cash flow. Banks use DTI to ensure you have the actual monthly repayment capacity to absorb the new debt without defaulting.'}
                </p>
                <p>
                  {isZh
                    ? 'DTI 是您所有月度债务支付（包括抵押贷款、汽车贷款、信用卡最低还款和新的 HELOC 代理月供）除以您的月总收入。这是银行用来防止支付冲击（Payment Shock）的核心风控指标。'
                    : 'DTI is your total monthly debt payments (including mortgage, car loans, credit card minimums, and the new HELOC proxy payment) divided by your gross monthly income. This is the core risk control metric banks use to prevent payment shock.'}
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: DTI Impact on Approval */}
          <section className="mb-12">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {isZh ? '2. How Does DTI Impact Your HELOC Approval Limit?' : '2. How Does DTI Impact Your HELOC Approval Limit?'}
              </h2>

              <div className="space-y-6 text-slate-700 leading-relaxed">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-amber-900 mb-3">
                    {isZh ? '💰 The $1 Billion Castle Scenario' : '💰 The $1 Billion Castle Scenario'}
                  </h3>
                  <p className="text-amber-900">
                    {isZh
                      ? '让我们运行一个有趣的假设场景。想象您拥有英国女王的城堡，价值 10 亿美元，完全无贷款。您拥有无限的房屋净值。猜猜如果您的 DTI 不通过，银行会借给您多少？零。让我们看看数学计算。'
                      : 'Let\'s run a fun hypothetical scenario. Imagine you own the Queen of England\'s castle, valued at $1 Billion free and clear. You have infinite home equity. Guess how much the bank will lend you if your DTI fails? Zero. Let\'s look at the math.'}
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">{isZh ? '基础参数' : 'Base Parameters'}</h4>
                  <ul className="text-sm text-blue-900 space-y-1">
                    <li><strong>{isZh ? '月收入：' : 'Monthly Income:'}</strong> $10,000</li>
                    <li><strong>{isZh ? '现有月债务：' : 'Current Monthly Debt:'}</strong> $4,000</li>
                    <li><strong>{isZh ? 'HELOC 月供控制率：' : 'HELOC Payment Control Rate:'}</strong> 1.25%</li>
                  </ul>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <p className="font-semibold text-slate-900 mb-2">{isZh ? '公式：' : 'Formula:'}</p>
                  <code className="text-sm text-slate-800 block bg-white p-3 rounded border border-slate-300">
                    MaxCreditLimit<sub>DTI</sub> = (MonthlyIncome × DTI - CurrentMonthlyDebt) / HelocPaymentCtrlRate
                  </code>
                </div>

                <div className="my-8 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                  <Image
                    src="/images/dti_borrowing_power_chart_optimized.png"
                    alt={isZh ? 'DTI 借款能力图表' : 'DTI Borrowing Power Chart'}
                    width={1200}
                    height={675}
                    className="w-full h-auto"
                  />
                </div>

                <div className="space-y-4">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <h4 className="text-base font-semibold text-emerald-900 mb-2">
                      {isZh ? '💡 洞察 1：债务障碍' : '💡 Insight 1: The Debt Barrier'}
                    </h4>
                    <p className="text-sm text-emerald-900 leading-relaxed">
                      {isZh
                        ? '您必须首先清除现有的 $4,000 债务。在 36% DTI 下，您的容量为负，导致批准额度为 $0。借款能力仅在您超过现有债务门槛后才开始。'
                        : 'You must clear your existing $4,000 debt first. At 36% DTI, your capacity is negative, resulting in a flat $0 approval. Borrowing power begins only AFTER you exceed the existing debt threshold.'}
                    </p>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h4 className="text-base font-semibold text-amber-900 mb-2">
                      {isZh ? '💡 洞察 2：代理杠杆' : '💡 Insight 2: The Proxy Leverage'}
                    </h4>
                    <p className="text-sm text-amber-900 leading-relaxed">
                      {isZh
                        ? '由于 1.25% 分母的存在，DTI 允许额度的微小增加（从 43% 到 50%）会使您的借款能力从 $24,000 爆炸式增长到 $80,000。'
                        : 'Because of the 1.25% denominator, a tiny increase in DTI allowance (from 43% to 50%) explodes your borrowing power from $24,000 to $80,000.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Debt Impact */}
          <section className="mb-12">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {isZh ? '3. What Other Factors Destroy Your Borrowing Power?' : '3. What Other Factors Destroy Your Borrowing Power?'}
              </h2>

              <div className="space-y-6 text-slate-700 leading-relaxed">
                <p className="text-lg">
                  {isZh
                    ? '让我们调整场景。假设银行将您锁定在标准的 43% DTI 层级。您的现有债务如何改变游戏规则？'
                    : 'Let\'s adjust the scenario. Assume the bank locked you into the standard 43% DTI tier. How does your existing debt change the game?'}
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">{isZh ? '基础参数' : 'Base Parameters'}</h4>
                  <ul className="text-sm text-blue-900 space-y-1">
                    <li><strong>{isZh ? '月收入：' : 'Monthly Income:'}</strong> $10,000 to $15,000</li>
                    <li><strong>{isZh ? 'DTI：' : 'DTI:'}</strong> 43%</li>
                    <li><strong>{isZh ? 'HELOC 月供控制率：' : 'HELOC Payment Control Rate:'}</strong> 1.25%</li>
                  </ul>
                </div>

                <div className="my-8 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                  <Image
                    src="/images/dti_debt_impact_chart.png"
                    alt={isZh ? 'DTI 债务影响图表' : 'DTI Debt Impact Chart'}
                    width={1200}
                    height={675}
                    className="w-full h-auto"
                  />
                </div>

                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="text-base font-semibold text-red-900 mb-2">
                      {isZh ? '💡 洞察 1：$1 到 $80 的摧毁规则' : '💡 Insight 1: The $1 to $80 Destruction Rule'}
                    </h4>
                    <p className="text-sm text-red-900 leading-relaxed">
                      {isZh
                        ? '每 $1 的现有月债务（如汽车贷款）会摧毁 $80 的 HELOC 借款能力（1 / 0.0125）。这是 1.25% 分母的反向杠杆效应。'
                        : 'Every $1 of existing monthly debt (like a car loan) destroys $80 of HELOC borrowing power (1 / 0.0125). This is the inverse leverage effect of the 1.25% denominator.'}
                    </p>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <h4 className="text-base font-semibold text-emerald-900 mb-2">
                      {isZh ? '💡 洞察 2：预批准技巧' : '💡 Insight 2: The Pre-Approval Hack'}
                    </h4>
                    <p className="text-sm text-emerald-900 leading-relaxed">
                      {isZh
                        ? '在申请前还清 $500/月的汽车贷款可以立即解锁 $40,000 的银行信用额度。这就是为什么精明的借款人在申请 HELOC 前会进行债务整合。'
                        : 'Paying off a $500/mo auto loan before applying can instantly unlock $40,000 in bank credit. This is why savvy borrowers consolidate debt before applying for a HELOC.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Dynamic DTI Calculation */}
          <section className="mb-12">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {isZh ? '4. How Underwriters Calculate Your Dynamic DTI' : '4. How Underwriters Calculate Your Dynamic DTI'}
              </h2>

              <div className="space-y-6 text-slate-700 leading-relaxed">
                <p className="text-lg">
                  {isZh
                    ? '43% 不是静态的。银行使用动态公式根据您的信用评分和 CLTV 调整最大允许 DTI。'
                    : '43% isn\'t static. Banks use a dynamic formula that adjusts your maximum allowed DTI based on your credit score and CLTV.'}
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">
                    {isZh ? '📐 动态 DTI 规则' : '📐 Dynamic DTI Rules'}
                  </h3>
                  <ul className="space-y-4 text-sm text-blue-900">
                    <li>
                      <strong className="block mb-1">{isZh ? '基础 DTI 上限：' : 'The Base DTI Cap:'}</strong>
                      {isZh ? '对于标准借款人，核心核保引擎从严格的 43% 基础 DTI 限额开始。' : 'For standard borrowers, the core underwriting engine starts with a strict Base DTI limit of 43%.'}
                    </li>
                    <li>
                      <strong className="block mb-1">{isZh ? 'FICO 奖励：' : 'The FICO Bonus:'}</strong>
                      {isZh ? '贷款机构奖励优秀的信用历史。FICO 760+ 解锁 +7% 奖励；FICO 720-759 解锁 +5% 奖励；FICO 680-719 解锁 +2% 奖励。' : 'Lenders reward excellent credit histories. FICO 760+ unlocks a +7% bonus; FICO 720-759 unlocks a +5% bonus; FICO 680-719 unlocks a +2% bonus.'}
                    </li>
                    <li>
                      <strong className="block mb-1">{isZh ? 'CLTV 奖励：' : 'The CLTV Bonus:'}</strong>
                      {isZh ? '较低的贷款价值比率提供进一步的灵活性。CLTV ≤ 60% 解锁 +5% 奖励；CLTV 61%-80% 解锁 +2% 奖励。' : 'Lower loan-to-value ratios grant further flexibility. CLTV ≤ 60% unlocks a +5% bonus; CLTV 61%-80% unlocks a +2% bonus.'}
                    </li>
                    <li>
                      <strong className="block mb-1">{isZh ? '绝对最大上限：' : 'The Absolute Maximum Cap:'}</strong>
                      {isZh ? '即使您最大化所有可用奖励（例如达到 55%），核心银行风险管理法规也会强制执行硬性停止。动态算法应用 50% 的绝对最高 DTI 上限。没有标准的美国 HELOC 批准会超过此阈值。' : 'Even if you max out all available bonuses (e.g., reaching 55%), core banking risk management regulations enforce a hard stop. The dynamic algorithm applies an Absolute Top DTI Cap of 50%. No standard US HELOC approval will exceed this threshold.'}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: 1.25% Payment Control Rate */}
          <section className="mb-12">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {isZh ? '5. Why the 1.25% HelocPaymentCtrlRate? (The Stress Test)' : '5. Why the 1.25% HelocPaymentCtrlRate? (The Stress Test)'}
              </h2>

              <div className="space-y-6 text-slate-700 leading-relaxed">
                <p className="text-lg">
                  {isZh
                    ? '为什么银行将您的可用现金除以 1.25%（0.0125）？这是核保月供因子。'
                    : 'Why do banks divide your available cash by 1.25% (0.0125)? This is the Underwriting Payment Factor.'}
                </p>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-amber-900 mb-3">
                    {isZh ? '⚠️ 行业标准压力测试' : '⚠️ Industry-Standard Stress Test'}
                  </h3>
                  <p className="text-amber-900 leading-relaxed">
                    {isZh
                      ? '主要的美国贷款机构（如 Chase、Wells Fargo 和 Fannie Mae 指南）不会根据初始的"仅付息"月供来核保可变利率 HELOC。他们必须针对未来在更高利率下的完全摊销还款阶段对您的能力进行压力测试，以防止支付冲击。信用额度的 1.25% 是行业标准代理，以保证您能够在最坏情况的利率环境中生存。'
                      : 'Major US lenders (like Chase, Wells Fargo, and Fannie Mae guidelines) do not underwrite variable-rate HELOCs based on the initial "Interest-Only" payment. They must stress-test your capacity against a future, fully-amortizing repayment phase at a higher interest rate to prevent payment shock. 1.25% of the line amount is the industry-standard proxy to guarantee you can survive worst-case rate environments.'}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-slate-900 mb-2">{isZh ? '实例：' : 'Example:'}</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {isZh
                      ? '如果您申请 $100,000 的 HELOC，银行会假定每月支付 $1,250 用于 DTI 资格审查目的，即使您的实际初始仅付息月供可能只有 $500。这确保了当利率上升或还款期开始时，您不会陷入财务困境。'
                      : 'If you request a $100,000 HELOC, the bank assumes a monthly payment of $1,250 for DTI qualification purposes, even if your actual initial interest-only payment might be only $500. This ensures you won\'t fall into financial distress when rates rise or the repayment period begins.'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="mb-12">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 shadow-sm text-center">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                {isZh ? 'Test Your DTI Scenarios' : 'Test Your DTI Scenarios'}
              </h3>
              <p className="text-slate-700 mb-6 leading-relaxed">
                {isZh
                  ? '使用我们的 HELOC 批准计算器测试不同的收入场景，查看您的 DTI 如何影响最大借款额度。'
                  : 'Test different income scenarios using our HELOC Approval Calculator and see how your DTI impacts your maximum borrowing limit.'}
              </p>
              <Link
                href={`/${locale}#calculator`}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-3 text-base font-semibold text-white hover:bg-emerald-700 transition shadow-lg"
              >
                {isZh ? '立即计算您的 DTI 借款能力 →' : 'Calculate Your DTI Borrowing Power Now →'}
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
