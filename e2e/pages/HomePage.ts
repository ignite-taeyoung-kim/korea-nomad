import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * 홈페이지 Page Object
 */
export class HomePage extends BasePage {
  // Selectors
  private readonly filterButtonSelector = '[data-testid="filter-button"], button:has-text("Filter")';
  private readonly searchInputSelector = 'input[placeholder*="Search"], input[placeholder*="검색"]';
  private readonly sortDropdownSelector = '[data-testid="sort-dropdown"], select[name="sort"]';
  private readonly cityCardSelector = '[data-testid="city-card"]';
  private readonly filterCostSelector = 'input[name="cost"], [data-testid="cost-filter"]';
  private readonly filterSpeedSelector = 'input[name="speed"], [data-testid="speed-filter"]';
  private readonly heroSectionSelector = '[data-testid="hero-section"], .hero, .banner';
  private readonly ctaSectionSelector = '[data-testid="cta-section"], .cta';

  constructor(page: Page) {
    super(page);
  }

  /**
   * 검색 입력
   */
  async searchCity(query: string): Promise<void> {
    await this.fillText(this.searchInputSelector, query);
    await this.page.waitForTimeout(500); // 검색 결과 로드 대기
  }

  /**
   * 필터 버튼 클릭
   */
  async clickFilterButton(): Promise<void> {
    await this.clickElement(this.filterButtonSelector);
  }

  /**
   * 정렬 옵션 선택
   */
  async selectSortOption(option: string): Promise<void> {
    await this.page.selectOption(this.sortDropdownSelector, option);
  }

  /**
   * 비용 필터 설정
   */
  async setFilterCost(minCost: string, maxCost?: string): Promise<void> {
    const costInputs = await this.page.locator(this.filterCostSelector).count();
    if (costInputs > 0) {
      await this.fillText(this.filterCostSelector, minCost);
      if (maxCost && costInputs > 1) {
        const inputs = this.page.locator(this.filterCostSelector);
        await inputs.nth(1).fill(maxCost);
      }
    }
  }

  /**
   * 인터넷 속도 필터 설정
   */
  async setFilterSpeed(minSpeed: string): Promise<void> {
    await this.fillText(this.filterSpeedSelector, minSpeed);
  }

  /**
   * 도시 카드 개수 조회
   */
  async getCityCardCount(): Promise<number> {
    return await this.page.locator(this.cityCardSelector).count();
  }

  /**
   * 특정 도시 카드 클릭
   */
  async clickCityCard(cityName: string): Promise<void> {
    const card = this.page.locator(`${this.cityCardSelector}:has-text("${cityName}")`).first();
    await card.click();
    await this.waitForNavigation();
  }

  /**
   * 도시 카드의 좋아요 버튼 클릭
   */
  async clickCityCardLike(cityName: string): Promise<void> {
    const card = this.page.locator(`${this.cityCardSelector}:has-text("${cityName}")`).first();
    const likeButton = card.locator('button[data-testid="like-button"], button:has-text("❤"), button:has-text("♡")').first();
    await likeButton.click();
  }

  /**
   * 도시 카드의 북마크 버튼 클릭
   */
  async clickCityCardBookmark(cityName: string): Promise<void> {
    const card = this.page.locator(`${this.cityCardSelector}:has-text("${cityName}")`).first();
    const bookmarkButton = card.locator('button[data-testid="bookmark-button"], button:has-text("⭐"), button:has-text("☆")').first();
    await bookmarkButton.click();
  }

  /**
   * 히어로 섹션 보이는지 확인
   */
  async isHeroSectionVisible(): Promise<boolean> {
    return await this.isElementVisible(this.heroSectionSelector);
  }

  /**
   * CTA 섹션 보이는지 확인
   */
  async isCtaSectionVisible(): Promise<boolean> {
    return await this.isElementVisible(this.ctaSectionSelector);
  }

  /**
   * 필터 초기화
   */
  async resetFilters(): Promise<void> {
    const resetButton = this.page.locator('button:has-text("Reset"), button:has-text("초기화")').first();
    if (await resetButton.isVisible()) {
      await resetButton.click();
    }
  }

  /**
   * 모든 카드가 로드될 때까지 대기
   */
  async waitForCityCardsLoad(): Promise<void> {
    await this.page.waitForSelector(this.cityCardSelector, { state: 'visible' });
  }
}
