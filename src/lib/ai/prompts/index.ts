/**
 * AI Prompt Generator
 * 动态Prompt生成器 - 根据场景类型生成对应的Prompt
 */

import type { ScenarioType } from '@/types/heloc-ai';
import type { PromptContext, PromptTemplate } from './base';
import { getSystemRolePrompt, getOutputSchema } from './base';
import { generateDebtConsolidationPrompt } from './debt-consolidation';
import { getHomeRenovationPrompt } from './home-renovation';
import { getCreditOptimizationPrompt } from './credit-optimization';
import { getEmergencyFundPrompt } from './emergency-fund';
import { getInvestmentPrompt } from './investment';
import { getMaxBorrowingPowerPrompt } from './max-borrowing-power';

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
  const isMaxBorrowing = !context.userInputs.amountNeeded || context.userInputs.amountNeeded === 0;

  if (isMaxBorrowing) {
    userMessage = getMaxBorrowingPowerPrompt(context);
    return {
      systemRole,
      userMessage,
      outputSchema,
    };
  }

  switch (scenario) {
    case 'debt_consolidation':
      userMessage = generateDebtConsolidationPrompt({
        homeValue: context.userInputs.homeValue,
        maxBorrowingPower: context.calculatedData.coreMetrics.maxLimit,
        requestedAmount: context.userInputs.amountNeeded || context.calculatedData.coreMetrics.maxLimit,
        isMaxBorrowing: !context.userInputs.amountNeeded || context.userInputs.amountNeeded === 0,
        currentDti: context.calculatedData.coreMetrics.dti,
        newDti: context.calculatedData.coreMetrics.dti,
        estimatedHelocRate: context.calculatedData.coreMetrics.helocRate,
        currentMonthlyDebt: context.userInputs.monthlyDebt || 0,
        newHelocMonthlyPayment: Math.round(
          (context.userInputs.amountNeeded || context.calculatedData.coreMetrics.maxLimit)
            * context.calculatedData.coreMetrics.helocRate
            / 100
            / 12
        ),
      });
      break;
    case 'home_renovation':
      userMessage = getHomeRenovationPrompt(context);
      break;
    case 'credit_optimization':
      userMessage = getCreditOptimizationPrompt(context);
      break;
    case 'emergency_fund':
      userMessage = getEmergencyFundPrompt(context);
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
  generateDebtConsolidationPrompt,
  getHomeRenovationPrompt,
  getCreditOptimizationPrompt,
  getEmergencyFundPrompt,
  getInvestmentPrompt,
  getMaxBorrowingPowerPrompt,
  getSystemRolePrompt,
  getOutputSchema,
};
