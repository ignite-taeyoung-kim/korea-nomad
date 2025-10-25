# 한국 노마드 라이프 (Korea Nomad Life)

한국에서 디지털 노마드로 생활하고 싶은 사람들을 위한 정보 플랫폼입니다.

## 프로젝트 개요

이 프로젝트는 한국의 다양한 도시에서 노마드 생활을 위한 모든 정보를 한곳에서 제공합니다.

**주요 기능:**
- 🏙️ 도시별 정보 비교 (인터넷 속도, 생활비, 카페, 커뮤니티)
- ⭐️ 종합 평점 및 상세 분석
- 👥 노마드 커뮤니티 연결
- 📝 사용자 리뷰 및 피드백
- 🎉 이벤트 및 밋업 정보

## 기술 스택

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React

## 프로젝트 구조

```
korea-nomad/
├── app/
│   ├── layout.tsx              # 루트 레이아웃
│   ├── page.tsx                # 홈페이지
│   ├── globals.css             # 전역 스타일
│   ├── cities/
│   │   ├── page.tsx            # 도시 목록 페이지
│   │   └── [id]/
│   │       └── page.tsx        # 도시 상세 페이지
│   └── not-found.tsx           # 404 페이지
├── components/
│   ├── layout/
│   │   ├── Navigation.tsx      # 네비게이션 바
│   │   ├── Footer.tsx          # 푸터
│   │   └── InfoSidebar.tsx     # 정보 사이드바
│   ├── home/
│   │   ├── HeroSection.tsx     # 히어로 섹션
│   │   ├── CityGrid.tsx        # 도시 그리드
│   │   ├── CityCard.tsx        # 도시 카드
│   │   └── CTASection.tsx      # CTA 섹션
│   └── cities/
│       └── FilterSidebar.tsx   # 필터 사이드바
├── lib/
│   ├── data.ts                 # Mock 데이터
│   ├── types.ts                # 타입 정의
│   └── utils.ts                # 유틸리티 함수
├── public/                     # 정적 파일
├── tailwind.config.ts          # Tailwind 설정
├── tsconfig.json               # TypeScript 설정
├── next.config.js              # Next.js 설정
└── package.json                # 패키지 설정
```

## 설치 및 실행

### 1. 프로젝트 설치

```bash
cd korea-nomad
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어주세요.

### 3. 프로덕션 빌드

```bash
npm run build
npm start
```

## 주요 페이지

### 1. 홈페이지 (`/`)
- 히어로 섹션: 서비스 소개 및 검색
- 인기 도시 BEST 8 카드
- 우측 정보 사이드바: 밋업, 신규 멤버, 채팅
- CTA 섹션: 가입 유도

### 2. 도시 목록 (`/cities`)
- 모든 도시 검색 및 필터링
- 정렬 옵션: 종합점수, 생활비, 인터넷 속도 등
- 반응형 그리드 레이아웃
- 지역/생활비/인터넷 속도 필터

### 3. 도시 상세 (`/cities/[id]`)
- 도시별 상세 정보
- 기본 정보 및 점수 분석
- 도시 소개 및 설명
- 리뷰 섹션
- 관심 도시 추가 및 공유

## 반응형 디자인

모든 페이지는 반응형 디자인으로 구현되어 있습니다:

- **모바일** (375px~): 1열 레이아웃
- **태블릿** (768px~): 2열 레이아웃
- **데스크톱** (1024px~): 4열 레이아웃

## 색상 팔레트

Primary Color: `#0ea5e9` (Sky Blue)
- 50: `#f0f9ff`
- 100: `#e0f2fe`
- 600: `#0284c7`
- 700: `#0369a1`

## Server Components 우선

이 프로젝트는 Next.js App Router의 Server Components를 우선으로 구현하였습니다:
- 레이아웃 및 페이지는 모두 Server Component로 구현
- 상호작용이 필요한 컴포넌트만 `'use client'` 디렉티브 사용
  - `HeroSection.tsx` (검색 입력)
  - `CTASection.tsx` (폼 입력)
  - `FilterSidebar.tsx` (필터 상호작용)

## Mock 데이터

현재는 Mock 데이터를 사용하고 있습니다. 추후 백엔드 API 연동 시:

```typescript
// lib/data.ts에서 API 호출로 변경
const response = await fetch('/api/cities')
const cities = await response.json()
```

## 성능 최적화

- Tailwind CSS를 이용한 최적화된 스타일링
- Next.js 이미지 최적화 (추후 적용)
- 코드 스플리팅 및 동적 로딩
- SEO 최적화 (메타데이터)

## 향후 개발 계획

- [ ] 백엔드 API 연동
- [ ] 사용자 인증 및 로그인
- [ ] 도시/리뷰 작성 기능
- [ ] 지도 기능 통합
- [ ] 검색 필터 동작
- [ ] 좋아요/북마크 기능
- [ ] 실시간 채팅
- [ ] 이메일 알림

## 라이선스

MIT

## 문의

이 프로젝트에 대한 질문이나 제안은 이슈를 등록해주세요.
