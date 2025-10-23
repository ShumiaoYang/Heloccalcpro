'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleSwitch = async (nextLocale: 'en' | 'zh') => {
    if (nextLocale === locale) return;

    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    const target = `${pathname}${hash}`;

    await router.replace(target, { locale: nextLocale });
  };

  return (
    <div className="flex items-center overflow-hidden rounded-xl border border-sky-100 bg-white text-xs font-semibold text-slate-600 shadow-sm">
      <button
        type="button"
        onClick={() => handleSwitch('en')}
        className={`px-3 py-2 transition ${
          locale === 'en' ? 'bg-sky-100 text-sky-700' : 'hover:bg-sky-50'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => handleSwitch('zh')}
        className={`px-3 py-2 transition ${
          locale === 'zh' ? 'bg-sky-100 text-sky-700' : 'hover:bg-sky-50'
        }`}
      >
        中文
      </button>
    </div>
  );
}
