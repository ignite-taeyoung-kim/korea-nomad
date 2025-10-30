# Agent 1: Lib Core Tests

## 책임
- 필터링 로직 테스트 (filters.test.ts)
- 유틸리티 함수 테스트 (utils.test.ts)
- 로컬스토리지 관리 테스트 (storage.test.ts)

## 작업 범위
**총 125개 테스트 케이스**

### 1. `__tests__/unit/lib/filters.test.ts` (70개 테스트)

#### extractMinCost() - 10개
- 정상적인 범위 파싱: "2.1~3M" → 2.1
- 정상적인 범위 파싱: "1~2M" → 1
- 한 자리 숫자: "5~6M" → 5
- 소수점 한 자리: "3.5~4M" → 3.5
- 소수점 두 자리: "2.35~2.50M" → 2.35
- 빈 문자열 입력
- null/undefined 입력
- 잘못된 형식 문자열: "abc"
- M 없는 범위: "2.1~3"
- 틸드 없는 문자열: "2.1M"

#### filterBySearch() - 10개
- 도시명으로 검색 (완전 일치)
- 도시명으로 검색 (대소문자 무시)
- 지역으로 검색
- 설명 텍스트로 검색
- 공백 포함 검색
- 검색어 없을 때
- 일치하는 도시 없을 때
- 특수문자 검색
- 매우 긴 검색어
- 한글/영문 혼합 검색

#### filterByRegions() - 8개
- 단일 지역 필터
- 복수 지역 필터
- 전체 지역
- 빈 배열
- 잘못된 지역명
- null 지역
- 대소문자 무시 검증
- 중복 지역 처리

#### filterByCostRange() - 10개
- 정상 범위
- 최소값만 설정
- 최대값만 설정
- 범위 없음
- min > max인 경우
- 음수 범위
- 소수점 범위
- 정확히 경계값
- 매우 큰 범위
- NaN, Infinity 입력

#### filterBySpeed() - 8개
- 정상 속도
- 낮은 속도
- 높은 속도
- 속도 필터 없음
- 정확히 경계값
- 음수 속도
- 매우 큰 속도
- 소수점 속도

#### filterByFavorites() - 4개
- 좋아요 있음
- 좋아요 없음
- 일부 좋아요
- 존재하지 않는 ID

#### filterByBookmarks() - 3개
- 북마크 있음
- 북마크 없음
- 일부 북마크

#### sortCities() - 6개
- 종합 정렬
- 저렴 정렬
- 빠른 정렬
- 활발 정렬
- 삶의 질 정렬
- 리뷰 정렬

#### applyFilters() - 11개
- 모든 필터 미적용
- 단일 필터
- 복합 필터 AND 조건
- 필터 + 정렬
- showFavorites=true + favorites
- showBookmarks=true + bookmarks
- 모든 필터 적용
- 필터 결과가 빈 경우
- null 필터 파라미터 처리
- 원본 배열 변경되지 않음
- 필터 결과 정확성

### 2. `__tests__/unit/lib/utils.test.ts` (25개 테스트)

#### cn() - Tailwind 클래스 병합 - 6개
- 단일 클래스
- 다중 클래스
- 조건부 클래스
- 충돌하는 클래스 병합
- 빈 문자열 제거
- null/undefined 필터링

#### formatNumber() - 6개
- 1000 → "1,000"
- 1000000 → "1,000,000"
- 1 → "1"
- 0 → "0"
- 음수: -1000 → "-1,000"
- 소수점: 1000.5 처리

#### formatCost() - 5개
- "$2.1M" → "2.1만원"
- "$3M" → "3만원"
- "$2.5M" → "2.5만원"
- "$0M" → "0만원"
- 없는 기호 → 원본 반환

#### formatSpeed() - 3개
- 100 → "100Mbps"
- 1000 → "1000Mbps"
- null/undefined

#### getRatingColor() - 3개
- 평점에 따른 색상 반환
- 경계값 테스트
- 기본값 처리

#### getRatingBgColor() - 2개
- 배경 색상 반환
- null 처리

### 3. `__tests__/unit/lib/storage.test.ts` (30개 테스트)

#### 좋아요 관리 - 12개
- getFavorites() - 초기 상태
- getFavorites() - 저장된 데이터 반환
- addFavorite() - 새로운 cityId 추가
- addFavorite() - 중복 추가 시 처리
- addFavorite() - 여러 개 순차 추가
- removeFavorite() - 존재하는 cityId 제거
- removeFavorite() - 존재하지 않는 cityId 처리
- removeFavorite() - 전체 제거
- isFavorite() - 좋아요 있음
- isFavorite() - 좋아요 없음
- isFavorite() - 빈 배열
- localStorage 저장 확인

#### 북마크 관리 - 12개
- getBookmarks() - 초기 상태
- getBookmarks() - 저장된 데이터 반환
- addBookmark() - 새로운 cityId 추가
- addBookmark() - 중복 처리
- removeBookmark() - 존재하는 cityId 제거
- removeBookmark() - 존재하지 않는 cityId 처리
- isBookmarked() - 북마크 있음
- isBookmarked() - 북마크 없음
- isBookmarked() - 빈 배열
- toggleBookmark() - 상태 토글
- localStorage 저장 확인
- 관련 함수들 일관성 검증

#### localStorage 오류 처리 - 6개
- localStorage 접근 불가능한 경우 (SSR 환경)
- 손상된 JSON 파싱 오류
- 용량 초과 시뮬레이션
- getItem() null 반환 처리
- setItem() 오류 처리
- 에러 로깅 확인

## 의존성
- Phase 0 (Agent 0) 완료: jest.config.js, Mock 기본 구조
- Mock data.ts (cities 배열)
- Mock localStorage

## 생성되는 파일
- `__tests__/unit/lib/filters.test.ts`
- `__tests__/unit/lib/utils.test.ts`
- `__tests__/unit/lib/storage.test.ts`

## 예상 시간
- 1주 (완전 병렬 가능)

## 다음 단계
- Agent 2: Lib Utils 테스트 병렬 진행
- Agent 3: 이 파일 테스트 완료 후 useFilters.test.ts 작성

## 주의사항
- localStorage mock은 jest.setup.js에서 관리
- 모든 테스트는 beforeEach에서 초기화
- Mock data는 __tests__/mocks/data.mock.ts에서 import
