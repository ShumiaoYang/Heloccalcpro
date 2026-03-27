import { MetadataRoute } from 'next';
import { locales } from '@/i18n/routing';

const baseUrl = process.env.NEXT_PUBLIC_APP_DOMAIN || 'https://heloccalculator.pro';

// Public pages to include in sitemap
export const routes = [
  { path: '', priority: 1.0, changeFrequency: 'daily' as const },
  { path: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/sample-report', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/smart-ways-to-use-heloc', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/heloc-concerns-and-risks', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/heloc-calculator-features', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/heloc-dti-requirements', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/heloc-effective-blended-rate', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/heloc-payment-shock', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/heloc-rate-increase-risk', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/heloc-cltv-limits', priority: 0.8, changeFrequency: 'weekly' as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routes.flatMap((route) =>
    locales.map((locale) => {
      // Build the alternates language map for this specific route
      const alternatesMap = locales.reduce((acc, altLocale) => {
        acc[altLocale] = `${baseUrl}/${altLocale}${route.path}`;
        return acc;
      }, {} as Record<string, string>);

      // Add the x-default fallback (pointing to English as primary)
      alternatesMap['x-default'] = `${baseUrl}/en${route.path}`;

      return {
        url: `${baseUrl}/${locale}${route.path}`,
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: alternatesMap,
        },
      };
    })
  );
}
