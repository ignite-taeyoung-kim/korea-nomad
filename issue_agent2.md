# Agent 2: Lib Utils Tests

## 책임
- 공유 기능 테스트 (share.test.ts)
- 데이터 검증 테스트 (data.test.ts)
- 타입 검증 테스트 (types.test.ts)
- 리뷰 저장소 테스트 (reviewStorage.test.ts)
- 이벤트 참가 테스트 (eventParticipation.test.ts)
- 사용자 프로필 테스트 (userProfile.test.ts)

## 작업 범위
**총 110개 테스트 케이스**

### 1. `__tests__/unit/lib/share.test.ts` (20개 테스트)

#### copyToClipboard(url) - 4개
- 클립보드 API 호출 확인
- 성공 시 true 반환
- 실패 시 false 반환
- URL 정확히 복사됨

#### shareToKakaoTalk(options) - 3개
- Kakao SDK 초기화 확인
- window.Kakao.Link.sendScrap() 호출 확인
- SDK 없을 때 에러 처리

#### shareToTwitter(options) - 3개
- 트위터 공유 URL 생성 확인
- window.open() 호출 확인
- 특수문자 인코딩 확인

#### shareToFacebook(options) - 2개
- 페이스북 Sharer 호출 확인
- URL 파라미터 정확성

#### shareToNaverBlog(options) - 2개
- 네이버 블로그 공유 URL 정확성
- 파라미터 인코딩

#### canUseShareApi() - 2개
- navigator.share 존재 확인
- true/false 정확히 반환

#### shareViaWebAPI(options) - 2개
- navigator.share() 호출 확인
- 거부(reject) 처리

### 2. `__tests__/unit/lib/data.test.ts` (15개 테스트)

#### cities 배열 - 5개
- 길이 = 8
- 각 도시는 필수 필드 포함
- id 유일성 확인
- 점수 범위 (0~10) 검증
- 모든 필수 데이터 타입 확인

#### reviews 배열 - 4개
- 길이 > 0
- rating 범위 (1~5)
- 필수 필드 확인
- city_id는 cities에 존재

#### events 배열 - 3개
- category는 유효한 값만 사용
- 필수 필드 확인
- city_id 유효성

#### newMembers, stats - 3개
- 필드 존재 확인
- 데이터 타입 확인
- 통계 값 검증

### 3. `__tests__/unit/lib/types.test.ts` (10개 테스트)

#### City 타입 - 3개
- 모든 필수 필드 존재 확인
- 선택 필드 처리
- 타입 호환성

#### Review 타입 - 2개
- 모든 필드 타입 정확성
- rating enum 범위

#### Event 타입 - 2개
- category enum 값 (5개만 허용)
- 필수/선택 필드

#### FilterParams 타입 - 2개
- sortBy는 6가지만 허용
- 범위 필드 검증

#### 타입 호환성 - 1개
- 모든 타입 간 호환성 검증

### 4. `__tests__/unit/lib/reviewStorage.test.ts` (35개 테스트)

#### getReviewsForCity(cityId) - 4개
- mock 데이터 + 저장된 리뷰 결합
- 최신순 정렬 (created_at 내림차순)
- 존재하지 않는 cityId → 빈 배열
- 리뷰 중복 확인

#### addReview() - 6개
- 새 리뷰 추가
- ID 자동 생성 (nanoid 또는 UUID)
- created_at 자동 설정
- localStorage에 저장 확인
- 동일 도시에 여러 리뷰 추가
- 필드 검증 (rating, title, content)

#### updateReview() - 6개
- 기존 리뷰 수정
- 필드별 수정 (rating, title, content)
- 존재하지 않는 리뷰 처리
- updated_at 업데이트
- 부분 업데이트 확인
- 원본 데이터 보존

#### deleteReview() - 5개
- 리뷰 삭제
- 존재하지 않는 리뷰 처리
- localStorage 업데이트 확인
- 도시별 리뷰 개수 감소
- 전체 삭제 후 빈 배열 반환

#### getAverageRating(cityId) - 4개
- 리뷰 평균값 계산
- 리뷰 없음 처리
- 정확한 평균값 ([3, 4, 5] → 4)
- 소수점 반올림

#### getReviewsByDate/getReviewsByRating(cityId) - 4개
- 정렬된 배열 반환
- 원본 배열 미변경
- 정렬 순서 정확성
- 빈 배열 처리

#### localStorage 오류 처리 - 6개
- 손상된 데이터 처리
- 접근 불가능한 경우
- JSON 파싱 오류
- 용량 초과 시뮬레이션
- null 데이터 처리
- 에러 로깅

### 5. `__tests__/unit/lib/eventParticipation.test.ts` (15개 테스트)

#### getParticipations() - 3개
- 참가 이벤트 ID 배열 반환
- 초기 상태 → []
- 저장된 데이터 반환

#### isParticipating(eventId) - 2개
- 참가 중 → true
- 미참가 → false

#### addParticipation(eventId) - 3개
- 새 이벤트 참가 추가
- 중복 체크
- localStorage 저장

#### removeParticipation(eventId) - 2개
- 참가 취소
- 존재하지 않는 eventId 처리

#### toggleParticipation(eventId) - 3개
- true → false
- false → true
- boolean 반환 확인

#### localStorage 오류 처리 - 2개
- 손상된 데이터 처리
- 접근 불가능한 경우

### 6. `__tests__/unit/lib/userProfile.test.ts` (15개 테스트)

#### getProfile() - 3개
- 저장된 프로필 반환
- 초기 상태 → 기본값
- 모든 필드 포함

#### saveProfile(profile) - 3개
- 전체 프로필 저장
- name, bio, avatar_url 포함
- localStorage 업데이트

#### updateProfileName() - 2개
- 이름 업데이트
- 다른 필드 유지

#### updateProfileBio() - 2개
- 소개 업데이트
- 다른 필드 유지

#### updateProfileAvatar() - 2개
- 아바타 URL 업데이트
- 다른 필드 유지

#### localStorage 오류 처리 - 3개
- 손상된 데이터 처리
- 접근 불가능한 경우
- 부분 업데이트 오류

## 의존성
- Phase 0 (Agent 0) 완료: jest.config.js, Mock 기본 구조
- Mock localStorage
- Mock navigator, window 객체
- Agent 1 (optional): 공유할 수 있는 테스트 패턴 참고

## 생성되는 파일
- `__tests__/unit/lib/share.test.ts`
- `__tests__/unit/lib/data.test.ts`
- `__tests__/unit/lib/types.test.ts`
- `__tests__/unit/lib/reviewStorage.test.ts`
- `__tests__/unit/lib/eventParticipation.test.ts`
- `__tests__/unit/lib/userProfile.test.ts`

## 예상 시간
- 1주 (Agent 1과 병렬 가능)

## 다음 단계
- Agent 3: useProfile, useUserProfile 테스트 (이 파일들 참고)
- Agent 3: useFilters 테스트 (Agent 1의 filters.test.ts 완료 후)

## 주의사항
- localStorage mock은 jest.setup.js에서 관리
- Mock data는 __tests__/mocks/data.mock.ts에서 import
- 각 테스트는 독립적으로 실행 가능해야 함
