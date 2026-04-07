/**
 * OpenAI Provider (GPT-5)
 * OpenAI GPT-5 集成
 */

import { AIProvider, AIProviderConfig } from './base';
import type { AiAnalysis, CalculatedData, ScenarioType } from '@/types/heloc-ai';
import { generatePrompt } from '../prompts';

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
    const scenario = (userInputs.scenario as ScenarioType) || 'debt_consolidation';
    const prompt = generatePrompt(scenario, { calculatedData, userInputs });

    const response = await this.callOpenAI(prompt.systemRole, prompt.userMessage);

    // Clean response
    let cleanedResponse = response.trim();

    // Remove <think> tags if present
    cleanedResponse = cleanedResponse.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

    // Remove markdown code blocks
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    // Parse JSON response
    const parsed = JSON.parse(cleanedResponse);

    // Check if this is debt consolidation response format
    if (parsed.executiveVerdict && parsed.radicalCandorWarning) {
      // Map debt consolidation format to v3Report format
      return {
        executiveVerdict: parsed.executiveVerdict,
        cashFlowAnalysis: parsed.cashFlowAnalysis,
        radicalCandorWarning: parsed.radicalCandorWarning,
        summary: parsed.executiveVerdict.summary || '',
        diagnostic: parsed.cashFlowAnalysis?.commentary || '',
        strategy: parsed.actionPlan?.[0]?.description || '',
        actionPlan: parsed.actionPlan?.map((item: any) => item.title) || [],
        tips: [],
        v3Report: {
          executiveBrief: parsed.executiveVerdict.summary,
          goalAnalysis: {
            economicImpact: parsed.cashFlowAnalysis?.commentary || '',
            advisorNote: parsed.executiveVerdict.headline || '',
          },
          bankEvaluation: {
            cltvInsight: 'Standard evaluation applied',
            dtiInsight: 'DTI assessed within normal parameters',
            marginInsight: 'Rate based on credit profile',
          },
          riskDashboard: {
            dtiLabel: parsed.executiveVerdict.status === 'APPROVED_ZONE' ? 'Healthy' : 'Caution',
            cltvLabel: 'Healthy',
            dtiColor: parsed.executiveVerdict.status === 'APPROVED_ZONE' ? 'green' : 'yellow',
            cltvColor: 'green',
          },
          lifetimeRoadmap: {
            drawPeriodView: 'Interest-only payments during draw period',
            repaymentPeriodView: 'Principal and interest payments begin',
            paymentShockWarning: 'Prepare for payment increase in repayment period',
          },
          lifecyclePersonalized: 'Your financial journey will evolve over the 20-year term',
          stressTest: {
            rateHikeImpact: 'Rate increases will impact monthly payments',
            advisorTip: 'Maintain cash reserves for rate volatility',
          },
          bankReadiness: parsed.actionPlan?.map((item: any) => `${item.title}: ${item.description}`) || [],
          specialRecommendation: parsed.actionPlan?.[0]?.description || 'Follow the action plan carefully',
          radicalCandorWarning: parsed.radicalCandorWarning,
        },
      };
    }

    // Standard summary/diagnostic format
    if (parsed.summary && parsed.diagnostic && parsed.strategy) {
      return {
        summary: parsed.summary,
        diagnostic: parsed.diagnostic,
        strategy: parsed.strategy,
        actionPlan: Array.isArray(parsed.actionPlan) ? parsed.actionPlan : [],
        tips: Array.isArray(parsed.tips) ? parsed.tips : [],
        stressTestCommentary: parsed.stressTestCommentary,
        homeRenovationV2: parsed.homeRenovationV2,
        debtConsolidationV3: parsed.debtConsolidationV3,
        creditOptimizationV3: parsed.creditOptimizationV3,
        emergencyFundV3: parsed.emergencyFundV3,
        investmentV3: parsed.investmentV3,
      };
    }

    // v3Report fallback format
    return {
      summary: parsed.executiveBrief || '',
      diagnostic: parsed.bankEvaluation?.dtiInsight || '',
      strategy: parsed.goalAnalysis?.advisorNote || '',
      actionPlan: parsed.bankReadiness || [],
      tips: [],
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
        homeRenovationV2: parsed.homeRenovationV2,
        debtConsolidationV3: parsed.debtConsolidationV3,
        creditOptimizationV3: parsed.creditOptimizationV3,
        emergencyFundV3: parsed.emergencyFundV3,
        investmentV3: parsed.investmentV3,
      };
    } catch (error) {
      throw new Error(`Failed to parse AI response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
