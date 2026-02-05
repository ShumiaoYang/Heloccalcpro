import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing session_id' },
        { status: 400 }
      );
    }

    // 查找购买记录
    const purchase = await prisma.pdfPurchase.findFirst({
      where: {
        stripeSessionId: sessionId,
      },
    });

    if (!purchase) {
      return NextResponse.json(
        { error: 'Purchase not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: purchase.status,
      pdfUrl: purchase.pdfUrl,
    });
  } catch (error) {
    console.error('Get purchase error:', error);
    return NextResponse.json(
      { error: 'Failed to get purchase info' },
      { status: 500 }
    );
  }
}
