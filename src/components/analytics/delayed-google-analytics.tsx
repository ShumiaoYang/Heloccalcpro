'use client';

import { useEffect, useState } from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';

type DelayedGoogleAnalyticsProps = {
  gaId: string;
};

export default function DelayedGoogleAnalytics({ gaId }: DelayedGoogleAnalyticsProps) {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const win = window as Window & {
      requestIdleCallback?: (
        callback: IdleRequestCallback,
        options?: IdleRequestOptions,
      ) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    let timeoutId: number | null = null;
    let idleId: number | null = null;
    let cancelled = false;

    const activate = () => {
      if (!cancelled) {
        setShouldLoad(true);
      }
    };

    const scheduleLoad = () => {
      if (win.requestIdleCallback) {
        idleId = win.requestIdleCallback(activate, { timeout: 2000 });
        return;
      }

      timeoutId = window.setTimeout(activate, 1200);
    };

    if (document.readyState === 'complete') {
      scheduleLoad();
      return () => {
        cancelled = true;
        if (idleId !== null && win.cancelIdleCallback) {
          win.cancelIdleCallback(idleId);
        }
        if (timeoutId !== null) {
          window.clearTimeout(timeoutId);
        }
      };
    }

    const onLoad = () => scheduleLoad();
    window.addEventListener('load', onLoad, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener('load', onLoad);
      if (idleId !== null && win.cancelIdleCallback) {
        win.cancelIdleCallback(idleId);
      }
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  if (!shouldLoad) return null;

  return <GoogleAnalytics gaId={gaId} />;
}
