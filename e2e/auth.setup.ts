import { test as setup, expect } from '@playwright/test';

const authFile = 'e2e/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // 로그인 페이지로 이동
  await page.goto('/login');

  // 기본값이 채워진 폼을 제출
  await page.getByPlaceholder('email').fill('test@gmail.com');
  await page.getByPlaceholder('password').fill('1234');
  await page.getByRole('button', { name: 'Submit' }).click();

  // 로그인 후 메인 페이지로 리다이렉트 확인
  await expect(page).toHaveURL('/');

  // 인증 상태 저장
  await page.context().storageState({ path: authFile });
});
