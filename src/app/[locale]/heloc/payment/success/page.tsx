import type { Metadata } from 'next';
import PaymentSuccessPageClient from './page.client';

export const metadata: Metadata = {
  title: 'Payment Success',
  robots: {
    index: false,
    follow: true,
  },
};

// 禁用静态生成，因为页面依赖 URL 参数
export const dynamic = 'force-dynamic';

export default function PaymentSuccessPage() {
  return <PaymentSuccessPageClient />;
}
