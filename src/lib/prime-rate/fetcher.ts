/**
 * Prime Rate Fetcher - FRED API Integration
 */

interface FREDObservation {
  realtime_start: string;
  realtime_end: string;
  date: string;
  value: string;
}

interface FREDResponse {
  realtime_start: string;
  realtime_end: string;
  observation_start: string;
  observation_end: string;
  units: string;
  output_type: number;
  file_type: string;
  order_by: string;
  sort_order: string;
  count: number;
  offset: number;
  limit: number;
  observations: FREDObservation[];
}

/**
 * Fetch latest Prime Rate from FRED API
 * Series ID: DPRIME (Bank Prime Loan Rate)
 */
export async function fetchLatestPrimeRate(): Promise<number> {
  const apiKey = process.env.FRED_API_KEY;

  if (!apiKey) {
    throw new Error('FRED_API_KEY not configured');
  }

  const url = `https://api.stlouisfed.org/fred/series/observations?series_id=DPRIME&api_key=${apiKey}&limit=1&sort_order=desc&file_type=json`;

  const response = await fetch(url, {
    next: { revalidate: 0 }, // No cache for fetcher
  });

  if (!response.ok) {
    throw new Error(`FRED API error: ${response.status}`);
  }

  const data: FREDResponse = await response.json();

  if (!data.observations || data.observations.length === 0) {
    throw new Error('No Prime Rate data available');
  }

  const rate = parseFloat(data.observations[0].value);

  if (isNaN(rate)) {
    throw new Error('Invalid Prime Rate value');
  }

  return rate;
}
