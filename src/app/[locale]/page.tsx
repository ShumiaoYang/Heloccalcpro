import PageShell from '@/components/layout/page-shell';
import {
  BlogSection,
  ExamplesSection,
  FeaturesSection,
  FooterSection,
  HeroSection,
  LinksSection,
  RoadmapSection,
  ToolSection,
} from '@/components/home/sections';
import { getSiteContent } from '@/lib/content';
import { getNavigation } from '@/lib/navigation';
import { getSeoMetadata } from '@/lib/seo';
import type { Locale } from '@/i18n/routing';

type PageProps = {
  params: { locale: Locale };
};

export async function generateMetadata({ params }: PageProps) {
  const { metadata } = getSeoMetadata('/', params.locale);
  return metadata;
}

export default function LocaleHomePage({ params }: PageProps) {
  const { locale } = params;
  const content = getSiteContent(locale);
  const navigation = getNavigation(locale);

  return (
    <PageShell
      navigation={navigation}
      siteName={content.site.name}
      loginLabel={content.site.loginCta}
      logoutLabel={content.site.logoutCta}
      loginHref={`/${locale}/auth/login`}
      locale={locale}
    >
      <HeroSection content={content} />
      <ToolSection content={content} />
      <ExamplesSection content={content} />
      <FeaturesSection content={content} />
      <BlogSection content={content} />
      <LinksSection content={content} />
      <RoadmapSection content={content} />
      <FooterSection content={content} />
    </PageShell>
  );
}
