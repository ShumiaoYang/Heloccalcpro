/**
 * AI Prompt Generator
 * 动态Prompt生成器 - 根据场景类型生成对应的Prompt
 */

import type { ScenarioType } from '@/types/heloc-ai';
import type { PromptContext, PromptTemplate } from './base';
import { getSystemRolePrompt, getOutputSchema } from './base';
import { getDebtConsolidationPrompt } from './debt-consolidation';
import { getHomeRenovationPrompt } from './home-renovation';
import { getCreditOptimizationPrompt } from './credit-optimization';
import { getContingentLiquidityPrompt } from './contingent-liquidity';
import { getInvestmentPrompt } from './investment';

/**
 * 根据场景类型生成完整的Prompt模板
 */
export function generatePrompt(
  scenario: ScenarioType,
  context: PromptContext
): PromptTemplate {
  const systemRole = getSystemRolePrompt();
  const outputSchema = getOutputSchema();

  let userMessage: string;

  switch (scenario) {
    case 'debt_consolidation':
      userMessage = getDebtConsolidationPrompt(context);
      break;
    case 'home_renovation':
      userMessage = getHomeRenovationPrompt(context);
      break;
    case 'credit_optimization':
      userMessage = getCreditOptimizationPrompt(context);
      break;
    case 'contingent_liquidity':
      userMessage = getContingentLiquidityPrompt(context);
      break;
    case 'investment':
      userMessage = getInvestmentPrompt(context);
      break;
    default:
      throw new Error(`Unknown scenario type: ${scenario}`);
  }

  return {
    systemRole,
    userMessage,
    outputSchema,
  };
}

/**
 * 导出所有场景的Prompt生成函数
 */
export {
  getDebtConsolidationPrompt,
  getHomeRenovationPrompt,
  getCreditOptimizationPrompt,
  getContingentLiquidityPrompt,
  getInvestmentPrompt,
  getSystemRolePrompt,
  getOutputSchema,
};
