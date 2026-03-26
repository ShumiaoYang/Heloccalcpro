/**
 * Cron Job API - Daily Prime Rate Update
 * Triggered by Vercel Cron Jobs
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fetchLatestPrimeRate } from '@/lib/prime-rate/fetcher';

export async function GET(request: NextRequest) {
  // Verify Cron Secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const rate = await fetchLatestPrimeRate();

    await prisma.primeRate.create({
      data: {
        rate,
        effectiveDate: new Date(),
        source: 'FRED API',
      },
    });

    return Response.json({
      success: true,
      rate,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to update Prime Rate:', error);
    return Response.json({
      error: 'Failed to update Prime Rate',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
