'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import type { NavigationItem } from '@/lib/navigation';
import { useActiveSection } from '@/lib/hooks/useActiveSection';
import { scrollToAnchor, updateHash } from '@/lib/utils/scroll-to-anchor';
import type { Locale } from '@/i18n/routing';

type LoginHref = `/${Locale}/auth/login`;
type AccountHref = `/${Locale}/account/settings`;
type BillingHref = `/${Locale}/account/billing`;

type MobileNavClientProps = {
  navigation: NavigationItem[];
  loginLabel: string;
  logoutLabel: string;
  locale: Locale;
};

export default function PageShellMobileNavClient({
  navigation,
  loginLabel,
  logoutLabel,
  locale,
}: MobileNavClientProps) {
  const [open, setOpen] = useState(false);
  const activeSection = useActiveSection(navigation);
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const accountLabel = locale === 'zh' ? '账号设置' : 'Account settings';
  const billingLabel = locale === 'zh' ? '订阅管理' : 'Manage plan';
  const loginHref = `/${locale}/auth/login` as LoginHref;
  const accountHref = `/${locale}/account/settings` as AccountHref;
  const billingHref = `/${locale}/account/billing` as BillingHref;

  const handleNavigate = (href: string) => {
    if (href.startsWith('#')) {
      scrollToAnchor(href);
      updateHash(href);
    } else {
      window.location.href = `/${locale}${href}`;
    }
    setOpen(false);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: `/${locale}` });
  };

  return (
    <>
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition hover:border-emerald-200 hover:text-emerald-600 lg:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-lg lg:hidden">
          <div className="flex items-center justify-between px-4 py-4">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">Menu</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 shadow-sm hover:border-emerald-200 hover:text-emerald-600"
            >
              <X className="h-5 w-5" aria-hidden />
              <span className="sr-only">Close navigation</span>
            </button>
          </div>
          <nav className="space-y-2 px-4">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.href)}
                className={`w-full rounded-xl px-4 py-3 text-left text-base font-medium ${
                  activeSection === item.id ? 'bg-emerald-100 text-emerald-800' : 'bg-white text-slate-600 shadow-sm'
                }`}
              >
                {item.label}
              </button>
            ))}
            <Link
              href={`/${locale}/heloc/retrieve`}
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-base font-medium text-emerald-700 shadow-sm hover:border-emerald-300 hover:bg-emerald-100"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{locale === 'zh' ? '找回报告' : 'Retrieve Reports'}</span>
            </Link>
          </nav>
          <div className="mt-6 space-y-3 px-4">
            {isAuthenticated ? (
              <>
                <Link
                  href={accountHref}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-base font-medium text-slate-700 shadow-sm hover:border-emerald-200 hover:text-emerald-700"
                >
                  {accountLabel}
                </Link>
                <Link
                  href={billingHref}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-center text-base font-medium text-emerald-700 shadow-sm hover:border-emerald-200 hover:bg-emerald-100"
                >
                  {billingLabel}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    handleSignOut();
                  }}
                  className="block w-full rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-center text-base font-medium text-emerald-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-100"
                >
                  {logoutLabel}
                </button>
              </>
            ) : (
              <Link
                href={loginHref}
                onClick={() => setOpen(false)}
                className="block rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-center text-base font-medium text-emerald-700 shadow-sm hover:border-emerald-200 hover:bg-emerald-100"
              >
                {loginLabel}
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
