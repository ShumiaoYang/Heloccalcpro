import { getPrimeRateWithMetadata } from '@/lib/prime-rate/service';
import { BASE_MARGIN, FALLBACK_PRIME_RATE } from '@/lib/heloc/rate-constants';

export { FALLBACK_PRIME_RATE };

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
