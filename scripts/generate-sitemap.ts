import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { defaultLocale, locales } from '@/i18n/routing';

const OUTPUT = path.join(process.cwd(), 'public', 'sitemap.xml');

// Routes with locale prefix (e.g., /en, /zh)
const LOCALE_ROUTES = [
  { path: '/', priority: 1.0, changefreq: 'daily' },
  { path: '/heloc/retrieve', priority: 0.8, changefreq: 'weekly' },
  { path: '/smart-ways-to-use-heloc', priority: 0.9, changefreq: 'weekly' },
  { path: '/heloc-concerns-and-risks', priority: 0.9, changefreq: 'weekly' },
  { path: '/heloc-calculator-features', priority: 0.9, changefreq: 'weekly' },
];

// Routes without locale prefix (global routes) - currently none for public pages
const GLOBAL_ROUTES: Array<{ path: string; priority: number; changefreq: string }> = [];

const localeAware = new Set(LOCALE_ROUTES.map(r => r.path));

function normalizeOrigin(origin?: string) {
  const fallback = 'https://example.com';
  if (!origin) return fallback;
  return origin.endsWith('/') ? origin.slice(0, -1) : origin;
}

function buildUrl(origin: string, route: string) {
  const segment = route.startsWith('/') ? route : `/${route}`;
  return `${origin}${segment}`;
}

function localizeRoutes(route: string): string[] {
  if (!localeAware.has(route)) {
    return [route];
  }

  // Since localePrefix is 'always', all locales need prefix including default
  return locales.map((locale) => {
    if (route === '/') {
      return `/${locale}`;
    }

    return `/${locale}${route}`;
  });
}

function generateSitemap() {
  const origin = normalizeOrigin(process.env.APP_DOMAIN);
  const timestamp = new Date().toISOString();

  const urlEntries: Array<{ loc: string; priority: number; changefreq: string }> = [];

  // Add locale-aware routes
  LOCALE_ROUTES.forEach((route) => {
    localizeRoutes(route.path).forEach((localizedPath) => {
      const loc = buildUrl(origin, localizedPath === '/' ? '' : localizedPath);
      urlEntries.push({
        loc,
        priority: route.priority,
        changefreq: route.changefreq,
      });
    });
  });

  // Add global routes
  GLOBAL_ROUTES.forEach((route) => {
    const loc = buildUrl(origin, route.path);
    urlEntries.push({
      loc,
      priority: route.priority,
      changefreq: route.changefreq,
    });
  });

  const urlset = urlEntries
    .map((entry) => {
      return [
        '  <url>',
        `    <loc>${entry.loc}</loc>`,
        `    <changefreq>${entry.changefreq}</changefreq>`,
        `    <priority>${entry.priority}</priority>`,
        `    <lastmod>${timestamp}</lastmod>`,
        '  </url>',
      ].join('\n');
    })
    .join('\n');

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urlset,
    '</urlset>',
    '',
  ].join('\n');

  mkdirSync(path.dirname(OUTPUT), { recursive: true });
  writeFileSync(OUTPUT, xml);
  console.info(`✓ sitemap.xml generated with ${urlEntries.length} entries`);
}

generateSitemap();
