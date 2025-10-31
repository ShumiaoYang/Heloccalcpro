declare module 'stripe' {
  type StripeMetadata = Record<string, string | null | undefined>;

  export type StripeEvent = {
    id: string;
    type: string;
    data: {
      object: unknown;
    };
  };

  export type StripeSubscriptionItem = {
    price?: {
      id?: string | null;
    } | null;
  };

  export type StripeSubscription = {
    id: string;
    status: StripeSubscriptionStatus;
    customer: string | { id: string };
    items: {
      data: StripeSubscriptionItem[];
    };
    metadata: StripeMetadata;
    current_period_end?: number | null;
    trial_end?: number | null;
    cancel_at_period_end?: boolean | null;
  };

  export type StripeSubscriptionStatus =
    | 'incomplete'
    | 'incomplete_expired'
    | 'trialing'
    | 'active'
    | 'past_due'
    | 'canceled'
    | 'unpaid';

  export type StripeCheckoutSession = {
    id: string;
    subscription?: string | { id: string };
    metadata?: StripeMetadata;
  };

  export default class Stripe {
    constructor(secretKey: string, options?: { apiVersion?: string });

    checkout: {
      sessions: {
        create(params: Record<string, unknown>): Promise<{ id: string; url?: string | null; subscription?: string }>;
      };
    };

    billingPortal: {
      sessions: {
        create(params: Record<string, unknown>): Promise<{ id: string; url?: string | null }>;
      };
    };

    customers: {
      create(params: Record<string, unknown>): Promise<{ id: string }>;
    };

    subscriptions: {
      retrieve(id: string, params?: Record<string, unknown>): Promise<StripeSubscription>;
    };

    webhooks: {
      constructEvent(payload: string | Buffer, signature: string, secret: string): StripeEvent;
    };
  }

  export namespace Stripe {
    export type Event = StripeEvent;
    export type Subscription = StripeSubscription;
    export namespace Checkout {
      export type Session = StripeCheckoutSession;
    }
  }
}
