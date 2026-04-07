import { getPrimeRateWithMetadata } from '@/lib/prime-rate/service';

const FALLBACK_PRIME_RATE = 6.75;
const BASE_MARGIN = 0.5;

export async function getLivePrimeRate(): Promise<number> {
  try {
    const rateData = await getPrimeRateWithMetadata();
    if (!rateData.isDefault && Number.isFinite(rateData.rate) && rateData.rate > 0) {
      return rateData.rate;
    }
    return FALLBACK_PRIME_RATE;
  } catch {
    return FALLBACK_PRIME_RATE;
  }
}

export const getBaseMargin = (): number => BASE_MARGIN;
