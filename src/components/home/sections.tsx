import Link from 'next/link';
import HelocTabbedCalculator from '@/components/calculator/heloc-tabbed-calculator';
import type { SiteContent } from '@/lib/content';
import type { Locale } from '@/i18n/routing';

type SectionsProps = {
  content: SiteContent;
  locale: Locale;
};

type ToolSectionProps = SectionsProps;

export function HeroSection({ content, locale }: SectionsProps) {
  const { hero, site } = content;
  return (
    <section id="hero" className="section-spacing">
      <span className="inline-flex rounded-full border border-emerald-100 bg-white/90 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 shadow-sm">
        {hero.badge}
      </span>
      <div className="space-y-6">
        <h1 className="text-4xl font-semibold tracking-tight text-primary-900 sm:text-5xl">{hero.title}</h1>
        <p className="max-w-4xl text-base leading-relaxed text-slate-600">{hero.subtitle}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link
          href="#tool"
          className="rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600"
        >
          {hero.primaryCta}
        </Link>
        <Link
          href="#features"
          className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700"
        >
          {hero.secondaryCta}
        </Link>
      </div>
    </section>
  );
}

export function ToolSection({ content, locale }: ToolSectionProps) {
  return (
    <section id="tool" className="section-spacing">
      <HelocTabbedCalculator />
    </section>
  );
}


export function FeaturesSection({ content, locale }: SectionsProps) {
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
      <div className="mt-8 text-center">
        <Link
          href={`/${locale}/heloc-calculator-features`}
          className="inline-flex items-center gap-2 rounded-full border-2 border-emerald-600 bg-white px-6 py-3 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50"
        >
          {content.site.name === 'HELOC Calculator' ? 'Read Full Guide' : '阅读完整指南'}
          <span className="text-lg">→</span>
        </Link>
      </div>
    </section>
  );
}



export function SmartWaysSection({ content, locale }: SectionsProps) {
  return (
    <section id="smart-ways" className="section-spacing">
      <header className="space-y-2">
        <h2 className="section-title">{content.smartWays.title}</h2>
        <p className="text-sm text-slate-600">{content.smartWays.description}</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {content.smartWays.items.map((item, index) => (
          <div key={index} className="surface-card p-5">
            <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{item.description}</p>
            {item.date && (
              <p className="mt-3 text-xs text-slate-500">{item.date}</p>
            )}
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link
          href={`/${locale}/smart-ways-to-use-heloc`}
          className="inline-flex items-center gap-2 rounded-full border-2 border-emerald-600 bg-white px-6 py-3 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50"
        >
          {content.site.name === 'HELOC Calculator' ? 'Read Full Guide' : '阅读完整指南'}
          <span className="text-lg">→</span>
        </Link>
      </div>
    </section>
  );
}

export function ConcernsHelpSection({ content, locale }: SectionsProps) {
  return (
    <section id="concerns-help" className="section-spacing">
      <header className="space-y-2">
        <h2 className="section-title">{content.concernsHelp.title}</h2>
        <p className="text-sm text-slate-600">{content.concernsHelp.description}</p>
      </header>
      <div className="space-y-4">
        {content.concernsHelp.items.map((item, index) => {
          if ('question' in item) {
            return (
              <details key={index} className="surface-card group p-5">
                <summary className="cursor-pointer text-base font-semibold text-slate-900 list-none flex items-center justify-between">
                  {item.question}
                  <span className="text-emerald-600 transition-transform group-open:rotate-180">▼</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.answer}</p>
              </details>
            );
          } else {
            const isExternal = item.href.startsWith('http');
            return (
              <a
                key={index}
                href={item.href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noreferrer' : undefined}
                className="surface-card group block p-5"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
                  <span className="text-emerald-600 transition group-hover:translate-x-1">▶</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{item.description}</p>
              </a>
            );
          }
        })}
      </div>
      <div className="mt-8 text-center">
        <Link
          href={`/${locale}/heloc-concerns-and-risks`}
          className="inline-flex items-center gap-2 rounded-full border-2 border-emerald-600 bg-white px-6 py-3 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50"
        >
          {content.site.name === 'HELOC Calculator' ? 'Read Full Guide' : '阅读完整指南'}
          <span className="text-lg">→</span>
        </Link>
      </div>
    </section>
  );
}

export function FooterSection({ content }: SectionsProps) {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-emerald-200 bg-primary-900 text-white pt-8 pb-6 px-6 -mx-6">
      <div className="max-w-4xl mx-auto space-y-4">
        <p className="text-base font-medium">{content.footer.tagline}</p>
        <p className="text-sm text-emerald-100">{content.footer.copyright.replace('{{year}}', year.toString())}</p>
        {content.footer.disclaimer && (
          <p className="text-xs text-emerald-200 leading-relaxed border-t border-emerald-800 pt-4">
            {content.footer.disclaimer}
          </p>
        )}
      </div>
    </footer>
  );
}
