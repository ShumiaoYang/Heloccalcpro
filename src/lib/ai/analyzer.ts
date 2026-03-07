/**
 * AI Analyzer
 * AI分析编排器 - 协调不同的AI提供商
 */

import { OpenAIProvider } from './providers/openai';
import { GeminiProvider } from './providers/gemini';
import type { AiAnalysis, CalculatedData } from '@/types/heloc-ai';

// 重试配置
const MAX_RETRIES = parseInt(process.env.AI_MAX_RETRIES || '3', 10);
const RETRY_DELAY_MS = 1000; // 1秒

/**
 * 延迟函数
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 带重试机制的Provider调用
 */
async function callProviderWithRetry(
  provider: OpenAIProvider | GeminiProvider,
  calculatedData: CalculatedData,
  userInputs: Record<string, any>,
  providerName: string
): Promise<AiAnalysis> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`[${providerName}] Attempt ${attempt}/${MAX_RETRIES}`);
      const result = await provider.analyze(calculatedData, userInputs);
      console.log(`[${providerName}] Success on attempt ${attempt}`);
      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`[${providerName}] Attempt ${attempt} failed:`, lastError.message);

      if (attempt < MAX_RETRIES) {
        await delay(RETRY_DELAY_MS * attempt); // 指数退避
      }
    }
  }

  throw lastError || new Error(`${providerName} failed after ${MAX_RETRIES} attempts`);
}

/**
 * 分析HELOC数据
 * @param calculatedData - 计算后的财务数据
 * @param userInputs - 用户原始输入
 * @returns AI分析结果
 */
export async function analyzeHeloc(
  calculatedData: CalculatedData,
  userInputs: Record<string, any>
): Promise<AiAnalysis> {
  // 配置Gemini Provider (主引擎)
  const geminiBaseUrl = process.env.GEMINI_BASE_URL;
  const geminiConfig = {
    apiKey: process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY_GPT5 || '',
    model: process.env.GEMINI_MODEL || 'gemini-pro',
    baseUrl: geminiBaseUrl,
    temperature: parseFloat(process.env.GEMINI_TEMPERATURE || '0.7'),
    maxTokens: parseInt(process.env.GEMINI_MAX_TOKENS || '2000', 10),
  };

  try {
    // 判断 Gemini 使用哪种 API 方式
    const isAggregatedApi = geminiBaseUrl && (
      geminiBaseUrl.includes('apicore') ||
      geminiBaseUrl.includes('openai')
    );

    if (isAggregatedApi) {
      console.log('[Gemini] Using aggregated API (OpenAI-compatible format)');
      const geminiEndpoint = geminiBaseUrl ? `${geminiBaseUrl}/chat/completions` : undefined;
      const geminiProviderViaOpenAI = new OpenAIProvider(geminiConfig, geminiEndpoint);
      return await callProviderWithRetry(
        geminiProviderViaOpenAI,
        calculatedData,
        userInputs,
        'Gemini (via OpenAI API)'
      );
    } else {
      console.log('[Gemini] Using native Google API');
      const geminiProvider = new GeminiProvider(geminiConfig);
      return await callProviderWithRetry(
        geminiProvider,
        calculatedData,
        userInputs,
        'Gemini (native)'
      );
    }
  } catch (geminiError) {
    console.error('Gemini failed after retries, falling back to OpenAI:', geminiError);

    // 配置OpenAI备用引擎
    const openaiConfig = {
      apiKey: process.env.OPENAI_API_KEY_GPT5 || '',
      model: process.env.OPENAI_MODEL || 'gpt-4',
      temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
      maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '2000', 10),
    };

    const openaiBaseUrl = process.env.OPENAI_BASE_URL;
    const openaiEndpoint = openaiBaseUrl
      ? `${openaiBaseUrl}/chat/completions`
      : undefined;

    try {
      const openaiProvider = new OpenAIProvider(openaiConfig, openaiEndpoint);
      return await callProviderWithRetry(
        openaiProvider,
        calculatedData,
        userInputs,
        'OpenAI'
      );
    } catch (openaiError) {
      console.error('Both Gemini and OpenAI failed:', openaiError);
      throw new Error(
        `AI analysis failed: Gemini error - ${geminiError instanceof Error ? geminiError.message : 'Unknown'}, ` +
        `OpenAI error - ${openaiError instanceof Error ? openaiError.message : 'Unknown'}`
      );
    }
  }
}
