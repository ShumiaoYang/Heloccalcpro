import Image from 'next/image';
import type { NavigationItem } from '@/lib/navigation';
import type { Locale } from '@/i18n/routing';
import PageShellDesktopNavClient from '@/components/layout/page-shell-desktop-nav.client';
import PageShellHeaderAuthClient from '@/components/layout/page-shell-header-auth.client';
import PageShellMobileNavClient from '@/components/layout/page-shell-mobile-nav.client';

type PageShellProps = {
  navigation: NavigationItem[];
  siteName: string;
  loginLabel: string;
  logoutLabel: string;
  locale: Locale;
  children: React.ReactNode;
};

export default function PageShell({
  navigation,
  siteName,
  loginLabel,
  logoutLabel,
  locale,
  children,
}: PageShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-emerald-200/70 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-full items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <PageShellMobileNavClient
              navigation={navigation}
              loginLabel={loginLabel}
              logoutLabel={logoutLabel}
              locale={locale}
            />
            <Logo siteName={siteName} />
          </div>
          <PageShellHeaderAuthClient
            locale={locale}
            loginLabel={loginLabel}
            logoutLabel={logoutLabel}
          />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden lg:h-[calc(100vh-4rem)]">
        <aside className="hidden w-44 flex-shrink-0 border-r border-emerald-200/70 bg-white/70 shadow-lg shadow-emerald-100/50 backdrop-blur lg:flex lg:h-[calc(100vh-4rem)] lg:flex-col lg:overflow-y-auto">
          <div className="flex flex-1 flex-col px-6 py-10">
            <PageShellDesktopNavClient navigation={navigation} locale={locale} />
          </div>
        </aside>

        <main className="flex flex-1 flex-col overflow-y-auto lg:h-[calc(100vh-4rem)]">
          <div className="mx-auto flex w-full max-w-full flex-col gap-16 px-4 py-6 lg:px-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

function Logo({ siteName }: { siteName: string }) {
  const normalizedName = siteName && siteName.trim().length > 0 ? siteName.trim() : 'HELOC Calculator';
  const [firstWord, ...restWords] = normalizedName.split(' ');
  const restLabel = restWords.join(' ');

  return (
    <div className="flex items-center gap-2">
      <Image
        src="/icon.svg"
        alt={`${normalizedName} logo`}
        className="h-8 w-8"
        width={32}
        height={32}
        priority
      />
      <span className="text-3xl font-bold leading-none">
        <span className="text-[#5B21B6]">{firstWord}</span>
        {restLabel ? <span className="text-slate-600"> {restLabel}</span> : null}
        <span className="text-emerald-600">.pro</span>
      </span>
    </div>
  );
}
