import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * 로그인 페이지 Page Object
 */
export class LoginPage extends BasePage {
  // Selectors
  private readonly emailInputSelector = 'input[type="email"], input[name="email"]';
  private readonly passwordInputSelector = 'input[type="password"], input[name="password"]';
  private readonly loginButtonSelector = 'button:has-text("Log In"), button:has-text("로그인")';
  private readonly forgotPasswordLinkSelector = 'a:has-text("Forgot password"), a:has-text("비밀번호 잊음")';
  private readonly signupLinkSelector = 'a:has-text("Sign up"), a:has-text("회원가입")';
  private readonly errorMessageSelector = '[data-testid="error-message"], .error, .alert-error';
  private readonly googleLoginButtonSelector = 'button:has-text("Google"), button[data-testid="google-login"]';
  private readonly githubLoginButtonSelector = 'button:has-text("GitHub"), button[data-testid="github-login"]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * 이메일 입력
   */
  async enterEmail(email: string): Promise<void> {
    await this.fillText(this.emailInputSelector, email);
  }

  /**
   * 비밀번호 입력
   */
  async enterPassword(password: string): Promise<void> {
    await this.fillText(this.passwordInputSelector, password);
  }

  /**
   * 로그인 버튼 클릭
   */
  async clickLoginButton(): Promise<void> {
    await this.clickElement(this.loginButtonSelector);
  }

  /**
   * 이메일과 비밀번호로 로그인
   */
  async login(email: string, password: string): Promise<void> {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickLoginButton();
    // 로그인 후 페이지 로드 대기
    await this.page.waitForTimeout(1000);
  }

  /**
   * 비밀번호 찾기 링크 클릭
   */
  async clickForgotPasswordLink(): Promise<void> {
    await this.clickElement(this.forgotPasswordLinkSelector);
  }

  /**
   * 회원가입 링크 클릭
   */
  async clickSignupLink(): Promise<void> {
    await this.clickElement(this.signupLinkSelector);
    await this.waitForNavigation();
  }

  /**
   * 구글 로그인 버튼 클릭
   */
  async clickGoogleLogin(): Promise<void> {
    if (await this.elementExists(this.googleLoginButtonSelector)) {
      await this.clickElement(this.googleLoginButtonSelector);
    }
  }

  /**
   * 깃허브 로그인 버튼 클릭
   */
  async clickGithubLogin(): Promise<void> {
    if (await this.elementExists(this.githubLoginButtonSelector)) {
      await this.clickElement(this.githubLoginButtonSelector);
    }
  }

  /**
   * 에러 메시지 확인
   */
  async getErrorMessage(): Promise<string | null> {
    const errorElement = this.page.locator(this.errorMessageSelector).first();
    if (await errorElement.isVisible()) {
      return await errorElement.textContent();
    }
    return null;
  }

  /**
   * 에러 메시지가 표시되는지 확인
   */
  async isErrorMessageVisible(): Promise<boolean> {
    return await this.isElementVisible(this.errorMessageSelector);
  }

  /**
   * 로그인 버튼이 활성화된 상태인지 확인
   */
  async isLoginButtonEnabled(): Promise<boolean> {
    const button = this.page.locator(this.loginButtonSelector);
    return await button.isEnabled();
  }
}
