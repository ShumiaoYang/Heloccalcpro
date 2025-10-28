import { SummarizerError } from './errors';
import type { SummarizerProvider } from './config';

type BaseParams = {
  prompt: string;
  length: number;
  locale: string;
};

export type ProviderResult = {
  summary: string;
  model: string;
};

export async function runProvider(
  provider: SummarizerProvider,
  model: string,
  params: BaseParams,
): Promise<ProviderResult> {
  if (provider === 'openai') {
    return runWithOpenAI(model, params);
  }
  return runWithMock(model, params);
}

async function runWithOpenAI(model: string, params: BaseParams): Promise<ProviderResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new SummarizerError('OPENAI_API_KEY 未配置，无法调用 OpenAI。', 'config');
  }

  const baseUrl = process.env.OPENAI_BASE_URL ?? 'https://api.openai.com/v1';
  const temperature = Number(process.env.OPENAI_SUMMARIZER_TEMP ?? '0.2');

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature,
      messages: [
        {
          role: 'system',
          content:
            'You are an AI writing assistant that summarizes the provided content. Respond in the same language as the user unless instructed otherwise.',
        },
        {
          role: 'user',
          content: buildOpenAIUserPrompt(params),
        },
      ],
    }),
  });

  if (!response.ok) {
    let errorMessage = response.statusText;
    try {
      const errorJson = await response.json();
      errorMessage = errorJson.error?.message || errorMessage;
    } catch {
      // ignore json parse error
    }
    throw new SummarizerError(`OpenAI 调用失败: ${errorMessage}`, 'provider');
  }

  const data = await response.json();
  const summary = data.choices?.[0]?.message?.content?.trim();
  if (!summary) {
    throw new SummarizerError('OpenAI 返回内容为空。', 'provider');
  }

  return { summary, model };
}

function buildOpenAIUserPrompt({ prompt, length, locale }: BaseParams) {
  const lengthHint = Math.min(Math.max(length, 1), 5);
  const tone = lengthHint <= 2 ? 'concise' : lengthHint >= 5 ? 'detailed' : 'balanced';
  return [
    `Language: ${locale}`,
    `Tone: ${tone}`,
    `Length scale: ${lengthHint} (1 = short, 5 = detailed)`,
    '',
    'Text to summarize:',
    prompt,
  ].join('\n');
}

async function runWithMock(model: string, params: BaseParams): Promise<ProviderResult> {
  const summary = buildMockSummary(params.prompt, params.length);
  return { summary, model };
}

function buildMockSummary(prompt: string, length: number) {
  const normalized = prompt.replace(/\s+/g, ' ').trim();
  if (normalized.length <= 180) {
    return normalized;
  }

  const approx = Math.max(80, Math.min(220 * length, normalized.length));
  const truncated = normalized.slice(0, approx);
  return `${truncated}${normalized.length > approx ? '…' : ''}`;
}
