import toolsConfig from '../../../config/tools.config.json';

export type SummarizerProvider = 'mock' | 'openai';

type ToolsConfigFile = typeof toolsConfig;

export type ToolConfig = ToolsConfigFile['tools'][number];
export type ToolStatus = ToolConfig['status'];

export type SummarizerConfig = ToolConfig & {
  provider: SummarizerProvider;
  model: string;
  temperature?: number;
  maxOutputTokens?: number;
};

export const TOOL_SUMMARIZER_SLUG = 'text-summarizer';

const providerEnv = process.env.TOOL_SUMMARIZER_PROVIDER as SummarizerProvider | undefined;
const modelEnv = process.env.TOOL_SUMMARIZER_MODEL;

export function getToolConfigs(): ToolConfig[] {
  return toolsConfig.tools;
}

export function getToolConfigBySlug(slug: string): ToolConfig | undefined {
  return toolsConfig.tools.find((tool) => tool.slug === slug);
}

export function getSummarizerConfig(override?: ToolConfig): SummarizerConfig {
  const tool = override ?? getToolConfigBySlug(TOOL_SUMMARIZER_SLUG);
  if (!tool) {
    throw new Error('缺少 text-summarizer 配置，请检查 config/tools.config.json');
  }

  return {
    ...tool,
    provider: (providerEnv ?? tool.provider) as SummarizerProvider,
    model: modelEnv ?? tool.model,
  };
}
