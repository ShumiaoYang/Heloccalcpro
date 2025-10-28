"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { signIn } from 'next-auth/react';
import { ArrowLeft, BadgeCheck, ShieldCheck, Sparkles } from 'lucide-react';

const highlightIcons = [BadgeCheck, ShieldCheck, Sparkles];

export default function LoginPageClient() {
  const [loading, setLoading] = useState(false);
  const locale = useLocale();
  const t = useTranslations('login');

  const highlights = t.raw('highlights') as { title: string; description: string }[];

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signIn('google', { callbackUrl: `/${locale}` });
    } catch (error) {
      console.error('Google sign-in failed', error);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-white via-sky-50 to-blue-50">
      <div className="flex items-center gap-4 px-6 py-4 text-sm text-slate-600">
        <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-slate-500 transition hover:text-sky-600">
          <ArrowLeft className="h-4 w-4" />
          {t('backToHome')}
        </Link>
        <span className="text-xs uppercase tracking-[0.3em] text-slate-400">{t('badgeLabel')}</span>
      </div>
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-10">
        <div className="grid w-full max-w-4xl gap-6 rounded-3xl border border-sky-100 bg-white/90 p-8 shadow-xl shadow-sky-100/60 lg:grid-cols-2">
          <div className="space-y-6">
            <span className="inline-flex rounded-full border border-sky-100 bg-sky-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">
              {t('badgeLabel')}
            </span>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{t('title')}</h1>
              <p className="text-sm leading-relaxed text-slate-600">
                {t.rich('description', {
                  mailto: (chunks) => (
                    <a href="mailto:product@aitoolbox.com" className="text-sky-600 hover:underline">
                      {chunks}
                    </a>
                  ),
                })}
              </p>
            </div>
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              <Image src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" aria-hidden width={20} height={20} />
              {loading ? t('ctaLoading') : t('ctaPrimary')}
            </button>
            <p className="text-xs text-slate-500">{t('disclaimer')}</p>
          </div>
          <div className="space-y-4 rounded-2xl border border-slate-100 bg-white/80 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{t('comingSoon')}</p>
            <div className="space-y-4">
              {highlights.map(({ title, description }, index) => {
                const Icon = highlightIcons[index % highlightIcons.length];
                return (
                  <div key={title} className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                    <span className="rounded-full bg-white p-2 text-slate-600 shadow">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
                      <p className="text-sm text-slate-600">{description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
