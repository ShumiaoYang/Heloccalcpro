'use client';

import { useEffect, useRef, useState } from 'react';
import type { SiteContent } from '@/lib/content';

type ToolCopy = SiteContent['tool'];

type ToolCardProps = {
  copy: ToolCopy;
};

type RunState = 'idle' | 'loading' | 'success' | 'error';

export default function ToolCard({ copy }: ToolCardProps) {
  const [prompt, setPrompt] = useState('');
  const [length, setLength] = useState(3);
  const [state, setState] = useState<RunState>('idle');
  const [message, setMessage] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const clearPending = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const runMock = (value: string) => {
    clearPending();
    setState('loading');
    setMessage('');

    timeoutRef.current = setTimeout(() => {
      if (value.trim().toLowerCase() === 'trigger-error') {
        setState('error');
        setMessage(copy.mockError);
      } else {
        setState('success');
        setMessage(`${copy.mockSuccess} (≈${length * 80} chars)`);
      }
    }, 750);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!prompt.trim()) return;
    runMock(prompt);
  };

  const handleReset = () => {
    clearPending();
    setPrompt('');
    setLength(3);
    setState('idle');
    setMessage('');
  };

  return (
    <div className="grid gap-6 rounded-3xl border border-sky-100 bg-white/90 p-6 shadow-xl shadow-sky-100/60 lg:grid-cols-4 lg:gap-8 lg:p-8">
      <form onSubmit={handleSubmit} className="space-y-5 lg:col-span-1">
        <div>
          <label htmlFor="prompt" className="text-sm font-medium text-slate-700">
            {copy.inputLabel}
          </label>
          <textarea
            id="prompt"
            name="prompt"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder={copy.inputPlaceholder}
            rows={6}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
          <p className="mt-2 text-xs text-slate-500">{copy.helperText}</p>
        </div>

        <div className="space-y-3">
          <fieldset className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <legend className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              {copy.modelLabel}
            </legend>
            <select
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
              defaultValue="gpt-4-turbo"
              disabled
            >
              <option value="gpt-4-turbo">gpt-4-turbo (Mock)</option>
            </select>
            <p className="text-xs text-slate-500">Model selection is configurable per tool.</p>
          </fieldset>

          <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <label htmlFor="summary-length" className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              {copy.lengthLabel}
            </label>
            <input
              id="summary-length"
              type="range"
              min={1}
              max={5}
              value={length}
              onChange={(event) => setLength(Number(event.target.value))}
              className="w-full accent-sky-500"
            />
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Concise</span>
              <span>{length}</span>
              <span>Detailed</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
            disabled={!prompt.trim() || state === 'loading'}
          >
            {state === 'loading' ? copy.loading : copy.generate}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-sky-200 hover:text-sky-700"
          >
            {copy.reset}
          </button>
        </div>
      </form>

      <div className="lg:col-span-3">
        <div className="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-inner">
          {state === 'idle' && (
            <EmptyState title={copy.title} description={copy.description} />
          )}
          {state === 'loading' && <LoadingState />}
          {state === 'success' && <ResultState variant="success" message={message} />}
          {state === 'error' && <ResultState variant="error" message={message} />}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex h-full flex-col items-start justify-center gap-4 text-left text-slate-600">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="text-sm leading-relaxed">{description}</p>
      <ul className="space-y-2 text-xs text-slate-500">
        <li>• Support success, failure, and loading flows.</li>
        <li>• Adjust layout via configuration-driven tool cards.</li>
        <li>• Replace mock logic with API integration when ready.</li>
      </ul>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex h-full flex-col justify-center space-y-4">
      <div className="flex items-center gap-3 text-slate-600">
        <span className="h-3 w-3 animate-ping rounded-full bg-sky-400" />
        <span className="text-sm font-medium">Processing request…</span>
      </div>
      <div className="space-y-2">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="h-4 animate-pulse rounded bg-slate-200/60" />
        ))}
      </div>
    </div>
  );
}

function ResultState({ variant, message }: { variant: 'success' | 'error'; message: string }) {
  const isError = variant === 'error';
  return (
    <div
      className={`flex h-full flex-col justify-center rounded-2xl border px-6 py-6 text-sm leading-relaxed ${
        isError
          ? 'border-rose-200 bg-rose-50 text-rose-700'
          : 'border-emerald-200 bg-emerald-50 text-emerald-700'
      }`}
    >
      <p>{message}</p>
    </div>
  );
}
