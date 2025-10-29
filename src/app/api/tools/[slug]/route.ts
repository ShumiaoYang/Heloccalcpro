import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { locales, type Locale } from '@/i18n/routing';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/prisma';
import {
  getToolConfigBySlug,
  getSummarizerConfig,
  TOOL_SUMMARIZER_SLUG,
  type ToolConfig,
} from '@/lib/tools/config';
import { summarize } from '@/lib/tools/summarizer';
import { SummarizerError, isSummarizerError } from '@/lib/tools/errors';
import { ToolRunStatus } from '@prisma/client';

const MIN_LATENCY_MS = 600;

export async function POST(
  request: Request,
  { params }: { params: { slug: string } },
) {
  const { slug } = params;
  const startedAt = Date.now();
  const session = await getServerSession(authOptions);

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { code: 'invalid_payload', message: '请求体无法解析，请确认为 JSON 格式。' },
      { status: 400 },
    );
  }

  const toolConfig = getToolConfigBySlug(slug);
  if (!toolConfig) {
    return NextResponse.json(
      { code: 'tool_not_found', message: '未找到对应的工具配置。' },
      { status: 404 },
    );
  }

  if (toolConfig.status !== 'live') {
    return NextResponse.json(
      { code: 'tool_disabled', message: '该工具尚未上线或暂不可用。' },
      { status: 503 },
    );
  }

  try {
    const result = await runToolByType(toolConfig, payload as Record<string, unknown>);

    await logToolRun({
      slug,
      status: ToolRunStatus.SUCCESS,
      payload,
      result,
      sessionUserId: session?.user?.id,
    });

    await ensureMinLatency(startedAt);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    await logToolRun({
      slug,
      status: ToolRunStatus.FAILED,
      error,
      sessionUserId: session?.user?.id,
      payload,
    });

    await ensureMinLatency(startedAt);

    return handleError(error);
  }
}

async function runToolByType(config: ToolConfig, payload: Record<string, unknown>) {
  if (config.type === 'summarizer' && config.slug === TOOL_SUMMARIZER_SLUG) {
    const { prompt, length, locale } = normalizeSummarizerPayload(payload);
    const summarizerConfig = getSummarizerConfig(config);
    const result = await summarize({ prompt, length, locale }, summarizerConfig);

    return {
      summary: result.summary,
      model: result.model,
    };
  }

  throw new SummarizerError('当前工具类型暂未接入真实推理。', 'config');
}

function normalizeSummarizerPayload(payload: Record<string, unknown>) {
  const prompt = typeof payload.prompt === 'string' ? payload.prompt : '';
  const length = Number(payload.length ?? 3);
  const locale = sanitizeLocale(payload.locale);

  return { prompt, length, locale };
}

function sanitizeLocale(value: unknown): Locale {
  if (typeof value === 'string') {
    const candidate = value as Locale;
    if ((locales as readonly string[]).includes(candidate)) {
      return candidate;
    }
  }
  return 'en';
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

type SuccessLogParams = {
  slug: string;
  status: Extract<ToolRunStatus, 'SUCCESS'>;
  payload: unknown;
  result: unknown;
  sessionUserId?: string;
};

type FailureLogParams = {
  slug: string;
  status: Extract<ToolRunStatus, 'FAILED'>;
  payload: unknown;
  error: unknown;
  sessionUserId?: string;
};

async function logToolRun(params: SuccessLogParams | FailureLogParams) {
  try {
    const tool = await prisma.tool.upsert({
      where: { slug: params.slug },
      create: {
        slug: params.slug,
        name: params.slug,
        description: 'Auto-created from tool config',
        isActive: true,
      },
      update: {},
    });

    await prisma.toolRun.create({
      data: {
        toolId: tool.id,
        userId: params.sessionUserId ?? undefined,
        input: params.payload ?? {},
        output:
          params.status === ToolRunStatus.SUCCESS
            ? params.result ?? {}
            : { error: serializeError(params.error) },
        status: params.status,
      },
    });
  } catch (loggingError) {
    console.error('[tool-run-log-failed]', loggingError);
  }
}

function serializeError(error: unknown) {
  if (!error) return { message: 'Unknown error' };
  if (error instanceof Error) {
    return { message: error.message, stack: error.stack };
  }
  try {
    return JSON.parse(JSON.stringify(error));
  } catch {
    return { message: String(error) };
  }
}
