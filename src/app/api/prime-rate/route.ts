/**
 * Prime Rate Query API
 */

import { PRIME_RATE_CACHE_TTL_SECONDS } from '@/lib/heloc/rate-constants';
import { getPrimeRateWithMetadata } from '@/lib/prime-rate/service';

export const revalidate = PRIME_RATE_CACHE_TTL_SECONDS;

export async function GET() {
  const data = await getPrimeRateWithMetadata();

  return Response.json(data);
}
