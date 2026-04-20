import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { ReactNode } from 'react';
import { Noto_Sans_SC } from 'next/font/google';
import { Locale, locales } from '@/i18n/routing';

const notoSansSc = Noto_Sans_SC({
  subsets: ['latin'],
  variable: '--font-noto-sans-sc',
  display: 'swap',
  preload: false,
  weight: ['400', '500', '600', '700'],
  fallback: ['system-ui', 'arial'],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: Locale };
}) {
  const { locale } = params;
  setRequestLocale(locale);
  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className={locale === 'zh' ? `${notoSansSc.variable} locale-zh` : undefined}>
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
