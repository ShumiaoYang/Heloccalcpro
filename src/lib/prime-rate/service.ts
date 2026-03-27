/**
 * Prime Rate Service - Cached data access layer
 */

import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { DEFAULT_VALUES } from '@/lib/heloc/types';

/**
 * Get current Prime Rate from database (cached)
 */
export const getCurrentPrimeRate = cache(async (): Promise<number> => {
  try {
    console.log('[PrimeRate] Fetching from database...');
    const latest = await prisma.primeRate.findFirst({
      orderBy: { effectiveDate: 'desc' },
    });

    if (latest) {
      console.log('[PrimeRate] Found in DB:', {
        rate: latest.rate,
        effectiveDate: latest.effectiveDate,
        source: latest.source,
      });
      return latest.rate;
    } else {
      console.warn('[PrimeRate] No data found in DB, using default:', DEFAULT_VALUES.primeRate);
      return DEFAULT_VALUES.primeRate;
    }
  } catch (error) {
    console.error('[PrimeRate] Failed to fetch from DB:', error);
    console.error('[PrimeRate] Using default value:', DEFAULT_VALUES.primeRate);
    return DEFAULT_VALUES.primeRate;
  }
});

/**
 * Get Prime Rate with metadata
 */
export async function getPrimeRateWithMetadata() {
  try {
    const latest = await prisma.primeRate.findFirst({
      orderBy: { effectiveDate: 'desc' },
    });

    if (!latest) {
      return {
        rate: DEFAULT_VALUES.primeRate,
        effectiveDate: new Date(),
        source: 'Default',
        isDefault: true,
      };
    }

    return {
      rate: latest.rate,
      effectiveDate: latest.effectiveDate,
      source: latest.source,
      isDefault: false,
    };
  } catch (error) {
    console.error('Failed to fetch Prime Rate metadata:', error);
    return {
      rate: DEFAULT_VALUES.primeRate,
      effectiveDate: new Date(),
      source: 'Default',
      isDefault: true,
    };
  }
}
