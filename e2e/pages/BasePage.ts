import { Page, expect } from '@playwright/test';
import { TIMEOUTS } from '../config/timeouts';

/**
 * 모든 Page Object의 기본 클래스
 * 공통 메서드와 유틸리티를 제공합니다
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * 페이지로 이동
   */
  async goto(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: 'networkidle' });
    await this.waitForPageLoad();
  }

  /**
   * 페이지 로드 완료 대기
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle', {
      timeout: TIMEOUTS.pageLoad,
    });
  }

  /**
   * 특정 요소를 클릭
   */
  async clickElement(selector: string): Promise<void> {
    await this.page.click(selector);
  }

  /**
   * 텍스트 입력
   */
  async fillText(selector: string, text: string): Promise<void> {
    await this.page.fill(selector, text);
  }

  /**
   * 텍스트 조회
   */
  async getText(selector: string): Promise<string> {
    return await this.page.textContent(selector) || '';
  }

  /**
   * 요소가 보이는지 확인
   */
  async isElementVisible(selector: string): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, {
        timeout: TIMEOUTS.elementVisible,
        state: 'visible',
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 요소 활성화 대기
   */
  async waitForElementEnabled(selector: string): Promise<void> {
    await this.page.waitForSelector(selector, {
      timeout: TIMEOUTS.elementEnabled,
      state: 'visible',
    });
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible' });
  }

  /**
   * URL 확인
   */
  async verifyURL(expectedURL: string): Promise<void> {
    await expect(this.page).toHaveURL(expectedURL);
  }

  /**
   * 페이지 제목 확인
   */
  async verifyPageTitle(expectedTitle: string): Promise<void> {
    await expect(this.page).toHaveTitle(new RegExp(expectedTitle));
  }

  /**
   * 스크린샷 촬영
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({
      path: `e2e/test-results/screenshots/${name}-${Date.now()}.png`,
      fullPage: true,
    });
  }

  /**
   * 콘솔 메시지 확인 대기
   */
  async waitForConsoleMessage(predicate: (msg: string) => boolean): Promise<void> {
    return new Promise((resolve) => {
      this.page.on('console', (msg) => {
        if (predicate(msg.text())) {
          resolve();
        }
      });
    });
  }

  /**
   * 네비게이션 대기
   */
  async waitForNavigation(): Promise<void> {
    await this.page.waitForNavigation({ timeout: TIMEOUTS.navigation });
  }

  /**
   * 쿠키 설정
   */
  async setCookie(name: string, value: string): Promise<void> {
    await this.page.context().addCookies([
      {
        name,
        value,
        url: this.page.url(),
      },
    ]);
  }

  /**
   * 로컬스토리지에 데이터 저장
   */
  async setLocalStorage(key: string, value: string): Promise<void> {
    await this.page.evaluate(
      ([k, v]: [string, string]) => localStorage.setItem(k, v),
      [key, value]
    );
  }

  /**
   * 로컬스토리지에서 데이터 조회
   */
  async getLocalStorage(key: string): Promise<string | null> {
    return await this.page.evaluate((k: string) => localStorage.getItem(k), key);
  }

  /**
   * 로컬스토리지 초기화
   */
  async clearLocalStorage(): Promise<void> {
    await this.page.evaluate(() => localStorage.clear());
  }

  /**
   * 현재 페이지 URL 조회
   */
  async getCurrentURL(): Promise<string> {
    return this.page.url();
  }

  /**
   * 요소가 존재하는지 확인
   */
  async elementExists(selector: string): Promise<boolean> {
    const count = await this.page.locator(selector).count();
    return count > 0;
  }

  /**
   * 모달이 나타날 때까지 대기
   */
  async waitForModal(): Promise<void> {
    await this.page.waitForSelector('[role="dialog"], .modal', {
      timeout: TIMEOUTS.elementVisible,
    });
  }

  /**
   * 모달 닫기
   */
  async closeModal(): Promise<void> {
    const closeButton = this.page.locator('button:has-text("Close"), button:has-text("닫기")').first();
    if (await closeButton.isVisible()) {
      await closeButton.click();
      await this.page.waitForTimeout(TIMEOUTS.modalDismiss);
    }
  }

  /**
   * 페이지 새로고침
   */
  async refreshPage(): Promise<void> {
    await this.page.reload();
    await this.waitForPageLoad();
  }
}
