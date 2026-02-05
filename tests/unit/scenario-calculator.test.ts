/**
 * Scenario Calculator Tests
 * 场景计算器单元测试
 */

import { describe, it, expect } from 'vitest';
import {
  calculateDebtConsolidation,
  calculateHomeRenovation,
  calculateCreditOptimization,
  calculateEmergencyFund,
  calculateInvestment,
} from '@/lib/heloc/scenario-calculator';

describe('场景计算器 - 债务整合', () => {
  it('应该正确计算债务整合的利息节省', () => {
    const result = calculateDebtConsolidation({
      homeValue: 500000,
      mortgageBalance: 300000,
      helocLimit: 100000,
      helocRate: 8.5,
      creditScore: 700,
      annualIncome: 100000,
      monthlyDebt: 2000,
      creditCardBalance: 20000,
      creditCardLimit: 30000,
    });

    expect(result.interestSaved).toBeGreaterThan(0);
    expect(result.payoffMonthsReduced).toBeGreaterThanOrEqual(0);
  });
});

describe('场景计算器 - 房屋翻新', () => {
  it('应该正确计算房屋翻新的ROI', () => {
    const result = calculateHomeRenovation({
      homeValue: 500000,
      mortgageBalance: 300000,
      helocLimit: 100000,
      helocRate: 8.5,
      creditScore: 700,
      annualIncome: 100000,
      monthlyDebt: 2000,
      renovationCost: 50000,
      renovationType: 'kitchen_bath',
      renovationDuration: 6,
    });

    expect(result.futureEquity).toBeGreaterThan(0);
    expect(result.estValueIncrease).toBe(37500); // 50000 * 0.75
  });
});

describe('场景计算器 - 信用优化', () => {
  it('应该正确计算信用额度提升和利用率下降', () => {
    const result = calculateCreditOptimization({
      homeValue: 500000,
      mortgageBalance: 300000,
      helocLimit: 100000,
      helocRate: 8.5,
      creditScore: 700,
      annualIncome: 100000,
      monthlyDebt: 2000,
      creditCardBalance: 20000,
      creditCardLimit: 30000,
    });

    expect(result.creditLimitBoost).toBe(100000);
    expect(result.utilizationDrop).toBeGreaterThan(0);
  });
});

describe('场景计算器 - 应急基金', () => {
  it('应该正确计算应急基金覆盖月数', () => {
    const result = calculateEmergencyFund({
      homeValue: 500000,
      mortgageBalance: 300000,
      helocLimit: 100000,
      helocRate: 8.5,
      creditScore: 700,
      annualIncome: 100000,
      monthlyDebt: 2000,
      monthlyExpenses: 5000,
    });

    expect(result.monthsCovered).toBe(20); // 100000 / 5000
    expect(result.availableLiquidity).toBe(100000);
  });
});

describe('场景计算器 - 投资分析', () => {
  it('应该正确计算投资获利门槛', () => {
    const result = calculateInvestment({
      homeValue: 500000,
      mortgageBalance: 300000,
      helocLimit: 100000,
      helocRate: 8.5,
      creditScore: 700,
      annualIncome: 100000,
      monthlyDebt: 2000,
      investmentAmount: 50000,
      expectedReturn: 12,
    });

    expect(result.hurdleRate).toBe(8.5);
    expect(result.equityRiskRatio).toBeGreaterThan(0);
  });
});

