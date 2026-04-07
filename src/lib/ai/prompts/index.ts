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
import { calculateCLTVCap } from '@/lib/heloc/credit-calculator';
import { calculateCreditDTILimit, calculateDynamicMaxDTI } from '@/lib/heloc/core-metrics';

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
      {
        const requestedAmount = context.userInputs.amountNeeded || context.calculatedData.coreMetrics.maxLimit;
        const annualIncome = Number(context.userInputs.annualIncome || 0);
        const monthlyIncome = annualIncome > 0 ? annualIncome / 12 : 0;
        const currentMonthlyDebt = Number(
          context.userInputs.currentMonthlyDebt
          ?? context.userInputs.monthlyDebt
          ?? ((context.userInputs.subjectHousingPayment || 0) + (context.userInputs.otherMonthlyDebt || 0))
        );
        const currentDti = monthlyIncome > 0 ? (currentMonthlyDebt / monthlyIncome) * 100 : 0;
        const helocRate = context.calculatedData.coreMetrics.helocRate;
        const drawInterestPayment = Math.round((requestedAmount * helocRate) / 100 / 12);
        const repaymentMonths = Number(context.userInputs.repaymentMonths || 240);
        const propertyType = (context.userInputs.propertyType as
          | 'Single-family'
          | 'Townhouse'
          | 'Condo'
          | 'Multi-family'
          | 'Manufactured') || 'Single-family';
        const occupancyType = (context.userInputs.occupancy as
          | 'Primary residence'
          | 'Second home'
          | 'Investment property') || 'Primary residence';
        const { cltvCap } = calculateCLTVCap(
          Number(context.userInputs.creditScore || 700),
          occupancyType,
          propertyType
        );
        const effectiveDtiPct = calculateDynamicMaxDTI(Number(context.userInputs.creditScore || 700), cltvCap) * 100;
        const cltvLimitAmount = Math.max(
          0,
          Number(context.userInputs.homeValue || 0) * (cltvCap / 100) - Number(context.userInputs.mortgageBalance || 0)
        );
        const dtiLimitAmount = calculateCreditDTILimit(
          annualIncome,
          currentMonthlyDebt,
          Number(context.userInputs.creditScore || 700),
          cltvCap
        );
        const calcRepaymentPi = (principal: number, ratePct: number, months: number): number => {
          if (principal <= 0 || months <= 0) return 0;
          const monthlyRate = ratePct / 100 / 12;
          if (monthlyRate === 0) return principal / months;
          const factor = Math.pow(1 + monthlyRate, months);
          return (principal * monthlyRate * factor) / (factor - 1);
        };

        userMessage = generateDebtConsolidationPrompt({
          homeValue: context.userInputs.homeValue,
          maxBorrowingPower: context.calculatedData.coreMetrics.maxLimit,
          requestedAmount,
          creditCardBalance: Number(context.userInputs.creditCardBalance || 0),
          creditCardLimit: Number(context.userInputs.creditCardLimit || 0),
          currentDti,
          projectedDti: context.calculatedData.coreMetrics.dti,
          estimatedHelocRate: helocRate,
          currentMonthlyDebt,
          monthlyIncome,
          drawInterestPayment,
          repaymentPayment: calcRepaymentPi(requestedAmount, helocRate, repaymentMonths),
          repaymentPlus2Payment: calcRepaymentPi(requestedAmount, helocRate + 2, repaymentMonths),
          repaymentPlus4Payment: calcRepaymentPi(requestedAmount, helocRate + 4, repaymentMonths),
          drawPlus2Payment: (requestedAmount * (helocRate + 2)) / 100 / 12,
          drawPlus4Payment: (requestedAmount * (helocRate + 4)) / 100 / 12,
          effectiveCltv: cltvCap,
          effectiveDti: effectiveDtiPct,
          cltvLimit: cltvLimitAmount,
          dtiLimit: dtiLimitAmount,
        });
      }
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
