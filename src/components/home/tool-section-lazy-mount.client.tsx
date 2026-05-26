'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const ToolSectionClient = dynamic(() => import('@/components/home/tool-section-client'));

type ToolSectionLazyMountProps = {
  fallbackRate: number;
  baseMargin: number;
  preloadOffset?: number;
  manualStart?: boolean;
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
  preloadOffset = 500,
  manualStart = false,
}: ToolSectionLazyMountProps) {
  const [shouldMount, setShouldMount] = useState(manualStart);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const rootMargin = useMemo(() => `0px 0px ${preloadOffset}px 0px`, [preloadOffset]);

  useEffect(() => {
    if (manualStart || shouldMount || typeof window === 'undefined') return;

    const target = sentinelRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldMount(true);
          observer.disconnect();
        }
      },
      { root: null, rootMargin, threshold: 0.01 },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [manualStart, rootMargin, shouldMount]);

  return (
    <div ref={sentinelRef}>
      {shouldMount ? (
        <ToolSectionClient fallbackRate={fallbackRate} baseMargin={baseMargin} />
      ) : (
        <ToolSectionSkeleton />
      )}
    </div>
  );
}
