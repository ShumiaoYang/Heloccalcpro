/**
 * AI Provider Base Class
 * AI提供商的抽象基类
 */

import type { AiAnalysis, CalculatedData } from '@/types/heloc-ai';

export interface AIProviderConfig {
  apiKey: string;
  model: string;
  baseUrl?: string;
  temperature?: number;
  maxTokens?: number;
  timeout?: number;
}

export abstract class AIProvider {
  protected config: AIProviderConfig;

  constructor(config: AIProviderConfig) {
    this.config = config;
  }

  /**
   * 分析HELOC数据并生成AI洞察
   * @param calculatedData - 计算后的财务数据
   * @param userInputs - 用户原始输入
   * @returns AI分析结果
   */
  abstract analyze(
    calculatedData: CalculatedData,
    userInputs: Record<string, any>
  ): Promise<AiAnalysis>;

  /**
   * 健康检查
   * @returns 是否可用
   */
  abstract healthCheck(): Promise<boolean>;
}
