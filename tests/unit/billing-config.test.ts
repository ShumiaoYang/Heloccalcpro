import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('billing config', () => {
  beforeEach(() => {
    process.env.STRIPE_PRICE_PRO_MONTHLY = 'price_test_monthly';
    process.env.STRIPE_PRICE_PRO_ANNUAL = 'price_test_annual';
    vi.resetModules();
  });

  it('exposes default plan and resolves recurring price id', async () => {
    const { getBillingPlans, getDefaultPlan } = await import('@/lib/billing/config');
    const plans = getBillingPlans();
    expect(plans.length).toBeGreaterThan(0);

    const defaultPlan = getDefaultPlan();
    expect(defaultPlan.slug).toBe('free');

    const proMonthly = plans.find((plan) => plan.slug === 'pro-monthly');
    expect(proMonthly?.stripePriceId).toBe('price_test_monthly');
    expect(proMonthly?.amount).toBe(900);
    expect(proMonthly?.interval).toBe('month');

    const proAnnual = plans.find((plan) => plan.slug === 'pro-annual');
    expect(proAnnual?.stripePriceId).toBe('price_test_annual');
    expect(proAnnual?.amount).toBe(3900);
    expect(proAnnual?.interval).toBe('year');
  });
});
