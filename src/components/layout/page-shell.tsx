'use client';

import { useMemo, useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { NavigationItem } from '@/lib/navigation';
import { useActiveSection } from '@/lib/hooks/useActiveSection';
import { scrollToAnchor, updateHash } from '@/lib/utils/scroll-to-anchor';
import LanguageSwitcher from '@/components/navigation/language-switcher';
import type { Locale } from '@/i18n/routing';

type PageShellProps = {
  navigation: NavigationItem[];
  siteName: string;
  loginLabel: string;
  logoutLabel: string;
  loginHref: string;
  locale: Locale;
  children: React.ReactNode;
};

export default function PageShell({
  navigation,
  siteName,
  loginLabel,
  logoutLabel,
  loginHref,
  locale,
  children,
}: PageShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useActiveSection(navigation);
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const user = session?.user;
  const userDisplayName = useMemo(() => {
    if (!user) return '';
    return user.name ?? user.email ?? 'Account';
  }, [user]);

  const handleNavigate = (href: string) => {
    scrollToAnchor(href);
    updateHash(href);
    setMobileOpen(false);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: `/${locale}` });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition hover:border-sky-200 hover:text-sky-600 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Logo siteName={siteName} />
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <UserBadge
                name={userDisplayName}
                email={user?.email ?? ''}
                image={user?.image ?? ''}
                onSignOut={handleSignOut}
                logoutLabel={logoutLabel}
              />
            ) : (
              <Link
                href={loginHref}
                className="rounded-lg border border-sky-200 bg-sky-100 px-4 py-2 text-sm font-medium text-sky-700 transition hover:border-sky-300 hover:bg-sky-200"
              >
                {loginLabel}
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden lg:h-[calc(100vh-4rem)]">
        <aside className="hidden w-72 flex-shrink-0 border-r border-slate-200/70 bg-white/70 shadow-lg shadow-sky-100/50 backdrop-blur lg:flex lg:h-[calc(100vh-4rem)] lg:flex-col lg:overflow-y-auto">
          <div className="flex flex-1 flex-col px-6 py-10">
            <nav className="space-y-2 pr-2 text-sm font-medium text-slate-600">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.href)}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-2 text-left transition-colors ${
                    activeSection === item.id ? 'bg-sky-100 text-sky-800 shadow-inner shadow-sky-200' : 'hover:bg-sky-50'
                  }`}
                >
                  <span>#{item.label}</span>
                  {activeSection === item.id && <span className="h-2 w-2 rounded-full bg-sky-500" />}
                </button>
              ))}
            </nav>
            <div className="mt-auto pt-6">
              <FooterCTA
                loginLabel={loginLabel}
                logoutLabel={logoutLabel}
                loginHref={loginHref}
                isAuthenticated={isAuthenticated}
                onSignOut={handleSignOut}
              />
            </div>
          </div>
        </aside>

        <main className="flex flex-1 flex-col overflow-y-auto lg:h-[calc(100vh-4rem)]">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-12 lg:px-10">{children}</div>
        </main>
      </div>

      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navigation={navigation}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        loginLabel={loginLabel}
        logoutLabel={logoutLabel}
        loginHref={loginHref}
        isAuthenticated={isAuthenticated}
        onSignOut={handleSignOut}
      />
    </div>
  );
}

function Logo({ siteName }: { siteName: string }) {
  return (
    <div className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-slate-600">
      <span className="h-2 w-2 rounded-full bg-sky-500 shadow-[0_0_16px_theme(colors.sky.300)]" />
      <span>{siteName}</span>
    </div>
  );
}

function FooterCTA({
  loginLabel,
  logoutLabel,
  loginHref,
  isAuthenticated,
  onSignOut,
}: {
  loginLabel: string;
  logoutLabel: string;
  loginHref: Route;
  isAuthenticated: boolean;
  onSignOut: () => void;
}) {
  return (
    <div className="mt-10 space-y-4 text-sm text-slate-500">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Access</p>
      {isAuthenticated ? (
        <button
          type="button"
          onClick={onSignOut}
          className="flex w-full items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-emerald-700 shadow-sm transition hover:border-emerald-200 hover:text-emerald-800 hover:shadow-md"
        >
          <span>{logoutLabel}</span>
          <span aria-hidden>→</span>
        </button>
      ) : (
        <Link
          href={loginHref}
          className="flex items-center justify-between rounded-xl border border-sky-100 bg-white px-4 py-3 text-slate-700 shadow-sm transition hover:border-sky-200 hover:text-sky-700 hover:shadow-md"
        >
          <span>{loginLabel}</span>
          <span aria-hidden>→</span>
        </Link>
      )}
      <p className="text-xs text-slate-400">
        {isAuthenticated ? '已登录，后续将开放套餐与订阅入口。' : '账号体系正在扩展，欢迎申请早期体验。'}
      </p>
    </div>
  );
}

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
  navigation: NavigationItem[];
  activeSection: string;
  onNavigate: (href: string) => void;
  loginLabel: string;
  logoutLabel: string;
  loginHref: Route;
  isAuthenticated: boolean;
  onSignOut: () => void;
};

function MobileNav({
  open,
  onClose,
  navigation,
  activeSection,
  onNavigate,
  loginLabel,
  logoutLabel,
  loginHref,
  isAuthenticated,
  onSignOut,
}: MobileNavProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-lg lg:hidden">
      <div className="flex items-center justify-between px-4 py-4">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">Menu</span>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 shadow-sm hover:border-sky-200 hover:text-sky-600"
        >
          <X className="h-5 w-5" aria-hidden />
          <span className="sr-only">Close navigation</span>
        </button>
      </div>
      <nav className="space-y-2 px-4">
        {navigation.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.href)}
            className={`w-full rounded-xl px-4 py-3 text-left text-base font-medium ${
              activeSection === item.id ? 'bg-sky-100 text-sky-800' : 'bg-white text-slate-600 shadow-sm'
            }`}
          >
            #{item.label}
          </button>
        ))}
      </nav>
      <div className="mt-6 space-y-3 px-4">
        {isAuthenticated ? (
          <button
            type="button"
            onClick={() => {
              onClose();
              onSignOut();
            }}
            className="block w-full rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-center text-base font-medium text-emerald-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-100"
          >
            {logoutLabel}
          </button>
        ) : (
          <Link
            href={loginHref}
            onClick={onClose}
            className="block rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-center text-base font-medium text-sky-700 shadow-sm hover:border-sky-200 hover:bg-sky-100"
          >
            {loginLabel}
          </Link>
        )}
      </div>
    </div>
  );
}

function UserBadge({
  name,
  email,
  image,
  logoutLabel,
  onSignOut,
}: {
  name: string;
  email: string;
  image: string;
  logoutLabel: string;
  onSignOut: () => void;
}) {
  const initials = (name || email)
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-left shadow-sm">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={name} className="h-8 w-8 rounded-full object-cover" />
      ) : (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500 text-xs font-semibold uppercase text-white">
          {initials || 'AI'}
        </div>
      )}
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-slate-700">{name || email}</span>
        <button
          type="button"
          onClick={onSignOut}
          className="text-left text-[10px] font-medium text-sky-600 hover:underline"
        >
          {logoutLabel}
        </button>
      </div>
    </div>
  );
}
