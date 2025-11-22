# 🎉 Playwright E2E 테스트 환경 설정 완료

## 📋 설정 완료 사항

### ✅ 설치된 패키지
- `@playwright/test` - Playwright 테스트 프레임워크

### ✅ 생성된 구조

```
e2e/
├── playwright.config.ts              # Playwright 설정 파일
├── README.md                          # 가이드 문서
│
├── tests/                             # 테스트 파일 디렉토리
│   ├── auth/                          # 인증 테스트 (placeholder)
│   ├── home/                          # 홈페이지 테스트 (placeholder)
│   ├── cities/                        # 도시 상세 테스트 (placeholder)
│   ├── community/                     # 커뮤니티 테스트 (placeholder)
│   ├── dashboard/                     # 대시보드 테스트 (placeholder)
│   └── workflows/                     # 사용자 여정 테스트 (placeholder)
│
├── pages/                             # Page Object Model (8개 파일)
│   ├── BasePage.ts                    # 기본 클래스 - 공통 기능
│   ├── NavigationBar.ts               # 네비게이션 바
│   ├── HomePage.ts                    # 홈페이지
│   ├── LoginPage.ts                   # 로그인 페이지
│   ├── SignupPage.ts                  # 회원가입 페이지
│   ├── CityDetailPage.ts              # 도시 상세페이지
│   ├── CommunityPage.ts               # 커뮤니티 페이지
│   ├── DashboardPage.ts               # 대시보드 페이지
│   └── index.ts                       # 내보내기
│
├── fixtures/                          # 테스트 데이터 (5개 파일)
│   ├── users.ts                       # 테스트 사용자 데이터
│   ├── cities.ts                      # 테스트 도시 데이터
│   ├── reviews.ts                     # 테스트 리뷰 데이터
│   ├── events.ts                      # 테스트 이벤트 데이터
│   └── index.ts                       # 내보내기
│
├── utils/                             # 헬퍼 함수 (5개 파일)
│   ├── test-helpers.ts                # 일반 헬퍼 함수
│   ├── auth-helpers.ts                # 인증 관련 헬퍼
│   ├── assertions.ts                  # 커스텀 assertion 함수
│   ├── db-helpers.ts                  # DB 관련 헬퍼
│   └── index.ts                       # 내보내기
│
├── config/                            # 설정 파일 (4개 파일)
│   ├── global-setup.ts                # 전역 설정
│   ├── global-teardown.ts             # 전역 정리
│   ├── baseUrls.ts                    # 환경별 URL
│   └── timeouts.ts                    # 타임아웃 설정
│
└── data/                              # 테스트 데이터 파일
    ├── test-users.json                # 사용자 테스트 데이터
    └── test-cities.json               # 도시 테스트 데이터
```

### ✅ 업데이트된 파일
- `package.json` - E2E 테스트 스크립트 추가
- `.gitignore` - E2E 결과 파일 제외

### ✅ 추가된 npm 스크립트

```json
{
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui",
  "test:e2e:debug": "playwright test --debug",
  "test:e2e:headed": "playwright test --headed",
  "test:e2e:chromium": "playwright test --project=chromium",
  "test:e2e:firefox": "playwright test --project=firefox",
  "test:e2e:webkit": "playwright test --project=webkit",
  "test:all": "npm run test && npm run test:e2e"
}
```

---

## 🚀 다음 단계

### 1. 브라우저 설치 (처음 한 번만)
```bash
npx playwright install
```

### 2. 테스트 작성 시작

각 카테고리별 폴더에서 테스트 파일 작성:
- `e2e/tests/auth/login.spec.ts`
- `e2e/tests/home/filters.spec.ts`
- `e2e/tests/cities/cityDetail.spec.ts`
- 등등...

### 3. 테스트 작성 예시

```typescript
// e2e/tests/auth/login.spec.ts
import { test } from '@playwright/test';
import { LoginPage } from '../../pages';
import { TEST_USERS } from '../../fixtures';
import { loginUser } from '../../utils';

test.describe('로그인', () => {
  test('유효한 자격증명으로 로그인', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);

    // Act
    await loginPage.goto('http://localhost:3000/auth/login');
    await loginPage.login(TEST_USERS.validUser.email, TEST_USERS.validUser.password);

    // Assert
    await page.waitForURL('**/dashboard');
  });
});
```

### 4. 테스트 실행

