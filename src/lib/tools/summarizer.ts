import { getSummarizerConfig, type SummarizerConfig } from './config';
import { isSummarizerError, SummarizerError } from './errors';
import { runProvider } from './provider';

export type SummarizeParams = {
  prompt: string;
  length: number;
  locale: string;
};

export type SummarizeResult = {
  summary: string;
  model: string;
};

const MIN_LENGTH = 1;
const MAX_LENGTH = 5;
const MAX_PROMPT_CHARS = 4000;

export async function summarize(
  params: SummarizeParams,
  configOverride?: SummarizerConfig,
): Promise<SummarizeResult> {
  validateInput(params);

  const config = configOverride ?? getSummarizerConfig();

  try {
    const providerResult = await runProvider(config.provider, config.model, params, {
      temperature: config.temperature,
      maxOutputTokens: config.maxOutputTokens,
    });
    return providerResult;
  } catch (error) {
    if (isSummarizerError(error)) {
      throw error;
    }

    throw new SummarizerError('摘要服务调用出现未知错误。', 'unknown');
  }
}

function validateInput({ prompt, length }: SummarizeParams) {
  if (typeof prompt !== 'string') {
    throw new SummarizerError('请输入有效的文本内容。', 'validation');
  }

  const trimmed = prompt.trim();
  if (trimmed.length === 0) {
    throw new SummarizerError('文本内容不能为空。', 'validation');
  }

  if (trimmed.length > MAX_PROMPT_CHARS) {
    throw new SummarizerError('文本超出最大长度限制（最多 4000 字符）。', 'validation');
  }

  if (Number.isNaN(length) || length < MIN_LENGTH || length > MAX_LENGTH) {
    throw new SummarizerError('摘要长度参数无效。', 'validation');
  }
}
