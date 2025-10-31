import type { StripeEvent, StripeSubscription, StripeCheckoutSession } from 'stripe';
import { SubscriptionStatus } from '@prisma/client';
import { prisma, type Prisma } from '@/lib/prisma';
import { stripe, stripeMockMode } from './stripe';
import { billingConfig, getBillingPlans, getDefaultPlan, getPlanBySlug, type BillingPlan, getPlanByStripePriceId } from './config';

type CreateCheckoutParams = {
  userId: string;
  planSlug: string;
  successUrl: string;
  cancelUrl: string;
};

export async function ensurePlansSynced() {
  const plans = getBillingPlans();
  for (const plan of plans) {
    // eslint-disable-next-line no-await-in-loop
    await upsertPlanRecord(plan);
  }
}

export async function getActiveSubscription(userId: string) {
  return prisma.userSubscription.findFirst({
    where: {
      userId,
      status: { in: ['TRIALING', 'ACTIVE', 'PAST_DUE'] },
    },
    orderBy: { createdAt: 'desc' },
    include: { plan: true },
  });
}

export async function createCheckoutSession(params: CreateCheckoutParams) {
  const plan = getPlanBySlug(params.planSlug) ?? getDefaultPlan();
  if (plan.type !== 'recurring' || !plan.stripePriceId) {
    throw new Error('该订阅计划无需通过 Stripe 结算。');
  }

  const planRecord = await upsertPlanRecord(plan);
  const user = await prisma.user.findUnique({
    where: { id: params.userId },
  });

  if (!user) {
    throw new Error(`未找到用户 ${params.userId}`);
  }

  const stripeCustomerId = await getOrCreateStripeCustomer(user.id, user.email ?? undefined, user.name ?? undefined);

  if (stripeMockMode) {
    const subscriptionId = `mock_sub_${plan.slug}_${user.id}`;
    const now = new Date();
    const currentPeriodEnd = computeMockPeriodEnd(plan, now);

    await prisma.userSubscription.upsert({
      where: { stripeSubscriptionId: subscriptionId },
      update: {
        userId: user.id,
        planId: planRecord.id,
        stripeCustomerId,
        status: SubscriptionStatus.ACTIVE,
        currentPeriodEnd,
        cancelAtPeriodEnd: false,
        trialEndsAt: null,
      },
      create: {
        userId: user.id,
        planId: planRecord.id,
        stripeSubscriptionId: subscriptionId,
        stripeCustomerId,
        status: SubscriptionStatus.ACTIVE,
        currentPeriodEnd,
        cancelAtPeriodEnd: false,
        trialEndsAt: null,
      },
    });

    return {
      id: subscriptionId,
      url: params.successUrl,
    };
  }

  if (!stripe) {
    throw new Error('Stripe 未配置，无法创建 Checkout Session。');
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: stripeCustomerId,
    billing_address_collection: 'auto',
    automatic_tax: { enabled: true },
    line_items: [
      {
        price: plan.stripePriceId,
        quantity: 1,
      },
    ],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: {
      userId: user.id,
      planSlug: plan.slug,
    },
    subscription_data: {
      metadata: {
        userId: user.id,
        planSlug: plan.slug,
        planId: planRecord.id,
      },
    },
    allow_promotion_codes: true,
  });

  return session;
}

export async function createBillingPortalSession(userId: string, returnUrl: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error(`未找到用户 ${userId}`);
  }

  const stripeCustomerId =
    user.stripeCustomerId ?? (await getOrCreateStripeCustomer(user.id, user.email ?? undefined, user.name ?? undefined));

  if (stripeMockMode) {
    return { id: `mock_portal_${userId}`, url: returnUrl };
  }

  if (!stripe) {
    throw new Error('Stripe 未配置，无法创建 Portal Session。');
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: returnUrl,
  });

  return portalSession;
}

export async function handleStripeWebhook(event: StripeEvent) {
  if (stripeMockMode) {
    console.info('[billing] 模拟模式下忽略 Stripe Webhook', { type: event.type });
    return;
  }

  await recordPaymentEvent(event);

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event);
      break;
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      await handleSubscriptionUpdated(event);
      break;
    default:
      break;
  }
}

async function handleCheckoutCompleted(event: StripeEvent) {
  const session = event.data.object as StripeCheckoutSession;

  const subscriptionId =
    typeof session.subscription === 'string' ? session.subscription : session.subscription?.id ?? null;
  if (!subscriptionId || !stripe) {
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['latest_invoice.payment_intent', 'items.data.price.product'],
  });
  await upsertSubscriptionFromStripe(subscription);
}

