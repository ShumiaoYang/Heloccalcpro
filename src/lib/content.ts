import en from '../../content/en.json';
import zh from '../../content/zh.json';
import { Locale } from '@/i18n/routing';

export type SiteContent = typeof en;

const contentMap: Record<Locale, SiteContent> = {
  en,
  zh,
};

export function getSiteContent(locale: Locale): SiteContent {
  return contentMap[locale] ?? contentMap.en;
}
