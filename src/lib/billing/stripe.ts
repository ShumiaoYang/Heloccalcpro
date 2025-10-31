type StripeConstructor = typeof import('stripe').default;

export const stripeMockMode = process.env.STRIPE_MOCK_MODE === 'true';

let StripeClient: StripeConstructor | null = null;

try {
  // eslint-disable-next-line global-require
  const stripeModule = require('stripe');
  StripeClient = stripeModule?.default ?? stripeModule;
} catch (error) {
  if (process.env.NODE_ENV === 'production') {
    console.error('[billing] 未安装 Stripe SDK，请执行 `npm install stripe`。', error);
  } else {
    console.warn('[billing] 未检测到 Stripe SDK，相关功能将处于禁用状态。');
  }
}

const stripeSecret = process.env.STRIPE_SECRET_KEY;

if (!stripeSecret && !stripeMockMode && process.env.NODE_ENV === 'production') {
  throw new Error('STRIPE_SECRET_KEY 未配置，无法初始化 Stripe 客户端。');
}

if (!stripeSecret && !stripeMockMode) {
  console.warn('[billing] STRIPE_SECRET_KEY 未配置，Stripe 客户端将以禁用模式运行。');
}

export const stripe =
  StripeClient && stripeSecret
    ? new StripeClient(stripeSecret, {
        apiVersion: '2024-06-20',
      })
    : null;
