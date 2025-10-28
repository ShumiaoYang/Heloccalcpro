import toolsConfig from '../../../config/tools.config.json';

export type SummarizerProvider = 'mock' | 'openai';

type ConfigFile = typeof toolsConfig;

type SummarizerConfigFromFile = ConfigFile['summarizer'];

export type SummarizerConfig = SummarizerConfigFromFile & {
  provider: SummarizerProvider;
};

const providerEnv = process.env.TOOL_SUMMARIZER_PROVIDER as SummarizerProvider | undefined;
const modelEnv = process.env.TOOL_SUMMARIZER_MODEL;

export function getSummarizerConfig(): SummarizerConfig {
  const fileConfig = toolsConfig.summarizer;
  return {
    ...fileConfig,
    provider: providerEnv ?? (fileConfig.provider as SummarizerProvider),
    model: modelEnv ?? fileConfig.model,
  };
}
