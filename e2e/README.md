# 🎭 E2E 테스트 (Playwright)

Korea Nomad 프로젝트의 End-to-End 테스트 스위트입니다. Playwright를 사용하여 실제 사용자 시나리오를 테스트합니다.

## 📋 목차

- [프로젝트 구조](#-프로젝트-구조)
- [시작하기](#-시작하기)
- [테스트 실행](#-테스트-실행)
- [테스트 작성 가이드](#-테스트-작성-가이드)
- [Page Object Model](#-page-object-model)
- [Fixtures와 데이터](#-fixtures와-데이터)
- [유틸리티 함수](#-유틸리티-함수)
- [CI/CD 통합](#-cicd-통합)

---

## 📁 프로젝트 구조

```
e2e/
├── playwright.config.ts          # Playwright 설정
├── README.md                      # 이 파일
│
├── tests/                         # 테스트 파일
│   ├── auth/                      # 인증 관련
│   ├── home/                      # 홈페이지
│   ├── cities/                    # 도시 상세
│   ├── community/                 # 커뮤니티
│   ├── dashboard/                 # 대시보드
│   └── workflows/                 # 전체 사용자 여정
│
├── pages/                         # Page Object Model
│   ├── BasePage.ts                # 기본 클래스
│   ├── HomePage.ts
│   ├── LoginPage.ts
│   ├── CityDetailPage.ts
│   ├── CommunityPage.ts
│   ├── DashboardPage.ts
│   ├── NavigationBar.ts
│   └── index.ts                   # 내보내기
│
├── fixtures/                      # 테스트 데이터
│   ├── users.ts
│   ├── cities.ts
│   ├── reviews.ts
│   ├── events.ts
│   └── index.ts
│
├── utils/                         # 헬퍼 함수
│   ├── test-helpers.ts            # 일반 헬퍼
│   ├── auth-helpers.ts            # 인증 헬퍼
│   ├── assertions.ts              # 커스텀 assertion
│   ├── db-helpers.ts              # DB 헬퍼
│   └── index.ts
│
├── config/                        # 설정
│   ├── global-setup.ts            # 전역 설정
│   ├── global-teardown.ts         # 전역 정리
│   ├── baseUrls.ts                # URL 설정
│   └── timeouts.ts                # 타임아웃 설정
│
└── data/                          # 테스트 데이터 (JSON)
    ├── test-users.json
    ├── test-cities.json
    └── mock-responses.json
```

---

## 🚀 시작하기

### 설치

Playwright는 이미 설치되어 있습니다. 필요하면 다시 설치:

```bash
npm install -D @playwright/test
```

### 브라우저 설치

```bash
npx playwright install
```

---

## 🧪 테스트 실행

### 모든 테스트 실행

```bash
npm run test:e2e
```

### UI 모드로 실행 (대화형)

```bash
npm run test:e2e:ui
```

### 디버그 모드

```bash
npm run test:e2e:debug
```

### Headed 모드 (브라우저 창 표시)

```bash
npm run test:e2e:headed
```

### 특정 브라우저 테스트

```bash
npm run test:e2e:chromium    # Chrome
npm run test:e2e:firefox     # Firefox
npm run test:e2e:webkit      # Safari
```

### 특정 테스트 파일 실행

```bash
npx playwright test e2e/tests/auth/login.spec.ts
```

### 특정 테스트만 실행

```bash
npx playwright test -g "로그인 테스트"
```

---

## ✍️ 테스트 작성 가이드

### 기본 테스트 구조

```typescript
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages';

test.describe('홈페이지', () => {
  test('도시 카드가 표시되어야 함', async ({ page }) => {
    // Arrange
    const homePage = new HomePage(page);

    // Act
    await homePage.goto('http://localhost:3000');

    // Assert
    await expect(page.locator('[data-testid="city-card"]')).toBeVisible();
  });
});
```

### AAA 패턴

1. **Arrange**: 테스트 환경 준비
2. **Act**: 사용자 액션 수행
3. **Assert**: 결과 검증

---

## 🏗️ Page Object Model

Page Object Model은 UI 상호작용을 캡슐화하여 테스트를 유지보수하기 쉽게 만듭니다.

### 커스텀 Page 만들기

```typescript
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class MyPage extends BasePage {
  private readonly mySelector = '[data-testid="my-element"]';

  async myAction(): Promise<void> {
    await this.clickElement(this.mySelector);
  }
}
```

### BasePage 메서드

- `goto(url)`: 페이지 이동
- `clickElement(selector)`: 요소 클릭
- `fillText(selector, text)`: 텍스트 입력
- `getText(selector)`: 텍스트 조회
- `isElementVisible(selector)`: 요소 표시 확인
- `takeScreenshot(name)`: 스크린샷 촬영
- 등등...

---

## 📦 Fixtures와 데이터

### 테스트 사용자

```typescript
import { TEST_USERS } from '../fixtures';

const { email, password } = TEST_USERS.validUser;
```

### 테스트 도시

```typescript
import { TEST_CITIES } from '../fixtures';

const seoul = TEST_CITIES.seoul;
```

### 테스트 리뷰/이벤트

```typescript
import { TEST_REVIEWS, TEST_EVENTS } from '../fixtures';
```

---

## 🛠️ 유틸리티 함수

### 인증

```typescript
import { loginUser, logoutUser, isUserAuthenticated } from '../utils';

await loginUser(page, 'email@test.com', 'password');
```

### 헬퍼

```typescript
import { waitForText, clickWhenReady, waitForLoadingToComplete } from '../utils';

await waitForText(page, '로딩 완료');
await clickWhenReady(page, '.button');
```

### Assertion

```typescript
import { expectElementVisible, expectTableRowCount } from '../utils';

await expectElementVisible(page, '.element');
await expectTableRowCount(page, 'table', 5);
```

---

## 📊 테스트 결과

테스트 실행 후 결과 보기:

```bash
# HTML 리포트 열기
npx playwright show-report
```

결과 위치: `e2e/test-results/`

---

## 🔄 CI/CD 통합

GitHub Actions에서 E2E 테스트 실행:

```yaml
- name: E2E 테스트
  run: npm run test:e2e
```

---

## 📝 모범 사례

1. **한 가지씩만 테스트**: 각 테스트는 하나의 기능만 검증
2. **명확한 테스트 이름**: 테스트가 뭘 하는지 명확히 표현
3. **Data-testid 사용**: UI 구현이 바뀌어도 깨지지 않음
4. **대기 최소화**: 불필요한 대기는 테스트 속도를 느리게 함
5. **스크린샷**: 실패한 테스트 시 자동 스크린샷 촬영

---

## 🐛 문제 해결

### 타임아웃

```typescript
// 특정 타임아웃 설정
await page.waitForSelector(selector, { timeout: 30000 });
```

### 비안정적인 테스트 (Flaky Tests)

- 명시적 대기 사용
- 네트워크 상태 확인
- 재시도 설정

### 로컬 vs CI 환경 차이

```typescript
const baseURL = process.env.PLAYWRIGHT_ENV === 'ci'
  ? 'https://staging.com'
  : 'http://localhost:3000';
```

---

## 📚 참고 자료

- [Playwright 공식 문서](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Page Object Model 패턴](https://martinfowler.com/bliki/PageObject.html)

---

## 🤝 기여

새로운 테스트를 추가할 때:

1. 적절한 폴더에 파일 생성
2. Page Object 사용
3. Fixtures 활용
4. 헬퍼 함수 재사용
5. 명확한 테스트 이름

---

**Happy Testing! 🎉**
