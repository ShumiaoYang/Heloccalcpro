'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import type { NavigationItem } from '@/lib/navigation';
import { useActiveSection } from '@/lib/hooks/useActiveSection';
import { scrollToAnchor, updateHash } from '@/lib/utils/scroll-to-anchor';
import type { Locale } from '@/i18n/routing';

type LoginHref = `/${Locale}/auth/login`;
type AccountHref = `/${Locale}/account/settings`;
type BillingHref = `/${Locale}/account/billing`;

type MobileNavDrawerProps = {
  navigation: NavigationItem[];
  loginLabel: string;
  logoutLabel: string;
  locale: Locale;
  onClose: () => void;
};

export default function PageShellMobileNavDrawerClient({
  navigation,
  loginLabel,
  logoutLabel,
  locale,
  onClose,
}: MobileNavDrawerProps) {
  const [mounted, setMounted] = useState(false);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
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
    onClose();
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: `/${locale}` });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !drawerRef.current) return;

      const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (!active || active === first || !drawerRef.current.contains(active)) {
          event.preventDefault();
          last.focus();
        }
        return;
      }

      if (!active || active === last || !drawerRef.current.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [mounted, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      ref={drawerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation menu"
      className="fixed inset-0 z-[80] overflow-y-auto overscroll-contain bg-white/95 backdrop-blur-lg lg:hidden"
    >
      <div className="flex items-center justify-between px-4 py-4">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">Menu</span>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
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
          onClick={onClose}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-base font-medium text-emerald-700 shadow-sm hover:border-emerald-300 hover:bg-emerald-100"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span>{locale === 'zh' ? '找回报告' : 'Retrieve Reports'}</span>
        </Link>
      </nav>
      <div className="mt-6 space-y-3 px-4">
        {isAuthenticated ? (
          <>
            <Link
              href={accountHref}
              onClick={onClose}
              className="block rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-base font-medium text-slate-700 shadow-sm hover:border-emerald-200 hover:text-emerald-700"
            >
              {accountLabel}
            </Link>
            <Link
              href={billingHref}
              onClick={onClose}
              className="block rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-center text-base font-medium text-emerald-700 shadow-sm hover:border-emerald-200 hover:bg-emerald-100"
            >
              {billingLabel}
            </Link>
            <button
              type="button"
              onClick={() => {
                onClose();
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
            onClick={onClose}
            className="block rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-center text-base font-medium text-emerald-700 shadow-sm hover:border-emerald-200 hover:bg-emerald-100"
          >
            {loginLabel}
          </Link>
        )}
      </div>
    </div>,
    document.body
  );
}
