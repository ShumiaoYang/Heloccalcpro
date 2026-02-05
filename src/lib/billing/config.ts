import rawBillingConfig from '../../../config/billing.config.json';
import type { Locale } from '@/i18n/routing';

type RawPlan = (typeof rawBillingConfig.plans)[number];

export type BillingPlanType = 'free' | 'recurring';

export type BillingPlanLimits = {
  toolRunsPerMonth?: number;
};

export type BillingPlanCopy = {
  name: string;
  description: string;
};

export type BillingPlan = {
  slug: string;
  type: BillingPlanType;
  currency: string;
  amount: number;
  interval: string;
  stripePriceId?: string;
  limits: BillingPlanLimits;
  copy: Record<Locale, BillingPlanCopy>;
};

export const billingConfig = {
  defaultPlan: rawBillingConfig.defaultPlan,
  plans: rawBillingConfig.plans.map(normalizePlan),
};

export function getBillingPlans(): BillingPlan[] {
  return billingConfig.plans;
}

export function getPlanBySlug(slug: string): BillingPlan | undefined {
  return getBillingPlans().find((plan) => plan.slug === slug);
}

export function getDefaultPlan(): BillingPlan {
  const plan =
    getPlanBySlug(billingConfig.defaultPlan) ?? billingConfig.plans.find((item) => item.type === 'free');
  if (!plan) {
    throw new Error('billing.config.json 缺少默认订阅计划。');
  }
  return plan;
}

export function getPlanCopy(plan: BillingPlan, locale: Locale): BillingPlanCopy {
  return plan.copy[locale] ?? plan.copy.en;
}

export function getPlanByStripePriceId(priceId: string | null | undefined): BillingPlan | undefined {
  if (!priceId) return undefined;
  return getBillingPlans().find((plan) => plan.stripePriceId === priceId);
}

function normalizePlan(plan: RawPlan): BillingPlan {
  const type = plan.type as BillingPlanType;
  const stripePriceId =
    typeof plan.stripePrice?.env === 'string' ? process.env[plan.stripePrice.env] ?? undefined : undefined;

  if (type === 'recurring' && !stripePriceId) {
    const warningMsg = `[billing-config] 订阅计划 ${plan.slug} 缺少 Stripe Price ID，将使用测试占位值。后续请配置 ${plan.stripePrice?.env ?? ''}。`;
    if (process.env.NODE_ENV === 'production') {
      console.error(warningMsg);
    } else {
      console.warn(warningMsg);
    }
  }

  return {
    slug: plan.slug,
    type,
    currency: plan.currency,
    amount: plan.amount,
    interval: plan.interval,
    stripePriceId: stripePriceId ?? `test_price_${plan.slug}`,
    limits: plan.limits ?? {},
    copy: plan.copy as BillingPlan['copy'],
  };
}
