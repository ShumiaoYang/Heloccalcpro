import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe, stripeMockMode } from '@/lib/billing/stripe';
import { handleStripeWebhook } from '@/lib/billing/service';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (stripeMockMode) {
    try {
      const mockEvent = (await request.json()) as Parameters<typeof handleStripeWebhook>[0];
      await handleStripeWebhook(mockEvent);
      return NextResponse.json({ received: true, mode: 'mock' }, { status: 200 });
    } catch (error) {
      console.error('[billing] 模拟模式下处理 webhook 失败', error);
      return NextResponse.json({ message: 'Mock webhook 处理失败。' }, { status: 400 });
    }
  }

  if (!stripe) {
    return NextResponse.json({ message: 'Stripe 未配置。' }, { status: 503 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('[billing] STRIPE_WEBHOOK_SECRET 未配置');
    return NextResponse.json({ message: 'Webhook 未启用。' }, { status: 503 });
  }

  const signature = headers().get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ message: '缺少 Stripe 签名。' }, { status: 400 });
  }

  const payload = await request.text();

  try {
    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    await handleStripeWebhook(event);
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('[billing] Stripe Webhook 解析失败', error);
    return NextResponse.json({ message: 'Webhook 处理失败。' }, { status: 400 });
  }
}
