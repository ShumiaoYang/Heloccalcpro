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

    let activated = false;
    let timeoutId: number | null = null;

    const activate = () => {
      if (activated) return;
      activated = true;
      setShouldLoad(true);
      removeListeners();
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };

    const onInteraction = () => activate();

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        activate();
      }
    };

    const removeListeners = () => {
      window.removeEventListener('pointerdown', onInteraction);
      window.removeEventListener('keydown', onInteraction);
      window.removeEventListener('touchstart', onInteraction);
      window.removeEventListener('scroll', onInteraction);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };

    window.addEventListener('pointerdown', onInteraction, { once: true, passive: true });
    window.addEventListener('keydown', onInteraction, { once: true });
    window.addEventListener('touchstart', onInteraction, { once: true, passive: true });
    window.addEventListener('scroll', onInteraction, { once: true, passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);

    timeoutId = window.setTimeout(activate, 15000);

    return () => {
      removeListeners();
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  if (!shouldLoad) return null;

  return <GoogleAnalytics gaId={gaId} />;
}
