import RetrieveForm from '@/components/heloc/retrieve-form';
import { getSeoMetadata } from '@/lib/seo';
import type { Locale } from '@/i18n/routing';

type PageProps = {
  params: { locale: Locale };
};

export async function generateMetadata({ params }: PageProps) {
  const { metadata } = getSeoMetadata('/heloc/retrieve', params.locale);
  return metadata;
}

export default function RetrieveReportPage({ params }: PageProps) {
  return <RetrieveForm />;
}
