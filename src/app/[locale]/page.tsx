import PageShell from '@/components/layout/page-shell';
import {
  HeroSection,
  ConcernsHelpSection,
  FeaturesSection,
  FooterSection,
  SmartWaysSection,
  ToolSection,
} from '@/components/home/sections';
import { getSiteContent } from '@/lib/content';
import { getNavigation } from '@/lib/navigation';
import { getSeoMetadata } from '@/lib/seo';
import {
  getAuthorSchema,
  getOrganizationSchema,
  getWebApplicationSchema,
  getFinancialProductSchema,
  getFAQPageSchema
} from '@/lib/structured-data';
import type { Locale } from '@/i18n/routing';

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

  // Generate structured data schemas
  const authorSchema = getAuthorSchema();
  const organizationSchema = getOrganizationSchema();
  const webAppSchema = getWebApplicationSchema();
  const financialProductSchema = getFinancialProductSchema();
  const faqSchema = getFAQPageSchema(locale);

  return (
    <>
      {/* JSON-LD Structured Data */}
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

      <PageShell
        navigation={navigation}
        siteName={content.site.name}
        loginLabel={content.site.loginCta}
        logoutLabel={content.site.logoutCta}
        locale={locale}
      >
        <HeroSection content={content} locale={locale} />
        <ToolSection content={content} locale={locale} />
        <SmartWaysSection content={content} locale={locale} />
        <ConcernsHelpSection content={content} locale={locale} />
        <FeaturesSection content={content} locale={locale} />
        <FooterSection content={content} locale={locale} />
      </PageShell>
    </>
  );
}
