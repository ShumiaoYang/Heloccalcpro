'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import type { NavigationItem } from '@/lib/navigation';
import type { Locale } from '@/i18n/routing';
import { useActiveSection } from '@/lib/hooks/useActiveSection';
import { scrollToAnchor, updateHash } from '@/lib/utils/scroll-to-anchor';

type DesktopNavClientProps = {
  navigation: NavigationItem[];
  locale: Locale;
};

function NavTooltip({
  buttonRef,
  subtitle,
  show
}: {
  buttonRef: RefObject<HTMLButtonElement>;
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
        left: rect.right + 8,
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

function NavItem({
  item,
  isActive,
  onNavigate,
}: {
  item: NavigationItem;
  isActive: boolean;
  onNavigate: (href: string) => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => onNavigate(item.href)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`flex w-full items-center justify-between rounded-xl px-4 py-2 text-left transition-colors ${
          isActive ? 'bg-emerald-100 text-emerald-800 shadow-inner shadow-emerald-200' : 'hover:bg-emerald-50'
        }`}
      >
        <span>{item.label}</span>
        {isActive && <span className="h-2 w-2 rounded-full bg-emerald-500" />}
      </button>
      {item.subtitle ? <NavTooltip buttonRef={buttonRef} subtitle={item.subtitle} show={isHovered} /> : null}
    </div>
  );
}

export default function PageShellDesktopNavClient({ navigation, locale }: DesktopNavClientProps) {
  const activeSection = useActiveSection(navigation);

  const handleNavigate = (href: string) => {
    if (href.startsWith('#')) {
      scrollToAnchor(href);
      updateHash(href);
      return;
    }

    window.location.href = `/${locale}${href}`;
  };

  return (
    <>
      <nav className="space-y-2 pr-2 text-sm font-medium text-slate-600">
        {navigation.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            isActive={activeSection === item.id}
            onNavigate={handleNavigate}
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
    </>
  );
}
