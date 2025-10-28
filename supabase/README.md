# Supabase 마이그레이션 가이드

## 개요
이 폴더에는 Korea Nomad 프로젝트의 Supabase 데이터베이스 스키마를 설정하기 위한 마이그레이션 파일들이 있습니다.

## 마이그레이션 파일 설명

### 1. `migrations/001_create_core_tables.sql`
**목적**: 핵심 테이블 생성 및 인덱스 설정

생성되는 테이블:
- `cities` - 도시 정보 (8개 도시)
- `users` - 사용자 프로필 (auth.users 참조)
- `reviews` - 도시 리뷰
- `events` - 커뮤니티 이벤트
- `favorites` - 사용자 즐겨찾기
- `bookmarks` - 사용자 북마크

### 2. `migrations/002_enable_rls_policies.sql`
**목적**: Row Level Security (RLS) 활성화 및 보안 정책 설정

정책:
- `cities`: 모든 사용자가 읽기 가능 (읽기 전용)
- `reviews`: 모든 사용자가 읽기 가능, 소유자만 수정/삭제
- `events`: 모든 사용자가 읽기 가능, 생성자만 수정/삭제
- `users`: 모든 사용자가 읽기 가능, 소유자만 수정
- `favorites`, `bookmarks`: 소유자만 접근 가능

### 3. `migrations/003_seed_cities.sql`
**목적**: 정적 도시 데이터 8개 입력

도시: 서울, 강릉, 전주, 부산, 대구, 제주, 광주, 대전

### 4. `migrations/004_seed_reviews.sql`
**목적**: 정적 리뷰 데이터 25개 입력

각 도시별 리뷰 데이터

### 5. `migrations/005_seed_events.sql`
**목적**: 정적 이벤트 데이터 14개 입력

각 도시별 이벤트 데이터

### 6. `migrations/006_setup_user_sync.sql`
**목적**: auth.users와 public.users 자동 동기화

기능:
- `handle_new_user()`: 새로운 인증 사용자 생성 시 자동으로 프로필 테이블에 삽입
- `handle_user_deletion()`: 인증 사용자 삭제 시 프로필도 함께 삭제
- `update_user_timestamp()`: 프로필 업데이트 시 updated_at 자동 갱신

## 실행 방법

### 방법 1: Supabase 대시보드 SQL Editor (권장)

1. [Supabase 대시보드](https://app.supabase.com)에 로그인
2. 프로젝트 선택
3. 좌측 메뉴에서 "SQL Editor" 클릭
4. 각 마이그레이션 파일의 내용을 순서대로 복사하여 실행

**실행 순서**:
```
1. 001_create_core_tables.sql      (테이블 생성)
2. 002_enable_rls_policies.sql     (보안 정책)
3. 003_seed_cities.sql              (도시 데이터)
4. 004_seed_reviews.sql            (리뷰 데이터)
5. 005_seed_events.sql             (이벤트 데이터)
6. 006_setup_user_sync.sql         (사용자 동기화 트리거)
```

### 방법 2: Supabase CLI (로컬 개발)

```bash
# Supabase CLI 설치 (이미 설치되어 있다면 스킵)
npm install -g @supabase/cli

# 로그인
supabase login

# 마이그레이션 적용
supabase db push
```

### 방법 3: psql 직접 실행

```bash
# 각 파일을 순서대로 실행
psql postgresql://[user]:[password]@[host]:[port]/[database] -f migrations/001_create_core_tables.sql
psql postgresql://[user]:[password]@[host]:[port]/[database] -f migrations/002_enable_rls_policies.sql
psql postgresql://[user]:[password]@[host]:[port]/[database] -f migrations/003_seed_cities.sql
psql postgresql://[user]:[password]@[host]:[port]/[database] -f migrations/004_seed_reviews.sql
psql postgresql://[user]:[password]@[host]:[port]/[database] -f migrations/005_seed_events.sql
```

## 마이그레이션 후 확인사항

### 1. 테이블 생성 확인
Supabase 대시보드에서 "Table Editor"로 이동하여 다음 테이블들이 생성되었는지 확인:
- `cities` (8개 행)
- `users` (0개 행 - 아직 사용자가 없음)
- `reviews` (25개 행)
- `events` (14개 행)
- `favorites` (0개 행)
- `bookmarks` (0개 행)

### 2. RLS 정책 확인
각 테이블의 "Policies" 탭에서 정책이 올바르게 설정되었는지 확인

### 3. 데이터 조회 테스트
SQL Editor에서 다음 쿼리로 데이터 조회 테스트:

```sql
-- 도시 목록 조회
SELECT id, name, overall_score FROM public.cities ORDER BY overall_score DESC;

-- 리뷰 목록 조회
SELECT r.id, r.title, r.rating, c.name as city FROM public.reviews r
JOIN public.cities c ON r.city_id = c.id
LIMIT 5;

-- 이벤트 목록 조회
SELECT e.id, e.title, e.category, c.name as city FROM public.events e
JOIN public.cities c ON e.city_id = c.id
LIMIT 5;
```

## 주의사항

### user_id와 creator_id에 대해
- `reviews.user_id`와 `events.creator_id`는 현재 NULL로 설정되어 있습니다
- 실제 사용자가 로그인하여 데이터를 생성하면 자동으로 채워집니다
- 필요한 경우 나중에 외래키 제약을 추가할 수 있습니다

### 데이터 수정 방법
시드 데이터를 수정하려면:

1. 해당 마이그레이션 파일 수정
2. Supabase에서 데이터 수동 삭제 또는 UPDATE 쿼리 실행
3. 마이그레이션 파일 다시 실행

### 롤백
마이그레이션을 되돌리려면:

```sql
-- 테이블 삭제 (주의!)
DROP TABLE IF EXISTS public.bookmarks;
DROP TABLE IF EXISTS public.favorites;
DROP TABLE IF EXISTS public.events;
DROP TABLE IF EXISTS public.reviews;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.cities;
```

## 다음 단계

마이그레이션 후 다음 작업을 진행하세요:

1. **Phase 2**: 인증 시스템 확충
   - auth.users와 public.users 연동 설정
   - OAuth 설정

2. **Phase 3**: 커스텀 훅 업데이트
   - useFilters, useFavorite, useBookmark, useReviews, useEvents, useProfile 리팩토링
   - Supabase 쿼리 연동

3. **Phase 4**: UI 컴포넌트 업데이트
   - 도시 목록, 상세 페이지, 대시보드 등 리팩토링

## 문제 해결

### Q: 마이그레이션 실행 중 에러 발생
- Supabase 대시보드에서 각 SQL을 개별적으로 실행해보세요
- 에러 메시지를 읽고 문제를 파악하세요

### Q: 테이블이 생성되지 않음
- SQL 문법 오류 확인
- 외래키 참조 확인
- Supabase 권한 확인

### Q: 데이터가 입력되지 않음
- INSERT 문 실행 후 메시지 확인
- SELECT 쿼리로 데이터 존재 확인
- ON CONFLICT DO NOTHING 때문에 중복 시 자동 무시됨

## 지원

문제가 발생하면 다음을 확인하세요:
- [Supabase 공식 문서](https://supabase.com/docs)
- [PostgreSQL 문서](https://www.postgresql.org/docs/)
- GitHub Issues
