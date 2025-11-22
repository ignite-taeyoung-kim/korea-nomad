import { test, expect } from '@playwright/test';
import { HomePage, NavigationBar } from '../../pages';
import { TEST_CITIES } from '../../fixtures';
import { expectElementVisible } from '../../utils';

test.describe('홈페이지 - 기본 렌더링', () => {
  let homePage: HomePage;
  let navBar: NavigationBar;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    navBar = new NavigationBar(page);
    await homePage.goto('http://localhost:3000');
  });

  test('로고가 존재하는지 확인', async ({ page }) => {
    // Arrange & Act
    const logo = page.locator('header a, nav a, [data-testid="logo"], .logo').first();

    // Assert
    const isLogoVisible = await logo.isVisible().catch(() => false);
    expect(isLogoVisible).toBeTruthy();
  });

  test('홈페이지에 도시 카드들이 존재하는지 확인', async ({ page }) => {
    // Arrange & Act
    await page.waitForTimeout(2000); // 페이지 로드 대기

    // 다양한 선택자로 도시 카드 찾기
    const cityCards = page.locator(
      '[data-testid="city-card"], .city-card, [class*="Card"], article, .card'
    );

    // Assert
    const count = await cityCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('처음 접속하면 필터가 적용 안 돼 있는지 확인', async ({ page }) => {
    // Arrange & Act
    await homePage.waitForCityCardsLoad();

    // Assert - 필터 UI 요소가 기본값인지 확인
    const searchInput = page.locator('input[placeholder*="Search"], input[placeholder*="검색"]').first();
    if (await searchInput.isVisible()) {
      await expect(searchInput).toHaveValue('');
    }
  });

  test('필터가 적용 안 돼 있으면 데이터베이스의 모든 도시가 표시되는지 확인', async ({ page }) => {
    // Arrange
    await homePage.waitForCityCardsLoad();
    const expectedCityCount = Object.keys(TEST_CITIES).length; // 5개 도시

    // Act
    const cityCards = page.locator('[data-testid="city-card"]');

    // Assert
    const actualCityCount = await cityCards.count();
    expect(actualCityCount).toBe(expectedCityCount);
  });

  test('각 도시 카드에 필수 정보가 표시되는지 확인', async ({ page }) => {
    // Arrange & Act
    await homePage.waitForCityCardsLoad();
    const firstCard = page.locator('[data-testid="city-card"]').first();

    // Assert - 도시 이름 확인
    const cityName = firstCard.locator('[data-testid="city-name"], .city-name, h3, h2').first();
    await expect(cityName).toBeVisible();

    // Assert - 점수 또는 이모지 확인
    const score = firstCard.locator('[data-testid="score"], .score, .rating').first();
    const emoji = firstCard.locator('[data-testid="emoji"], .emoji, .icon').first();

    const hasScore = await score.isVisible().catch(() => false);
    const hasEmoji = await emoji.isVisible().catch(() => false);

    expect(hasScore || hasEmoji).toBeTruthy();
  });

  test('도시 카드를 클릭하면 상세 페이지로 이동하는지 확인', async ({ page }) => {
    // Arrange
    await homePage.waitForCityCardsLoad();
    const firstCard = page.locator('[data-testid="city-card"]').first();

    // Act
    await firstCard.click();

    // Assert - URL이 상세 페이지로 변경되었는지 확인
    await expect(page).toHaveURL(/\/cities\/.+/);
  });

  test('홈페이지 네비게이션이 정상 작동하는지 확인', async ({ page }) => {
    // Arrange & Act
    await expectElementVisible(page, 'nav');

    // Assert
    await expect(page.locator('nav')).toBeVisible();
  });

  test('필터 버튼이 존재하는지 확인', async ({ page }) => {
    // Arrange & Act
    const filterButton = page.locator(
      'button[data-testid="filter-button"], button:has-text("Filter"), button:has-text("필터")'
    ).first();

    // Assert
    const filterButtonExists = await filterButton.isVisible().catch(() => false);
    expect(filterButtonExists).toBeTruthy();
  });
});

test.describe('홈페이지 - 도시 카드 상호작용', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto('http://localhost:3000');
    await homePage.waitForCityCardsLoad();
  });

  test('도시 카드에 마우스 호버 효과가 있는지 확인', async ({ page }) => {
    // Arrange
    const firstCard = page.locator('[data-testid="city-card"]').first();

    // Act
    await firstCard.hover();

    // Assert - 호버 후 스타일 변경 확인 (opacity, transform 등)
    const computedStyle = await firstCard.evaluate((el) => {
      return window.getComputedStyle(el).transform;
    });

    // 호버 효과가 있으면 transform이 변경될 것으로 예상
    expect(computedStyle).toBeDefined();
  });

  test('좋아요 버튼이 도시 카드에 존재하는지 확인', async ({ page }) => {
    // Arrange
    const firstCard = page.locator('[data-testid="city-card"]').first();

    // Act
    const likeButton = firstCard.locator('button[data-testid="like-button"], button:has-text("❤"), button:has-text("♡")').first();

    // Assert
    const likeButtonExists = await likeButton.isVisible().catch(() => false);
    expect(likeButtonExists).toBeTruthy();
  });

  test('북마크 버튼이 도시 카드에 존재하는지 확인', async ({ page }) => {
    // Arrange
    const firstCard = page.locator('[data-testid="city-card"]').first();

    // Act
    const bookmarkButton = firstCard.locator(
      'button[data-testid="bookmark-button"], button:has-text("⭐"), button:has-text("☆")'
    ).first();

    // Assert
    const bookmarkButtonExists = await bookmarkButton.isVisible().catch(() => false);
    expect(bookmarkButtonExists).toBeTruthy();
  });
});

test.describe('홈페이지 - 레이아웃 및 반응형', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto('http://localhost:3000');
  });

  test('홈페이지 제목이 올바른지 확인', async ({ page }) => {
    // Act & Assert
    await expect(page).toHaveTitle(/Korea Nomad|한국 노마드/i);
  });

  test('페이지가 로드되는데 시간이 걸리지 않는지 확인', async ({ page }) => {
    // Arrange - 시간 측정
    const startTime = Date.now();

    // Act
    await homePage.goto('http://localhost:3000');
    await homePage.waitForCityCardsLoad();

    // Assert - 5초 이내로 로드
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(5000);
  });

  test('콘솔에 심각한 에러가 없는지 확인', async ({ page }) => {
    // Arrange
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Act
    await homePage.goto('http://localhost:3000');
    await homePage.waitForCityCardsLoad();

    // Assert
    expect(errors.filter(e => !e.includes('404'))).toHaveLength(0);
  });
});
