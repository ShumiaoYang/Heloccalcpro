import type { Metadata } from 'next';
import PaymentSuccessPageClient from './page.client';

export const metadata: Metadata = {
  title: 'Payment Success',
  robots: {
    index: false,
    follow: true,
  },
};

export default function PaymentSuccessPage() {
  return <PaymentSuccessPageClient />;
}
