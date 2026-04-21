'use client';

import { useState, useEffect } from 'react';
import { FALLBACK_PRIME_RATE } from '@/lib/heloc/rate-constants';

interface PrimeRateData {
  rate: number;
  effectiveDate: Date;
  source: string;
  isDefault: boolean;
}

type UsePrimeRateOptions = {
  fallbackRate?: number;
  refreshOnMount?: boolean;
};

type UsePrimeRateResult = {
  rate: number;
  isLoading: boolean;
  isStale: boolean;
  data: PrimeRateData;
};

const REQUEST_TIMEOUT_MS = 800;

export function usePrimeRate({
  fallbackRate = FALLBACK_PRIME_RATE,
  refreshOnMount = true,
}: UsePrimeRateOptions = {}): UsePrimeRateResult {
  const [data, setData] = useState<PrimeRateData>({
    rate: fallbackRate,
    effectiveDate: new Date(),
    source: 'Fallback',
    isDefault: true,
  });
  const [isLoading, setIsLoading] = useState(refreshOnMount);
  const [isStale, setIsStale] = useState(true);

  useEffect(() => {
    if (!refreshOnMount) {
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    fetch('/api/prime-rate', { signal: controller.signal, cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error(`prime-rate status ${res.status}`);
        return res.json();
      })
      .then((payload: Partial<PrimeRateData>) => {
        const rate = Number(payload.rate);
        if (!Number.isFinite(rate) || rate <= 0) {
          throw new Error('invalid prime rate');
        }

        setData({
          rate,
          effectiveDate: payload.effectiveDate ? new Date(payload.effectiveDate) : new Date(),
          source: payload.source ?? 'Unknown',
          isDefault: payload.isDefault ?? false,
        });
        setIsStale(payload.isDefault ?? false);
      })
      .catch(() => {
        setData({
          rate: fallbackRate,
          effectiveDate: new Date(),
          source: 'Fallback',
          isDefault: true,
        });
        setIsStale(true);
      })
      .finally(() => {
        window.clearTimeout(timeoutId);
        setIsLoading(false);
      });

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [fallbackRate, refreshOnMount]);

  return {
    rate: data.rate,
    isLoading,
    isStale,
    data,
  };
}
