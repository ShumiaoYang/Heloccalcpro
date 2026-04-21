'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import LanguageSwitcher from '@/components/navigation/language-switcher';
import type { Locale } from '@/i18n/routing';

type LoginHref = `/${Locale}/auth/login`;
type AccountHref = `/${Locale}/account/settings`;

type HeaderAuthClientProps = {
  locale: Locale;
  loginLabel: string;
  logoutLabel: string;
};

export default function PageShellHeaderAuthClient({
  locale,
  loginLabel,
  logoutLabel,
}: HeaderAuthClientProps) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const user = session?.user;
  const userDisplayName = useMemo(() => {
    if (!user) return '';
    return user.name ?? user.email ?? 'Account';
  }, [user]);

  const accountLabel = locale === 'zh' ? '账号设置' : 'Account settings';
  const loginHref = `/${locale}/auth/login` as LoginHref;
  const accountHref = `/${locale}/account/settings` as AccountHref;

  const handleSignOut = async () => {
    await signOut({ callbackUrl: `/${locale}` });
  };

  return (
    <div className="flex items-center gap-3">
      <LanguageSwitcher />
      {isAuthenticated ? (
        <UserMenu
          name={userDisplayName}
          email={user?.email ?? ''}
          image={user?.image ?? ''}
          accountHref={accountHref}
          accountLabel={accountLabel}
          onSignOut={handleSignOut}
          logoutLabel={logoutLabel}
        />
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

function UserMenu({
  name,
  email,
  image,
  accountHref,
  accountLabel,
  logoutLabel,
  onSignOut,
}: {
  name: string;
  email: string;
  image: string;
  accountHref: AccountHref;
  accountLabel: string;
  logoutLabel: string;
  onSignOut: () => void;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (dropdownRef.current?.contains(target) || triggerRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const initials = (name || email)
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-200 hover:text-emerald-600"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={name ? `${name} account menu` : 'Account menu'}
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={name} className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <span>{initials || 'AI'}</span>
        )}
      </button>

      {open ? (
        <div
          ref={dropdownRef}
          className="absolute right-0 z-50 mt-2 w-60 rounded-xl border border-slate-200 bg-white p-2 text-sm shadow-xl"
        >
          <div className="rounded-lg bg-slate-50 px-3 py-2">
            <p className="text-xs font-semibold text-slate-700">{name || email}</p>
            {email ? <p className="text-xs text-slate-400">{email}</p> : null}
          </div>
          <div className="my-2 h-px bg-slate-100" />
          <Link
            href={accountHref}
            onClick={() => setOpen(false)}
            className="flex items-center justify-between rounded-lg px-3 py-2 text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700"
          >
            <span>{accountLabel}</span>
            <span aria-hidden>→</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onSignOut();
            }}
            className="mt-2 flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700"
          >
            <span>{logoutLabel}</span>
            <span aria-hidden>↩</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
