/**
 * AI Prompt Templates
 * AI Prompt模板基础定义
 */

import type { ScenarioType, CalculatedData, AiAnalysis } from '@/types/heloc-ai';

// ============================================
// Prompt接口定义
// ============================================

export interface PromptContext {
  calculatedData: CalculatedData;
  userInputs: Record<string, any>;
}

export interface PromptTemplate {
  systemRole: string;
  userMessage: string;
  outputSchema: Record<string, any>;
}

/**
 * 生成系统角色Prompt - v3.0 结构化报告
 */
export function getSystemRolePrompt(): string {
  return `# Role

You are a senior U.S. Household Financial Advisor. Generate a structured HELOC Analysis Report.

# Voice and Tone

- Professional but Warm
- Candid and Observant
- U.S. Consumer Centric
- Write as if personally reviewing their case, not auto-generated

# Output Format

Output ONLY valid JSON with this structure:
{
  "executiveBrief": "3-4 sentence warm summary. Start with natural advisor opening like 'I've carefully reviewed your financial snapshot...' or 'Looking at your equity position...' or 'Let's dive into your roadmap for [goal]...'. NEVER use 'Dear Client' or 'Welcome, Client'. Write as if personally reviewing their case.",
  "goalAnalysis": {
    "economicImpact": "2-3 sentences explaining the financial impact of their goal",
    "advisorNote": "1-2 sentences with actionable recommendation"
  },
  "bankEvaluation": {
    "cltvInsight": "2-3 sentences explaining CLTV in plain language",
    "dtiInsight": "2-3 sentences on cash flow resilience. Note: This is the bank's standard measure of repayment resilience",
    "marginInsight": "2-3 sentences on credit pricing factors"
  },
  "riskDashboard": {
    "dtiLabel": "Healthy|Caution|High Risk based on DTI value",
    "cltvLabel": "Healthy|Caution|High Risk based on CLTV value",
    "dtiColor": "green if DTI<35%, yellow if 35-43%, red if >43%",
    "cltvColor": "green if CLTV<80%, yellow if 80-90%, red if >90%"
  },
  "lifetimeRoadmap": {
    "drawPeriodView": "2-3 sentences on years 1-10 strategy",
    "repaymentPeriodView": "2-3 sentences on years 11-30 planning",
    "paymentShockWarning": "2 sentences warning about payment jump with specific dollar impact"
  },
  "lifecyclePersonalized": "2-3 paragraphs (8-12 sentences total) analyzing their 20-year journey. MUST mention inflation assumptions and income growth projections. Discuss financial evolution over time.",
  "stressTest": {
    "rateHikeImpact": "2-3 sentences explaining +2% rate scenario with dollar impact",
    "advisorTip": "1-2 sentences with specific mitigation strategy"
  },
  "bankReadiness": [
    "checklist item 1",
    "checklist item 2",
    "checklist item 3",
    "checklist item 4"
  ],
  "specialRecommendation": "2 paragraphs with specific tactical advice tailored to their situation. Include actionable strategies like '90-day spending fast', credit score improvement tactics, or debt paydown priorities. Be specific and practical."
}

# Risk Score Interpretation

When discussing risk metrics, always include this explanation: "This score reflects how your leverage, cash flow pressure, and potential payment shock interact under our professional risk model."

Risk Score Guide:
- 0-30: Low risk, strong financial position
- 31-60: Moderate risk, manageable with proper planning
- 61-100: Higher risk, requires careful strategy and monitoring`;
}

/**
 * 获取输出JSON Schema (已废弃，v3.0 使用 Markdown)
 * @deprecated v3.0 不再使用 JSON schema，改为生成 Markdown 报告
 */
export function getOutputSchema(): Record<string, any> {
  return {
    type: 'object',
    required: ['summary', 'diagnostic', 'strategy', 'actionPlan', 'tips'],
    properties: {
      summary: {
        type: 'string',
        description: 'Executive summary (2-3 sentences)',
      },
      diagnostic: {
        type: 'string',
        description: 'Risk diagnostic based on CLTV and DTI',
      },
      strategy: {
        type: 'string',
        description: 'Scenario-specific expert strategy',
      },
      actionPlan: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            action: { type: 'string', description: 'The action step to take' },
            reason: { type: 'string', description: 'Why this step matters - explain the benefit to the user' },
          },
          required: ['action', 'reason'],
        },
        minItems: 3,
        maxItems: 5,
        description: 'Actionable steps with explanations of why each matters',
      },
      tips: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['info', 'danger'] },
            content: { type: 'string' },
          },
        },
        description: 'Important tips and warnings',
      },
      stressTestCommentary: {
        type: 'string',
        description: 'Commentary on stress test results (optional)',
      },
    },
  };
}

/**
 * v3.0: 生成 User Prompt（Markdown 报告模板）
 */
export function getUserPromptV3(context: PromptContext): string {
  const { calculatedData, userInputs } = context;
  const { coreMetrics, scenarioMetrics } = calculatedData;

  return `Generate a HELOC Analysis Report using the following data:

## User Profile
- Primary Goal: ${userInputs.scenario || 'General'}
- Annual Income: $${userInputs.annualIncome?.toLocaleString() || '0'}
- Credit Score: ${userInputs.creditScore || 'N/A'}
- Income Growth Assumption: ${userInputs.incomeGrowthAssumption || '3%'}
- Economic Outlook: ${userInputs.economicOutlook || 'Mild Inflation'}

## Financial Metrics
- Home Value: $${userInputs.homeValue?.toLocaleString() || '0'}
- Mortgage Balance: $${userInputs.mortgageBalance?.toLocaleString() || '0'}
- Approved Credit Limit: $${coreMetrics.maxLimit?.toLocaleString() || '0'}
- Effective Rate: ${coreMetrics.helocRate?.toFixed(2) || '0'}%
- CLTV Result: ${coreMetrics.cltv?.toFixed(1) || '0'}%
- Bank's Stress Test DTI: ${coreMetrics.dti?.toFixed(2) || '0'}%
- Risk Score: ${calculatedData.riskScore || 'N/A'}
- Risk Level: ${calculatedData.riskLevel || 'N/A'}

## Payment Analysis
- Utilization Ratio: ${userInputs.utilizationRatio || 50}%
- Draw Period: ${userInputs.drawPeriodYears || 10} years
- Repayment Period: ${userInputs.repaymentPeriodYears || 20} years
- Draw Period Monthly Payment (Interest-Only): $${Math.round(coreMetrics.maxLimit * coreMetrics.helocRate / 100 / 12)}
- Repayment Period Monthly Payment (Principal + Interest): $${Math.round((coreMetrics.maxLimit / 240) + (coreMetrics.maxLimit * coreMetrics.helocRate / 100 / 12))}
- Payment Shock (Monthly Increase): $${Math.round(coreMetrics.maxLimit / 240)}
- Monthly Savings: $${coreMetrics.monthlySavings?.toLocaleString() || '0'}

## Scenario Benefits
${JSON.stringify(scenarioMetrics, null, 2)}

Generate the complete Markdown report following the v3.0 template structure with 8 sections.`;
}

