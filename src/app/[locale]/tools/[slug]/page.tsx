import { notFound } from 'next/navigation';
import ToolCard from '@/components/home/tool-card';
import ToolCatalogCard from '@/components/tools/catalog-card';
import { getSiteContent } from '@/lib/content';
import { getToolConfigBySlug, getToolConfigs, TOOL_SUMMARIZER_SLUG } from '@/lib/tools/config';
import { getSeoMetadata } from '@/lib/seo';
import type { Locale } from '@/i18n/routing';
import { locales } from '@/i18n/routing';
import { findLocalizedTool, type LocalizedToolCatalogItem } from '@/lib/tools/catalog';

type PageProps = {
  params: { locale: Locale; slug: string };
};

export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    getToolConfigs().map((tool) => ({
      locale,
      slug: tool.slug,
    })),
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { metadata } = getSeoMetadata(`/tools/${params.slug}`, params.locale);
  return metadata;
}

export default function ToolDetailPage({ params }: PageProps) {
  const { locale, slug } = params;
  const toolConfig = getToolConfigBySlug(slug);
  const content = getSiteContent(locale);
  const catalogItem = findLocalizedTool(content.toolCatalog, locale, slug);

  if (!toolConfig || !catalogItem) {
    notFound();
  }

  const isSummarizer = slug === TOOL_SUMMARIZER_SLUG;
  const isComingSoon = catalogItem.status !== 'live' || catalogItem.disabled;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 lg:px-10">
      <div className="space-y-3">
        {catalogItem.tag ? (
          <span className="inline-flex rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-sky-600">
            {catalogItem.tag}
          </span>
        ) : null}
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          {catalogItem.title}
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-600">{catalogItem.description}</p>
      </div>

      <div className="mt-10">
        {isSummarizer ? (
          <ToolCard copy={content.tool} locale={locale} slug={catalogItem.slug} />
        ) : isComingSoon ? (
          <ComingSoonCard item={catalogItem} />
        ) : (
          <ToolCatalogCard item={catalogItem} locale={locale} />
        )}
      </div>
    </div>
  );
}

function ComingSoonCard({ item }: { item: LocalizedToolCatalogItem }) {
  return (
    <div className="surface-card flex flex-col gap-6 p-6">
      <p className="text-sm text-slate-600">
        {item.cta}，该工具的后端推理管线尚未接入。你可以在 `config/tools.config.json` 中配置 provider 与模型，或继承 API 逻辑快速扩展。
      </p>
      <p className="text-xs text-slate-400">
        提示：完成对接后，记得更新文案和 SEO 配置（`config/seo.config.json`）以反映上线状态。
      </p>
    </div>
  );
}
