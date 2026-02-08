'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { NavigationItem } from '@/lib/navigation';
import { useActiveSection } from '@/lib/hooks/useActiveSection';
import { scrollToAnchor, updateHash } from '@/lib/utils/scroll-to-anchor';
import LanguageSwitcher from '@/components/navigation/language-switcher';
import type { Locale } from '@/i18n/routing';

type LoginHref = `/${Locale}/auth/login`;
type AccountHref = `/${Locale}/account/settings`;
type BillingHref = `/${Locale}/account/billing`;

type PageShellProps = {
  navigation: NavigationItem[];
  siteName: string;
  loginLabel: string;
  logoutLabel: string;
  locale: Locale;
  children: React.ReactNode;
};

// NavTooltip component using Portal to escape sidebar overflow
function NavTooltip({
  buttonRef,
  subtitle,
  show
}: {
  buttonRef: React.RefObject<HTMLButtonElement>;
  subtitle: string;
  show: boolean;
}) {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!show || !buttonRef.current) return;

    const updatePosition = () => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top,
        left: rect.right + 8, // 8px gap from button
      });
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [show, buttonRef]);

  if (!mounted || !show) return null;

  return createPortal(
    <div
      className="pointer-events-none fixed z-[60] w-64 rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-lg"
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
    >
      <div className="absolute -left-1 top-3 h-2 w-2 rotate-45 bg-slate-900" />
      {subtitle}
    </div>,
    document.body
  );
}

// NavItem component to manage individual navigation item with tooltip
function NavItem({
  item,
  isActive,
  onNavigate,
  onHoverChange,
}: {
  item: NavigationItem;
  isActive: boolean;
  onNavigate: (href: string) => void;
  onHoverChange: (id: string | null) => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHoverChange(item.id);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHoverChange(null);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => onNavigate(item.href)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`flex w-full items-center justify-between rounded-xl px-4 py-2 text-left transition-colors ${
          isActive ? 'bg-emerald-100 text-emerald-800 shadow-inner shadow-emerald-200' : 'hover:bg-emerald-50'
        }`}
      >
        <span>{item.label}</span>
        {isActive && <span className="h-2 w-2 rounded-full bg-emerald-500" />}
      </button>
      {item.subtitle && (
        <NavTooltip buttonRef={buttonRef} subtitle={item.subtitle} show={isHovered} />
      )}
    </div>
  );
}

export default function PageShell({
  navigation,
  siteName,
  loginLabel,
  logoutLabel,
  locale,
  children,
}: PageShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const activeSection = useActiveSection(navigation);
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const user = session?.user;
  const userDisplayName = useMemo(() => {
    if (!user) return '';
    return user.name ?? user.email ?? 'Account';
  }, [user]);
  const accountLabel = locale === 'zh' ? '账号设置' : 'Account settings';
  const billingLabel = locale === 'zh' ? '订阅管理' : 'Manage plan';
  const loginHref = `/${locale}/auth/login` as LoginHref;
  const accountHref = `/${locale}/account/settings` as AccountHref;
  const billingHref = `/${locale}/account/billing` as BillingHref;

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
      <header className="sticky top-0 z-50 border-b border-emerald-200/70 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-full items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition hover:border-emerald-200 hover:text-emerald-600 lg:hidden"
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
              <UserMenu
                name={userDisplayName}
                email={user?.email ?? ''}
                image={user?.image ?? ''}
                accountHref={accountHref}
                accountLabel={accountLabel}
                billingHref={billingHref}
                billingLabel={billingLabel}
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
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden lg:h-[calc(100vh-4rem)]">
        <aside className="hidden w-44 flex-shrink-0 border-r border-emerald-200/70 bg-white/70 shadow-lg shadow-emerald-100/50 backdrop-blur lg:flex lg:h-[calc(100vh-4rem)] lg:flex-col lg:overflow-y-auto">
          <div className="flex flex-1 flex-col px-6 py-10">
            <nav className="space-y-2 pr-2 text-sm font-medium text-slate-600">
              {navigation.map((item) => (
                <NavItem
                  key={item.id}
                  item={item}
                  isActive={activeSection === item.id}
                  onNavigate={handleNavigate}
                  onHoverChange={setHoveredItem}
                />
              ))}
            </nav>
            <div className="mt-auto pt-6">
              <Link
                href={`/${locale}/heloc/retrieve`}
                className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{locale === 'zh' ? '找回报告' : 'Retrieve Reports'}</span>
              </Link>
            </div>
          </div>
        </aside>

        <main className="flex flex-1 flex-col overflow-y-auto lg:h-[calc(100vh-4rem)]">
          <div className="mx-auto flex w-full max-w-full flex-col gap-16 px-4 py-6 lg:px-6">{children}</div>
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
        accountHref={accountHref}
        accountLabel={accountLabel}
        billingHref={billingHref}
        billingLabel={billingLabel}
        isAuthenticated={isAuthenticated}
        onSignOut={handleSignOut}
        locale={locale}
      />
    </div>
  );
}

function Logo({ siteName }: { siteName: string }) {
  return (
    <div className="flex items-center gap-2">
      <img src="/icon.svg" alt="HELOC Calculator" className="h-8 w-8" />
      <span className="text-3xl font-bold leading-none">
        <span className="text-[#5B21B6]">HELOC</span>
        <span className="text-slate-600"> Calculator</span>
        <span className="text-emerald-600">.pro</span>
      </span>
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
  loginHref: LoginHref;
  accountHref: AccountHref;
  accountLabel: string;
  billingHref: BillingHref;
  billingLabel: string;
  isAuthenticated: boolean;
  onSignOut: () => void;
  locale: Locale;
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
  accountHref,
  accountLabel,
  billingHref,
  billingLabel,
  isAuthenticated,
  onSignOut,
  locale,
}: MobileNavProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-lg lg:hidden">
      <div className="flex items-center justify-between px-4 py-4">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">Menu</span>
        <button
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
            onClick={() => onNavigate(item.href)}
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
                onSignOut();
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
    </div>
  );
}

function UserMenu({
  name,
  email,
  image,
  accountHref,
  accountLabel,
  billingHref,
  billingLabel,
  logoutLabel,
  onSignOut,
}: {
  name: string;
  email: string;
  image: string;
  accountHref: AccountHref;
  accountLabel: string;
  billingHref: BillingHref;
  billingLabel: string;
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
          {/* Temporarily hidden - Manage Plan menu item
          <Link
            href={billingHref}
            onClick={() => setOpen(false)}
            className="mt-1 flex items-center justify-between rounded-lg px-3 py-2 text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700"
          >
            <span>{billingLabel}</span>
            <span aria-hidden>→</span>
          </Link>
          */}
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

