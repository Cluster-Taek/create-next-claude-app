import { test, expect } from '@playwright/test';

// 로그인 테스트는 인증 상태 없이 실행
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test('로그인 페이지가 정상적으로 렌더링된다', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByText('Login')).toBeVisible();
    await expect(page.getByPlaceholder('email')).toBeVisible();
    await expect(page.getByPlaceholder('password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
  });

  test('올바른 자격 증명으로 로그인할 수 있다', async ({ page }) => {
    await page.goto('/login');

    await page.getByPlaceholder('email').fill('test@gmail.com');
    await page.getByPlaceholder('password').fill('1234');
    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page).toHaveURL('/');
  });

  test('잘못된 자격 증명은 에러 메시지를 표시한다', async ({ page }) => {
    await page.goto('/login');

    await page.getByPlaceholder('email').fill('wrong@gmail.com');
    await page.getByPlaceholder('password').fill('wrong');
    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.getByText('Invalid email or password')).toBeVisible();
  });
});
