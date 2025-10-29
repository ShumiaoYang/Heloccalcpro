import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import { Inter, Noto_Sans_SC } from 'next/font/google';
import './globals.css';
import AuthSessionProvider from '@/components/providers/session-provider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoSans = Noto_Sans_SC({
  subsets: ['latin'],
  variable: '--font-noto-sans-sc',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'AI Toolbox',
  description: 'AI tools hub with localization, SEO, and extensible tool cards.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} ${notoSans.variable} bg-slate-950 text-slate-100 antialiased`}>
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