```bash
# 모든 E2E 테스트 실행
npm run test:e2e

# UI 모드 (권장: 테스트 작성 중)
npm run test:e2e:ui

# 디버그 모드
npm run test:e2e:debug

# 특정 테스트 파일
npx playwright test e2e/tests/auth/login.spec.ts

# 특정 패턴의 테스트
npx playwright test -g "로그인"
```

---

## 📚 주요 기능

### Page Object Model (POM)
```typescript
import { HomePage } from '../pages';

const homePage = new HomePage(page);
await homePage.goto('http://localhost:3000');
await homePage.searchCity('Seoul');
```

### Fixtures (테스트 데이터)
```typescript
import { TEST_USERS, TEST_CITIES, TEST_REVIEWS } from '../fixtures';

const user = TEST_USERS.validUser;
const city = TEST_CITIES.seoul;
```

### 헬퍼 함수
```typescript
import { loginUser, expectElementVisible, waitForText } from '../utils';

await loginUser(page, 'email@test.com', 'password');
await expectElementVisible(page, '.welcome-message');
await waitForText(page, '로딩 완료');
```

### 커스텀 Assertion
```typescript
import { expectTableRowCount, expectButtonClickable } from '../utils';

await expectTableRowCount(page, 'table', 5);
await expectButtonClickable(page, '.submit-button');
```

---

## ⚙️ 설정 파일 설명

### `playwright.config.ts`
- 테스트 디렉토리: `./e2e/tests`
- 테스트 매칭 패턴: `**/*.spec.ts`
- 병렬 실행: 활성화
- 재시도: CI 환경에서만 (2회)
- 타임아웃: 30초 (테스트), 5초 (expect)
- 리포트: HTML, JSON, JUnit
- 브라우저: Chromium, Firefox, WebKit
- 모바일 테스트: Pixel 5, iPhone 12
- 스크린샷: 실패 시만
- 비디오: 실패 시만

### `config/baseUrls.ts`
```typescript
// 환경별 URL 설정
BASE_URLS.development = 'http://localhost:3000'
BASE_URLS.staging = process.env.STAGING_URL
BASE_URLS.production = process.env.PRODUCTION_URL
```

### `config/timeouts.ts`
```typescript
TIMEOUTS.navigation = 30000          // 네비게이션
TIMEOUTS.pageLoad = 30000            // 페이지 로드
TIMEOUTS.apiResponse = 15000         // API 응답
TIMEOUTS.elementVisible = 10000      // 요소 표시
TIMEOUTS.formSubmit = 10000          // 폼 제출
```

---

## 📖 가이드 문서

상세한 사용법은 `e2e/README.md` 참고

---

## 🎯 테스트 작성 전략

### 테스트 우선순위
1. **Auth Flow**: 로그인, 회원가입, 로그아웃
2. **Home Page**: 필터, 검색, 도시 카드 상호작용
3. **City Detail**: 리뷰 보기/작성, 좋아요, 북마크
4. **Community**: 이벤트 보기, 생성, 참여
5. **Dashboard**: 프로필, 즐겨찾기, 내 리뷰
6. **User Journey**: 전체 시나리오 테스트

### 각 카테고리별 예상 테스트 수
- Auth: 10-15개
- Home: 12-18개
- Cities: 15-20개
- Community: 10-15개
- Dashboard: 12-18개
- Workflows: 8-12개
- **합계: 67-98개**

---

## 🔧 문제 해결

### Playwright 설치 재시도
```bash
npx playwright install --with-deps
```

### 특정 브라우저만 설치
```bash
npx playwright install chromium
```

### 테스트 결과 보기
```bash
npx playwright show-report
```

---

## ✨ 모범 사례

✅ **Do's**
- Page Object Model 사용
- Fixtures로 테스트 데이터 관리
- 헬퍼 함수 재사용
- 명확한 테스트 이름
- data-testid 사용
- AAA 패턴 준수

❌ **Don'ts**
- 긴 타임아웃 설정
- 하드코딩된 대기 (`page.waitForTimeout`)
- 과도한 screenshot 촬영
- 테스트 간 의존성
- 테스트 순서에 의존

---

## 📞 지원

E2E 테스트 작성 중 도움이 필요하면:

1. `e2e/README.md` 참고
2. Playwright 공식 문서: https://playwright.dev
3. 기존 테스트 코드 참고

---

## 🎓 학습 자료

- [Playwright 공식 문서](https://playwright.dev)
- [Page Object Model 패턴](https://martinfowler.com/bliki/PageObject.html)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Tests](https://playwright.dev/docs/debug)

---

**E2E 테스트 환경 설정이 완료되었습니다! 이제 테스트 작성을 시작하세요! 🚀**
