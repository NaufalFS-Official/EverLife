import { test, expect } from '@playwright/test';

test.describe('E2E Smoke Test - Root App Rendering', () => {
  test('harus merender header EverLife dan kanvas scene inisial', async ({ page }) => {
    await page.goto('/');
    const title = page.locator('h1');
    await expect(title).toHaveText('EverLife');
    const headerRoot = page.locator('#app-root');
    await expect(headerRoot).toBeVisible();
  });
});
