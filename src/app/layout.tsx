import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import { Inter, Noto_Sans_SC, JetBrains_Mono, Dancing_Script } from 'next/font/google';
import './globals.css';
import AuthSessionProvider from '@/components/providers/session-provider';
import { GoogleAnalytics } from '@/lib/analytics/google-analytics';
import { StructuredData } from '@/components/seo/structured-data';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  fallback: ['system-ui', 'arial'],
});

const notoSans = Noto_Sans_SC({
  subsets: ['latin'],
  variable: '--font-noto-sans-sc',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  fallback: ['system-ui', 'arial'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  fallback: ['monospace'],
});

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing-script',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  fallback: ['cursive'],
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
      <head>
        <StructuredData type="website" />
      </head>
      <body className={`${inter.variable} ${notoSans.variable} ${jetbrainsMono.variable} ${dancingScript.variable} antialiased`}>
        {gaId && <GoogleAnalytics measurementId={gaId} />}
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
