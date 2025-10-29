import { describe, expect, it } from 'vitest';
import { summarize } from '@/lib/tools/summarizer';

describe('summarize()', () => {
  it('throws when prompt is empty', async () => {
    await expect(summarize({ prompt: '', length: 3, locale: 'en' })).rejects.toThrow(
      /文本内容不能为空/,
    );
  });

  it('throws when prompt is too long', async () => {
    const longPrompt = 'a'.repeat(5000);
    await expect(summarize({ prompt: longPrompt, length: 3, locale: 'en' })).rejects.toThrow(
      /文本超出最大长度限制/,
    );
  });

  it('returns summary when prompt is valid', async () => {
    const result = await summarize({
      prompt: 'This is a long text that should be summarized into something shorter.',
      length: 2,
      locale: 'en',
    });

    expect(result.summary.length).toBeGreaterThan(0);
  });
});
