import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * 대시보드 페이지 Page Object
 */
export class DashboardPage extends BasePage {
  // Selectors
  private readonly profileCardSelector = '[data-testid="profile-card"], .profile-card';
  private readonly userNameSelector = '[data-testid="user-name"], .user-name';
  private readonly userBioSelector = '[data-testid="user-bio"], .user-bio';
  private readonly editProfileButtonSelector = 'button:has-text("Edit Profile"), button:has-text("프로필 수정")';
  private readonly myReviewsTabSelector = 'button:has-text("My Reviews"), button:has-text("내 리뷰")';
  private readonly myBookmarksTabSelector = 'button:has-text("My Bookmarks"), button:has-text("내 북마크")';
  private readonly myFavoritesTabSelector = 'button:has-text("My Favorites"), button:has-text("내 즐겨찾기")';
  private readonly myEventsTabSelector = 'button:has-text("My Events"), button:has-text("내 이벤트")';
  private readonly settingsTabSelector = 'button:has-text("Settings"), button:has-text("설정")';
  private readonly logoutButtonSelector = 'button:has-text("Logout"), button:has-text("로그아웃")';
  private readonly activityStatsSelector = '[data-testid="activity-stats"], .activity-stats';
  private readonly reviewListSelector = '[data-testid="review-list"], .review-list';
  private readonly bookmarkListSelector = '[data-testid="bookmark-list"], .bookmark-list';
  private readonly favoriteListSelector = '[data-testid="favorite-list"], .favorite-list';
  private readonly eventListSelector = '[data-testid="event-list"], .event-list';

  constructor(page: Page) {
    super(page);
  }

  /**
   * 사용자 이름 조회
   */
  async getUserName(): Promise<string> {
    return await this.getText(this.userNameSelector);
  }

  /**
   * 사용자 소개 조회
   */
  async getUserBio(): Promise<string> {
    return await this.getText(this.userBioSelector);
  }

  /**
   * 프로필 수정 버튼 클릭
   */
  async clickEditProfileButton(): Promise<void> {
    await this.clickElement(this.editProfileButtonSelector);
  }

  /**
   * 내 리뷰 탭 클릭
   */
  async clickMyReviewsTab(): Promise<void> {
    await this.clickElement(this.myReviewsTabSelector);
    await this.page.waitForTimeout(500); // 탭 전환 대기
  }

  /**
   * 내 북마크 탭 클릭
   */
  async clickMyBookmarksTab(): Promise<void> {
    await this.clickElement(this.myBookmarksTabSelector);
    await this.page.waitForTimeout(500);
  }

  /**
   * 내 즐겨찾기 탭 클릭
   */
  async clickMyFavoritesTab(): Promise<void> {
    await this.clickElement(this.myFavoritesTabSelector);
    await this.page.waitForTimeout(500);
  }

  /**
   * 내 이벤트 탭 클릭
   */
  async clickMyEventsTab(): Promise<void> {
    await this.clickElement(this.myEventsTabSelector);
    await this.page.waitForTimeout(500);
  }

  /**
   * 설정 탭 클릭
   */
  async clickSettingsTab(): Promise<void> {
    await this.clickElement(this.settingsTabSelector);
    await this.page.waitForTimeout(500);
  }

  /**
   * 로그아웃 버튼 클릭
   */
  async clickLogoutButton(): Promise<void> {
    await this.clickElement(this.logoutButtonSelector);
  }

  /**
   * 프로필 카드가 보이는지 확인
   */
  async isProfileCardVisible(): Promise<boolean> {
    return await this.isElementVisible(this.profileCardSelector);
  }

  /**
   * 활동 통계가 보이는지 확인
   */
  async isActivityStatsVisible(): Promise<boolean> {
    return await this.isElementVisible(this.activityStatsSelector);
  }

  /**
   * 리뷰 개수 조회
   */
  async getReviewCount(): Promise<number> {
    await this.clickMyReviewsTab();
    return await this.page.locator(`${this.reviewListSelector} > *`).count();
  }

  /**
   * 북마크 개수 조회
   */
  async getBookmarkCount(): Promise<number> {
    await this.clickMyBookmarksTab();
    return await this.page.locator(`${this.bookmarkListSelector} > *`).count();
  }

  /**
   * 즐겨찾기 개수 조회
   */
  async getFavoriteCount(): Promise<number> {
    await this.clickMyFavoritesTab();
    return await this.page.locator(`${this.favoriteListSelector} > *`).count();
  }

  /**
   * 이벤트 개수 조회
   */
  async getEventCount(): Promise<number> {
    await this.clickMyEventsTab();
    return await this.page.locator(`${this.eventListSelector} > *`).count();
  }

  /**
   * 리뷰 항목 삭제 (첫 번째)
   */
  async deleteFirstReview(): Promise<void> {
    await this.clickMyReviewsTab();
    const deleteButton = this.page.locator(
      `${this.reviewListSelector} button:has-text("Delete"), ${this.reviewListSelector} button:has-text("삭제")`
    ).first();
    if (await deleteButton.isVisible()) {
      await deleteButton.click();
    }
  }

  /**
   * 북마크 항목 제거 (첫 번째)
   */
  async removeFirstBookmark(): Promise<void> {
    await this.clickMyBookmarksTab();
    const removeButton = this.page.locator(
      `${this.bookmarkListSelector} button:has-text("Remove"), ${this.bookmarkListSelector} button:has-text("제거")`
    ).first();
    if (await removeButton.isVisible()) {
      await removeButton.click();
    }
  }
}
