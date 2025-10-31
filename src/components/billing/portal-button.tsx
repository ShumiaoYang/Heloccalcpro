'use client';

import { useState } from 'react';

type PortalButtonProps = {
  label: string;
  processingLabel: string;
  errorMessage: string;
  className?: string;
};

export default function PortalButton({ label, processingLabel, errorMessage, className }: PortalButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch('/api/billing/portal', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(await extractErrorMessage(response));
      }

      const data = await response.json();
      if (data?.url) {
        window.location.href = data.url as string;
      } else {
        throw new Error('Missing portal url');
      }
    } catch (error) {
      console.error('[billing] portal launch failed', error);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:text-sky-600 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 ${className ?? ''}`}
      disabled={loading}
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
