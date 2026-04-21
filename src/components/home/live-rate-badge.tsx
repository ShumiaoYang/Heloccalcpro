'use client';

import { usePrimeRate } from '@/lib/hooks/usePrimeRate';

type LiveRateBadgeProps = {
  fallbackRate: number;
  refreshOnMount?: boolean;
};

export function LiveRateBadge({ fallbackRate, refreshOnMount = true }: LiveRateBadgeProps) {
  const { rate, isLoading, isStale } = usePrimeRate({
    fallbackRate,
    refreshOnMount,
  });

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50/80 border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-800 shadow-sm">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <span aria-live="polite">
        Live WSJ Prime Rate: {rate.toFixed(2)}% | HELOC Margins from +0.50%
        {isLoading ? ' (updating...)' : ''}
        {!isLoading && isStale ? ' (fallback)' : ''}
      </span>
    </div>
  );
}
