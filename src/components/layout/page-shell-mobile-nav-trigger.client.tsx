'use client';

import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Menu } from 'lucide-react';
import type { NavigationItem } from '@/lib/navigation';
import type { Locale } from '@/i18n/routing';

const MobileNavDrawer = dynamic(
  () => import('@/components/layout/page-shell-mobile-nav-drawer.client'),
  { ssr: false },
);

type MobileNavTriggerProps = {
  navigation: NavigationItem[];
  loginLabel: string;
  logoutLabel: string;
  locale: Locale;
};

export default function PageShellMobileNavTriggerClient({
  navigation,
  loginLabel,
  logoutLabel,
  locale,
}: MobileNavTriggerProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const handleClose = () => {
    setOpen(false);
    window.setTimeout(() => {
      triggerRef.current?.focus();
    }, 0);
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition hover:border-emerald-200 hover:text-emerald-600 lg:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open ? (
        <MobileNavDrawer
          navigation={navigation}
          loginLabel={loginLabel}
          logoutLabel={logoutLabel}
          locale={locale}
          onClose={handleClose}
        />
      ) : null}
    </>
  );
}
