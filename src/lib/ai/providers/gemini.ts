/**
 * Gemini Provider
 * Google Gemini 集成（备用引擎）
 */

import { AIProvider, AIProviderConfig } from './base';
import type { AiAnalysis, CalculatedData, ScenarioType } from '@/types/heloc-ai';
import { generatePrompt } from '../prompts';

export class GeminiProvider extends AIProvider {
  private apiEndpoint: string;

  constructor(config: AIProviderConfig) {
    super(config);
    // 使用配置的 baseUrl，如果没有则使用默认的 Google Gemini API
    this.apiEndpoint = config.baseUrl
      ? `${config.baseUrl}/models`
      : 'https://generativelanguage.googleapis.com/v1beta/models';
  }

  async analyze(
    calculatedData: CalculatedData,
    userInputs: Record<string, any>
  ): Promise<AiAnalysis> {
    const scenario = userInputs.scenario as ScenarioType;
    if (!scenario) {
      throw new Error('Scenario type is required');
    }

    // 生成Prompt
    const prompt = generatePrompt(scenario, {
      calculatedData,
      userInputs,
    });

    // 调用Gemini API
    const response = await this.callGemini(prompt.systemRole, prompt.userMessage);

    // 解析并验证响应
    return this.parseResponse(response);
  }

  async healthCheck(): Promise<boolean> {
    try {
      const url = `${this.apiEndpoint}/${this.config.model}?key=${this.config.apiKey}`;
      const response = await fetch(url, {
        method: 'GET',
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * 调用Gemini API
   */
  private async callGemini(systemRole: string, userMessage: string): Promise<string> {
    const url = `${this.apiEndpoint}/${this.config.model}:generateContent?key=${this.config.apiKey}`;

    // Gemini使用不同的消息格式，需要将system role合并到user message中
    const combinedPrompt = `${systemRole}\n\n${userMessage}\n\nPlease respond in JSON format.`;

    // 创建AbortController用于超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); // 45秒超时

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: combinedPrompt,
            }],
          }],
          generationConfig: {
            temperature: this.config.temperature,
            maxOutputTokens: this.config.maxTokens,
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Gemini API error: ${response.status} - ${error}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Gemini API request timeout after 45 seconds');
      }
      throw error;
    }
  }

  /**
   * 解析并验证AI响应
   */
  private parseResponse(responseText: string): AiAnalysis {
    try {
      // Gemini可能返回带有markdown代码块的JSON，需要清理
      let cleanedText = responseText.trim();
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/^```json\n/, '').replace(/\n```$/, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```\n/, '').replace(/\n```$/, '');
      }

      const parsed = JSON.parse(cleanedText);

      // 验证必需字段
      if (!parsed.summary || !parsed.diagnostic || !parsed.strategy) {
        throw new Error('Missing required fields in AI response');
      }

      if (!Array.isArray(parsed.actionPlan) || parsed.actionPlan.length < 3) {
        throw new Error('actionPlan must be an array with at least 3 items');
      }

      if (!Array.isArray(parsed.tips)) {
        throw new Error('tips must be an array');
      }

      return {
        summary: parsed.summary,
        diagnostic: parsed.diagnostic,
        strategy: parsed.strategy,
        actionPlan: parsed.actionPlan,
        tips: parsed.tips,
        stressTestCommentary: parsed.stressTestCommentary,
      };
    } catch (error) {
      throw new Error(`Failed to parse AI response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
