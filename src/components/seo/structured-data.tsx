import type { Locale } from '@/i18n/routing';
import { getSiteContent } from '@/lib/content';

/**
 * Single Source of Truth for JSON-LD schema generation.
 * lib/structured-data.ts re-exports these builders for non-React callers.
 */

const DEFAULT_BASE_URL = 'https://heloccalculator.pro';
const ORGANIZATION_NAME = 'HELOC Calculator';
const AUTHOR_NAME = 'Sapling Yang';

function normalizeBaseUrl(origin: string | undefined): string {
  const fallback = origin && origin.length > 0 ? origin : DEFAULT_BASE_URL;
  return fallback.endsWith('/') ? fallback.slice(0, -1) : fallback;
}

export function getStructuredDataBaseUrl(): string {
  return normalizeBaseUrl(process.env.NEXT_PUBLIC_APP_DOMAIN || process.env.APP_DOMAIN);
}

export function getAuthorSchema() {
  const baseUrl = getStructuredDataBaseUrl();

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${baseUrl}/#author`,
    name: AUTHOR_NAME,
    jobTitle: 'Core Banking System Architect and PMP',
    description:
      '20+ years of experience in Core Banking Systems, specializing in lending risk engines and financial modeling.',
    sameAs: ['https://twitter.com/SaplingYang', 'https://github.com/saplingyang'],
  };
}

export function getOrganizationSchema() {
  const baseUrl = getStructuredDataBaseUrl();

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: ORGANIZATION_NAME,
    url: baseUrl,
    logo: `${baseUrl}/icon.svg`,
    description: 'Professional HELOC calculator providing bank-grade credit line, payment shock, and LTV estimates.',
    founder: { '@id': `${baseUrl}/#author` },
    sameAs: ['https://twitter.com/SaplingYang'],
  };
}

export function getWebApplicationSchema() {
  const baseUrl = getStructuredDataBaseUrl();

  const webApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${baseUrl}/#calculator`,
    name: 'HELOC Payment & Risk Calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    url: baseUrl,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description:
      'Free HELOC calculator for credit line & payment estimates. Calculate max borrowing power, simulate credit score impact, and analyze risks with AI.',
    author: { '@id': `${baseUrl}/#author` },
    featureList: [
      'Calculates Jumbo HELOC limits for property values up to $5,000,000',
      'Strict alignment with FICO 300-850 credit scoring models',
      'Bank-grade risk engine simulating 43%-50% Debt-to-Income (DTI) stress testing',
    ],
    softwareHelp: {
      '@type': 'CreativeWork',
      url: `${baseUrl}/en/heloc-calculator-features`,
      name: 'Core Banking Algorithm & HELOC Calculation Methodology',
    },
  };

  return webApplicationSchema;
}

export function getFinancialProductSchema() {
  const baseUrl = getStructuredDataBaseUrl();

  return {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    '@id': `${baseUrl}/#heloc-product`,
    name: 'Home Equity Line of Credit (HELOC) Analysis',
    description: 'Bank-grade analysis tool for US Home Equity Lines of Credit, featuring DTI stress testing and Payment Shock calculations.',
    brand: { '@id': `${baseUrl}/#organization` },
    audience: {
      '@type': 'Audience',
      audienceType: 'US Middle-class homeowners',
    },
  };
}

export function getFAQPageSchema(locale: Locale) {
  const content = getSiteContent(locale);
  const faqItems = content.concernsHelp.items
    .filter((item): item is { question: string; answer: string } => 'question' in item)
    .map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    }));

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems,
  };
}

export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

type JsonLdScriptProps = {
  schema: Record<string, unknown>;
};

export function JsonLdScript({ schema }: JsonLdScriptProps) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

type ArticleSchemaProps = {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  image?: string | string[];
  articleSection?: string;
};

export function ArticleSchema({
  headline,
  description,
  url,
  datePublished,
  dateModified,
  image,
  articleSection,
}: ArticleSchemaProps) {
  const baseUrl = getStructuredDataBaseUrl();
  const canonicalImage = image || `${baseUrl}/og-image.png`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    url,
    datePublished,
    dateModified: dateModified ?? datePublished,
    image: canonicalImage,
    author: {
      '@type': 'Person',
      '@id': `${baseUrl}/#author`,
      name: AUTHOR_NAME,
      jobTitle: 'Core Banking System Architect and PMP',
      knowsAbout: [
        'Core Banking Systems',
        'Home Equity Line of Credit (HELOC)',
        'Mortgage Stress Testing',
        'Financial Risk Management',
      ],
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: ORGANIZATION_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/icon.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    articleSection,
  };

  return <JsonLdScript schema={articleSchema} />;
}

