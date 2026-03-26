/**
 * Prime Rate Query API
 */

import { getCurrentPrimeRate, getPrimeRateWithMetadata } from '@/lib/prime-rate/service';

export const revalidate = 86400; // 24 hours

export async function GET() {
  const data = await getPrimeRateWithMetadata();

  return Response.json(data);
}
