'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    let pollCount = 0;
    const maxPolls = 10; // 10次轮询，总计约17秒
    let timeoutId: NodeJS.Timeout;

    const fetchPdfUrl = async () => {
      try {
        const response = await fetch(`/api/heloc/purchase?session_id=${sessionId}`);
        const data = await response.json();

        if (response.ok && data.pdfUrl) {
          setPdfUrl(data.pdfUrl);
          setLoading(false);
          return;
        }

        pollCount++;
        if (pollCount >= maxPolls) {
          setLoading(false);
          setError('PDF generation is taking longer than expected. You can retry or check your email.');
          return;
        }

        // 方案2：前3次1秒，后续2秒 (总计: 3×1 + 7×2 = 17秒)
        const delay = pollCount <= 3 ? 1000 : 2000;
        timeoutId = setTimeout(fetchPdfUrl, delay);
      } catch (error) {
        console.error('Failed to fetch PDF URL:', error);
        pollCount++;
        if (pollCount >= maxPolls) {
          setLoading(false);
          setError('Failed to retrieve PDF. Please try again or check your email.');
        } else {
          const delay = pollCount <= 3 ? 1000 : 2000;
          timeoutId = setTimeout(fetchPdfUrl, delay);
        }
      }
    };

    fetchPdfUrl();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [sessionId, retrying]);

  const handleDownload = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setRetrying(!retrying); // Toggle to trigger useEffect
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-2xl font-bold text-stone-900 mb-2">
          Payment Successful!
        </h1>
        <p className="text-stone-600 mb-6">
          Your HELOC Financial Report is ready
        </p>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={loading || !pdfUrl}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg mb-4 transition-colors"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Preparing your report...
            </span>
          ) : pdfUrl ? (
            'Download Your Report'
          ) : (
            'Report generation failed - Please contact support'
          )}
        </button>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 mb-3">{error}</p>
            <button
              onClick={handleRetry}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {/* Email Confirmation */}
        <p className="text-sm text-stone-500 mb-6">
          We&apos;ve also sent a copy to your email
        </p>

        {/* Return Home Link */}
        <Link
          href="/"
          className="text-emerald-600 hover:text-emerald-700 font-medium"
        >
          Return to Calculator
        </Link>
      </div>
    </div>
  );
}
