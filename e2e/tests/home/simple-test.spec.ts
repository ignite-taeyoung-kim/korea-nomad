import { test, expect } from '@playwright/test';

test.describe('홈페이지 - 기본 테스트', () => {
  test('홈페이지에 접속 가능한지 확인', async ({ page }) => {
    // Arrange & Act
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // Assert
    expect(page.url()).toContain('localhost:3000');
  });

  test('페이지 제목 확인', async ({ page }) => {
    // Arrange & Act
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    const title = await page.title();

    // Assert
    console.log('페이지 제목:', title);
    expect(title).toBeTruthy();
    expect(title).toContain('한국');
  });

  test('페이지에 텍스트 내용이 있는지 확인', async ({ page }) => {
    // Arrange & Act
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    const bodyText = await page.textContent('body');

    // Assert
    expect(bodyText).toBeTruthy();
    console.log('본문 텍스트 길이:', bodyText?.length);
  });

  test('헤더 네비게이션 존재 확인', async ({ page }) => {
    // Arrange & Act
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // Navigation 또는 Header 요소 찾기
    const nav = page.locator('nav, header').first();
    const isNavVisible = await nav.isVisible().catch(() => false);

    console.log('네비게이션 표시:', isNavVisible);

    // Assert
    expect(isNavVisible).toBeTruthy();
  });

  test('메인 콘텐츠 영역 확인', async ({ page }) => {
    // Arrange & Act
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    const main = page.locator('main');
    const isMainVisible = await main.isVisible().catch(() => false);

    console.log('main 요소 표시:', isMainVisible);

    // Assert
    expect(isMainVisible).toBeTruthy();
  });

  test('페이지 구조 - h1, h2 제목 확인', async ({ page }) => {
    // Arrange & Act
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    const h1Count = await page.locator('h1, h2').count();
    console.log('제목(h1/h2) 개수:', h1Count);

    // Assert
    expect(h1Count).toBeGreaterThan(0);
  });

  test('푸터 영역 확인', async ({ page }) => {
    // Arrange & Act
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // 페이지 끝까지 스크롤
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    const footer = page.locator('footer');
    const isFooterVisible = await footer.isVisible().catch(() => false);

    console.log('푸터 표시:', isFooterVisible);

    // Assert
    expect(isFooterVisible).toBeTruthy();
  });
});
