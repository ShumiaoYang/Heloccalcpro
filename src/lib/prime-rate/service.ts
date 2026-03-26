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
    const latest = await prisma.primeRate.findFirst({
      orderBy: { effectiveDate: 'desc' },
    });

    return latest?.rate ?? DEFAULT_VALUES.primeRate;
  } catch (error) {
    console.error('Failed to fetch Prime Rate from DB:', error);
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
