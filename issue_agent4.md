# Agent 4: Hooks Data Tests

## 책임
- Supabase 데이터 페칭 훅 테스트
- 즐겨찾기/북마크 관리 (useFavorite, useBookmark)
- 리뷰 조회 (useReviews)
- 이벤트 조회 및 필터링 (useEvents)

## 작업 범위
**총 54개 테스트 케이스**

### 1. `__tests__/unit/hooks/useFavorite.test.ts` (12개 테스트)

#### useFavorite(cityId) - 6개
- 초기 상태: isFavorite 확인
- isLoading = false에서 시작
- cityId 변경 시 자동 리로드
- 로그인 안 됨 → 에러 처리 또는 alert
- Supabase 쿼리 호출 확인
- 오류 상태 처리

#### toggleFavorite() - 4개
- isFavorite = true 상태에서 호출 → false로 변경
- isFavorite = false 상태에서 호출 → true로 변경
- isLoading 중 disable 확인
- Supabase 즐겨찾기 테이블에 추가/삭제

#### useFavoritesList() - 2개
- 모든 즐겨찾기 조회 (현재 사용자)
- 빈 배열 → favorites = []

### 2. `__tests__/unit/hooks/useBookmark.test.ts` (12개 테스트)

#### useBookmark(cityId) - 6개
- 초기 상태 조회
- isLoading 상태 관리
- cityId 변경 시 자동 리로드
- 로그인 검증
- Supabase 쿼리 호출 확인
- 오류 상태 처리

#### toggleBookmark() - 4개
- 토글 기능 (true ↔ false)
- isLoading 중 disable 확인
- Supabase 북마크 테이블 업데이트
- 상태 동기화

#### useBookmarksList() - 2개
- 모든 북마크 조회
- 빈 배열 처리

### 3. `__tests__/unit/hooks/useReviews.test.ts` (15개 테스트)

#### 초기 상태 - 3개
- cityId 전달 시 Supabase에서 리뷰 조회
- isLoading = true → false
- 초기 error 상태

#### 리뷰 데이터 - 3개
- reviews: Review[] (정렬: 최신순)
- averageRating 자동 계산
- averageRating 정확성 ([3, 4, 5] → 4)

#### cityId 변경 - 2개
- 새로운 cityId로 변경 → 자동 리로드
- 이전 리뷰는 버려짐

#### refetch() 함수 - 2개
- 수동 리로드
- isLoading 상태 변경

#### sortedByDate/sortedByRating() 함수 - 2개
- 정렬된 사본 반환 (원본 미변경)
- 정확한 정렬 순서

#### 에러 처리 - 2개
- Supabase 쿼리 실패 → error 상태
- 무한 로딩 방지

#### 빈 리뷰 상태 - 1개
- reviews = [] → averageRating = 0

### 4. `__tests__/unit/hooks/useEvents.test.ts` (15개 테스트)

#### 초기 마운트 - 3개
- Supabase에서 이벤트 조회 (90일 이내)
- isLoading = true → false
- 초기 필터 상태

#### 필터링 로직 - 4개
- selectedCity 없음 → 모든 이벤트
- selectedCity 설정 → 해당 도시 이벤트만
- selectedCategory 설정 → 해당 카테고리만
- 둘 다 설정 → AND 조건

#### setSelectedCity/setSelectedCategory() - 2개
- 상태 업데이트 확인
- filteredEvents 자동 계산

#### refetch() 함수 - 2개
- 수동 이벤트 리로드
- isLoading 상태 변경

#### 시간 기반 필터 - 2개
- 90일 이내 이벤트만 조회 확인
- 과거 이벤트 제외

#### 에러 처리 - 2개
- Supabase 쿼리 실패
- 네트워크 오류

## 의존성
- Phase 0 (Agent 0) 완료: jest.config.js, Supabase Mock 완전 구현
- Agent 3 완료: Hooks State 테스트 (훅 작성 시 참고)
- Mock @supabase/supabase-js (필수)
- Mock 함수들:
  - from().select().eq()
  - from().upsert()
  - from().delete()
  - auth.getUser()

## 생성되는 파일
- `__tests__/unit/hooks/useFavorite.test.ts`
- `__tests__/unit/hooks/useBookmark.test.ts`
- `__tests__/unit/hooks/useReviews.test.ts`
- `__tests__/unit/hooks/useEvents.test.ts`

## 예상 시간
- 1.5주

## 시작 조건
- Phase 0 (Agent 0) 완료 (2일)
- Supabase Mock 완전 구현 필수
- Agent 3와 병렬 진행 가능 (의존성 없음)

## 다음 단계
- Agent 5, 6, 7, 8: 이 훅들 테스트 완료 후 컴포넌트 테스트 시작
- 컴포넌트에서 이 훅들 사용

## 주의사항
- Supabase Mock 복잡도 높음
- 모든 체이닝 메서드 지원 필요 (from().select().eq() 등)
- 데이터 일관성 검증 필수
- 동시성 처리 (여러 요청 동시 처리)
- Mock은 jest.setup.js에서 중앙 관리

## Mock 체크리스트
- [ ] createClient() mock
- [ ] auth.getUser() mock
- [ ] from(tableName) mock
- [ ] select() chain mock
- [ ] eq(column, value) chain mock
- [ ] insert/upsert/delete chain mock
- [ ] on() realtime mock
- [ ] error 상태 mock
- [ ] timeout 시뮬레이션
