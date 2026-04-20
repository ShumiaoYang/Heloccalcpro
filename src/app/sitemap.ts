import { MetadataRoute } from 'next';
import { locales } from '@/i18n/routing';
import { getAllPosts } from '@/lib/posts';

const baseUrl = process.env.NEXT_PUBLIC_APP_DOMAIN || process.env.APP_DOMAIN || 'https://heloccalculator.pro';

// Public pages to include in sitemap
export const routes = [
  { path: '', priority: 1.0, changeFrequency: 'daily' as const },
  { path: '/blog', priority: 0.85, changeFrequency: 'weekly' as const },
  { path: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/sample-report', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/smart-ways-to-use-heloc', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/heloc-concerns-and-risks', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/heloc-calculator-features', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/heloc-dti-requirements', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/heloc-effective-blended-rate', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/heloc-payment-shock', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/heloc-rate-increase-risk', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/blog/Architects-Transparency', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/blog/Hidden-Rules-of-HELOC', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/blog/How-1-to-80', priority: 0.8, changeFrequency: 'weekly' as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

  const staticEntries = routes.flatMap((route) =>
    locales.map((locale) => {
      // Build the alternates language map for this specific route
      const alternatesMap = locales.reduce((acc, altLocale) => {
        acc[altLocale] = `${normalizedBaseUrl}/${altLocale}${route.path}`;
        return acc;
      }, {} as Record<string, string>);

      // Add the x-default fallback (pointing to English as primary)
      alternatesMap['x-default'] = `${normalizedBaseUrl}/en${route.path}`;

      return {
        url: `${normalizedBaseUrl}/${locale}${route.path}`,
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: alternatesMap,
        },
      };
    })
  );

  const postsByLocale = Object.fromEntries(
    locales.map((locale) => [locale, getAllPosts(locale)])
  ) as Record<(typeof locales)[number], ReturnType<typeof getAllPosts>>;

  const slugsByLocale = Object.fromEntries(
    locales.map((locale) => [locale, new Set(postsByLocale[locale].map((post) => post.slug))])
  ) as Record<(typeof locales)[number], Set<string>>;

  const dynamicPostEntries = locales.flatMap((locale) =>
    postsByLocale[locale].map((post) => {
      const alternatesMap = locales.reduce((acc, altLocale) => {
        if (slugsByLocale[altLocale].has(post.slug)) {
          acc[altLocale] = `${normalizedBaseUrl}/${altLocale}/blog/${post.slug}`;
        }
        return acc;
      }, {} as Record<string, string>);

      alternatesMap['x-default'] =
        alternatesMap.en || `${normalizedBaseUrl}/${locale}/blog/${post.slug}`;

      const publishedAt = new Date(post.date);
      const lastModified = Number.isNaN(publishedAt.getTime()) ? now : publishedAt;

      return {
        url: `${normalizedBaseUrl}/${locale}/blog/${post.slug}`,
        lastModified,
        changeFrequency: 'monthly' as const,
        priority: 0.75,
        alternates: {
          languages: alternatesMap,
        },
      };
    })
  );

  return [...staticEntries, ...dynamicPostEntries];
}
