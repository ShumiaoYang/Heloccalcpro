import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import LoginPageClient from './page.client';
import type { Locale } from '@/i18n/routing';

type PageProps = {
  params: { locale: Locale };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'login' });
  const title = t('meta.title');
  const description = t('meta.description');

  return {
    title,
    description,
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default function LoginPage() {
  return <LoginPageClient />;
}
