import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E 테스트 설정
 * https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e/tests',
  testMatch: '**/*.spec.ts',

  /* 병렬 실행 설정 */
  fullyParallel: true,
  workers: process.env.CI ? 1 : undefined,

  /* 실패 시 재시도 */
  retries: process.env.CI ? 2 : 0,

  /* 테스트 타임아웃 */
  timeout: 30000,
  expect: {
    timeout: 5000,
  },

  /* 테스트 리포트 설정 */
  reporter: [
    ['html', { outputFolder: './e2e/test-results' }],
    ['json', { outputFile: './e2e/test-results/results.json' }],
    ['junit', { outputFile: './e2e/test-results/junit.xml' }],
    ['list'],
  ],

  /* 스크린샷/비디오 설정 */
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  /* 테스트 전 앱 시작 */
  webServer: process.env.CI
    ? undefined
    : {
        command: 'npm run dev',
        port: 3000,
        reuseExistingServer: true,
        timeout: 120000,
      },

  /* 브라우저 설정 */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* 모바일 테스트 */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  /* 글로벌 설정 */
  globalSetup: require.resolve('./e2e/config/global-setup.ts'),
  globalTeardown: require.resolve('./e2e/config/global-teardown.ts'),
});
