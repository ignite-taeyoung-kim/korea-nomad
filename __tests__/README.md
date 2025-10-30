# 테스트 가이드

Korea Nomad 프로젝트의 유닛 테스트 작성 및 실행 가이드입니다.

## 🚀 빠른 시작

### 의존성 설치
```bash
npm install
# 또는
yarn install
```

### 테스트 실행
```bash
# 모든 테스트 실행
npm test

# 감시 모드 (파일 변경 시 자동 재실행)
npm run test:watch

# 커버리지 리포트 생성
npm run test:coverage

# CI 모드 (GitHub Actions 등)
npm run test:ci
```

## 📁 디렉토리 구조

```
__tests__/
├── mocks/                       # Mock 데이터 및 인프라
│   ├── data.mock.ts            # Mock 도시, 리뷰, 이벤트 데이터
│   ├── supabase.mock.ts        # Supabase 모킹
│   └── setupTests.ts           # 테스트 환경 설정
│
├── fixtures/                    # JSON 테스트 데이터
│   ├── cities.json
│   ├── users.json
│   ├── reviews.json
│   └── events.json
│
├── unit/                        # 단위 테스트
│   ├── lib/                     # 유틸리티 함수 테스트
│   │   ├── filters.test.ts      # 필터링 로직
│   │   ├── utils.test.ts        # 헬퍼 함수
│   │   ├── storage.test.ts      # localStorage 관리
│   │   └── ...
│   │
│   ├── hooks/                   # React 훅 테스트
│   │   ├── useFilters.test.ts
│   │   ├── useProfile.test.ts
│   │   ├── useFavorite.test.ts
│   │   └── ...
│   │
│   └── components/              # React 컴포넌트 테스트
│       ├── home/
│       ├── cities/
│       ├── reviews/
│       ├── community/
│       ├── common/
│       └── dashboard/
│
└── integration/                 # 통합 테스트
    ├── auth/
    ├── cities/
    ├── reviews/
    ├── events/
    └── favorites/
```

## 📖 Mock 사용 방법

### 1. Mock 데이터 사용

```typescript
import { mockCities, mockReviews } from '@/__tests__/mocks/data.mock';

describe('필터링 테스트', () => {
  test('도시 필터링', () => {
    const result = filterBySearch(mockCities, { search: '서울' });
    expect(result).toHaveLength(1);
  });
});
```

### 2. localStorage Mock

Jest.setup.js에서 자동으로 설정됩니다.

```typescript
describe('저장소 테스트', () => {
  beforeEach(() => {
    localStorage.clear(); // 각 테스트 전에 초기화
  });

  test('좋아요 저장', () => {
    addFavorite('seoul');
    expect(isFavorite('seoul')).toBe(true);
  });
});
```

### 3. Supabase Mock

```typescript
import { setMockUser, setMockQueryResult } from '@/__tests__/mocks/supabase.mock';

describe('Supabase 훅 테스트', () => {
  test('사용자 프로필 조회', async () => {
    // 사용자 설정
    setMockUser({ id: 'user-1', email: 'test@example.com' });

    // 쿼리 결과 설정
    const mockData = [{ id: '1', name: '서울' }];
    setMockQueryResult(mockData);

    // 테스트
    const { result } = renderHook(() => useReviews('seoul'));

    // 검증
    expect(result.current.reviews).toEqual(mockData);
  });
});
```

## 🧪 테스트 작성 패턴

모든 테스트는 AAA (Arrange-Act-Assert) 패턴을 따릅니다. 자세한 내용은 `TEST_PATTERNS.md`를 참조하세요.

```typescript
describe('함수명', () => {
  test('상황에서 결과가 나온다', () => {
    // Arrange: 테스트 데이터 준비
    const input = { /* ... */ };

    // Act: 함수 실행
    const result = functionToTest(input);

    // Assert: 결과 검증
    expect(result).toEqual(expected);
  });
});
```

## 📊 테스트 커버리지

커버리지 리포트 생성:
```bash
npm run test:coverage
```

커버리지 목표:
- 유틸리티 함수: 90%+
- 훅: 85%+
- 컴포넌트: 80%+
- **전체**: 80%+

## 🔍 특정 테스트 파일 실행

```bash
# 특정 파일만 테스트
npm test -- filters.test.ts

# 특정 패턴의 파일만 테스트
npm test -- lib

# 특정 테스트만 실행 (정규식)
npm test -- --testNamePattern="필터링"
```

## 🐛 디버깅

### 테스트 단계별 실행
```bash
# 첫 번째 실패한 테스트에서 멈추기
npm test -- --bail

# 특정 라인 수 만큼만 실행
npm test -- --maxWorkers=1
```

### 콘솔 출력 확인
```typescript
test('디버깅', () => {
  console.log('디버그 정보');
  expect(true).toBe(true);
});
```

## ✅ 체크리스트

새 테스트 작성 전 확인:
- [ ] 테스트 파일명이 `.test.ts` 또는 `.test.tsx`로 끝남
- [ ] `describe`와 `test`로 구조화됨
- [ ] AAA 패턴 따름
- [ ] Mock 데이터 사용 (실제 API 호출 X)
- [ ] 테스트는 독립적 실행 가능
- [ ] 각 테스트 후 정리 (afterEach)
- [ ] 명확한 테스트 설명 제공

## 📝 테스트 작성 팁

### 좋은 테스트의 특징
✅ 명확한 목적
✅ 빠른 실행
✅ 안정적 (flaky 테스트 X)
✅ 독립적
✅ 집중적 (한 가지만 테스트)

### 피해야 할 것들
❌ 실제 API 호출
❌ 외부 의존성
❌ 테스트 간 순서 의존성
❌ 타이밍 의존성
❌ 과도한 mocking

## 🚨 일반적인 문제

### 1. localStorage 오류
```
Error: localStorage is not defined
```
→ jest.setup.js에서 localStorage mock이 로드되는지 확인

### 2. Supabase mock 문제
```
Error: Cannot read property 'from' of undefined
```
→ `__tests__/mocks/supabase.mock.ts`가 정확히 구현되었는지 확인

### 3. 타입 에러
```
error TS2339: Property 'xxx' does not exist
```
→ `tsconfig.test.json`이 올바르게 설정되었는지 확인

## 🔗 관련 문서

- [TEST_PATTERNS.md](../TEST_PATTERNS.md) - 테스트 작성 패턴
- [TEST_DEPENDENCIES.md](../TEST_DEPENDENCIES.md) - 의존성 맵
- [jest.config.js](../jest.config.js) - Jest 설정
- [jest.setup.js](../jest.setup.js) - 테스트 환경 설정

## 📞 도움말

- Jest 문서: https://jestjs.io/docs/getting-started
- React Testing Library: https://testing-library.com/react
- Supabase 테스트: https://supabase.com/docs/guides/with-nextjs

---

질문이나 문제가 있으면 이슈를 생성해주세요! 🎉
