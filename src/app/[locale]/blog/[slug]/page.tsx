import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import type { AnchorHTMLAttributes, HTMLAttributes } from 'react';
import Link from 'next/link';
import { locales, type Locale } from '@/i18n/routing';
import ArchitectNote from '@/components/content/ArchitectNote';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { getSeoMetadata } from '@/lib/seo';

type PageProps = {
  params: { locale: Locale; slug: string };
};

function getBaseUrl(): string {
  const envDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || process.env.APP_DOMAIN;
  const fallback = envDomain && envDomain.length > 0 ? envDomain : 'https://heloccalculator.pro';
  return fallback.endsWith('/') ? fallback.slice(0, -1) : fallback;
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getAllPosts(locale).map((post) => ({
      locale,
      slug: post.slug,
    }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug, params.locale);
  if (!post) {
    return {};
  }

  const { metadata: baseMetadata } = getSeoMetadata(`/blog/${params.slug}`, params.locale);
  const baseUrl = getBaseUrl();
  const canonicalUrl = `${baseUrl}/${params.locale}/blog/${post.slug}`;

  return {
    ...baseMetadata,
    title: `${post.title} | HELOC Insights`,
    description: post.excerpt,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      ...(baseMetadata.openGraph ?? {}),
      type: 'article',
      url: canonicalUrl,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      ...(baseMetadata.twitter ?? {}),
      title: post.title,
      description: post.excerpt,
    },
  };
}

function ReadyToSeeNumbersCta({ locale }: { locale: Locale }) {
  const isZh = locale === 'zh';

  return (
    <div className="mt-12 rounded-2xl border-2 border-emerald-500 bg-gradient-to-br from-emerald-50 to-white p-8 text-center">
      <h3 className="mb-4 text-2xl font-bold text-slate-900">
        {isZh ? '准备好查看你的真实数据了吗？' : 'Ready to See Your Numbers?'}
      </h3>
      <p className="mx-auto mb-6 max-w-2xl text-lg text-slate-700">
        {isZh
          ? '不要把你的房屋净值决策交给黑盒。使用我用银行级算法打造的计算器，只需30秒，无需注册，即可获得你的专属压力测试报告。'
          : "Don't leave your home equity decisions to a black box. Use the calculator I built with bank-grade algorithms. Get your personalized stress test report in 30 seconds-no registration required."}
      </p>
      <a
        href={`/${locale}/#tool`}
        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-emerald-700 hover:shadow-xl"
      >
        {isZh ? '启动免费计算器 🚀' : 'Launch Free Calculator 🚀'}
      </a>
      <p className="mt-4 text-sm text-slate-600">
        {isZh ? '✓ 完全免费  ✓ 无需注册  ✓ 银行级精度' : '✓ Completely Free  ✓ No Registration  ✓ Bank-Grade Precision'}
      </p>
    </div>
  );
}

export default function BlogPostPage({ params }: PageProps) {
  const post = getPostBySlug(params.slug, params.locale);
  if (!post) {
    notFound();
  }

  const { metadata: baseMetadata } = getSeoMetadata(`/blog/${params.slug}`, params.locale);
  const siteName =
    typeof baseMetadata.openGraph === 'object' && baseMetadata.openGraph?.siteName
      ? String(baseMetadata.openGraph.siteName)
      : 'HELOC Calculator';
  const baseUrl = getBaseUrl();
  const canonicalUrl = `${baseUrl}/${params.locale}/blog/${post.slug}`;

  const techArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    '@id': `${canonicalUrl}#techarticle`,
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: params.locale === 'zh' ? 'zh-CN' : 'en-US',
    mainEntityOfPage: canonicalUrl,
    author: {
      '@type': 'Person',
      name: post.author || 'Sapling Yang',
      url: `${baseUrl}/${params.locale}/about`,
      jobTitle: 'Core Banking Architect',
      description:
        'Core Banking System Architect with 20+ years in lending engines, mortgage risk models, and financial stress testing.',
      sameAs: ['https://twitter.com/SaplingYang', 'https://github.com/saplingyang'],
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/icon.svg`,
      },
    },
    about: [
      'Home Equity Line of Credit (HELOC)',
      'Mortgage Stress Testing',
      'Debt-to-Income (DTI) Risk',
      'Cash Flow Risk Management',
    ],
  };

  const mdxComponents = {
    ArchitectNote,
    h1: (props: HTMLAttributes<HTMLHeadingElement>) => (
      <h2 className="mt-10 text-3xl font-semibold tracking-tight text-slate-900" {...props} />
    ),
    h2: (props: HTMLAttributes<HTMLHeadingElement>) => (
      <h2 className="mt-8 text-2xl font-semibold tracking-tight text-slate-900" {...props} />
    ),
    h3: (props: HTMLAttributes<HTMLHeadingElement>) => (
      <h3 className="mt-6 text-xl font-semibold tracking-tight text-slate-900" {...props} />
    ),
    a: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a className="font-medium text-emerald-700 underline decoration-emerald-300 underline-offset-4" {...props} />
    ),
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleSchema) }}
      />

      <nav className="mb-8 flex items-center gap-2 text-sm text-slate-600">
        <Link href={`/${params.locale}`} className="hover:text-emerald-600 transition">
          {params.locale === 'zh' ? '首页' : 'Home'}
        </Link>
        <span>/</span>
        <Link href={`/${params.locale}/blog`} className="hover:text-emerald-600 transition">
          {params.locale === 'zh' ? '博客' : 'Blog'}
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">{post.title}</span>
      </nav>

      <Link
        href={`/${params.locale}`}
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600 transition mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        {params.locale === 'zh' ? '返回主页' : 'Back to Home'}
      </Link>

      <article className="mx-auto max-w-3xl">
        <header className="mb-10 border-b border-slate-200 pb-6">
          <p className="mb-3 text-sm text-slate-500">
            <time dateTime={post.date}>{post.date}</time>
            <span className="mx-2">•</span>
            <span>{post.author}</span>
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">{post.title}</h1>
          <p className="mt-4 text-lg text-slate-600">{post.excerpt}</p>
        </header>

        <div className="prose prose-slate lg:prose-xl mx-auto max-w-none">
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>

        <ReadyToSeeNumbersCta locale={params.locale} />
      </article>
    </main>
  );
}
