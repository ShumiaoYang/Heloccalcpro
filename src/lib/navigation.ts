import navEn from '../../content/navigation.en.json';
import navZh from '../../content/navigation.zh.json';
import { Locale } from '@/i18n/routing';

export type NavigationItem = {
  id: string;
  href: string;
  label: string;
  subtitle?: string;
};

const navigationMap: Record<Locale, NavigationItem[]> = {
  en: navEn,
  zh: navZh,
};

export function getNavigation(locale: Locale): NavigationItem[] {
  return navigationMap[locale] ?? navigationMap.en;
}