async function handleSubscriptionUpdated(event: StripeEvent) {
  const subscription = event.data.object as StripeSubscription;
  await upsertSubscriptionFromStripe(subscription);
}

async function recordPaymentEvent(event: StripeEvent) {
  if (stripeMockMode) {
    return;
  }

  try {
    await prisma.paymentEvent.create({
      data: {
        stripeEventId: event.id,
        type: event.type,
        data: event as unknown as Prisma.InputJsonValue,
      },
    });
  } catch (error) {
    console.error('[billing] 保存支付事件失败', error);
  }
}

async function upsertSubscriptionFromStripe(subscription: StripeSubscription) {
  const stripeSubscriptionId = subscription.id;
  const stripeCustomerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id;
  const price =
    subscription.items.data[0]?.price ??
    subscription.items.data.find((item) => !!item.price)?.price ??
    undefined;
  const priceId = price?.id;
  const planSlug =
    subscription.metadata?.planSlug ??
    (priceId ? billingConfig.plans.find((plan) => plan.stripePriceId === priceId)?.slug : undefined);
  const userId = subscription.metadata?.userId;

  if (!planSlug || !userId) {
    console.warn('[billing] 无法匹配订阅元数据，跳过同步', { stripeSubscriptionId });
    return;
  }

  const plan = getPlanBySlug(planSlug);
  if (!plan) {
    console.warn('[billing] 未在配置中找到订阅计划', { planSlug });
    return;
  }

  const planRecord = await upsertPlanRecord(plan);

  const status = normalizeSubscriptionStatus(subscription.status);
  const currentPeriodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000)
    : null;
  const trialEndsAt = subscription.trial_end ? new Date(subscription.trial_end * 1000) : null;

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        stripeCustomerId,
      },
    }),
    prisma.userSubscription.upsert({
      where: { stripeSubscriptionId },
      update: {
        userId,
        planId: planRecord.id,
        stripeCustomerId,
        status,
        currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancel_at_period_end ?? false,
        trialEndsAt,
      },
      create: {
        userId,
        planId: planRecord.id,
        stripeSubscriptionId,
        stripeCustomerId,
        status,
        currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancel_at_period_end ?? false,
        trialEndsAt,
      },
    }),
  ]);
}

async function getOrCreateStripeCustomer(userId: string, email?: string, name?: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error(`未找到用户 ${userId}`);
  }

  if (stripeMockMode) {
    if (user.stripeCustomerId) {
      return user.stripeCustomerId;
    }
    const mockId = `mock_cust_${userId}`;
    await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: mockId },
    });
    return mockId;
  }

  if (!stripe) {
    throw new Error('Stripe 未初始化');
  }

  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  const customer = await stripe.customers.create({
    email,
    name,
    metadata: {
      userId,
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}

async function upsertPlanRecord(plan: BillingPlan) {
  const metadata = {
    limits: plan.limits,
  };

  return prisma.subscriptionPlan.upsert({
    where: { slug: plan.slug },
    update: {
      name: plan.copy.en.name,
      description: plan.copy.en.description,
      currency: plan.currency,
      amount: plan.amount,
      interval: plan.interval,
      stripePriceId: plan.stripePriceId ?? null,
      isActive: true,
      metadata,
    },
    create: {
      slug: plan.slug,
      name: plan.copy.en.name,
      description: plan.copy.en.description,
      currency: plan.currency,
      amount: plan.amount,
      interval: plan.interval,
      stripePriceId: plan.stripePriceId ?? null,
      isActive: true,
      metadata,
    },
  });
}

function normalizeSubscriptionStatus(status: StripeSubscription['status']): SubscriptionStatus {
  const normalized = status.replace(/-/g, '_').toUpperCase();
  if (normalized in SubscriptionStatus) {
    return normalized as SubscriptionStatus;
  }
  console.warn('[billing] 未识别的订阅状态，默认使用 CANCELED', { status });
  return SubscriptionStatus.CANCELED;
}

function computeMockPeriodEnd(plan: BillingPlan, reference: Date) {
  const end = new Date(reference.getTime());
  if (plan.interval === 'year') {
    end.setFullYear(end.getFullYear() + 1);
  } else if (plan.interval === 'month') {
    end.setMonth(end.getMonth() + 1);
  } else {
    end.setDate(end.getDate() + 30);
  }
  return end;
}
