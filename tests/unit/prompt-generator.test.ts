/**
 * AI Prompt Generator Tests
 * 测试Prompt生成器的正确性
 */

import { describe, it, expect } from 'vitest';
import { generatePrompt } from '@/lib/ai/prompts';
import type { PromptContext } from '@/lib/ai/prompts/base';
import type { ScenarioType, CalculatedData } from '@/types/heloc-ai';

describe('AI Prompt Generator', () => {
  // 创建测试用的基础上下文
  const createTestContext = (scenario: ScenarioType): PromptContext => {
    const baseContext: PromptContext = {
      calculatedData: {
        coreMetrics: {
          cltv: 75,
          dti: 35,
          helocRate: 8.5,
          monthlySavings: 500,
          maxLimit: 100000,
        },
        scenarioMetrics: {},
      } as CalculatedData,
      userInputs: {
        homeValue: 500000,
        mortgageBalance: 300000,
        creditScore: 720,
      },
    };

    // 根据场景类型添加特定的metrics和inputs
    switch (scenario) {
      case 'debt_consolidation':
        baseContext.calculatedData.scenarioMetrics = {
          interestSaved: 15000,
          payoffMonthsReduced: 24,
        };
        baseContext.userInputs.creditCardBalance = 50000;
        break;

      case 'home_renovation':
        baseContext.calculatedData.scenarioMetrics = {
          futureEquity: 237500,
          estValueIncrease: 37500,
        };
        baseContext.userInputs.renovationCost = 50000;
        baseContext.userInputs.renovationType = 'kitchen_bath';
        break;

      case 'credit_optimization':
        baseContext.calculatedData.scenarioMetrics = {
          creditLimitBoost: 100000,
          utilizationDrop: 25.5,
        };
        baseContext.userInputs.creditCardBalance = 15000;
        baseContext.userInputs.creditCardLimit = 30000;
        break;

      case 'emergency_fund':
        baseContext.calculatedData.scenarioMetrics = {
          monthsCovered: 20,
          availableLiquidity: 100000,
        };
        baseContext.userInputs.monthlyExpenses = 5000;
        break;

      case 'investment':
        baseContext.calculatedData.scenarioMetrics = {
          hurdleRate: 8.5,
          equityRiskRatio: 25,
        };
        baseContext.userInputs.investmentAmount = 50000;
        baseContext.userInputs.investmentType = 'real_estate';
        break;
    }

    return baseContext;
  };

  // 测试1: 验证Prompt模板结构完整性
  it('should generate complete prompt template with all required fields', () => {
    const context = createTestContext('debt_consolidation');
    const prompt = generatePrompt('debt_consolidation', context);

    expect(prompt).toHaveProperty('systemRole');
    expect(prompt).toHaveProperty('userMessage');
    expect(prompt).toHaveProperty('outputSchema');
    expect(typeof prompt.systemRole).toBe('string');
    expect(typeof prompt.userMessage).toBe('string');
    expect(typeof prompt.outputSchema).toBe('object');
  });

  // 测试2: 验证系统角色Prompt包含关键内容
  it('should include HELOC expert role in system prompt', () => {
    const context = createTestContext('debt_consolidation');
    const prompt = generatePrompt('debt_consolidation', context);

    expect(prompt.systemRole).toContain('HELOC');
    expect(prompt.systemRole).toContain('financial expert');
    expect(prompt.systemRole).toContain('objective');
    expect(prompt.systemRole).toContain('actionable');
  });

  // 测试3: 验证输出Schema包含所有必需字段
  it('should have valid output schema with required fields', () => {
    const context = createTestContext('debt_consolidation');
    const prompt = generatePrompt('debt_consolidation', context);

    expect(prompt.outputSchema.type).toBe('object');
    expect(prompt.outputSchema.required).toContain('summary');
    expect(prompt.outputSchema.required).toContain('diagnostic');
    expect(prompt.outputSchema.required).toContain('strategy');
    expect(prompt.outputSchema.required).toContain('actionPlan');
    expect(prompt.outputSchema.required).toContain('tips');
  });

  // 测试4: 验证债务整合场景Prompt包含关键指标
  it('should generate debt consolidation prompt with key metrics', () => {
    const context = createTestContext('debt_consolidation');
    const prompt = generatePrompt('debt_consolidation', context);

    expect(prompt.userMessage).toContain('debt consolidation');
    expect(prompt.userMessage).toContain('$15,000');
    expect(prompt.userMessage).toContain('24 months');
    expect(prompt.userMessage).toContain('Interest arbitrage');
  });

  // 测试5: 验证房屋翻新场景Prompt包含关键指标
  it('should generate home renovation prompt with key metrics', () => {
    const context = createTestContext('home_renovation');
    const prompt = generatePrompt('home_renovation', context);

    expect(prompt.userMessage).toContain('home renovation');
    expect(prompt.userMessage).toContain('$37,500');
    expect(prompt.userMessage).toContain('$237,500');
    expect(prompt.userMessage).toContain('kitchen_bath');
    expect(prompt.userMessage).toContain('ROI expectations');
  });

  // 测试6: 验证信用优化场景Prompt包含关键指标
  it('should generate credit optimization prompt with key metrics', () => {
    const context = createTestContext('credit_optimization');
    const prompt = generatePrompt('credit_optimization', context);

    expect(prompt.userMessage).toContain('credit optimization');
    expect(prompt.userMessage).toContain('$100,000');
    expect(prompt.userMessage).toContain('25.5%');
    expect(prompt.userMessage).toContain('Utilization optimization');
  });

  // 测试7: 验证应急基金场景Prompt包含关键指标
  it('should generate emergency fund prompt with key metrics', () => {
    const context = createTestContext('emergency_fund');
    const prompt = generatePrompt('emergency_fund', context);

    expect(prompt.userMessage).toContain('emergency fund');
    expect(prompt.userMessage).toContain('20 months');
    expect(prompt.userMessage).toContain('$100,000');
    expect(prompt.userMessage).toContain('Survival curve');
  });

  // 测试8: 验证投资场景Prompt包含关键指标
  it('should generate investment prompt with key metrics', () => {
    const context = createTestContext('investment');
    const prompt = generatePrompt('investment', context);

    expect(prompt.userMessage).toContain('investment');
    expect(prompt.userMessage).toContain('8.5%');
    expect(prompt.userMessage).toContain('25%');
    expect(prompt.userMessage).toContain('Hurdle rate');
    expect(prompt.userMessage).toContain('real_estate');
  });

  // 测试9: 验证所有场景类型都能正确生成Prompt
  it('should generate prompts for all scenario types', () => {
    const scenarios: ScenarioType[] = [
      'debt_consolidation',
      'home_renovation',
      'credit_optimization',
      'emergency_fund',
      'investment',
    ];

    scenarios.forEach((scenario) => {
      const context = createTestContext(scenario);
      const prompt = generatePrompt(scenario, context);

      expect(prompt.systemRole).toBeTruthy();
      expect(prompt.userMessage).toBeTruthy();
      expect(prompt.outputSchema).toBeTruthy();
    });
  });

  // 测试10: 验证无效场景类型会抛出错误
  it('should throw error for invalid scenario type', () => {
    const context = createTestContext('debt_consolidation');

    expect(() => {
      generatePrompt('invalid_scenario' as ScenarioType, context);
    }).toThrow('Unknown scenario type');
  });
});
