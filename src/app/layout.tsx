import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import { Inter } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';
import AuthSessionProvider from '@/components/providers/session-provider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  fallback: ['system-ui', 'arial'],
});

export const metadata: Metadata = {
  title: 'HELOC Calculator - Smart Home Equity Decisions',
  description: 'Calculate your Home Equity Line of Credit with real-time results, risk scoring, and stress testing. Make smarter financial decisions with our free HELOC calculator.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        {gaId && <GoogleAnalytics gaId={gaId} />}
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
