import type { Metadata } from 'next';
import seoConfig from '../../config/seo.config.json';
import { Locale } from '@/i18n/routing';

type HrefLangMap = Record<string, string>;

type OpenGraphEntry = {
  title?: string;
  description?: string;
  [key: string]: unknown;
};

type TwitterEntry = {
  title?: string;
  description?: string;
  [key: string]: unknown;
};

type SeoEntry = {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  hreflang?: HrefLangMap;
  openGraph?: OpenGraphEntry;
  twitter?: TwitterEntry;
  heading?: string;
  noindex?: boolean;
};

type PageConfig = Record<string, Partial<Record<Locale, SeoEntry>>>;

type SeoConfig = {
  global: Record<Locale, SeoEntry>;
  pages: PageConfig;
};

const config = seoConfig as SeoConfig;

const DEFAULT_DOMAIN = 'https://heloccalculator.pro';
let hasWarnedMissingAppDomain = false;

function normalizeOrigin(origin: string | undefined) {
  const base = origin && origin.length > 0 ? origin : DEFAULT_DOMAIN;
  return base.endsWith('/') ? base.slice(0, -1) : base;
}

function withOrigin(pathOrUrl: string | undefined, origin: string): string | undefined {
  if (!pathOrUrl) {
    return undefined;
  }

  try {
    const url = new URL(pathOrUrl);
    return url.toString();
  } catch {
    const normalized = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
    return `${origin}${normalized}`;
  }
}

function mapLanguages(hreflang: HrefLangMap | undefined, origin: string): HrefLangMap | undefined {
  if (!hreflang) {
    return undefined;
  }
  const mapped = Object.entries(hreflang).reduce<HrefLangMap>((acc, [lang, link]) => {
    const updated = withOrigin(link, origin);
    if (updated) {
      acc[lang] = updated;
    }
    return acc;
  }, {});

  // Add x-default pointing to English version
  if (mapped['en']) {
    mapped['x-default'] = mapped['en'];
  }

  return mapped;
}

function resolveEntry(pathname: string, locale: Locale): SeoEntry {
  const globalEntry = config.global[locale] ?? {};
  const pageEntry = config.pages[pathname]?.[locale] ?? {};

  return {
    ...globalEntry,
    ...pageEntry,
    openGraph: {
      ...globalEntry.openGraph,
      ...pageEntry.openGraph,
    },
    twitter: {
      ...globalEntry.twitter,
      ...pageEntry.twitter,
    },
  };
}

export function getSeoMetadata(pathname: string, locale: Locale): { metadata: Metadata; heading?: string } {
  const envDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || process.env.APP_DOMAIN;
  if (process.env.NODE_ENV === 'development' && !envDomain && !hasWarnedMissingAppDomain) {
    console.warn(
      '[SEO] Missing NEXT_PUBLIC_APP_DOMAIN and APP_DOMAIN. Falling back to default domain for metadata canonical URLs.'
    );
    hasWarnedMissingAppDomain = true;
  }
  const origin = normalizeOrigin(envDomain);
  const entry = resolveEntry(pathname, locale);

  // Build the actual URL path with locale prefix (since localePrefix is 'always')
  const localizedPath = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;

  // Use entry.canonical if it's explicitly set, otherwise use the localized path
  const canonicalPath = entry.canonical || localizedPath;
  const canonical = withOrigin(canonicalPath, origin);
  const hreflang = mapLanguages(entry.hreflang, origin);

  const metadata: Metadata = {
    title: entry.title,
    description: entry.description,
    keywords: entry.keywords,
    alternates: {
      canonical,
      languages: hreflang,
    },
    openGraph: entry.openGraph
      ? {
          ...entry.openGraph,
          url: canonical,
          title: entry.openGraph?.title ?? entry.title,
          description: entry.openGraph?.description ?? entry.description,
        }
      : undefined,
    twitter: entry.twitter
      ? {
          ...entry.twitter,
          title: entry.twitter?.title ?? entry.title,
          description: entry.twitter?.description ?? entry.description,
        }
      : undefined,
    robots: entry.noindex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
  };

  return {
    metadata,
    heading: entry.heading,
  };
}
