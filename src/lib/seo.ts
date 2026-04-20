import type { Metadata } from 'next';
import seoConfig from '../../config/seo.config.json';
import { Locale, locales, defaultLocale } from '@/i18n/routing';

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

function normalizePath(pathname: string): string {
  let path = pathname?.trim() || '/';
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }

  for (const locale of locales) {
    if (path === `/${locale}`) {
      path = '/';
      break;
    }
    if (path.startsWith(`/${locale}/`)) {
      path = path.slice(locale.length + 1);
      break;
    }
  }

  if (path.length > 1 && path.endsWith('/')) {
    path = path.slice(0, -1);
  }
  return path || '/';
}

function localizePath(pathname: string, locale: Locale): string {
  const normalizedPath = normalizePath(pathname);
  if (locale === defaultLocale) {
    return normalizedPath;
  }
  return normalizedPath === '/' ? `/${locale}` : `/${locale}${normalizedPath}`;
}

function buildAlternatesLanguages(pathname: string, origin: string): HrefLangMap {
  const mapped = locales.reduce<HrefLangMap>((acc, locale) => {
    acc[locale] = `${origin}${localizePath(pathname, locale)}`;
    return acc;
  }, {});

  mapped['x-default'] = mapped[defaultLocale];
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

function constructMetadata(entry: SeoEntry, locale: Locale, pathname: string, origin: string): Metadata {
  const languages = buildAlternatesLanguages(pathname, origin);
  const canonical = languages[locale];

  return {
    title: entry.title,
    description: entry.description,
    alternates: {
      canonical,
      languages,
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
  const normalizedPath = normalizePath(pathname);
  const entry = resolveEntry(normalizedPath, locale);
  const metadata = constructMetadata(entry, locale, normalizedPath, origin);

  return {
    metadata,
    heading: entry.heading,
  };
}
