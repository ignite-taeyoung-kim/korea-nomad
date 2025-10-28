# ⚡ 성능 최적화 가이드

## Phase 6: 성능 최적화 및 테스트

### 1. 쿼리 최적화 ✅

**파일:** `lib/supabase/queries-optimized.ts`

#### 개선 사항:
- ✅ 필드 선택 최적화 (SELECT * 제거)
- ✅ 페이지네이션 추가 (20개씩)
- ✅ 전체 개수 조회 포함
- ✅ 최대 제한 설정

#### 사용 예시:
```typescript
// Before (현재)
const reviews = await fetchReviewsByCityId(cityId)

// After (최적화)
const { data, total, page, totalPages } = await fetchReviewsByCityIdOptimized(cityId, 1)
```

---

### 2. Next.js 캐싱 전략

#### 서버 컴포넌트 캐싱 (app/cities/[id]/page.tsx)
```typescript
// revalidate: 시간(초) 단위로 ISR(Incremental Static Regeneration)
export const revalidate = 60 // 60초마다 재검증

export default async function CityDetailPage({ params }: Props) {
  // 이 데이터는 60초마다 재생성됨
}
```

#### 권장 설정:
| 페이지 | revalidate | 이유 |
|--------|-----------|------|
| 홈페이지 | 3600 (1시간) | 도시 데이터 자주 변경 안 함 |
| 도시 상세 | 600 (10분) | 리뷰, 이벤트 실시간 추가 |
| 커뮤니티 | 60 (1분) | 이벤트 자주 업데이트 |
| 대시보드 | 0 (무캐시) | 사용자별 데이터 |

---

### 3. 클라이언트 캐싱

#### SWR (stale-while-revalidate) 패턴
```typescript
// hooks/useEvents.ts
const { data: events, mutate } = useSWR(
  `events-${selectedCity}`,
  () => fetchUpcomingEvents(90),
  {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // 60초 내 중복 요청 제거
  }
)

// 데이터 업데이트 후
await mutate()
```

---

### 4. 이미지 최적화

#### Next.js Image 컴포넌트 사용
```typescript
// ❌ Bad
<img src={city.image_url} alt={city.name} />

// ✅ Good
import Image from 'next/image'

<Image
  src={city.image_url}
  alt={city.name}
  width={400}
  height={300}
  priority={false}
  placeholder="blur"
  blurDataURL="/placeholder.jpg"
/>
```

#### 구현 대상:
- [ ] components/home/CityCard.tsx
- [ ] components/cities/CityDetailHeader.tsx
- [ ] components/community/EventList.tsx

---

### 5. 번들 크기 최적화

#### 현재 상태:
```
총 패키지 수: 18개
- 매우 최소한의 의존성 ✅
- 불필요한 라이브러리 없음 ✅
```

#### 모니터링 방법:
```bash
npm run build
# "route (app)" 섹션에서 번들 크기 확인
```

---

### 6. 데이터베이스 인덱스

#### 현재 인덱스 상태:
```sql
-- ✅ 자동으로 생성된 인덱스
- primary key (id) on all tables
- foreign keys (city_id, user_id, creator_id)

-- 추가 권장 인덱스
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX idx_events_date ON events(date ASC);
CREATE INDEX idx_reviews_user_city ON reviews(user_id, city_id);
```

---

### 7. 성능 측정

#### Lighthouse 검사 (로컬)
```bash
# Chrome DevTools → Lighthouse → Generate report
```

#### 목표 점수:
- Performance: 80+
- Accessibility: 90+
- Best Practices: 85+
- SEO: 90+

---

### 8. E2E 테스트 (선택사항)

#### Playwright 설정
```bash
npm install -D @playwright/test

# playwright.config.ts 생성
npx playwright install
```

#### 테스트 예시:
```typescript
// e2e/cities.spec.ts
import { test, expect } from '@playwright/test'

test('should load city detail page', async ({ page }) => {
  await page.goto('/cities/seoul')
  await expect(page.locator('h1')).toContainText('Seoul')
})
```

---

### 9. 실행 체크리스트

#### Phase 6 완료 항목:
- [ ] queries-optimized.ts 검토
- [ ] 서버 컴포넌트에 revalidate 추가
- [ ] Image 컴포넌트 마이그레이션
- [ ] Lighthouse 점수 80+ 확인
- [ ] 페이지네이션 테스트

---

## 🚀 배포 전 확인 사항

```bash
# 1. 빌드 확인
npm run build

# 2. 로컬 테스트
npm run start
# http://localhost:3000 접속하여 기능 확인

# 3. 성능 분석
# Chrome DevTools → Lighthouse
```

---

## 📊 성능 개선 기대효과

| 지표 | Before | After | 개선율 |
|------|--------|-------|--------|
| 초기 로딩 | ~3s | ~1.5s | 50% ↓ |
| 페이지 크기 | ~2MB | ~1MB | 50% ↓ |
| 데이터 전송 | 25개 필드 | 12개 필드 | 52% ↓ |
| 캐시 히트율 | 0% | 70% | - |

---

## 🎯 다음 단계

1. **현재 쿼리 → 최적화된 쿼리 마이그레이션** (선택사항)
   - 점진적으로 변경 가능
   - 기존 쿼리도 계속 작동

2. **Next.js 캐싱 설정** (권장)
   - 각 페이지에 revalidate 추가

3. **Image 최적화** (권장)
   - 갤러리 이미지부터 시작

4. **Lighthouse 최적화**
   - Performance 80+ 목표
