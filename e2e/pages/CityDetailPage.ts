import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * 도시 상세페이지 Page Object
 */
export class CityDetailPage extends BasePage {
  // Selectors
  private readonly cityNameSelector = '[data-testid="city-name"], h1';
  private readonly cityDescriptionSelector = '[data-testid="city-description"], .description';
  private readonly overallScoreSelector = '[data-testid="overall-score"], .score';
  private readonly costPerMonthSelector = '[data-testid="cost-per-month"], .cost';
  private readonly internetSpeedSelector = '[data-testid="internet-speed"], .speed';
  private readonly cafeRatingSelector = '[data-testid="cafe-rating"], .cafe-rating';
  private readonly likeButtonSelector = 'button[data-testid="like-button"], button:has-text("❤")';
  private readonly bookmarkButtonSelector = 'button[data-testid="bookmark-button"], button:has-text("⭐")';
  private readonly shareButtonSelector = 'button[data-testid="share-button"], button:has-text("Share")';
  private readonly reviewSectionSelector = '[data-testid="review-section"], .reviews';
  private readonly reviewListSelector = '[data-testid="review-list"], .review-list';
  private readonly reviewFormSelector = '[data-testid="review-form"], form.review-form';
  private readonly addReviewButtonSelector = 'button:has-text("Add Review"), button:has-text("리뷰 추가")';

  constructor(page: Page) {
    super(page);
  }

  /**
   * 도시 이름 조회
   */
  async getCityName(): Promise<string> {
    return await this.getText(this.cityNameSelector);
  }

  /**
   * 도시 설명 조회
   */
  async getCityDescription(): Promise<string> {
    return await this.getText(this.cityDescriptionSelector);
  }

  /**
   * 전체 점수 조회
   */
  async getOverallScore(): Promise<string> {
    return await this.getText(this.overallScoreSelector);
  }

  /**
   * 월간 비용 조회
   */
  async getCostPerMonth(): Promise<string> {
    return await this.getText(this.costPerMonthSelector);
  }

  /**
   * 인터넷 속도 조회
   */
  async getInternetSpeed(): Promise<string> {
    return await this.getText(this.internetSpeedSelector);
  }

  /**
   * 카페 평점 조회
   */
  async getCafeRating(): Promise<string> {
    return await this.getText(this.cafeRatingSelector);
  }

  /**
   * 좋아요 버튼 클릭
   */
  async clickLikeButton(): Promise<void> {
    await this.clickElement(this.likeButtonSelector);
  }

  /**
   * 북마크 버튼 클릭
   */
  async clickBookmarkButton(): Promise<void> {
    await this.clickElement(this.bookmarkButtonSelector);
  }

  /**
   * 공유 버튼 클릭
   */
  async clickShareButton(): Promise<void> {
    await this.clickElement(this.shareButtonSelector);
  }

  /**
   * 리뷰 섹션이 보이는지 확인
   */
  async isReviewSectionVisible(): Promise<boolean> {
    return await this.isElementVisible(this.reviewSectionSelector);
  }

  /**
   * 리뷰 개수 조회
   */
  async getReviewCount(): Promise<number> {
    return await this.page.locator(`${this.reviewListSelector} > *`).count();
  }

  /**
   * 리뷰 추가 버튼 클릭
   */
  async clickAddReviewButton(): Promise<void> {
    await this.clickElement(this.addReviewButtonSelector);
  }

  /**
   * 리뷰 폼이 보이는지 확인
   */
  async isReviewFormVisible(): Promise<boolean> {
    return await this.isElementVisible(this.reviewFormSelector);
  }

  /**
   * 도시 정보가 로드되었는지 확인
   */
  async waitForCityDetailsLoad(): Promise<void> {
    await this.page.waitForSelector(this.cityNameSelector, { state: 'visible' });
  }

  /**
   * 좋아요 버튼 상태 확인
   */
  async isLikeButtonActive(): Promise<boolean> {
    const button = this.page.locator(this.likeButtonSelector);
    const ariaPressed = await button.getAttribute('aria-pressed');
    return ariaPressed === 'true';
  }

  /**
   * 북마크 버튼 상태 확인
   */
  async isBookmarkButtonActive(): Promise<boolean> {
    const button = this.page.locator(this.bookmarkButtonSelector);
    const ariaPressed = await button.getAttribute('aria-pressed');
    return ariaPressed === 'true';
  }
}
