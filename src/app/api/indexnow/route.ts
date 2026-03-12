import { NextResponse } from 'next/server';
import { submitToIndexNow } from '@/lib/indexnow';
import sitemap from '@/app/sitemap';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sitemapEntries = sitemap();
    const urls = sitemapEntries.map(entry => entry.url);

    await submitToIndexNow(urls);

    return NextResponse.json({
      success: true,
      message: `Submitted ${urls.length} URLs to IndexNow`,
      urls,
    });
  } catch (error) {
    console.error('IndexNow submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit to IndexNow' },
      { status: 500 }
    );
  }
}
