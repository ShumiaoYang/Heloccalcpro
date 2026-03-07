/**
 * OpenAI Provider (GPT-5)
 * OpenAI GPT-5 集成
 */

import { AIProvider, AIProviderConfig } from './base';
import type { AiAnalysis, CalculatedData, ScenarioType } from '@/types/heloc-ai';
import { generatePrompt } from '../prompts';
import { getSystemRolePrompt, getUserPromptV3 } from '../prompts/base';

export class OpenAIProvider extends AIProvider {
  private apiEndpoint: string;

  constructor(config: AIProviderConfig, customEndpoint?: string) {
    super(config);
    // 支持自定义API端点（如apicore.ai）
    this.apiEndpoint = customEndpoint || 'https://api.openai.com/v1/chat/completions';
  }

  async analyze(
    calculatedData: CalculatedData,
    userInputs: Record<string, any>
  ): Promise<AiAnalysis> {
    const systemRole = getSystemRolePrompt();
    const userMessage = getUserPromptV3({ calculatedData, userInputs });

    const response = await this.callOpenAI(systemRole, userMessage);

    // Clean markdown code blocks if present
    let cleanedResponse = response.trim();
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    // Parse JSON response
    const parsed = JSON.parse(cleanedResponse);

    return {
      summary: parsed.executiveBrief || '',
      diagnostic: parsed.bankEvaluation?.dtiInsight || '',
      strategy: parsed.goalAnalysis?.advisorNote || '',
      actionPlan: parsed.bankReadiness || [],
      tips: [],
      // v3.0 structured data
      v3Report: parsed,
    };
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * 调用OpenAI API
   */
  private async callOpenAI(systemRole: string, userMessage: string): Promise<string> {
    // 创建AbortController用于超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); // 45秒超时

    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            { role: 'system', content: systemRole },
            { role: 'user', content: userMessage },
          ],
          temperature: this.config.temperature,
          max_tokens: this.config.maxTokens,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenAI API error: ${response.status} - ${error}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('OpenAI API request timeout after 45 seconds');
      }
      throw error;
    }
  }

  /**
   * 解析并验证AI响应
   */
  private parseResponse(responseText: string): AiAnalysis {
    try {
      const parsed = JSON.parse(responseText);

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
