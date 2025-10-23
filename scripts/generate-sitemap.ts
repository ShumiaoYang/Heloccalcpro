import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { defaultLocale, locales } from '@/i18n/routing';

const OUTPUT = path.join(process.cwd(), 'public', 'sitemap.xml');
const BASE_ROUTES = ['/'];
const GLOBAL_ROUTES = ['/auth/login'];

const localeAware = new Set(BASE_ROUTES);

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

  return locales.map((locale) => {
    if (locale === defaultLocale) {
      return route;
    }

    if (route === '/') {
      return `/${locale}`;
    }

    return `/${locale}${route}`;
  });
}

function generateSitemap() {
  const origin = normalizeOrigin(process.env.APP_DOMAIN);
  const timestamp = new Date().toISOString();

  const routes = new Set<string>();
  BASE_ROUTES.forEach((route) => localizeRoutes(route).forEach((r) => routes.add(r)));
  GLOBAL_ROUTES.forEach((route) => routes.add(route));

  const urlset = Array.from(routes)
    .map((route) => {
      const loc = buildUrl(origin, route === '/' ? '' : route);
      return [
        '  <url>',
        `    <loc>${loc}</loc>`,
        '    <changefreq>weekly</changefreq>',
        '    <priority>0.8</priority>',
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
  console.info(`✓ sitemap.xml generated with ${routes.size} entries`);
}

generateSitemap();
