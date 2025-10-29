import type { SiteContent } from '@/lib/content';
import type { Locale } from '@/i18n/routing';
import { getToolConfigs, type ToolConfig, type ToolStatus } from './config';

type ToolCatalogCopy = SiteContent['toolCatalog'];

export type LocalizedToolCatalogItem = {
  slug: string;
  title: string;
  description: string;
  tag?: string;
  cta: string;
  status: ToolStatus;
  disabled: boolean;
  config: ToolConfig;
  ctaDescription?: string;
};

export type LocalizedToolCatalog = {
  title: string;
  description?: string;
  viewAll?: string;
  items: LocalizedToolCatalogItem[];
};

export function buildLocalizedToolCatalog(
  catalog: ToolCatalogCopy | undefined,
  locale: Locale,
): LocalizedToolCatalog {
  const configs = getToolConfigs();
  const localizedItems = catalog?.items ?? [];
  const configMap = new Map(configs.map((tool) => [tool.slug, tool]));

  const items = localizedItems
    .map((item) => {
      const config = configMap.get(item.slug);
      if (!config) {
        return null;
      }

      const ctaCopy = config.cta?.[locale];
      const status = config.status;
      const disabled = status !== 'live' || Boolean(ctaCopy?.disabled);

      return {
        slug: config.slug,
        title: item.title,
        description: item.description ?? ctaCopy?.description ?? '',
        tag: item.tag ?? ctaCopy?.tag,
        cta: item.cta ?? ctaCopy?.label ?? '',
        status,
        disabled,
        config,
        ctaDescription: ctaCopy?.description,
      };
    })
    .filter((entry): entry is LocalizedToolCatalogItem => entry !== null);

  return {
    title: catalog?.title ?? '',
    description: catalog?.description,
    viewAll: catalog?.viewAll,
    items,
  };
}

export function findLocalizedTool(
  catalog: ToolCatalogCopy | undefined,
  locale: Locale,
  slug: string,
): LocalizedToolCatalogItem | undefined {
  const localizedCatalog = buildLocalizedToolCatalog(catalog, locale);
  return localizedCatalog.items.find((item) => item.slug === slug);
}
