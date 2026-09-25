import { test, expect } from '@playwright/test';

test.describe('E2E Smoke Test - Root App Rendering', () => {
  test('harus merender header EverLife dan kanvas viewport mobile', async ({ page }) => {
    await page.goto('/');
    const title = page.locator('h1');
    await expect(title).toContainText('EverLife');
    const viewport = page.locator('#everlife-viewport');
    await expect(viewport).toBeVisible();
  });
});
