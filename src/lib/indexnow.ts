const INDEXNOW_KEY = process.env.INDEXNOW_KEY || '0dce286b89da4ff2b7fd33167fb4e036';
const INDEXNOW_ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
];

export async function submitToIndexNow(urls: string | string[]): Promise<void> {
  const urlList = Array.isArray(urls) ? urls : [urls];

  if (urlList.length === 0) return;

  const host = new URL(urlList[0]).host;

  const payload = {
    host,
    key: INDEXNOW_KEY,
    keyLocation: `https://${host}/${INDEXNOW_KEY}.txt`,
    urlList,
  };

  for (const endpoint of INDEXNOW_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log(`✓ IndexNow submitted ${urlList.length} URLs to ${endpoint}`);
        return;
      }
    } catch (error) {
      console.warn(`IndexNow submission failed for ${endpoint}:`, error);
    }
  }
}
