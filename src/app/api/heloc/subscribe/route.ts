import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existing = await prisma.emailSubscription.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { message: 'Already subscribed' },
        { status: 200 }
      );
    }

    // Create subscription
    await prisma.emailSubscription.create({
      data: {
        email,
        subscribeType: 'prime_rate_alert',
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed',
    });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
