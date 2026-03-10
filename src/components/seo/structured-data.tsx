/**
 * Structured Data (Schema.org JSON-LD) Component
 * 为Google Rich Results提供结构化数据
 */

interface StructuredDataProps {
  type?: 'website' | 'calculator' | 'article' | 'faq';
  title?: string;
  description?: string;
  url?: string;
}

export function StructuredData({
  type = 'website',
  title,
  description,
  url
}: StructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_DOMAIN || 'https://heloccalculator.pro';

  // Organization Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'HELOC Calculator',
    url: baseUrl,
    logo: `${baseUrl}/icon.svg`,
    description: 'Professional HELOC Calculator for smart home equity decisions',
    sameAs: [
      // 添加社交媒体链接（如果有）
    ],
  };

  // Website Schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'HELOC Calculator',
    url: baseUrl,
    description: description || 'Calculate your Home Equity Line of Credit with real-time results, risk scoring, and stress testing.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/en/heloc?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  // WebApplication Schema (for calculator)
  const webApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: title || 'HELOC Calculator',
    url: url || `${baseUrl}/en/heloc`,
    description: description || 'Free HELOC calculator with AI-powered analysis, risk scoring, and personalized recommendations.',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Real-time HELOC calculations',
      'Risk score analysis',
      'Debt consolidation scenarios',
      'Home renovation planning',
      'AI-powered recommendations',
    ],
  };

  // FinancialProduct Schema
  const financialProductSchema = {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    name: 'Home Equity Line of Credit (HELOC)',
    description: 'A revolving line of credit secured by your home equity',
    provider: {
      '@type': 'Organization',
      name: 'HELOC Calculator',
    },
    feesAndCommissionsSpecification: 'Varies by lender',
    interestRate: {
      '@type': 'QuantitativeValue',
      value: 'Variable',
      description: 'Prime Rate + Margin',
    },
  };

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'HELOC Calculator',
        item: `${baseUrl}/en/heloc`,
      },
    ],
  };

  // 根据页面类型选择合适的schema
  const schemas: any[] = [organizationSchema, websiteSchema, breadcrumbSchema];

  if (type === 'calculator') {
    schemas.push(webApplicationSchema, financialProductSchema);
  }

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}

/**
 * FAQ Schema Component
 */
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  items: FAQItem[];
}

export function FAQSchema({ items }: FAQSchemaProps) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  );
}

/**
 * Article Schema Component
 */
interface ArticleSchemaProps {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  image?: string;
}

export function ArticleSchema({
  title,
  description,
  datePublished,
  dateModified,
  author = 'Sapling Yang',
  image,
}: ArticleSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_DOMAIN || 'https://heloccalculator.pro';

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: image || `${baseUrl}/og-image.png`,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: author,
      jobTitle: 'Core Banking System Architect and PMP',
      sameAs: [
        'https://twitter.com/SaplingYang',
        'https://github.com/saplingyang'
      ]
    },
    publisher: {
      '@type': 'Organization',
      name: 'HELOC Calculator',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/icon.svg`,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
    />
  );
}
