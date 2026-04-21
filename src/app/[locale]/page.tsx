import PageShell from '@/components/layout/page-shell';
import dynamic from 'next/dynamic';
import { GeoBaselineData } from '@/components/seo/geo-baseline-data';
import {
  HeroSection,
  ToolSection,
} from '@/components/home/sections';

const SmartWaysSection = dynamic(
  () => import('@/components/home/sections').then(mod => ({ default: mod.SmartWaysSection })),
  { loading: () => <div className="min-h-[500px] w-full" /> }
);

const ConcernsHelpSection = dynamic(
  () => import('@/components/home/sections').then(mod => ({ default: mod.ConcernsHelpSection })),
  { loading: () => <div className="min-h-[600px] w-full" /> }
);

const FeaturesSection = dynamic(
  () => import('@/components/home/sections').then(mod => ({ default: mod.FeaturesSection })),
  { loading: () => <div className="min-h-[400px] w-full" /> }
);

const FooterSection = dynamic(
  () => import('@/components/home/sections').then(mod => ({ default: mod.FooterSection })),
  { loading: () => <div className="min-h-[300px] w-full" /> }
);
import { getSiteContent } from '@/lib/content';
import { getNavigation } from '@/lib/navigation';
import { getSeoMetadata } from '@/lib/seo';
import { FALLBACK_PRIME_RATE, getBaseMargin } from '@/lib/heloc/rate-service';
import {
  getAuthorSchema,
  getOrganizationSchema,
  getWebApplicationSchema,
  getFinancialProductSchema,
  getFAQPageSchema
} from '@/lib/structured-data';
import type { Locale } from '@/i18n/routing';

export const revalidate = 3600; // Revalidate every hour

type PageProps = {
  params: { locale: Locale };
};

export async function generateMetadata({ params }: PageProps) {
  const { metadata } = getSeoMetadata('/', params.locale);
  return metadata;
}

export default async function LocaleHomePage({ params }: PageProps) {
  const { locale } = params;
  const content = getSiteContent(locale);
  const navigation = getNavigation(locale);
  const baseMargin = getBaseMargin();

  // Generate structured data schemas
  const authorSchema = getAuthorSchema();
  const organizationSchema = getOrganizationSchema();
  const webAppSchema = getWebApplicationSchema();
  const financialProductSchema = getFinancialProductSchema();
  const faqSchema = getFAQPageSchema(locale);

  return (
    <>
      <PageShell
        navigation={navigation}
        siteName={content.site.name}
        loginLabel={content.site.loginCta}
        logoutLabel={content.site.logoutCta}
        locale={locale}
      >
        <HeroSection content={content} fallbackPrimeRate={FALLBACK_PRIME_RATE} />
        <ToolSection
          fallbackPrimeRate={FALLBACK_PRIME_RATE}
          baseMargin={baseMargin}
        />
        <SmartWaysSection content={content} locale={locale} />
        <ConcernsHelpSection content={content} locale={locale} />
        <FeaturesSection content={content} locale={locale} />
        <GeoBaselineData />
        <FooterSection content={content} locale={locale} />
      </PageShell>

      {/* JSON-LD Structured Data (after main content to reduce first-screen parse pressure) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(authorSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(financialProductSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
