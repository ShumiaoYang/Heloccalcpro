import Link from 'next/link';
import type { Locale } from '@/i18n/routing';
import type { LocalizedToolCatalogItem } from '@/lib/tools/catalog';

type ToolCatalogCardProps = {
  item: LocalizedToolCatalogItem;
  locale: Locale;
};

export default function ToolCatalogCard({ item, locale }: ToolCatalogCardProps) {
  const isDisabled = item.disabled;
  const href = `/${locale}/tools/${item.slug}`;

  return (
    <div className="surface-card flex h-full flex-col justify-between gap-5 p-6">
      <div className="space-y-3">
        {item.tag ? (
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] ${
              isDisabled ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
            }`}
          >
            {item.tag}
          </span>
        ) : null}
        <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
        <p className="text-sm leading-relaxed text-slate-600">{item.description}</p>
      </div>
      <div>
        {isDisabled ? (
          <span className="inline-flex cursor-not-allowed items-center gap-1 text-sm font-semibold text-slate-400">
            {item.cta}
          </span>
        ) : (
          <Link
            href={href}
            className="inline-flex items-center gap-1 text-sm font-semibold text-sky-600 transition hover:text-sky-500"
          >
            {item.cta}
            <span aria-hidden>→</span>
          </Link>
        )}
      </div>
    </div>
  );
}
