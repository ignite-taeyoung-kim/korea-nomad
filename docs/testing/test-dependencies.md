# 테스트 의존성 맵

각 테스트 파일이 다른 테스트와 어떤 관계가 있는지, 그리고 어떤 Mock 인프라가 필요한지를 정의합니다.

## 📊 의존성 그래프

```
Phase 0: 기초 설정 (필수, 모든 테스트 선행 조건)
├── jest.config.js
├── jest.setup.js (localStorage, window mock)
├── tsconfig.test.json
├── __tests__/mocks/data.mock.ts (Mock 데이터)
├── __tests__/mocks/supabase.mock.ts (Supabase mock)
└── TEST_PATTERNS.md

        ↓ (모든 테스트가 위에 의존)

Phase 1: Lib 테스트 (병렬 가능, Phase 0 완료 후)
├── Agent 1: Lib Core (독립적)
│   ├── filters.test.ts (data.mock.ts 사용)
│   ├── utils.test.ts (독립적)
│   └── storage.test.ts (jest.setup.js의 localStorage mock 사용)
│
└── Agent 2: Lib Utils (독립적)
    ├── share.test.ts (window.navigator mock 필요)
    ├── data.test.ts (data.mock.ts 검증)
    ├── types.test.ts (독립적)
    ├── reviewStorage.test.ts (jest.setup.js의 localStorage mock 사용)
    ├── eventParticipation.test.ts (localStorage mock)
    └── userProfile.test.ts (localStorage mock)

        ↓ (Phase 1 완료 후)

Phase 2: Hooks 테스트 (부분 병렬, 일부 Phase 1 필요)
├── Agent 3: Hooks State
│   ├── useFilters.test.ts (← filters.test.ts 완료 필요)
│   │   └── lib/filters.ts 로직 이해 필수
│   ├── useProfile.test.ts (← userProfile.test.ts 완료 필요)
│   │   └── lib/userProfile.ts 로직 이해 필수
│   └── useUserProfile.test.ts (← supabase.mock.ts 완성 필수)
│       └── Supabase auth mock 필요
│
└── Agent 4: Hooks Data (Phase 0 + Mock 완성 후)
    ├── useFavorite.test.ts (← supabase.mock.ts 완성 필수)
    ├── useBookmark.test.ts (← supabase.mock.ts 완성 필수)
    ├── useReviews.test.ts (← supabase.mock.ts 완성 필수)
    └── useEvents.test.ts (← supabase.mock.ts 완성 필수)

        ↓ (Phase 2 완료 후)

Phase 3: Components 테스트 (병렬 가능, Phase 2 필요)
├── Agent 5: Components Home
│   ├── CityCard.test.tsx (← useFavorite.test.ts, useBookmark.test.ts)
│   ├── CityGrid.test.tsx (← fetchCities mock 필요)
│   ├── FilterSelect.test.tsx (독립적)
│   └── HeroSection.test.tsx (← FilterSelect.test.tsx 참고)
│
├── Agent 6: Components Cities
│   ├── FilterSidebar.test.tsx (← useFilters.test.ts, filters.test.ts)
│   ├── SearchBar.test.tsx (독립적)
│   ├── CityActionButtons.test.tsx (← useFavorite.test.ts, useBookmark.test.ts)
│   └── EmptyState.test.tsx (독립적)
│
├── Agent 7: Components Reviews
│   ├── ReviewForm.test.tsx (← useReviews.test.ts 참고)
│   ├── ReviewCard.test.tsx (← reviewStorage.test.ts 참고)
│   ├── ReviewList.test.tsx (← ReviewCard.test.tsx)
│   ├── CityReviewsSection.test.tsx (← useReviews.test.ts)
│   └── StarRating.test.tsx (독립적)
│
└── Agent 8: Components Community
    ├── EventCard.test.tsx (← useEvents.test.ts)
    ├── EventFilter.test.tsx (← useEvents.test.ts)
    ├── EventList.test.tsx (← EventCard.test.tsx, useEvents.test.ts)
    └── CreateEventForm.test.tsx (← useEvents.test.ts)

        ↓ (Phase 3 완료 후)

Phase 4: 통합 테스트 (순차, 모든 단위 테스트 완료 후)
├── authFlow.test.ts (모든 인증 관련 테스트)
├── cityFiltering.test.ts (filters + components 통합)
├── reviewSystem.test.ts (reviews + useReviews 통합)
├── eventManagement.test.ts (events + useEvents 통합)
└── favoritesBookmarks.test.ts (favorites + bookmarks 통합)
```

## 🔗 구체적인 의존성

### Agent 1: Lib Core
```
No dependencies (Phase 0 제외)
├── filters.test.ts
│   └── 사용: data.mock.ts (mockCities)
├── utils.test.ts
│   └── 사용: 없음 (독립적)
└── storage.test.ts
    └── 사용: jest.setup.js (localStorage mock)
```

### Agent 2: Lib Utils
```
Partial dependency on Agent 1
├── share.test.ts
│   └── 사용: jest.setup.js (navigator mock)
├── data.test.ts
│   └── 검증: data.mock.ts 데이터 구조
├── types.test.ts
│   └── 사용: 없음 (독립적)
├── reviewStorage.test.ts
│   └── 사용: jest.setup.js (localStorage mock)
├── eventParticipation.test.ts
│   └── 사용: jest.setup.js (localStorage mock)
└── userProfile.test.ts
    └── 사용: jest.setup.js (localStorage mock)
```

