/**
 * Week 1 功能验证测试
 */

import { describe, it, expect } from 'vitest';
import { generateAccessToken, verifyAccessToken } from '@/lib/pdf/token-manager';
import type { AiAnalysis, CalculatedData, CoreMetrics } from '@/types/heloc-ai';

describe('Week 1 - TypeScript类型定义验证', () => {
  it('应该正确定义CoreMetrics类型', () => {
    const metrics: CoreMetrics = {
      cltv: 75.5,
      dti: 35.2,
      helocRate: 8.5,
      monthlySavings: 500,
      maxLimit: 100000,
    };

    expect(metrics.cltv).toBe(75.5);
    expect(metrics.dti).toBe(35.2);
  });

  it('应该正确定义AiAnalysis类型', () => {
    const analysis: AiAnalysis = {
      summary: 'Test summary',
      diagnostic: 'Test diagnostic',
      strategy: 'Test strategy',
      actionPlan: [
        { action: 'Action 1', reason: 'Reason 1' },
        { action: 'Action 2', reason: 'Reason 2' },
      ],
      tips: [
        { type: 'info', content: 'Info tip' },
        { type: 'danger', content: 'Danger tip' },
      ],
    };

    expect(analysis.actionPlan).toHaveLength(2);
    expect(analysis.actionPlan[0].action).toBe('Action 1');
    expect(analysis.actionPlan[0].reason).toBe('Reason 1');
    expect(analysis.tips[0].type).toBe('info');
  });
});

describe('Week 1 - PDF令牌系统验证', () => {
  it('应该成功生成访问令牌', () => {
    const token = generateAccessToken(
      'purchase-123',
      'test@example.com',
      'calc-456'
    );

    expect(token.token).toBeDefined();
    expect(token.expiresAt).toBeInstanceOf(Date);
  });

  it('应该成功验证有效令牌', () => {
    const token = generateAccessToken(
      'purchase-123',
      'test@example.com',
      'calc-456'
    );

    const result = verifyAccessToken(token.token);

    expect(result.valid).toBe(true);
    expect(result.payload?.purchaseId).toBe('purchase-123');
    expect(result.payload?.email).toBe('test@example.com');
  });

  it('应该拒绝无效令牌', () => {
    const result = verifyAccessToken('invalid-token');

    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });
});
