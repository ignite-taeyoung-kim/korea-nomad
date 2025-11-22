import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * 네비게이션 바 Page Object
 * 모든 페이지에 공통으로 나타나는 네비게이션 요소를 관리합니다
 */
export class NavigationBar extends BasePage {
  // Selectors
  private readonly logoSelector = 'a[href="/"]';
  private readonly homeNavSelector = 'a[href="/"], nav a:has-text("Home")';
  private readonly citiesNavSelector = 'a[href="/cities"], nav a:has-text("Cities")';
  private readonly communityNavSelector = 'a[href="/community"], nav a:has-text("Community")';
  private readonly dashboardNavSelector = 'a[href="/dashboard"], nav a:has-text("Dashboard")';
  private readonly mobileMenuToggleSelector = '[role="button"]:has-text("Menu"), button.menu-toggle';
  private readonly profileButtonSelector = 'button[data-testid="profile-button"]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * 로고 클릭 (홈으로 이동)
   */
  async clickLogo(): Promise<void> {
    await this.clickElement(this.logoSelector);
    await this.waitForNavigation();
  }

  /**
   * 홈 네비게이션 클릭
   */
  async clickHome(): Promise<void> {
    await this.clickElement(this.homeNavSelector);
    await this.waitForNavigation();
  }

  /**
   * 도시 네비게이션 클릭
   */
  async clickCities(): Promise<void> {
    await this.clickElement(this.citiesNavSelector);
    await this.waitForNavigation();
  }

  /**
   * 커뮤니티 네비게이션 클릭
   */
  async clickCommunity(): Promise<void> {
    await this.clickElement(this.communityNavSelector);
    await this.waitForNavigation();
  }

  /**
   * 대시보드 네비게이션 클릭
   */
  async clickDashboard(): Promise<void> {
    await this.clickElement(this.dashboardNavSelector);
    await this.waitForNavigation();
  }

  /**
   * 모바일 메뉴 토글
   */
  async toggleMobileMenu(): Promise<void> {
    if (await this.elementExists(this.mobileMenuToggleSelector)) {
      await this.clickElement(this.mobileMenuToggleSelector);
    }
  }

  /**
   * 프로필 버튼 클릭
   */
  async clickProfileButton(): Promise<void> {
    await this.clickElement(this.profileButtonSelector);
  }

  /**
   * 특정 네비게이션 아이템이 활성화 상태인지 확인
   */
  async isNavItemActive(itemName: string): Promise<boolean> {
    const selector = `nav a[href*="${itemName}"].active, nav a:has-text("${itemName}").active`;
    return await this.elementExists(selector);
  }

  /**
   * 네비게이션이 보이는지 확인
   */
  async isNavigationVisible(): Promise<boolean> {
    return await this.isElementVisible('nav');
  }
}
