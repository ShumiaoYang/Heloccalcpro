import { expect, test } from '@playwright/test';

test.describe('工具目录与摘要工具', () => {
  test('英语工具列表基于配置渲染', async ({ page }) => {
    await page.goto('/en/tools');

    await expect(page.getByRole('heading', { name: 'Tool Catalogue' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Text Summarizer Demo' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Idea Generator' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Transcript Polisher' })).toBeVisible();

    const comingSoonBadges = page.getByText('Coming soon', { exact: false });
    await expect(comingSoonBadges).toHaveCount(2);
    await expect(page.getByText('Preview', { exact: true })).toBeVisible();
  });

  test('摘要工具细节页可完成 mock 推理', async ({ page }) => {
    const prompt =
      'Playwright should capture this short prompt and return it directly as a summary.';

    await page.goto('/en/tools/text-summarizer');

    await expect(page.getByRole('heading', { name: 'Text Summarizer Demo' })).toBeVisible();

    const textarea = page.getByLabel('Enter content');
    await textarea.fill(prompt);

    await page.getByRole('button', { name: 'Generate' }).click();
    await expect(page.getByRole('button', { name: 'Generating summary…' })).toBeVisible();

    await expect(page.getByRole('heading', { name: 'Summary ready' })).toBeVisible();
    await expect(page.getByText(prompt)).toBeVisible();
  });
});
