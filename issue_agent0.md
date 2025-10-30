# Agent 0: Setup & Test Infrastructure

## 책임
- Jest/React Testing Library 환경 구성
- Supabase Mock 인프라 구축
- 테스트 폴더 구조 생성
- 통합 테스트 작성 (Phase 4)

## Phase 0: 기초 설정 (2일, 예상 시간)

### 📋 작업 항목

#### Jest 설정
- [ ] `jest.config.js` 작성
  - preset: 'ts-jest'
  - testEnvironment: 'jsdom'
  - moduleNameMapper: '@/*' 경로 설정
  - collectCoverageFrom 설정 (lib, hooks, components)

- [ ] `jest.setup.js` 작성
  - '@testing-library/jest-dom' import
  - window 객체 mock (localStorage, navigator 등)
  - Jest globals 설정
  - beforeEach/afterEach 훅

- [ ] `tsconfig.test.json` 생성
  - ts-jest 호환성 설정

#### Mock 인프라
- [ ] `__tests__/mocks/supabase.mock.ts`
  - createClient() mock
  - auth 메서드 mock (getUser, signIn, signUp, etc)
  - database 메서드 mock (from, select, eq, etc)
  - realtime mock (on, subscribe, etc)

- [ ] `__tests__/mocks/data.mock.ts`
  - Mock cities 배열 (8개)
  - Mock users 배열
  - Mock reviews 배열
  - Mock events 배열
  - Mock 데이터 생성 함수들

- [ ] `__tests__/mocks/setupTests.ts`
  - 테스트 환경 초기화 함수
  - 공통 beforeEach/afterEach

#### 폴더 구조 생성
- [ ] `__tests__/mocks/` 디렉토리
- [ ] `__tests__/fixtures/` 디렉토리
- [ ] `__tests__/unit/lib/` 디렉토리
- [ ] `__tests__/unit/hooks/` 디렉토리
- [ ] `__tests__/unit/components/` 디렉토리
- [ ] `__tests__/integration/` 디렉토리

#### 설정 파일
- [ ] `package.json` scripts 추가
  - `"test": "jest"`
  - `"test:watch": "jest --watch"`
  - `"test:coverage": "jest --coverage"`

- [ ] 필요한 의존성 확인 및 설치
  - jest
  - @testing-library/react
  - @testing-library/jest-dom
  - ts-node
  - jest-mock-extended

#### 문서
- [ ] `__tests__/README.md` 작성
  - 테스트 실행 가이드
  - Mock 사용 방법
  - 테스트 작성 패턴

- [ ] `TEST_PATTERNS.md` 생성 (모든 Agent이 참고)
  - 공통 테스트 패턴 (Arrange-Act-Assert)
  - Mock 사용 가이드
  - 에러 처리 패턴

- [ ] `TEST_DEPENDENCIES.md` 생성
  - 파일 간 의존성 맵
  - Phase별 시작 조건

## Phase 4: 통합 테스트 (5일, 예상 시간)

### 🔗 통합 테스트 작성

- [ ] `__tests__/integration/auth/authFlow.test.ts` (15 tests)
  - 로그인/회원가입 흐름
  - 인증 상태 동기화

- [ ] `__tests__/integration/cities/cityFiltering.test.ts` (20 tests)
  - 필터 적용 → 도시 리스트 표시
  - 정렬 기능 통합
  - 검색 → 필터 결합

- [ ] `__tests__/integration/reviews/reviewSystem.test.ts` (20 tests)
  - 리뷰 작성 → 리스트 업데이트
  - 평점 계산 → 평균 표시
  - 리뷰 수정/삭제

- [ ] `__tests__/integration/events/eventManagement.test.ts` (15 tests)
  - 이벤트 생성 → 리스트 표시
  - 참가 상태 토글
  - 필터링 적용

- [ ] `__tests__/integration/favorites/favoritesBookmarks.test.ts` (10 tests)
  - 좋아요 추가 → 필터에 반영
  - 북마크 추가 → 필터에 반영
  - 상태 일관성

## 산출물

### 생성되는 파일
- jest.config.js
- jest.setup.js
- tsconfig.test.json
- __tests__/README.md
- __tests__/mocks/supabase.mock.ts
- __tests__/mocks/data.mock.ts
- __tests__/mocks/setupTests.ts
- __tests__/fixtures/*.json
- __tests__/integration/*.test.ts
- TEST_PATTERNS.md
- TEST_DEPENDENCIES.md

## 의존성
- 독립적 (최초 Phase 0)

## 병렬 관계
- Agent 1, 2는 Phase 0 완료 후 시작 가능
- Agent 3, 4는 Phase 0 + Mock 완전 구현 후 시작

## 주의사항
- Mock이 정확해야 다른 모든 테스트가 정상 작동
- TypeScript strict mode 호환성 필수
- 모든 Mock은 다른 Agent이 참고할 명확한 문서 필요
