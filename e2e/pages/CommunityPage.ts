import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * 커뮤니티 페이지 Page Object
 */
export class CommunityPage extends BasePage {
  // Selectors
  private readonly eventCardSelector = '[data-testid="event-card"], .event-card';
  private readonly createEventButtonSelector = 'button:has-text("Create Event"), button:has-text("이벤트 생성")';
  private readonly eventFilterSelector = '[data-testid="event-filter"], .event-filter';
  private readonly eventCategoryFilterSelector = 'select[name="category"], [data-testid="category-filter"]';
  private readonly eventListSelector = '[data-testid="event-list"], .event-list';
  private readonly eventTitleSelector = '[data-testid="event-title"], .event-title';
  private readonly eventDateSelector = '[data-testid="event-date"], .event-date';
  private readonly eventLocationSelector = '[data-testid="event-location"], .event-location';
  private readonly participantCountSelector = '[data-testid="participant-count"], .participant-count';
  private readonly joinEventButtonSelector = 'button:has-text("Join"), button:has-text("참여")';
  private readonly memberListSelector = '[data-testid="member-list"], .member-list';

  constructor(page: Page) {
    super(page);
  }

  /**
   * 이벤트 카드 개수 조회
   */
  async getEventCardCount(): Promise<number> {
    return await this.page.locator(this.eventCardSelector).count();
  }

  /**
   * 이벤트 생성 버튼 클릭
   */
  async clickCreateEventButton(): Promise<void> {
    await this.clickElement(this.createEventButtonSelector);
  }

  /**
   * 이벤트 카테고리 필터 설정
   */
  async filterByCategory(category: string): Promise<void> {
    await this.page.selectOption(this.eventCategoryFilterSelector, category);
    await this.page.waitForTimeout(500); // 필터 적용 대기
  }

  /**
   * 특정 이벤트 클릭
   */
  async clickEvent(eventTitle: string): Promise<void> {
    const event = this.page.locator(`${this.eventCardSelector}:has-text("${eventTitle}")`).first();
    await event.click();
    await this.waitForNavigation();
  }

  /**
   * 이벤트에 참여
   */
  async joinEvent(eventTitle: string): Promise<void> {
    const event = this.page.locator(`${this.eventCardSelector}:has-text("${eventTitle}")`).first();
    const joinButton = event.locator(this.joinEventButtonSelector);
    await joinButton.click();
  }

  /**
   * 이벤트 카드의 제목 조회
   */
  async getEventTitle(index: number = 0): Promise<string> {
    return await this.page.locator(this.eventTitleSelector).nth(index).textContent() || '';
  }

  /**
   * 이벤트 카드의 날짜 조회
   */
  async getEventDate(index: number = 0): Promise<string> {
    return await this.page.locator(this.eventDateSelector).nth(index).textContent() || '';
  }

  /**
   * 이벤트 카드의 위치 조회
   */
  async getEventLocation(index: number = 0): Promise<string> {
    return await this.page.locator(this.eventLocationSelector).nth(index).textContent() || '';
  }

  /**
   * 참가자 수 조회
   */
  async getParticipantCount(index: number = 0): Promise<string> {
    return await this.page.locator(this.participantCountSelector).nth(index).textContent() || '';
  }

  /**
   * 이벤트 필터가 보이는지 확인
   */
  async isEventFilterVisible(): Promise<boolean> {
    return await this.isElementVisible(this.eventFilterSelector);
  }

  /**
   * 멤버 리스트가 보이는지 확인
   */
  async isMemberListVisible(): Promise<boolean> {
    return await this.isElementVisible(this.memberListSelector);
  }

  /**
   * 모든 이벤트가 로드될 때까지 대기
   */
  async waitForEventsLoad(): Promise<void> {
    await this.page.waitForSelector(this.eventCardSelector, { state: 'visible' });
  }
}
