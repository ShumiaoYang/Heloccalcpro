import type { Locale } from '@/i18n/routing';
import { getSiteContent } from './content';

const BASE_URL = process.env.NEXT_PUBLIC_APP_DOMAIN || 'https://heloccalculator.pro';

/**
 * Generate Person Schema for author entity (E-E-A-T)
 */
export function getAuthorSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${BASE_URL}/#author`,
    name: 'Sapling Yang',
    jobTitle: 'Core Banking System Architect and PMP',
    description: '20+ years of experience in Core Banking Systems, specializing in lending risk engines and financial modeling.',
    sameAs: [
      'https://twitter.com/SaplingYang',
      'https://github.com/saplingyang'
    ]
  };
}

/**
 * Generate Organization Schema for HELOC Calculator
 */
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: 'HELOC Calculator',
    url: BASE_URL,
    logo: `${BASE_URL}/icon.svg`,
    description: 'Professional HELOC calculator providing bank-grade credit line, payment shock, and LTV estimates.',
    founder: { '@id': `${BASE_URL}/#author` },
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
    '@id': `${BASE_URL}/#calculator`,
    name: 'HELOC Payment & Risk Calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    url: BASE_URL,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    description: 'Free HELOC calculator for credit line & payment estimates. Calculate max borrowing power, simulate credit score impact, and analyze risks with AI.',
    author: { '@id': `${BASE_URL}/#author` },
    featureList: [
      'Calculates Jumbo HELOC limits for property values up to $5,000,000',
      'Strict alignment with FICO 300-850 credit scoring models',
      'Bank-grade risk engine simulating 43%-50% Debt-to-Income (DTI) stress testing'
    ]
  };
}

/**
 * Generate FinancialProduct Schema for HELOC
 */
export function getFinancialProductSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    '@id': `${BASE_URL}/#heloc-product`,
    name: 'Home Equity Line of Credit (HELOC) Analysis',
    description: 'Bank-grade analysis tool for US Home Equity Lines of Credit, featuring DTI stress testing and Payment Shock calculations.',
    brand: { '@id': `${BASE_URL}/#organization` },
    audience: {
      '@type': 'Audience',
      audienceType: 'US Middle-class homeowners'
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

