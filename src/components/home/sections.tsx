import Link from 'next/link';
import ToolCard from '@/components/home/tool-card';
import ToolCatalogCard from '@/components/tools/catalog-card';
import type { SiteContent } from '@/lib/content';
import type { Locale } from '@/i18n/routing';
import { buildLocalizedToolCatalog } from '@/lib/tools/catalog';
import { TOOL_SUMMARIZER_SLUG } from '@/lib/tools/config';

type SectionsProps = {
  content: SiteContent;
};

type ToolSectionProps = SectionsProps & {
  locale: Locale;
};

export function HeroSection({ content }: SectionsProps) {
  const { hero, site } = content;
  return (
    <section id="hero" className="section-spacing">
      <span className="inline-flex rounded-full border border-sky-100 bg-white/90 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 shadow-sm">
        {hero.badge}
      </span>
      <div className="space-y-6">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">{hero.title}</h1>
        <p className="max-w-2xl text-base leading-relaxed text-slate-600">{hero.subtitle}</p>
        <p className="max-w-2xl text-sm text-slate-500">{site.description}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link
          href="#tool"
          className="rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-400"
        >
          {hero.primaryCta}
        </Link>
        <Link
          href="#roadmap"
          className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
        >
          {hero.secondaryCta}
        </Link>
      </div>
    </section>
  );
}

export function ToolSection({ content, locale }: ToolSectionProps) {
  const catalog = buildLocalizedToolCatalog(content.toolCatalog, locale);
  const items = catalog.items;
  const hasItems = items.length > 0;

  return (
    <section id="tool" className="section-spacing">
      <header className="space-y-2">
        <h2 className="section-title">{content.tool.title}</h2>
        <p className="max-w-2xl text-sm text-slate-600">{content.tool.description}</p>
      </header>
      {hasItems ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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
      ) : (
        <div className="mt-6">
          <ToolCard copy={content.tool} locale={locale} slug={TOOL_SUMMARIZER_SLUG} />
        </div>
      )}
      {catalog?.viewAll && hasItems ? (
        <div className="mt-6">
          <Link
            href={`/${locale}/tools`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-sky-600 transition hover:text-sky-500"
          >
            {catalog.viewAll}
            <span aria-hidden>→</span>
          </Link>
        </div>
      ) : null}
    </section>
  );
}

export function ExamplesSection({ content }: SectionsProps) {
  return (
    <section id="examples" className="section-spacing">
      <header className="space-y-2">
        <h2 className="section-title">{content.examples.title}</h2>
        <p className="text-sm text-slate-600">{content.examples.description}</p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        {content.examples.items.map((item) => (
          <div key={item.title} className="surface-card h-full p-5">
            <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function FeaturesSection({ content }: SectionsProps) {
  return (
    <section id="features" className="section-spacing">
      <header className="space-y-2">
        <h2 className="section-title">{content.features.title}</h2>
        <p className="text-sm text-slate-600">{content.features.description}</p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        {content.features.items.map((feature) => (
          <div key={feature.title} className="surface-muted h-full p-5">
            <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function BlogSection({ content }: SectionsProps) {
  return (
    <section id="blog" className="section-spacing">
      <header className="space-y-2">
        <h2 className="section-title">{content.blog.title}</h2>
        <p className="text-sm text-slate-600">{content.blog.description}</p>
      </header>
      <div className="surface-muted p-6 text-sm text-slate-600">
        <p>{content.blog.description}</p>
      </div>
    </section>
  );
}

export function LinksSection({ content }: SectionsProps) {
  return (
    <section id="links" className="section-spacing">
      <header className="space-y-2">
        <h2 className="section-title">{content.links.title}</h2>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {content.links.items.map((item) => {
          const isExternal = item.href.startsWith('http');
          return (
            <a
              key={item.name}
              href={item.href}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noreferrer' : undefined}
              className="surface-card group block p-5"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
                <span className="text-xl text-sky-500 transition group-hover:translate-x-1">→</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{item.description}</p>
            </a>
          );
        })}
      </div>
    </section>
  );
}

export function RoadmapSection({ content }: SectionsProps) {
  return (
    <section id="roadmap" className="section-spacing">
      <header className="space-y-2">
        <h2 className="section-title">{content.roadmap.title}</h2>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        {content.roadmap.phases.map((phase) => (
          <div key={phase.name} className="surface-muted p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-sky-500">{phase.status}</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">{phase.name}</h3>
            <p className="mt-3 text-sm text-slate-600">{phase.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function FooterSection({ content }: SectionsProps) {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-slate-200 pt-6 text-sm text-slate-500">
      <p>{content.footer.tagline}</p>
      <p className="mt-2">{content.footer.copyright.replace('{{year}}', year.toString())}</p>
    </footer>
  );
}
