import { test, expect } from '@playwright/test';

test.describe('Users Page', () => {
  test('Users 페이지가 정상적으로 로드된다', async ({ page }) => {
    await page.goto('/users');
    await expect(page).toHaveURL('/users');
  });

  test('사용자 목록이 표시된다', async ({ page }) => {
    await page.goto('/users');

    // json-server 응답 대기 후 사용자 확인
    await page.waitForResponse((res) => res.url().includes('/users') && res.status() === 200);
    await expect(page.getByText('John Doe')).toBeVisible();
    await expect(page.getByText('Jane Doe')).toBeVisible();
  });
});
