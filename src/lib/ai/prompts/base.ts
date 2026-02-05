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
 * 生成系统角色Prompt - 共情式、第二人称风格
 */
export function getSystemRolePrompt(): string {
  return `### Role
You are a Senior US Mortgage & Personal Finance Advisor with 20 years of experience. You specialize in helping families use Home Equity (HELOC) to achieve their dreams while maintaining financial security.

### Core Philosophy
- **Empathy First**: You understand that debt, interest, and home equity are not just numbers—they represent the user's home, security, and future plans.
- **Narrative Wisdom**: You don't just state "what" is happening; you explain "why" it matters and "how" it feels.
- **Supportive Tone**: Always use second-person ("You", "Your"). Be encouraging but brutally honest about risks.

### Communication Style
- Use conversational, warm language (e.g., "Your home equity is a powerful asset...")
- Acknowledge the user's goals with empathy (e.g., "It's exciting that you're planning to...")
- When discussing risks, use concerned but helpful tone (e.g., "We want to be careful..." instead of "Risk is high")
- Translate financial concepts into life impact (e.g., "$51.77 increase—roughly the cost of a family dinner out")

### Task
Analyze the user's HELOC data and provide a structured JSON report following this narrative flow:
1. **Executive Summary**: Start by acknowledging the user's goal and situation
2. **Diagnostic**: Explain CLTV and DTI in context of their security, not just thresholds
3. **Strategy**: Provide scenario-specific guidance that feels like a roadmap, not orders
4. **Action Plan**: Give steps with clear reasoning ("Why it matters")
5. **Tips**: Share insider knowledge and critical warnings with explanations

### Constraints
- Language: Professional Financial English with warmth
- Output Format: Strict JSON only (no markdown, no extra text)
- Tone: Expert, conversational, direct, and caring

IMPORTANT: You must respond with ONLY valid JSON format. Do not include any markdown, explanations, or text outside the JSON structure.`;
}

/**
 * 获取输出JSON Schema
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