### Agent 3: Hooks State
```
Strong dependency on Phase 1 (Agent 1, 2)
├── useFilters.test.ts
│   └── 선행 조건: filters.test.ts (filters.ts 검증)
│   └── Mock 필요: next/navigation (useRouter, useSearchParams)
├── useProfile.test.ts
│   └── 선행 조건: userProfile.test.ts (userProfile.ts 검증)
│   └── Mock 필요: jest.setup.js (localStorage mock)
└── useUserProfile.test.ts
    └── 선행 조건: supabase.mock.ts 완성
    └── Mock 필요: @supabase/supabase-js mock, auth.getUser(), onAuthStateChange()
```

### Agent 4: Hooks Data
```
Strong dependency on Phase 0 (Mock 완성)
├── useFavorite.test.ts
│   └── Mock 필요: supabase.mock.ts (createClient, auth.getUser, from().select())
├── useBookmark.test.ts
│   └── Mock 필요: supabase.mock.ts (동일)
├── useReviews.test.ts
│   └── Mock 필요: supabase.mock.ts (from().select().eq() 체인)
└── useEvents.test.ts
    └── Mock 필요: supabase.mock.ts (동일)
```

### Agent 5: Components Home
```
Dependency on Phase 2 (Agent 3, 4)
├── CityCard.test.tsx
│   └── Hook: useFavorite, useBookmark
│   └── Mock: Next.js Link, Router
├── CityGrid.test.tsx
│   └── Mock: fetchCities() (server function)
├── FilterSelect.test.tsx
│   └── 독립적 (컴포넌트만 테스트)
└── HeroSection.test.tsx
    └── Hook: useFilters
    └── Mock: FilterSelect 컴포넌트
```

### Agent 6: Components Cities
```
Dependency on Phase 2 (Agent 3, 4)
├── FilterSidebar.test.tsx
│   └── Hook: useFilters, useFavorite, useBookmark
│   └── 선행: filters.test.ts, useFilters.test.ts
├── SearchBar.test.tsx
│   └── 독립적
├── CityActionButtons.test.tsx
│   └── Hook: useFavorite, useBookmark
│   └── 선행: useFavorite.test.ts, useBookmark.test.ts
└── EmptyState.test.tsx
    └── 독립적
```

### Agent 7: Components Reviews
```
Dependency on Phase 2 (Agent 3, 4)
├── ReviewForm.test.tsx
│   └── Hook: useProfile or useUserProfile
├── ReviewCard.test.tsx
│   └── Mock: formatDate() 함수
├── ReviewList.test.tsx
│   └── Mock: ReviewCard 컴포넌트
├── CityReviewsSection.test.tsx
│   └── Hook: useReviews
│   └── 선행: useReviews.test.ts
└── StarRating.test.tsx
    └── 독립적
```

### Agent 8: Components Community
```
Dependency on Phase 2 (Agent 3, 4)
├── EventCard.test.tsx
│   └── Hook: useEvents
│   └── Mock: Link, category colors
├── EventFilter.test.tsx
│   └── Hook: useEvents
│   └── 선행: useEvents.test.ts
├── EventList.test.tsx
│   └── Mock: EventCard 컴포넌트
└── CreateEventForm.test.tsx
    └── Hook: useEvents
    └── Mock: form submission
```

## 📋 체크리스트

### Phase 0 완료 후 확인
- [ ] jest.config.js 작동 확인
- [ ] jest.setup.js의 localStorage mock 테스트
- [ ] Supabase mock이 정확하게 Query Builder 구현
- [ ] data.mock.ts의 모든 Mock 데이터 구조 확인

### Phase 1 (Agent 1, 2) 시작 조건
- [ ] Phase 0 완료
- [ ] `npm test` 명령어 정상 작동
- [ ] Mock 데이터로 간단한 테스트 통과

### Phase 2 (Agent 3, 4) 시작 조건
- [ ] Phase 1 완료 (Agent 1, 2의 테스트 모두 통과)
- [ ] Mock 인프라 완전 구현
  - [ ] next/navigation mock
  - [ ] @supabase/supabase-js mock
  - [ ] localStorage mock
- [ ] 특히 Supabase Query Builder mock이 복잡한 체인 지원

### Phase 3 (Agent 5, 6, 7, 8) 시작 조건
- [ ] Phase 2 완료 (Agent 3, 4의 테스트 모두 통과)
- [ ] 모든 훅 테스트 통과
- [ ] React Testing Library 패턴 확인

### Phase 4 (통합 테스트) 시작 조건
- [ ] Phase 1, 2, 3 완료
- [ ] 모든 단위 테스트 통과
- [ ] Mock이 실제 데이터와 일치

## 🚨 주의사항

| 파일 | 주의사항 |
|------|---------|
| filters.test.ts | 복잡한 로직, 많은 엣지 케이스 확인 필요 |
| supabase.mock.ts | Query 체인 메서드 모두 구현 필수 |
| useFilters.test.ts | URL searchParams 동기화 테스트 필수 |
| useReviews.test.ts | averageRating 계산 정확성 중요 |
| CityCard.test.tsx | e.preventDefault() + e.stopPropagation() 테스트 |
| ReviewForm.test.tsx | 유효성 검증 메시지 표시 확인 |

## 🔄 병렬 처리 가능 구간

```
Week 1-2:
├── Phase 0: Agent 0 (순차)
└─→ Phase 1: Agent 1 + Agent 2 (병렬)

Week 3-4:
├── Phase 2: Agent 3 + Agent 4 (병렬, Mock 완성 필수)
└─→ Phase 3: Agent 5 + Agent 6 + Agent 7 + Agent 8 (병렬)

Week 5-6:
└── Phase 4: Agent 0 (순차)
```

---

이 의존성 맵을 따르면 효율적인 병렬 처리와 동시에 안정적인 테스트 구조를 유지할 수 있습니다! ✨
