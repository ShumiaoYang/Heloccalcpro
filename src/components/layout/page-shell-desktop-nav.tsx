import type { NavigationItem } from '@/lib/navigation';
import type { Locale } from '@/i18n/routing';

type DesktopNavProps = {
  navigation: NavigationItem[];
  locale: Locale;
};

export default function PageShellDesktopNav({ navigation, locale }: DesktopNavProps) {
  return (
    <>
      <nav className="space-y-2 pr-2 text-sm font-medium text-slate-600">
        {navigation.map((item) => {
          const href = item.href.startsWith('#') ? item.href : `/${locale}${item.href}`;

          return (
            <a
              key={item.id}
              href={href}
              className="flex w-full items-center justify-between rounded-xl px-4 py-2 text-left transition-colors hover:bg-emerald-50"
            >
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>
      <div className="mt-auto pt-6">
        <a
          href={`/${locale}/heloc/retrieve`}
          className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span>{locale === 'zh' ? '找回报告' : 'Retrieve Reports'}</span>
        </a>
      </div>
    </>
  );
}
