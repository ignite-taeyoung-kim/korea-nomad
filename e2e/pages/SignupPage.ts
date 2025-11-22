import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * 회원가입 페이지 Page Object
 */
export class SignupPage extends BasePage {
  // Selectors
  private readonly nameInputSelector = 'input[name="name"], input[type="text"]:first-of-type';
  private readonly emailInputSelector = 'input[type="email"]';
  private readonly passwordInputSelector = 'input[name="password"], input[type="password"]:first-of-type';
  private readonly confirmPasswordSelector = 'input[name="confirmPassword"], input[type="password"]:nth-of-type(2)';
  private readonly signupButtonSelector = 'button:has-text("Sign Up"), button:has-text("회원가입")';
  private readonly loginLinkSelector = 'a:has-text("Log in"), a:has-text("로그인")';
  private readonly termsCheckboxSelector = 'input[type="checkbox"][name="terms"]';
  private readonly errorMessageSelector = '[data-testid="error-message"], .error';
  private readonly successMessageSelector = '[data-testid="success-message"], .success';

  constructor(page: Page) {
    super(page);
  }

  /**
   * 이름 입력
   */
  async enterName(name: string): Promise<void> {
    await this.fillText(this.nameInputSelector, name);
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
   * 비밀번호 확인 입력
   */
  async enterConfirmPassword(password: string): Promise<void> {
    await this.fillText(this.confirmPasswordSelector, password);
  }

  /**
   * 약관 동의 체크
   */
  async acceptTerms(): Promise<void> {
    const checkbox = this.page.locator(this.termsCheckboxSelector);
    if (await checkbox.isVisible()) {
      const isChecked = await checkbox.isChecked();
      if (!isChecked) {
        await checkbox.click();
      }
    }
  }

  /**
   * 회원가입 버튼 클릭
   */
  async clickSignupButton(): Promise<void> {
    await this.clickElement(this.signupButtonSelector);
  }

  /**
   * 전체 회원가입 프로세스 실행
   */
  async signup(name: string, email: string, password: string): Promise<void> {
    await this.enterName(name);
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.enterConfirmPassword(password);
    await this.acceptTerms();
    await this.clickSignupButton();
    // 회원가입 처리 대기
    await this.page.waitForTimeout(1000);
  }

  /**
   * 로그인 링크 클릭
   */
  async clickLoginLink(): Promise<void> {
    await this.clickElement(this.loginLinkSelector);
    await this.waitForNavigation();
  }

  /**
   * 에러 메시지 조회
   */
  async getErrorMessage(): Promise<string | null> {
    const errorElement = this.page.locator(this.errorMessageSelector).first();
    if (await errorElement.isVisible()) {
      return await errorElement.textContent();
    }
    return null;
  }

  /**
   * 성공 메시지 확인
   */
  async isSuccessMessageVisible(): Promise<boolean> {
    return await this.isElementVisible(this.successMessageSelector);
  }

  /**
   * 회원가입 버튼이 활성화된 상태인지 확인
   */
  async isSignupButtonEnabled(): Promise<boolean> {
    const button = this.page.locator(this.signupButtonSelector);
    return await button.isEnabled();
  }
}
