import { notFound } from 'next/navigation';
import ToolCard from '@/components/home/tool-card';
import ToolCatalogCard from '@/components/tools/catalog-card';
import { getSiteContent } from '@/lib/content';
import { getSeoMetadata } from '@/lib/seo';
import type { Locale } from '@/i18n/routing';
import { buildLocalizedToolCatalog } from '@/lib/tools/catalog';
import { TOOL_SUMMARIZER_SLUG } from '@/lib/tools/config';

type PageProps = {
  params: { locale: Locale };
};

export async function generateMetadata({ params }: PageProps) {
  const { metadata } = getSeoMetadata('/tools', params.locale);
  return metadata;
}

export default function ToolsCatalogPage({ params }: PageProps) {
  const { locale } = params;
  const content = getSiteContent(locale);
  const catalog = buildLocalizedToolCatalog(content.toolCatalog, locale);

  if (!catalog) {
    notFound();
  }

  const items = catalog.items ?? [];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 lg:px-10">
      <div className="space-y-3">
        <span className="inline-flex rounded-full border border-sky-100 bg-sky-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">
          {catalog.title}
        </span>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{catalog.title}</h1>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600">{catalog.description}</p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          if (item.slug === TOOL_SUMMARIZER_SLUG) {
            return (
              <div key={item.slug} className="md:col-span-2 xl:col-span-2">
                {item.disabled ? (
                  <ToolCatalogCard item={item} locale={locale} />
                ) : (
                  <ToolCard copy={content.tool} locale={locale} slug={item.slug} />
                )}
              </div>
            );
          }

          return <ToolCatalogCard key={item.slug} item={item} locale={locale} />;
        })}
      </div>
    </div>
  );
}
