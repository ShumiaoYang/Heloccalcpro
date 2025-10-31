import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { createCheckoutSession } from '@/lib/billing/service';
import { getPlanBySlug, getDefaultPlan } from '@/lib/billing/config';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: '未登录用户无法发起订阅。' }, { status: 401 });
  }

  const body = (await safeJson(request)) ?? {};
  const planSlug = typeof body.planSlug === 'string' ? body.planSlug : getDefaultPlan().slug;
  const plan = getPlanBySlug(planSlug);

  if (!plan) {
    return NextResponse.json({ message: '订阅计划不存在。' }, { status: 404 });
  }

  if (plan.type === 'free') {
    return NextResponse.json({ message: '该计划无需付费。' }, { status: 400 });
  }

  const origin = getRequestOrigin();
  const successPath = typeof body.successPath === 'string' ? body.successPath : '/account/billing/success';
  const cancelPath = typeof body.cancelPath === 'string' ? body.cancelPath : '/account/billing';

  try {
    const sessionResult = await createCheckoutSession({
      userId: session.user.id,
      planSlug: plan.slug,
      successUrl: new URL(successPath, origin).toString(),
      cancelUrl: new URL(cancelPath, origin).toString(),
    });

    return NextResponse.json({ url: sessionResult.url }, { status: 200 });
  } catch (error) {
    console.error('[billing] 创建 Checkout Session 失败', error);
    return NextResponse.json({ message: '无法创建订阅会话，请稍后再试。' }, { status: 500 });
  }
}

async function safeJson(request: Request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function getRequestOrigin() {
  const headerOrigin = headers().get('origin');
  if (headerOrigin) return headerOrigin;
  const appDomain = process.env.APP_DOMAIN ?? 'http://localhost:3000';
  return appDomain.endsWith('/') ? appDomain : `${appDomain}`;
}
