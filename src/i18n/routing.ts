import { createNavigation } from 'next-intl/navigation';
import { Pathnames, LocalePrefix } from 'next-intl/routing';

export const locales = ['en', 'zh'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';
export const localePrefix: LocalePrefix<typeof locales> = 'always';

export const pathnames: Pathnames<typeof locales> = {
  '/': {
    en: '/en',
    zh: '/zh',
  },
};

export const { Link, redirect, usePathname, useRouter } = createNavigation({
  locales,
  defaultLocale,
  localePrefix,
  pathnames,
});
