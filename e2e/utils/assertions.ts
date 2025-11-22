import { Page, expect } from '@playwright/test';

/**
 * 커스텀 Assertion 함수들
 */

/**
 * 요소가 화면에 보일 때까지 기다린 후 assertion
 */
export async function expectElementVisible(page: Page, selector: string): Promise<void> {
  const element = page.locator(selector);
  await element.waitFor({ state: 'visible' });
  await expect(element).toBeVisible();
}

/**
 * 요소가 숨겨져 있는지 확인
 */
export async function expectElementHidden(page: Page, selector: string): Promise<void> {
  const element = page.locator(selector);
  await expect(element).toBeHidden();
}

/**
 * 요소가 활성화되어 있는지 확인
 */
export async function expectElementEnabled(page: Page, selector: string): Promise<void> {
  const element = page.locator(selector);
  await expect(element).toBeEnabled();
}

/**
 * 요소가 비활성화되어 있는지 확인
 */
export async function expectElementDisabled(page: Page, selector: string): Promise<void> {
  const element = page.locator(selector);
  await expect(element).toBeDisabled();
}

/**
 * 요소 내용 확인
 */
export async function expectElementContainsText(
  page: Page,
  selector: string,
  text: string
): Promise<void> {
  const element = page.locator(selector);
  await expect(element).toContainText(text);
}

/**
 * 요소 텍스트 정확히 일치 확인
 */
export async function expectElementHasExactText(
  page: Page,
  selector: string,
  text: string
): Promise<void> {
  const element = page.locator(selector);
  await expect(element).toHaveText(text);
}

/**
 * 요소 개수 확인
 */
export async function expectElementCount(
  page: Page,
  selector: string,
  count: number
): Promise<void> {
  const elements = page.locator(selector);
  await expect(elements).toHaveCount(count);
}

/**
 * URL이 포함하는지 확인
 */
export async function expectURLContains(page: Page, urlPart: string): Promise<void> {
  await expect(page).toHaveURL(new RegExp(urlPart));
}

/**
 * 페이지 제목 확인
 */
export async function expectPageTitle(page: Page, title: string): Promise<void> {
  await expect(page).toHaveTitle(new RegExp(title));
}

/**
 * 폼 유효성 검사 - 필수 필드 확인
 */
export async function expectFormFieldRequired(page: Page, fieldSelector: string): Promise<void> {
  const field = page.locator(fieldSelector);
  const required = await field.getAttribute('required');
  expect(required).toBeTruthy();
}

/**
 * 입력 필드 값 확인
 */
export async function expectInputValue(
  page: Page,
  selector: string,
  value: string
): Promise<void> {
  const input = page.locator(selector);
  await expect(input).toHaveValue(value);
}

/**
 * 버튼이 클릭 가능한지 확인
 */
export async function expectButtonClickable(page: Page, selector: string): Promise<void> {
  const button = page.locator(selector);
  await expect(button).toBeEnabled();
  await expect(button).toBeVisible();
}

/**
 * 링크가 올바른 href를 가지는지 확인
 */
export async function expectLinkHref(
  page: Page,
  selector: string,
  href: string
): Promise<void> {
  const link = page.locator(selector);
  await expect(link).toHaveAttribute('href', href);
}

/**
 * 이미지가 로드되었는지 확인
 */
export async function expectImageLoaded(page: Page, selector: string): Promise<void> {
  const image = page.locator(`img${selector}`);
  await image.waitFor({ state: 'visible' });
  const isLoaded = await image.evaluate((img: HTMLImageElement) => img.complete && img.naturalHeight > 0);
  expect(isLoaded).toBeTruthy();
}

/**
 * 팝업/모달이 나타나는지 확인
 */
export async function expectDialogVisible(page: Page, dialogTitle?: string): Promise<void> {
  const dialog = dialogTitle
    ? page.locator(`[role="dialog"]:has-text("${dialogTitle}"), .modal:has-text("${dialogTitle}")`)
    : page.locator('[role="dialog"], .modal');
  await expect(dialog).toBeVisible();
}

/**
 * 알림 메시지가 있는지 확인
 */
export async function expectAlertMessage(page: Page, messageType: 'error' | 'success' | 'warning' | 'info'): Promise<void> {
  const alert = page.locator(`[role="alert"].${messageType}, .alert-${messageType}`);
  await expect(alert).toBeVisible();
}

/**
 * 테이블 행 개수 확인
 */
export async function expectTableRowCount(
  page: Page,
  tableSelector: string,
  expectedCount: number
): Promise<void> {
  const rows = page.locator(`${tableSelector} tbody tr`);
  await expect(rows).toHaveCount(expectedCount);
}

/**
 * 선택 요소가 선택되었는지 확인
 */
export async function expectCheckboxChecked(page: Page, selector: string): Promise<void> {
  const checkbox = page.locator(selector);
  await expect(checkbox).toBeChecked();
}

/**
 * 선택 요소가 선택되지 않았는지 확인
 */
export async function expectCheckboxUnchecked(page: Page, selector: string): Promise<void> {
  const checkbox = page.locator(selector);
  await expect(checkbox).not.toBeChecked();
}

/**
 * 요소가 특정 클래스를 가지는지 확인
 */
export async function expectElementHasClass(
  page: Page,
  selector: string,
  className: string
): Promise<void> {
  const element = page.locator(selector);
  const classes = await element.getAttribute('class');
  expect(classes?.includes(className)).toBeTruthy();
}

/**
 * 요소가 특정 속성 값을 가지는지 확인
 */
export async function expectElementAttribute(
  page: Page,
  selector: string,
  attribute: string,
  value: string
): Promise<void> {
  const element = page.locator(selector);
  await expect(element).toHaveAttribute(attribute, value);
}
