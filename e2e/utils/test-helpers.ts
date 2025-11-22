import { Page, expect } from '@playwright/test';
import { TIMEOUTS } from '../config/timeouts';

/**
 * 일반적인 테스트 헬퍼 함수들
 */

/**
 * 무작위 지연 (밀리초)
 */
export async function randomDelay(min: number = 500, max: number = 2000): Promise<void> {
  const delay = Math.random() * (max - min) + min;
  await new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * 특정 텍스트가 페이지에 나타날 때까지 대기
 */
export async function waitForText(page: Page, text: string, timeout: number = TIMEOUTS.action): Promise<void> {
  await page.locator(`text=${text}`).waitFor({ state: 'visible', timeout });
}

/**
 * 특정 텍스트가 페이지에서 사라질 때까지 대기
 */
export async function waitForTextToDisappear(
  page: Page,
  text: string,
  timeout: number = TIMEOUTS.action
): Promise<void> {
  await page.locator(`text=${text}`).waitFor({ state: 'hidden', timeout });
}

/**
 * 요소가 클릭 가능할 때까지 대기 후 클릭
 */
export async function clickWhenReady(
  page: Page,
  selector: string,
  timeout: number = TIMEOUTS.elementEnabled
): Promise<void> {
  const element = page.locator(selector);
  await element.waitFor({ state: 'visible', timeout });
  await element.click();
}

/**
 * 양식 제출 대기
 */
export async function submitFormAndWait(
  page: Page,
  submitButtonSelector: string = 'button[type="submit"]',
  timeout: number = TIMEOUTS.formSubmit
): Promise<void> {
  await clickWhenReady(page, submitButtonSelector, timeout);
  // 폼 제출 후 네트워크 대기
  await page.waitForLoadState('networkidle');
}

/**
 * 알림 메시지 확인
 */
export async function hasAlert(page: Page, alertText: string): Promise<boolean> {
  const alert = page.locator(`[role="alert"]:has-text("${alertText}"), .alert:has-text("${alertText}")`);
  try {
    await alert.waitFor({ state: 'visible', timeout: 2000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * 로딩 표시기 대기 후 사라질 때까지 대기
 */
export async function waitForLoadingToComplete(
  page: Page,
  loadingSelector: string = '[data-testid="loading"], .loader, .spinner'
): Promise<void> {
  const loader = page.locator(loadingSelector);
  try {
    await loader.waitFor({ state: 'visible', timeout: 2000 });
    await loader.waitFor({ state: 'hidden', timeout: TIMEOUTS.dataLoad });
  } catch {
    // 로더가 없을 수도 있음
  }
}

/**
 * 테이블에서 특정 행 찾기
 */
export async function findTableRow(
  page: Page,
  tableSelector: string,
  searchText: string
): Promise<boolean> {
  const table = page.locator(tableSelector);
  const row = table.locator(`tr:has-text("${searchText}")`);
  return await row.count() > 0;
}

/**
 * 페이지 상태 확인 (로드 완료, 에러 없음)
 */
export async function verifyPageHealth(page: Page): Promise<void> {
  // 콘솔 에러 확인
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // 페이지 로드
  await page.waitForLoadState('networkidle');

  // 심각한 에러가 없는지 확인
  expect(consoleErrors.filter(e => !e.includes('404'))).toHaveLength(0);
}

/**
 * 다운로드 시작 대기
 */
export async function waitForDownload(page: Page, callback: () => Promise<void>): Promise<any> {
  const downloadPromise = page.waitForEvent('download');
  await callback();
  return await downloadPromise;
}

/**
 * 현재 시간 포맷
 */
export function getCurrentTimeFormatted(): string {
  return new Date().toLocaleTimeString();
}

/**
 * 스크린샷 저장 경로 생성
 */
export function generateScreenshotPath(testName: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `e2e/test-results/screenshots/${testName}-${timestamp}.png`;
}

/**
 * 테스트 데이터 정리 (필요시 사용)
 */
export async function cleanupTestData(page: Page): Promise<void> {
  // 로컬스토리지 초기화
  await page.evaluate(() => localStorage.clear());
  // 세션스토리지 초기화
  await page.evaluate(() => sessionStorage.clear());
  // 쿠키 삭제
  await page.context().clearCookies();
}
