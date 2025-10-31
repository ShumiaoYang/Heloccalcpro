'use client';

import { useState } from 'react';

type CheckoutButtonProps = {
  planSlug: string;
  label: string;
  processingLabel: string;
  errorMessage: string;
  className?: string;
  disabled?: boolean;
};

export default function CheckoutButton({
  planSlug,
  label,
  processingLabel,
  errorMessage,
  className,
  disabled,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading || disabled) return;
    setLoading(true);
    try {
      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planSlug }),
      });

      if (!response.ok) {
        throw new Error(await extractErrorMessage(response));
      }

      const data = await response.json();
      if (data?.url) {
        window.location.href = data.url as string;
      } else {
        throw new Error('Missing checkout url');
      }
    } catch (error) {
      console.error('[billing] checkout failed', error);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-300 ${className ?? ''}`}
      disabled={loading || disabled}
    >
      {loading ? processingLabel : label}
    </button>
  );
}

async function extractErrorMessage(response: Response) {
  try {
    const data = await response.json();
    return data?.message ?? 'Unknown error';
  } catch {
    return 'Unknown error';
  }
}
