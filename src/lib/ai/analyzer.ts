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
  // 配置OpenAI Provider (主引擎)
  const openaiConfig = {
    apiKey: process.env.OPENAI_API_KEY_GPT5 || '',
    model: process.env.OPENAI_MODEL || 'gpt-4',
    temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
    maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '2000', 10),
  };

  // 获取自定义API端点（支持第三方API如apicore.ai）
  const openaiBaseUrl = process.env.OPENAI_BASE_URL;
  const openaiEndpoint = openaiBaseUrl
    ? `${openaiBaseUrl}/chat/completions`
    : undefined;

  const openaiProvider = new OpenAIProvider(openaiConfig, openaiEndpoint);

  try {
    // 尝试使用OpenAI (带重试)
    return await callProviderWithRetry(
      openaiProvider,
      calculatedData,
      userInputs,
      'OpenAI'
    );
  } catch (openaiError) {
    console.error('OpenAI failed after retries, falling back to Gemini:', openaiError);

    // 配置Gemini备用引擎
    // 如果使用聚合API（如apicore.ai），Gemini也通过OpenAI兼容接口调用
    const geminiConfig = {
      apiKey: process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY_GPT5 || '',
      model: process.env.GEMINI_MODEL || 'gemini-pro',
      temperature: parseFloat(process.env.GEMINI_TEMPERATURE || '0.7'),
      maxTokens: parseInt(process.env.GEMINI_MAX_TOKENS || '2000', 10),
    };

    try {
      // 检查是否使用聚合API（通过OPENAI_BASE_URL判断）
      if (openaiBaseUrl && openaiBaseUrl.includes('apicore')) {
        console.log('[Gemini] Using aggregated API (OpenAI-compatible format)');
        // 使用OpenAI Provider调用Gemini模型（聚合API）
        const geminiProviderViaOpenAI = new OpenAIProvider(geminiConfig, openaiEndpoint);
        return await callProviderWithRetry(
          geminiProviderViaOpenAI,
          calculatedData,
          userInputs,
          'Gemini (via OpenAI API)'
        );
      } else {
        console.log('[Gemini] Using native Google API');
        // 使用原生Google Gemini API
        const geminiProvider = new GeminiProvider(geminiConfig);
        return await callProviderWithRetry(
          geminiProvider,
          calculatedData,
          userInputs,
          'Gemini (native)'
        );
      }
    } catch (geminiError) {
      // 两个引擎都失败了
      console.error('Both OpenAI and Gemini failed:', geminiError);
      throw new Error(
        `AI analysis failed: OpenAI error - ${openaiError instanceof Error ? openaiError.message : 'Unknown'}, ` +
        `Gemini error - ${geminiError instanceof Error ? geminiError.message : 'Unknown'}`
      );
    }
  }
}
