import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { localPdfExists, getLocalPdfFilename } from '@/lib/storage/local-storage';
import { getSignedDownloadUrl } from '@/lib/storage/r2-client';
import { generateAccessToken } from '@/lib/pdf/token-manager';

export async function POST(req: NextRequest) {
  try {
    const { stripePaymentId } = await req.json();

    if (!stripePaymentId || typeof stripePaymentId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid Stripe Transaction ID' },
        { status: 400 }
      );
    }

    console.log('[Retrieve] Searching report for Transaction ID:', stripePaymentId);

    // Find the purchase by Stripe Payment ID
    const purchase = await prisma.pdfPurchase.findUnique({
      where: {
        stripePaymentId: stripePaymentId.trim(),
      },
      select: {
        id: true,
        email: true,
        calculationId: true,
        stripePaymentId: true,
        status: true,
        r2Key: true,
        pdfUrl: true,
        createdAt: true,
        pdfGeneratedAt: true,
        accessToken: true,
        tokenExpiresAt: true,
      },
    });

    if (!purchase) {
      console.log('[Retrieve] No report found for Transaction ID:', stripePaymentId);
      return NextResponse.json(
        { error: 'No report found for this Transaction ID' },
        { status: 404 }
      );
    }

    console.log('[Retrieve] Found report:', purchase.id);

    // Check if PDF is ready
    if (purchase.status !== 'COMPLETED') {
      console.log('[Retrieve] PDF not ready yet, status:', purchase.status);
      return NextResponse.json(
        {
          error: 'Report is still being generated. Please try again in a few moments.',
          status: purchase.status
        },
        { status: 202 }
      );
    }

    // Generate download URL - check local file first, then R2
    let pdfUrl: string;

    try {
      // Check if local file exists
      const localFilename = getLocalPdfFilename(purchase.calculationId);
      const hasLocalFile = await localPdfExists(localFilename);

      if (hasLocalFile) {
        console.log('[Retrieve] Using local file');
        // Generate access token for local download
        const { token, expiresAt } = generateAccessToken(
          purchase.id,
          purchase.email,
          purchase.calculationId
        );

        // Update token in database
        await prisma.pdfPurchase.update({
          where: { id: purchase.id },
          data: {
            accessToken: token,
            tokenExpiresAt: expiresAt,
          },
        });

        pdfUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/heloc/download-pdf?token=${token}`;
      } else if (purchase.r2Key) {
        console.log('[Retrieve] Using R2 storage');
        // Generate signed URL from R2
        pdfUrl = await getSignedDownloadUrl(purchase.r2Key, 86400); // 24 hours
      } else {
        console.error('[Retrieve] No PDF file found (neither local nor R2)');
        return NextResponse.json(
          { error: 'Report file not found. Please contact support.' },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error('[Retrieve] Failed to generate download URL:', error);
      return NextResponse.json(
        { error: 'Failed to generate download link' },
        { status: 500 }
      );
    }

    // Return single report
    return NextResponse.json({
      success: true,
      report: {
        id: purchase.id,
        calculationId: purchase.calculationId,
        stripePaymentId: purchase.stripePaymentId,
        pdfUrl: pdfUrl,
        createdAt: purchase.createdAt,
        generatedAt: purchase.pdfGeneratedAt || purchase.createdAt,
      },
    });
  } catch (error) {
    console.error('[Retrieve] Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve reports' },
      { status: 500 }
    );
  }
}
