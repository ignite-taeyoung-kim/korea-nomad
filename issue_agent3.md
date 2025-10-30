# Agent 3: Hooks State Tests

## 책임
- 상태 관리 훅 테스트
- URL 기반 필터 상태 관리 (useFilters)
- 로컬 프로필 관리 (useProfile)
- Supabase 인증 프로필 (useUserProfile)

## 작업 범위
**총 42개 테스트 케이스**

### 1. `__tests__/unit/hooks/useFilters.test.ts` (15개 테스트)

#### 초기 상태 - 3개
- URL 쿼리 파라미터 없음 → 기본 필터값
- URL 쿼리 파라미터 있음 → 파싱 후 filters에 반영
- 여러 파라미터 동시 파싱

#### updateFilters(newFilters) - 4개
- 필터 업데이트 → URL searchParams 변경
- 브라우저 히스토리 추가됨 확인
- 스크롤 위치 유지 확인
- 일부 필터만 업데이트

#### resetFilters() - 2개
- 모든 필터 초기화
- URL에서 쿼리 파라미터 제거

#### URL 파라미터 파싱 - 4개
- ?search=seoul → filters.search
- ?regions=seoul,gangwon → filters.regions 배열
- ?costMin=1&costMax=5 → filters.costRange
- ?sort=cheap → filters.sortBy

#### URL 동기화 - 1개
- 필터 변경 시 URL 자동 업데이트
- 페이지 새로고침 후 필터 유지

#### 의존성 추적 - 1개
- useRouter, useSearchParams 호출 확인

### 2. `__tests__/unit/hooks/useProfile.test.ts` (12개 테스트)

#### 초기 마운트 - 3개
- localStorage에서 프로필 로드
- 로드 전: profile = null, isLoading = true
- 로드 후: profile 객체, isLoading = false

#### updateName(name) - 2개
- 즉시 UI 업데이트
- localStorage에 저장

#### updateBio(bio) - 2개
- 즉시 UI 업데이트
- localStorage에 저장

#### updateAvatar(avatarUrl) - 2개
- 즉시 UI 업데이트
- localStorage에 저장

#### localStorage 오류 처리 - 2개
- JSON 파싱 실패 → 기본값 사용
- 접근 불가능 → 에러 상태

#### SSR 환경 처리 - 1개
- typeof window 확인
- 서버에서 실행 시 에러 없음

### 3. `__tests__/unit/hooks/useUserProfile.test.ts` (15개 테스트)

#### 초기 마운트 - 3개
- Supabase auth.getUser() 호출
- 로딩 상태: loading = true → false
- 에러 상태 처리

#### 사용자 인증 확인 - 2개
- user !== null → isAuthenticated = true
- user === null → isAuthenticated = false

#### 프로필 조회 - 3개
- users 테이블에서 user_id로 조회
- profile 객체 반환
- 프로필 없음 → profile = null

#### onAuthStateChange 구독 - 3개
- 로그인 시 → 프로필 업데이트
- 로그아웃 시 → profile = null, user = null
- 구독 해제 (cleanup)

#### 에러 처리 - 2개
- Supabase 쿼리 실패 → error 상태
- 에러 메시지 정확성

#### 리마운트 시 클린업 - 2개
- 이전 구독 해제 확인
- 중복 구독 방지

## 의존성
- Phase 0 (Agent 0) 완료: jest.config.js, Mock 기본 구조
- Agent 1 완료: filters.test.ts → useFilters에서 filters.ts 로직 참고
- Agent 2 완료: userProfile.test.ts → useUserProfile 테스트 참고
- Mock next/navigation (useRouter, useSearchParams)
- Mock @supabase/supabase-js (useUserProfile에서)

## 생성되는 파일
- `__tests__/unit/hooks/useFilters.test.ts`
- `__tests__/unit/hooks/useProfile.test.ts`
- `__tests__/unit/hooks/useUserProfile.test.ts`

## 예상 시간
- 1.5주

## 시작 조건
- Phase 0 (Agent 0) 완료 (2일)
- Agent 1 filters.test.ts 완료 (useFilters 작성 전)
- Agent 2 userProfile.test.ts 완료 (useProfile 테스트 전)
- Supabase Mock 완전 구현 (useUserProfile 테스트 전)

## 다음 단계
- Agent 4: 이 훅들의 완료 이후 시작 (의존성 없음)
- Agent 5, 6, 7, 8: 이 훅들 테스트 완료 후 컴포넌트 테스트 시작

## 주의사항
- useRouter mock은 jest.setup.js에서 관리
- useSearchParams mock은 URL 쿼리 파라미터 조작 가능해야 함
- Supabase auth mock은 onAuthStateChange 구독 지원해야 함
- 각 테스트는 독립적 상태에서 실행 가능해야 함
- 성능: renderHook으로 리렌더링 테스트
