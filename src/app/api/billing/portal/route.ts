import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { createBillingPortalSession } from '@/lib/billing/service';

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: '未登录用户无法访问订阅管理。' }, { status: 401 });
  }

  const origin = headers().get('origin') ?? process.env.APP_DOMAIN ?? 'http://localhost:3000';
  const returnUrl = new URL('/account/billing', origin).toString();

  try {
    const portal = await createBillingPortalSession(session.user.id, returnUrl);
    return NextResponse.json({ url: portal.url }, { status: 200 });
  } catch (error) {
    console.error('[billing] 创建 Portal Session 失败', error);
    return NextResponse.json({ message: '无法打开订阅管理页面，请稍后再试。' }, { status: 500 });
  }
}
