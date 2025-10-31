import { expect, test } from '@playwright/test';

const waitForHydration = async (page: any) => {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);
};

test.describe('工具目录与摘要工具', () => {
  test('英语工具列表基于配置渲染', async ({ page }) => {
    await page.goto('/en/tools');
    await waitForHydration(page);

    await expect(page.locator('h1').filter({ hasText: 'Tool Catalogue' })).toBeVisible();
    await expect(page.locator('h3').filter({ hasText: 'Text Summarizer' })).toBeVisible();
    await expect(page.locator('h3').filter({ hasText: 'Transcript Polisher' })).toBeVisible();

    const comingSoonBadges = page.getByText('Coming soon', { exact: false });
    await expect(comingSoonBadges).toHaveCount(1);
    await expect(page.getByText('Preview', { exact: true })).toHaveCount(1);
  });

  test('摘要工具细节页可完成 mock 推理', async ({ page }) => {
    const prompt =
      'Playwright should capture this short prompt and return it directly as a summary.';

    await page.goto('/en/tools/text-summarizer');
    await waitForHydration(page);

    await expect(page.locator('h1').filter({ hasText: 'Text Summarizer' }).first()).toBeVisible();

    const textarea = page.getByLabel('Enter content');
    await textarea.fill(prompt);

    await page.getByRole('button', { name: 'Generate' }).click();
    await expect(page.getByRole('button', { name: /Generating summary/ })).toBeVisible();

    await expect(page.locator('text=Summary ready')).toBeVisible({ timeout: 7000 });
    await expect(page.getByText(prompt).last()).toBeVisible({ timeout: 7000 });
  });
});
