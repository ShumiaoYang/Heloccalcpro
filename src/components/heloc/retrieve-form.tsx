'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RetrieveForm() {
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [report, setReport] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setReport(null);

    if (!transactionId || transactionId.trim().length === 0) {
      setError('Please enter a valid Stripe Transaction ID');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/heloc/retrieve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stripePaymentId: transactionId.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.report) {
          setReport(data.report);
          setSuccess(true);
        } else {
          setError('No report found for this Transaction ID');
        }
      } else {
        setError(data.error || 'Failed to retrieve report');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-stone-900 mb-2">
            Retrieve Your Report
          </h1>
          <p className="text-stone-600">
            Enter your Stripe Transaction ID from the payment receipt
          </p>
        </div>

        {/* Form */}
        {!success && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Stripe Transaction ID
              </label>
              <input
                type="text"
                placeholder="pi_xxxxxxxxxxxxxxxxxxxxx"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm"
              />
              <p className="mt-2 text-xs text-stone-500">
                You can find this ID in your Stripe payment receipt email
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Retrieving...
                </span>
              ) : (
                'Retrieve Report'
              )}
            </button>
          </form>
        )}

        {/* Success - Single Report */}
        {success && report && (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
              <p className="text-sm text-green-700">
                ✓ Report found! You can download it below.
              </p>
            </div>

            <div className="p-6 border border-stone-200 rounded-lg bg-stone-50">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-stone-900 mb-1">
                    HELOC Financial Report
                  </h3>
                  <p className="text-sm text-stone-600">
                    Generated: {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="pt-3 border-t border-stone-200">
                  <p className="text-xs text-stone-500 mb-1">Transaction ID:</p>
                  <p className="text-sm font-mono text-stone-700 break-all">
                    {report.stripePaymentId}
                  </p>
                </div>
                <a
                  href={report.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors mt-4"
                >
                  Download Report
                </a>
              </div>
            </div>

            <button
              onClick={() => {
                setSuccess(false);
                setReport(null);
                setTransactionId('');
              }}
              className="w-full mt-6 bg-stone-200 hover:bg-stone-300 text-stone-700 font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Search Another Transaction
            </button>
          </div>
        )}

        {/* Back to Calculator Link */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            ← Back to Calculator
          </Link>
        </div>
      </div>
    </div>
  );
}
