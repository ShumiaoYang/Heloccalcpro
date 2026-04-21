import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { FALLBACK_PRIME_RATE, PRIME_RATE_CACHE_TTL_SECONDS } from '@/lib/heloc/rate-constants';

type PrimeRateSnapshot = {
  rate: number;
  effectiveDate: Date;
  source: string;
  isDefault: boolean;
};

function getFallbackSnapshot(): PrimeRateSnapshot {
  return {
    rate: FALLBACK_PRIME_RATE,
    effectiveDate: new Date(),
    source: 'Default',
    isDefault: true,
  };
}

const getPrimeRateSnapshotCached = unstable_cache(
  async (): Promise<PrimeRateSnapshot> => {
    const latest = await prisma.primeRate.findFirst({
      orderBy: { effectiveDate: 'desc' },
    });

    if (!latest) {
      return getFallbackSnapshot();
    }

    return {
      rate: latest.rate,
      effectiveDate: latest.effectiveDate,
      source: latest.source,
      isDefault: false,
    };
  },
  ['prime-rate-snapshot'],
  { revalidate: PRIME_RATE_CACHE_TTL_SECONDS }
);

export async function getPrimeRateWithMetadata(): Promise<PrimeRateSnapshot> {
  try {
    return await getPrimeRateSnapshotCached();
  } catch {
    return getFallbackSnapshot();
  }
}

export async function getCurrentPrimeRate(): Promise<number> {
  const snapshot = await getPrimeRateWithMetadata();
  return snapshot.rate;
}
