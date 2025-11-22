import { Page } from '@playwright/test';
import { LoginPage } from '../pages';
import { TEST_USERS } from '../fixtures';
import { ROUTES, getBaseUrl } from '../config/baseUrls';

/**
 * 인증 관련 헬퍼 함수들
 */

/**
 * 사용자 로그인
 */
export async function loginUser(
  page: Page,
  email: string = TEST_USERS.validUser.email,
  password: string = TEST_USERS.validUser.password
): Promise<void> {
  const loginPage = new LoginPage(page);
  await loginPage.goto(`${getBaseUrl()}${ROUTES.login}`);
  await loginPage.login(email, password);
  // 로그인 후 대시보드로 리다이렉트될 때까지 대기
  await page.waitForURL(`**/dashboard`, { timeout: 10000 });
}

/**
 * 사용자 로그아웃
 */
export async function logoutUser(page: Page): Promise<void> {
  // 로그아웃 버튼 찾기
  const logoutButton = page.locator('button:has-text("Logout"), button:has-text("로그아웃")').first();
  if (await logoutButton.isVisible()) {
    await logoutButton.click();
    // 로그아웃 후 홈페이지로 리다이렉트될 때까지 대기
    await page.waitForURL(`**/`, { timeout: 5000 });
  }
}

/**
 * 인증된 상태 확인
 */
export async function isUserAuthenticated(page: Page): Promise<boolean> {
  const dashboardLink = page.locator('a[href*="/dashboard"], nav:has-text("Dashboard")').first();
  return await dashboardLink.isVisible();
}

/**
 * 로컬스토리지에 토큰 저장 (테스트용)
 */
export async function setAuthToken(page: Page, token: string): Promise<void> {
  await page.evaluate((tkn: string) => {
    localStorage.setItem('auth-token', tkn);
  }, token);
}

/**
 * 로컬스토리지에서 토큰 조회
 */
export async function getAuthToken(page: Page): Promise<string | null> {
  return await page.evaluate(() => localStorage.getItem('auth-token'));
}

/**
 * 인증 정보 초기화
 */
export async function clearAuthData(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user-profile');
    sessionStorage.clear();
  });
  // 페이지 새로고침
  await page.reload();
}

/**
 * 사용자 프로필 정보 저장 (로컬 테스트용)
 */
export async function saveUserProfile(page: Page, profile: Record<string, any>): Promise<void> {
  await page.evaluate((prof: Record<string, any>) => {
    localStorage.setItem('user-profile', JSON.stringify(prof));
  }, profile);
}

/**
 * 사용자 프로필 정보 조회
 */
export async function getUserProfile(page: Page): Promise<Record<string, any> | null> {
  const profile = await page.evaluate(() => localStorage.getItem('user-profile'));
  return profile ? JSON.parse(profile) : null;
}

/**
 * 권한 확인 (관리자 여부)
 */
export async function isAdmin(page: Page): Promise<boolean> {
  const profile = await getUserProfile(page);
  return profile?.role === 'admin' || false;
}

/**
 * 권한 확인 (모더레이터 여부)
 */
export async function isModerator(page: Page): Promise<boolean> {
  const profile = await getUserProfile(page);
  return profile?.role === 'moderator' || false;
}

/**
 * 권한 확인 (일반 사용자)
 */
export async function isRegularUser(page: Page): Promise<boolean> {
  const profile = await getUserProfile(page);
  return profile?.role === 'user' || !profile;
}

/**
 * 세션 쿠키 설정
 */
export async function setSessionCookie(page: Page, sessionId: string): Promise<void> {
  await page.context().addCookies([
    {
      name: 'session_id',
      value: sessionId,
      url: getBaseUrl(),
      httpOnly: true,
      sameSite: 'Lax',
    },
  ]);
}

/**
 * 로그인 후 홈페이지로 이동
 */
export async function loginAndGoHome(
  page: Page,
  email?: string,
  password?: string
): Promise<void> {
  await loginUser(page, email, password);
  await page.goto(getBaseUrl());
}
