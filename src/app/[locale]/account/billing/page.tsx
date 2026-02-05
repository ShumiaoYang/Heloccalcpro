import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { SubscriptionStatus } from '@prisma/client';
import { authOptions } from '@/lib/auth/options';
import { getSeoMetadata } from '@/lib/seo';
import { getSiteContent } from '@/lib/content';
import type { Locale } from '@/i18n/routing';
import {
  getBillingPlans,
  getDefaultPlan,
  getPlanBySlug,
  getPlanCopy,
  type BillingPlan,
} from '@/lib/billing/config';
import { getActiveSubscription } from '@/lib/billing/service';
import CheckoutButton from '@/components/billing/checkout-button';
import PortalButton from '@/components/billing/portal-button';

type PageProps = {
  params: { locale: Locale };
};

export async function generateMetadata({ params }: PageProps) {
  const { metadata } = getSeoMetadata('/account/billing', params.locale);
  return {
    ...metadata,
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function BillingPage({ params }: PageProps) {
  const { locale } = params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect(`/${locale}/auth/login?callbackUrl=${encodeURIComponent(`/${locale}/account/billing`)}`);
  }

  const content = getSiteContent(locale);
  const billingCopy = content.account?.billing;
  if (!billingCopy) {
    throw new Error('缺少 account.billing 文案配置，请更新 content/<locale>.json');
  }

  const plans = getBillingPlans();
  const activeSubscription = await getActiveSubscription(session.user.id);
  const currentPlanSlug = activeSubscription?.plan?.slug ?? getDefaultPlan().slug;
  const currentPlan = getPlanBySlug(currentPlanSlug) ?? getDefaultPlan();
  const statusLabel = activeSubscription
    ? billingCopy.status[activeSubscription.status] ?? activeSubscription.status
    : null;
  const paidStatuses = new Set<SubscriptionStatus>([
    SubscriptionStatus.TRIALING,
    SubscriptionStatus.ACTIVE,
    SubscriptionStatus.PAST_DUE,
  ]);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{billingCopy.title}</h1>
        <p className="text-sm text-slate-600">{billingCopy.description}</p>
        {statusLabel ? (
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <span>{billingCopy.statusLabel}</span>
            <span className="uppercase tracking-[0.2em]">{statusLabel}</span>
          </div>
        ) : null}
      </header>

      <CurrentPlanSummary
        locale={locale}
        plan={currentPlan}
        copy={billingCopy}
        isPaid={activeSubscription ? paidStatuses.has(activeSubscription.status) : false}
      />

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">{billingCopy.planFeaturesLabel}</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {plans.map((plan) => {
            const copy = getPlanCopy(plan, locale);
            const isCurrent = plan.slug === currentPlanSlug;
            const showPortal = isCurrent && plan.type === 'recurring' && !!activeSubscription;
            const showCheckout = !isCurrent && plan.type === 'recurring';

            return (
              <article
                key={plan.slug}
                className={`rounded-2xl border p-6 shadow-sm ${
                  isCurrent ? 'border-sky-300 shadow-sky-100' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">{copy.name}</h3>
                    <p className="mt-1 text-sm text-slate-600">{copy.description}</p>
                  </div>
                  <Badge variant={plan.type === 'free' ? 'free' : 'paid'} copy={billingCopy} />
                </div>
                <PlanPrice plan={plan} locale={locale} />
                <ul className="mt-4 space-y-1 text-sm text-slate-600">
                  {renderLimits(plan, billingCopy).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>

                <div className="mt-6 flex items-center gap-3">
                  {showPortal ? (
                    <PortalButton
                      label={billingCopy.actions.manage}
                      processingLabel={billingCopy.actions.processing}
                      errorMessage={billingCopy.actions.portalError}
                    />
                  ) : showCheckout ? (
                    <CheckoutButton
                      planSlug={plan.slug}
                      label={billingCopy.actions.upgrade}
                      processingLabel={billingCopy.actions.processing}
                      errorMessage={billingCopy.actions.checkoutError}
                    />
                  ) : (
                    <span className="text-sm font-semibold text-emerald-600">{billingCopy.actions.current}</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function CurrentPlanSummary({
  plan,
  locale,
  copy,
  isPaid,
}: {
  plan: BillingPlan;
  locale: Locale;
  copy: NonNullable<ReturnType<typeof getSiteContent>['account']>['billing'];
  isPaid: boolean;
}) {
  const planCopy = getPlanCopy(plan, locale);
  return (
    <div className="rounded-2xl border border-sky-100 bg-white px-5 py-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-500">
            {copy.currentPlanLabel}
          </span>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">{planCopy.name}</h2>
          <p className="mt-1 text-sm text-slate-600">{planCopy.description}</p>
        </div>
        <Badge variant={isPaid ? 'paid' : 'free'} copy={copy} />
      </div>
    </div>
  );
}

function PlanPrice({ plan, locale }: { plan: BillingPlan; locale: Locale }) {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: plan.currency.toUpperCase(),
    minimumFractionDigits: plan.amount % 100 === 0 ? 0 : 2,
  });
  const amount = formatter.format(plan.amount / 100);

  if (plan.amount === 0) {
    const freeLabel = locale === 'zh' ? '免费' : 'Free';
    return (
      <p className="mt-3 text-2xl font-semibold text-slate-900">
        {freeLabel}
        <span className="ml-1 text-sm font-normal text-slate-500">/ {plan.interval}</span>
      </p>
    );
  }

  return (
    <p className="mt-3 text-2xl font-semibold text-slate-900">
      {amount}
      <span className="ml-1 text-sm font-normal text-slate-500">/ {plan.interval}</span>
    </p>
  );
}

function renderLimits(
  plan: BillingPlan,
  copy: NonNullable<ReturnType<typeof getSiteContent>['account']>['billing'],
) {
  const items: string[] = [];
  if (plan.limits.toolRunsPerMonth != null) {
    items.push(`${plan.limits.toolRunsPerMonth.toLocaleString()} ${copy.limits.toolRunsPerMonth}`);
  }
  return items;
}

function Badge({
  variant,
  copy,
}: {
  variant: 'free' | 'paid';
  copy: NonNullable<ReturnType<typeof getSiteContent>['account']>['billing'];
}) {
  const label = variant === 'free' ? copy.freeBadge : copy.paidBadge;
  const styles =
    variant === 'free'
      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
      : 'bg-sky-50 text-sky-600 border border-sky-200';

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] ${styles}`}>
      {label}
    </span>
  );
}
