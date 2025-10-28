import { NextResponse } from 'next/server';
import { isSummarizerError } from '@/lib/tools/errors';
import { summarize } from '@/lib/tools/summarizer';

const MIN_LATENCY_MS = 600;

type RequestPayload = {
  prompt?: string;
  length?: number;
  locale?: string;
};

export async function POST(request: Request) {
  const startedAt = Date.now();

  try {
    const payload = (await request.json()) as RequestPayload;
    const prompt = payload.prompt ?? '';
    const length = Number(payload.length ?? 3);
    const locale = typeof payload.locale === 'string' ? payload.locale : 'en';

    const result = await summarize({ prompt, length, locale });

    await ensureMinLatency(startedAt);

    return NextResponse.json(
      {
        summary: result.summary,
        model: result.model,
      },
      { status: 200 },
    );
  } catch (error) {
    await ensureMinLatency(startedAt);
    return handleError(error);
  }
}

function handleError(error: unknown) {
  if (isSummarizerError(error)) {
    const status = error.code === 'validation' ? 400 : error.code === 'config' ? 500 : 502;
    return NextResponse.json(
      {
        code: error.code,
        message: error.message,
        details: error.details,
      },
      { status },
    );
  }

  return NextResponse.json(
    {
      code: 'unknown',
      message: '发生未知错误，请稍后重试。',
    },
    { status: 500 },
  );
}

async function ensureMinLatency(start: number) {
  const elapsed = Date.now() - start;
  if (elapsed >= MIN_LATENCY_MS) return;
  await new Promise((resolve) => setTimeout(resolve, MIN_LATENCY_MS - elapsed));
}
