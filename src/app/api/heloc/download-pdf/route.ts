/**
 * PDF Download API with Token Authentication
 * 带令牌验证的PDF下载端点
 *
 * Priority: Local file → R2 fallback
 * 优先级：本地文件 → R2备份
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/pdf/token-manager';

export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { localPdfExists, readLocalPdf, getLocalPdfFilename } from '@/lib/storage/local-storage';
import { getSignedDownloadUrl } from '@/lib/storage/r2-client';

export async function GET(request: NextRequest) {
  try {
    // 从查询参数获取令牌
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Access token is required' },
        { status: 401 }
      );
    }

    // 验证令牌
    const verification = verifyAccessToken(token);

    if (!verification.valid || !verification.payload) {
      return NextResponse.json(
        { error: verification.error || 'Invalid token' },
        { status: 401 }
      );
    }

    const { purchaseId } = verification.payload;

    // 从数据库查询购买记录
    const purchase = await prisma.pdfPurchase.findUnique({
      where: { id: purchaseId },
    });

    if (!purchase) {
      return NextResponse.json(
        { error: 'Purchase not found' },
        { status: 404 }
      );
    }

    // 检查PDF是否已生成
    if (!purchase.pdfGeneratedAt) {
      return NextResponse.json(
        { error: 'PDF not yet generated' },
        { status: 404 }
      );
    }

    const { calculationId } = purchase;

    // Priority 1: Check local file first (fast)
    if (localPdfExists(calculationId)) {
      console.log('[Download] Serving from local storage:', calculationId);

      try {
        const pdfBuffer = readLocalPdf(calculationId);
        const filename = getLocalPdfFilename(calculationId);

        return new NextResponse(pdfBuffer as unknown as BodyInit, {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Cache-Control': 'private, no-cache',
          },
        });
      } catch (error) {
        console.error('[Download] Failed to read local file:', error);
        // Fall through to R2 fallback
      }
    }

    // Priority 2: Fallback to R2 if local file doesn't exist
    console.log('[Download] Local file not found, falling back to R2');

    if (!purchase.r2Key) {
      return NextResponse.json(
        { error: 'PDF file not available' },
        { status: 404 }
      );
    }

    // Generate signed R2 URL and redirect
    const signedUrl = await getSignedDownloadUrl(purchase.r2Key, 86400);
    console.log('[Download] Redirecting to R2:', purchase.r2Key);

    return NextResponse.redirect(signedUrl, 302);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    return NextResponse.json(
      { error: 'Failed to download PDF' },
      { status: 500 }
    );
  }
}
