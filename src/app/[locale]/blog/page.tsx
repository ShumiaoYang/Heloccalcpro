import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Link as I18nLink, type Locale } from '@/i18n/routing';
import { getAllPosts } from '@/lib/posts';
import { getSeoMetadata } from '@/lib/seo';

type PageProps = {
  params: { locale: Locale };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { metadata: baseMetadata } = getSeoMetadata('/blog', params.locale);
  const isZh = params.locale === 'zh';

  return {
    ...baseMetadata,
    title: isZh ? 'HELOC 深度洞察 | HELOC 计算器' : 'HELOC Insights | HELOC Calculator',
    description: isZh
      ? '来自核心银行系统架构师的房屋净值、现金流与风险管理深度分析。'
      : 'Bank-grade HELOC insights from a core banking architect focused on equity, cash flow, and risk management.',
  };
}

export default function BlogIndexPage({ params }: PageProps) {
  const { locale } = params;
  const posts = getAllPosts(locale);
  const isZh = locale === 'zh';

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="mb-8 flex items-center gap-2 text-sm text-slate-600">
        <Link href={`/${locale}`} className="hover:text-emerald-600 transition">
          {isZh ? '首页' : 'Home'}
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">{isZh ? '博客' : 'Blog'}</span>
      </nav>

      <Link
        href={`/${locale}`}
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600 transition mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        {isZh ? '返回主页' : 'Back to Home'}
      </Link>

      <header className="mb-10 space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {isZh ? 'HELOC 深度洞察' : 'HELOC Insights'}
        </h1>
        <p className="max-w-3xl text-base text-slate-600">
          {isZh
            ? '核心银行系统架构师视角，解析银行审批逻辑、现金流压力与风险边界。'
            : 'Core banking architect analysis on approval logic, payment shock, and real-world HELOC risk boundaries.'}
        </p>
      </header>

      <section className="grid gap-6">
        {posts.length === 0 ? (
          <p className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
            {isZh ? '暂无文章，敬请期待。' : 'No posts yet. Please check back soon.'}
          </p>
        ) : (
          posts.map((post) => (
            <article
              key={post.slug}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
            >
              <div className="mb-3 text-sm text-slate-500">
                <time dateTime={post.date}>{post.date}</time>
              </div>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">
                <I18nLink
                  href={{ pathname: '/blog/[slug]', params: { slug: post.slug } }}
                  className="transition hover:text-emerald-700"
                >
                  {post.title}
                </I18nLink>
              </h2>
              <p className="mb-4 text-slate-600">{post.excerpt}</p>
              <I18nLink
                href={{ pathname: '/blog/[slug]', params: { slug: post.slug } }}
                className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
              >
                {isZh ? '阅读全文 →' : 'Read full analysis →'}
              </I18nLink>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
