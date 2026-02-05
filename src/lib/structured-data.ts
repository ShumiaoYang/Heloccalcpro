import type { Locale } from '@/i18n/routing';
import { getSiteContent } from './content';

/**
 * Generate Organization Schema for HELOC Calculator
 */
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'HELOC Calculator',
    url: 'https://heloccalculator.pro',
    logo: 'https://heloccalculator.pro/icon.svg',
    description: 'Free HELOC calculator for credit line & payment estimates. Calculate max borrowing power, simulate credit score impact, and analyze risks with AI',
    sameAs: [
      'https://twitter.com/SaplingYang'
    ]
  };
}

/**
 * Generate WebApplication Schema for HELOC Calculator
 */
export function getWebApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'HELOC Calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    description: 'Free HELOC calculator for credit line & payment estimates. Calculate max borrowing power, simulate credit score impact, and analyze risks with AI',
    url: 'https://heloccalculator.pro',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    softwareVersion: '1.0',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '127',
      bestRating: '5',
      worstRating: '1'
    }
  };
}

/**
 * Generate FAQPage Schema from Common Concerns & Help section
 */
export function getFAQPageSchema(locale: Locale) {
  const content = getSiteContent(locale);
  const faqItems = content.concernsHelp.items
    .filter((item): item is { question: string; answer: string } => 'question' in item)
    .map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }));

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems
  };
}

/**
 * Generate BreadcrumbList Schema for navigation
 */
export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

