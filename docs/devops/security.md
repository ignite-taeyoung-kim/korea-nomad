# 🔒 보안 체크리스트

## Phase 5: 보안 및 실시간 기능

### 1. 보안 문제 해결 현황

#### ✅ Function Search Path 수정
- **파일**: `supabase/sql-scripts/fix_function_search_path.sql`
- **상태**: 마이그레이션 파일 준비 완료
- **실행 방법**: Supabase Dashboard → SQL Editor에서 실행
- **함수들**:
  - `handle_new_user()` - SET search_path = public 추가
  - `handle_user_deletion()` - SET search_path = public 추가
  - `update_user_timestamp()` - SET search_path = public 추가

#### ⏳ Leaked Password Protection 활성화
- **상태**: 수동 설정 필요
- **위치**: Supabase Dashboard → Authentication → Password strength
- **작업**: "Leaked password protection" 토글 활성화
- **이유**: 손상된 비밀번호(HaveIBeenPwned) 감지

---

### 2. RLS (Row Level Security) 정책 검증

#### ✅ RLS 정책 상태

**cities 테이블**
```
- SELECT: 모두 조회 가능 ✅
- INSERT/UPDATE/DELETE: 없음 (관리자만)
```

**users 테이블**
```
- SELECT: 모두 조회 가능 ✅
- INSERT: auth.uid() = id (자신만 추가) ✅
- UPDATE: auth.uid() = id (자신만 수정) ✅
- DELETE: 없음 (권한 제어)
```

**reviews 테이블**
```
- SELECT: 모두 조회 가능 ✅
- INSERT: auth.uid() = user_id (인증 필요) ✅
- UPDATE: auth.uid() = user_id (자신만 수정) ✅
- DELETE: auth.uid() = user_id (자신만 삭제) ✅
```

**events 테이블**
```
- SELECT: 모두 조회 가능 ✅
- INSERT: auth.uid() = creator_id (인증 필요) ✅
- UPDATE: auth.uid() = creator_id (자신만 수정) ✅
- DELETE: auth.uid() = creator_id (자신만 삭제) ✅
```

**favorites 테이블**
```
- SELECT: auth.uid() = user_id (자신만 조회) ✅
- INSERT: auth.uid() = user_id (자신만 추가) ✅
- UPDATE: 없음
- DELETE: auth.uid() = user_id (자신만 삭제) ✅
```

**bookmarks 테이블**
```
- SELECT: auth.uid() = user_id (자신만 조회) ✅
- INSERT: auth.uid() = user_id (자신만 추가) ✅
- UPDATE: 없음
- DELETE: auth.uid() = user_id (자신만 삭제) ✅
```

---

### 3. 외래 키 제약조건 ✅
- cities (id) ← reviews, events, favorites, bookmarks
- users (id) ← favorites, bookmarks, events (creator_id), reviews (user_id)
- 모든 외래 키 제약 설정됨

---

### 4. 데이터 검증 ✅
- reviews.rating: 1-5 범위 제약
- events.category: 특정 카테고리만 허용

---

### 5. Server Action 보안 검증

**app/auth/profile/actions.ts**
- ✅ 인증 확인: `auth.getUser()`
- ✅ 권한 검증: 본인 프로필만 수정
- ✅ 입력 검증: name, bio, avatar_url 유효성 확인

**app/actions/reviews.ts**
- ✅ 인증 확인: `auth.getUser()`
- ✅ 권한 검증: 본인 리뷰만 수정/삭제
- ✅ 입력 검증: rating 1-5 범위 확인
- ✅ revalidatePath: 캐시 무효화

**app/actions/events.ts**
- ✅ 인증 확인: `auth.getUser()`
- ✅ 권한 검증: 본인이 만든 이벤트만 삭제
- ✅ 입력 검증: 필수 필드 확인
- ✅ revalidatePath: 캐시 무효화

---

### 6. 다음 단계

1. **SQL 실행**
   ```bash
   # Supabase Dashboard → SQL Editor에서 실행
   supabase/sql-scripts/fix_function_search_path.sql
   ```

2. **Password Protection 활성화**
   - Supabase Dashboard → Authentication 접속
   - Password strength 섹션에서 Leaked password protection 활성화

3. **환경 변수 검토**
   - NEXT_PUBLIC_SUPABASE_URL (공개)
   - NEXT_PUBLIC_SUPABASE_ANON_KEY (제한됨, RLS로 보호)
   - 민감한 정보는 환경변수로 관리

---

## 📊 보안 점수

| 항목 | 상태 | 점수 |
|------|------|------|
| RLS 정책 | ✅ 완료 | 100% |
| 외래 키 제약 | ✅ 완료 | 100% |
| Server Action 인증 | ✅ 완료 | 100% |
| Function Search Path | ⏳ 대기 | 80% |
| Password Protection | ⏳ 대기 | 80% |
| **전체** | **진행중** | **92%** |

---

## 🚀 완료 표시

수정 작업이 완료되면 이곳을 업데이트하세요:

- [ ] SQL Editor에서 fix_function_search_path.sql 실행
- [ ] Leaked password protection 활성화
- [ ] 테스트: 각 기능이 정상 작동하는지 확인
