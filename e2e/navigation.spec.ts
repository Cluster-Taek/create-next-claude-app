import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('메인 페이지가 정상적으로 로드된다', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/');
  });
});
