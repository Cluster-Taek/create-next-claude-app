import { test, expect } from '@playwright/test';

test.describe('Users Page', () => {
  test('Users 페이지가 정상적으로 로드된다', async ({ page }) => {
    await page.goto('/users');
    await expect(page).toHaveURL('/users');
  });

  test('사용자 목록이 표시된다', async ({ page }) => {
    // goto 전에 응답 리스너를 먼저 등록해야 이벤트를 놓치지 않음
    const responsePromise = page.waitForResponse((res) => res.url().includes('/users') && res.status() === 200);
    await page.goto('/users');
    await responsePromise;

    await expect(page.getByText('John Doe')).toBeVisible();
    await expect(page.getByText('Jane Doe')).toBeVisible();
  });
});
