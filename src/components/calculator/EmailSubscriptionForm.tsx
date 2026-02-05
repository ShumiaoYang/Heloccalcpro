'use client';

import { useState } from 'react';

export default function EmailSubscriptionForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setMessage('Please enter a valid email address');
      setSuccess(false);
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/heloc/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Thanks for subscribing! You\'ll receive Prime Rate alerts.');
        setSuccess(true);
        setEmail('');
      } else {
        setMessage(data.error || 'Failed to subscribe');
        setSuccess(false);
      }
    } catch (err) {
      setMessage('An error occurred. Please try again.');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-stone-200">
      <h3 className="text-lg font-semibold text-stone-900 mb-2">
        Get Prime Rate Alerts
      </h3>
      <p className="text-sm text-stone-600 mb-4">
        Be notified when rates change
      </p>

      <form onSubmit={handleSubscribe} className="space-y-3">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-stone-100"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {loading ? 'Subscribing...' : 'Subscribe'}
        </button>

        {message && (
          <p className={`text-sm ${success ? 'text-emerald-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </form>

      <p className="text-xs text-stone-500 mt-3">
        We&apos;ll never spam you. Unsubscribe anytime.
      </p>
    </div>
  );
}
