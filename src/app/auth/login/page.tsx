import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';

type SearchParams = Record<string, string | string[] | undefined>;

export default async function AuthLoginRedirect({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const locale = await getLocale();
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (typeof value === 'string') {
      params.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((entry) => params.append(key, entry));
    }
  });

  const query = params.toString();
  const target = `/${locale}/auth/login${query ? `?${query}` : ''}`;

  redirect(target);
}
