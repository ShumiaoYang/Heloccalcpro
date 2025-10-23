import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { defaultLocale, Locale, locales } from './routing';

export default getRequestConfig(async ({ locale }) => {
  const candidateLocale = locale ?? defaultLocale;

  if (!locales.includes(candidateLocale as Locale)) {
    notFound();
  }

  const resolvedLocale = candidateLocale as Locale;

  if (process.env.NODE_ENV !== 'production') {
    console.log('[i18n] request locale', locale ?? '(fallback)', '->', resolvedLocale);
  }

  return {
    locale: resolvedLocale,
    messages: (await import(`../../content/${resolvedLocale}.json`)).default,
  };
});
