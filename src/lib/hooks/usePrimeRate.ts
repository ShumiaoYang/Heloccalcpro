/**
 * usePrimeRate Hook - Fetch current Prime Rate from API
 */

import { useState, useEffect } from 'react';
import { DEFAULT_VALUES } from '@/lib/heloc/types';

interface PrimeRateData {
  rate: number;
  effectiveDate: Date;
  source: string;
  isDefault: boolean;
}

export function usePrimeRate() {
  const [data, setData] = useState<PrimeRateData>({
    rate: DEFAULT_VALUES.primeRate,
    effectiveDate: new Date(),
    source: 'Default',
    isDefault: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/prime-rate')
      .then(res => res.json())
      .then(data => {
        setData({
          ...data,
          effectiveDate: new Date(data.effectiveDate),
        });
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}
