import type { Metadata } from 'next';
import LoginPageClient from './page.client';
import type { Locale } from '@/i18n/routing';
import { getSeoMetadata } from '@/lib/seo';

type PageProps = {
  params: { locale: Locale };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { metadata } = getSeoMetadata('/auth/login', params.locale);
  return metadata;
}

export default function LoginPage() {
  return <LoginPageClient />;
}
