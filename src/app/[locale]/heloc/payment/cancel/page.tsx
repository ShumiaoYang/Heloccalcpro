import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payment Canceled',
  robots: {
    index: false,
    follow: true,
  },
};

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Cancel Icon */}
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        {/* Cancel Message */}
        <h1 className="text-2xl font-bold text-stone-900 mb-2">
          Payment Cancelled
        </h1>
        <p className="text-stone-600 mb-6">
          Your payment was not completed. No charges were made.
        </p>

        {/* Try Again Button */}
        <Link
          href="/"
          className="inline-block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg mb-4 transition-colors"
        >
          Try Again
        </Link>

        {/* Help Text */}
        <p className="text-sm text-stone-500">
          Need help? Contact us at support@heloccalculator.pro
        </p>
      </div>
    </div>
  );
}
