'use client';

import { useEffect, useMemo, useRef, useState, type ComponentType } from 'react';

type ToolSectionLazyMountProps = {
  fallbackRate: number;
  baseMargin: number;
  preloadOffset?: number;
  manualStart?: boolean;
  idleLoad?: boolean;
};

type ToolSectionClientProps = {
  fallbackRate: number;
  baseMargin: number;
};

function ToolSectionSkeleton() {
  return (
    <div
      className="min-h-[900px] w-full animate-pulse rounded-2xl border border-emerald-100 bg-white/70"
      aria-hidden="true"
    />
  );
}

export default function ToolSectionLazyMount({
  fallbackRate,
  baseMargin,
  preloadOffset = 0,
  manualStart = false,
  idleLoad = true,
}: ToolSectionLazyMountProps) {
  const [shouldLoad, setShouldLoad] = useState(manualStart);
  const [ToolSectionClient, setToolSectionClient] = useState<ComponentType<ToolSectionClientProps> | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const dwellTimerRef = useRef<number | null>(null);

  const rootMargin = useMemo(() => `0px 0px ${preloadOffset}px 0px`, [preloadOffset]);

  useEffect(() => {
    if (manualStart || shouldLoad || typeof window === 'undefined') return;

    const target = sentinelRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((entry) => entry.isIntersecting);
        if (hit) {
          if (dwellTimerRef.current !== null) return;
          dwellTimerRef.current = window.setTimeout(() => {
            setShouldLoad(true);
            observer.disconnect();
          }, 160);
          return;
        }

        if (dwellTimerRef.current !== null) {
          window.clearTimeout(dwellTimerRef.current);
          dwellTimerRef.current = null;
        }
      },
      { root: null, rootMargin, threshold: 0.15 },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
      if (dwellTimerRef.current !== null) {
        window.clearTimeout(dwellTimerRef.current);
      }
    };
  }, [manualStart, rootMargin, shouldLoad]);

  useEffect(() => {
    if (!shouldLoad || ToolSectionClient) return;
    const win = window as Window & {
      requestIdleCallback?: (
        callback: IdleRequestCallback,
        options?: IdleRequestOptions,
      ) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    let cancelled = false;
    let timeoutId: number | null = null;

    const loadModule = async () => {
      const mod = await import('@/components/home/tool-section-client');
      if (!cancelled) {
        setToolSectionClient(() => mod.default);
      }
    };

    if (idleLoad && win.requestIdleCallback) {
      const idleId = win.requestIdleCallback(loadModule, { timeout: 1500 });
      return () => {
        cancelled = true;
        if (win.cancelIdleCallback) {
          win.cancelIdleCallback(idleId);
        }
      };
    }

    timeoutId = window.setTimeout(loadModule, 120);
    return () => {
      cancelled = true;
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [idleLoad, shouldLoad, ToolSectionClient]);

  return (
    <div ref={sentinelRef}>
      {ToolSectionClient ? (
        <ToolSectionClient fallbackRate={fallbackRate} baseMargin={baseMargin} />
      ) : (
        <ToolSectionSkeleton />
      )}
    </div>
  );
}
