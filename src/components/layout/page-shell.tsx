'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { NavigationItem } from '@/lib/navigation';
import { useActiveSection } from '@/lib/hooks/useActiveSection';
import { scrollToAnchor, updateHash } from '@/lib/utils/scroll-to-anchor';
import LanguageSwitcher from '@/components/navigation/language-switcher';

type PageShellProps = {
  navigation: NavigationItem[];
  siteName: string;
  loginLabel: string;
  loginHref: string;
  children: React.ReactNode;
};

export default function PageShell({
  navigation,
  siteName,
  loginLabel,
  loginHref,
  children,
}: PageShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useActiveSection(navigation);

  const handleNavigate = (href: string) => {
    scrollToAnchor(href);
    updateHash(href);
    setMobileOpen(false);
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
            <Link
              href={loginHref}
              className="rounded-lg border border-sky-200 bg-sky-100 px-4 py-2 text-sm font-medium text-sky-700 transition hover:border-sky-300 hover:bg-sky-200"
            >
              {loginLabel}
            </Link>
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
              <FooterCTA loginLabel={loginLabel} loginHref={loginHref} />
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
        loginHref={loginHref}
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

function FooterCTA({ loginLabel, loginHref }: { loginLabel: string; loginHref: string }) {
  return (
    <div className="mt-10 space-y-4 text-sm text-slate-500">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Access</p>
      <Link
        href={loginHref}
        className="flex items-center justify-between rounded-xl border border-sky-100 bg-white px-4 py-3 text-slate-700 shadow-sm transition hover:border-sky-200 hover:text-sky-700 hover:shadow-md"
      >
        <span>{loginLabel}</span>
        <span aria-hidden>→</span>
      </Link>
      <p className="text-xs text-slate-400">
        Account services coming soon. Reach out via product board for early access.
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
  loginHref: string;
};

function MobileNav({ open, onClose, navigation, activeSection, onNavigate, loginLabel, loginHref }: MobileNavProps) {
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
        <Link
          href={loginHref}
          onClick={onClose}
          className="block rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-center text-base font-medium text-sky-700 shadow-sm hover:border-sky-200 hover:bg-sky-100"
        >
          {loginLabel}
        </Link>
      </div>
    </div>
  );
}
