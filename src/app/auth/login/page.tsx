import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import { locales, type Locale } from '@/i18n/routing';

type SearchParams = Record<string, string | string[] | undefined>;

export default async function AuthLoginRedirect({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const fallbackLocale = await getLocale();
  const targetLocale = deriveLocaleFromParams(searchParams, fallbackLocale);
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (typeof value === 'string') {
      params.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((entry) => params.append(key, entry));
    }
  });

  const query = params.toString();
  const target = `/${targetLocale}/auth/login${query ? `?${query}` : ''}`;

  redirect(target);
}

function deriveLocaleFromParams(
  searchParams: SearchParams,
  fallbackLocale: Locale,
): Locale {
  const callbackUrl = searchParams.callbackUrl;
  if (typeof callbackUrl === 'string') {
    try {
      const base = process.env.NEXTAUTH_URL ?? 'https://localhost:3000';
      const url = new URL(callbackUrl, base);
      const segment = url.pathname.split('/')[1];
      if (locales.includes(segment as Locale)) {
        return segment as Locale;
      }
    } catch {
      // ignore
    }
  }

  const explicitLocale = searchParams.locale;
  if (typeof explicitLocale === 'string' && locales.includes(explicitLocale as Locale)) {
    return explicitLocale as Locale;
  }

  return fallbackLocale;
}
