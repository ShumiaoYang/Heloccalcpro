"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

const DEFAULT_HASH = '';

type RouterReplaceArgument = Parameters<ReturnType<typeof useRouter>['replace']>[0];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('site');

  const handleSwitch = async (nextLocale: 'en' | 'zh') => {
    if (nextLocale === locale) return;

   const hash = typeof window !== 'undefined' ? window.location.hash ?? DEFAULT_HASH : DEFAULT_HASH;
   const currentPath = typeof window !== 'undefined' ? window.location.pathname : pathname;

    const pathWithoutLocale = (() => {
      let base = currentPath;
      for (let i = 0; i < 5; i += 1) {
        const updated = base.replace(/^\/(en|zh)(?=\/|$)/, '') || '/';
        if (updated === base || (!updated.startsWith('/en') && !updated.startsWith('/zh'))) {
          return updated;
        }
        base = updated;
      }
      return base;
    })();

    const fallbackSegments = pathWithoutLocale.split('/').filter((segment) => segment.length > 0);
    const initialTarget = `/${[nextLocale, ...fallbackSegments].join('/')}`;

    const existingSegments = currentPath.split('/').filter((segment) => segment.length > 0);
    const isSameLocaleSegment = existingSegments[0] === nextLocale;
    const target = isSameLocaleSegment ? currentPath : `${initialTarget}${hash}`;

    if (process.env.NODE_ENV !== 'production') {
      console.log('[locale-switch]', {
        currentPath,
        pathWithoutLocale,
        fallbackSegments,
        initialTarget,
        existingSegments,
        target,
        nextLocale,
      });
    }

    if (!isSameLocaleSegment) {
      await router.replace(target as RouterReplaceArgument);
    }
  };

  return (
    <div className="flex items-center overflow-hidden rounded-xl border border-sky-100 bg-white text-xs font-semibold text-slate-600 shadow-sm">
      <button
        type="button"
        onClick={() => handleSwitch('en')}
        className={`px-3 py-2 transition ${
          locale === 'en' ? 'bg-sky-100 text-sky-700' : 'hover:bg-sky-50'
        }`}
        aria-label={t('toggleToEnglish')}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => handleSwitch('zh')}
        className={`px-3 py-2 transition ${
          locale === 'zh' ? 'bg-sky-100 text-sky-700' : 'hover:bg-sky-50'
        }`}
        aria-label={t('toggleToChinese')}
      >
        中文
      </button>
    </div>
  );
}
