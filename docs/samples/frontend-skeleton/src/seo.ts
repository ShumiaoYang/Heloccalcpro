export type Lang = 'en' | 'zh';

export async function loadSEOConfig(): Promise<any> {
  try {
    const resp = await fetch('/configs/seo.config.json');
    return await resp.json();
  } catch (e) {
    return { global: { en: {}, zh: {} }, pages: {} };
  }
}

function stripZh(pathname: string): string {
  if (!pathname) return '/';
  if (pathname.startsWith('/zh')) {
    const p = pathname.replace(/^\/zh/, '');
    return p === '' ? '/' : p;
  }
  return pathname;
}

export function resolveSEO(config: any, pathname: string, lang: Lang) {
  const key = stripZh(pathname);
  const pageLang = config?.pages?.[key]?.[lang] || {};
  const globalLang = config?.global?.[lang] || {};
  const globalEn = config?.global?.en || {};
  const pick = (field: string, def: any = '') => pageLang[field] ?? globalLang[field] ?? globalEn[field] ?? def;
  return {
    title: pick('title'),
    description: pick('description'),
    keywords: pick('keywords'),
    h1: pick('h1'),
    h2: pick('h2', []),
    h3: pick('h3', [])
  };
}

export function buildAlternates(origin: string, pathname: string) {
  const enPath = stripZh(pathname);
  const zhPath = pathname.startsWith('/zh') ? pathname : ('/zh' + (pathname === '/' ? '/' : pathname));
  return {
    en: origin + enPath,
    zh: origin + zhPath
  };
}