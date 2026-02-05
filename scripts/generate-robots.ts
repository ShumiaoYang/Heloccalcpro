import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const OUTPUT = path.join(process.cwd(), 'public', 'robots.txt');

function normalizeOrigin(origin?: string) {
  const fallback = 'https://example.com';
  if (!origin) return fallback;
  return origin.endsWith('/') ? origin.slice(0, -1) : origin;
}

function generateRobots() {
  const origin = normalizeOrigin(process.env.APP_DOMAIN);
  const content = [
    'User-agent: *',
    'Allow: /',
    '',
    '# Disallow private pages',
    'Disallow: /api/',
    'Disallow: /_next/',
    'Disallow: /*/auth/',
    'Disallow: /*/account/',
    'Disallow: /*/heloc/payment/',
    '',
    `Sitemap: ${origin}/sitemap.xml`,
    '',
  ].join('\n');

  mkdirSync(path.dirname(OUTPUT), { recursive: true });
  writeFileSync(OUTPUT, content, 'utf8');
  console.info('✓ robots.txt generated');
}

generateRobots();
