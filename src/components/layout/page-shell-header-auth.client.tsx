'use client';

import { useEffect, useState, type ComponentType } from 'react';
import Link from 'next/link';
import LanguageSwitcher from '@/components/navigation/language-switcher';
import type { Locale } from '@/i18n/routing';

type LoginHref = `/${Locale}/auth/login`;

type HeaderAuthClientProps = {
  locale: Locale;
  loginLabel: string;
  logoutLabel: string;
};

type HeaderAuthEnhancedProps = {
  locale: Locale;
  loginLabel: string;
  logoutLabel: string;
};

export default function PageShellHeaderAuthClient({
  locale,
  loginLabel,
  logoutLabel,
}: HeaderAuthClientProps) {
  const [EnhancedAuth, setEnhancedAuth] = useState<ComponentType<HeaderAuthEnhancedProps> | null>(null);
  const loginHref = `/${locale}/auth/login` as LoginHref;

  useEffect(() => {
    const win = window as Window & {
      requestIdleCallback?: (
        callback: IdleRequestCallback,
        options?: IdleRequestOptions,
      ) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    let cancelled = false;
    let timeoutId: number | null = null;

    const loadEnhanced = async () => {
      const mod = await import('@/components/layout/page-shell-header-auth-enhanced.client');
      if (!cancelled) {
        setEnhancedAuth(() => mod.default);
      }
    };

    if (win.requestIdleCallback) {
      const idleId = win.requestIdleCallback(loadEnhanced, { timeout: 2500 });
      return () => {
        cancelled = true;
        if (win.cancelIdleCallback) {
          win.cancelIdleCallback(idleId);
        }
      };
    }

    timeoutId = window.setTimeout(loadEnhanced, 1200);
    return () => {
      cancelled = true;
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <div className="flex items-center gap-3">
      <LanguageSwitcher />
      {EnhancedAuth ? (
        <EnhancedAuth locale={locale} loginLabel={loginLabel} logoutLabel={logoutLabel} />
      ) : (
        <Link
          href={loginHref}
          className="rounded-lg border border-emerald-200 bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-200"
        >
          {loginLabel}
        </Link>
      )}
    </div>
  );
}
