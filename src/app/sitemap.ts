import { MetadataRoute } from 'next';
import { locales } from '@/i18n/routing';

const baseUrl = process.env.NEXT_PUBLIC_APP_DOMAIN || 'https://heloccalculator.pro';

// Public pages to include in sitemap
export const routes = [
  { path: '', priority: 1.0, changeFrequency: 'daily' as const }, // Tier 1: 首页 (包含每日更新的 Live Rate)
    
  // --- Tier 2: Pillar Pages & Main Hubs (核心支柱页) ---
  { path: '/heloc-calculator-features', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/smart-ways-to-use-heloc', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/heloc-concerns-and-risks', priority: 0.9, changeFrequency: 'weekly' as const },
    
  // --- Tier 3: E-E-A-T Cluster Pages (深度核保逻辑子页) ---
  { path: '/heloc-dti-requirements', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/heloc-effective-blended-rate', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/heloc-payment-shock', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/heloc-rate-increase-risk', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/heloc-cltv-limits', priority: 0.8, changeFrequency: 'weekly' as const }, // 如果你有这个独立页面的话
    
  // --- Tier 4: Supporting Pages (辅助与转化后页面) ---
  { path: '/sample-report', priority: 0.8, changeFrequency: 'monthly' as const }, // 静态报告样本，不常变
  { path: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routes.flatMap(route =>
    locales.map(locale => ({
      url: `${baseUrl}/${locale}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    }))
  );
}
