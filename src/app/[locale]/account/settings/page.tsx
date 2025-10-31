import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { authOptions } from '@/lib/auth/options';
import { getSiteContent } from '@/lib/content';
import { getSeoMetadata } from '@/lib/seo';
import type { Locale } from '@/i18n/routing';

type PageProps = {
  params: { locale: Locale };
};

export async function generateMetadata({ params }: PageProps) {
  const { metadata } = getSeoMetadata('/account/settings', params.locale);
  return metadata;
}

export default async function AccountSettingsPage({ params }: PageProps) {
  const { locale } = params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect(`/${locale}/auth/login?callbackUrl=${encodeURIComponent(`/${locale}/account/settings`)}`);
  }

  const content = getSiteContent(locale);
  const settingsCopy = content.account?.settings;
  if (!settingsCopy) {
    throw new Error('缺少 account.settings 文案配置，请更新 content/<locale>.json');
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-12 lg:px-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{settingsCopy.title}</h1>
        <p className="text-sm text-slate-600">{settingsCopy.description}</p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Profile</h2>
        <p className="mt-2 text-sm text-slate-600">{settingsCopy.actions.updateProfile}</p>
        <p className="mt-6 text-sm text-slate-500">{settingsCopy.comingSoon}</p>
      </section>

      <section className="rounded-2xl border border-sky-100 bg-sky-50 px-6 py-6 text-sm text-slate-700">
        <h2 className="text-base font-semibold text-slate-900">{locale === 'zh' ? '需要帮助？' : 'Need help?'}</h2>
        <p className="mt-2">{settingsCopy.actions.contactSupport}</p>
        <Link
          href="mailto:product@aitoolbox.com"
          className="mt-3 inline-flex rounded-lg border border-sky-200 bg-white px-3 py-2 text-xs font-semibold text-sky-600 transition hover:border-sky-300 hover:text-sky-700"
        >
          product@aitoolbox.com
        </Link>
      </section>
    </div>
  );
}
