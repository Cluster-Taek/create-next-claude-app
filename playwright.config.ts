import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/global-setup.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'html' : 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },

  projects: [
    // 인증 상태 생성
    { name: 'setup', testMatch: /auth\.setup\.ts/ },

    // 브라우저 테스트 (Chromium만 기본 사용, 필요 시 브라우저 추가 설치 후 project 추가)
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],

  webServer: [
    {
      command: 'pnpm mock',
      url: 'http://localhost:4001',
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'pnpm build && pnpm start',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
