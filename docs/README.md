# 📚 Korea Nomad 프로젝트 문서

한국 노마드 라이프 정보 플랫폼 - Korea Nomad의 완전한 프로젝트 문서입니다.

---

## 📖 문서 구조

### 🧪 테스팅 가이드 (`/testing`)

프로젝트의 테스트 전략, 패턴, 실행 방법에 대한 가이드입니다.

#### 📄 [E2E 테스트 설정 가이드](./testing/e2e-setup.md)
**상태**: ✅ 완료
- Playwright E2E 테스트 환경 설정
- 설치된 패키지 및 구조
- npm 스크립트 명령어
- Page Object Model 구현
- 테스트 데이터 구조

#### 📄 [E2E 테스트 실행 가이드](./testing/e2e-guide.md)
**상태**: ✅ 완료
- 테스트 실행 방법 (UI 모드, 디버그 모드, 헤드리스 모드)
- 테스트 내용 상세 설명
- 예상 결과 및 문제 해결
- 선택자 조정 가이드

#### 📄 [테스트 작성 패턴](./testing/test-patterns.md)
**상태**: ✅ 완료
- AAA (Arrange-Act-Assert) 패턴
- 유틸리티 함수 테스트 예시
- 훅 테스트 (상태, 비동기)
- 컴포넌트 테스트
- Mock 사용 방법
- 네이밍 컨벤션

#### 📄 [테스트 의존성 맵](./testing/test-dependencies.md)
**상태**: ✅ 완료
- Phase별 테스트 의존성 그래프
- 구체적인 의존성 관계
- 시작 조건 체크리스트
- 병렬 처리 가능 구간
- 주의사항

#### 📄 [테스트 완료 보고서](./testing/test-completion-summary.md)
**상태**: ✅ 완료
- 최종 테스트 통계 (676개 테스트, 100% 통과율)
- Phase별 상세 완성 현황
- 주요 성과 및 품질 지표
- 기술 스택
- CI/CD 통합 방법

---

### 🎯 기능 설명서 (`/features`)

프로젝트의 주요 기능 및 구현 가이드입니다.

#### 📄 [도시 상세페이지 제작](./features/city-detail-page.md)
**상태**: ⏸️ 구현 대기
- 현재 구현 상황 분석
- 개선 필요 부분
- 6개 Phase로 구성된 상세 작업 분해
- 예상 소요시간 및 의존성 그래프
- 리스크 요소 및 병목 지점

---

### 🚀 DevOps & 인프라 (`/devops`)

성능 최적화, 보안, 배포 관련 가이드입니다.

#### 📄 [성능 최적화 가이드](./devops/performance.md)
**상태**: ✅ 준비 완료
- 쿼리 최적화 (SELECT * 제거, 페이지네이션)
- Next.js 캐싱 전략 (ISR, revalidate 설정)
- 클라이언트 캐싱 (SWR 패턴)
- 이미지 최적화 (Next.js Image 컴포넌트)
- 번들 크기 최적화
- 데이터베이스 인덱스
- Lighthouse 성능 측정
- 배포 전 확인 사항

#### 📄 [보안 체크리스트](./devops/security.md)
**상태**: ✅ 진행중 (92% 완료)
- Function Search Path 수정 상태
- Leaked Password Protection 활성화
- RLS (Row Level Security) 정책 검증
- 외래 키 제약조건
- 데이터 검증
- Server Action 보안 검증
- 보안 점수 현황

---

## 🎯 빠른 시작

### 🧪 테스트 실행
```bash
# E2E 테스트 (UI 모드)
npm run test:e2e:ui

# 특정 테스트 파일 실행
npm run test:e2e:ui -- e2e/tests/home/simple-test.spec.ts

# 디버그 모드
npm run test:e2e:debug

# 헤드리스 모드
npm run test:e2e
```

### 🚀 서버 실행
```bash
# 개발 서버 (port 3000)
PORT=3000 npm run dev

# 프로덕션 빌드 및 실행
npm run build
npm run start
```

### 📊 성능 측정
```bash
# 빌드 성능 분석
npm run build

# Lighthouse 점수 확인 (Chrome DevTools)
# Chrome DevTools → Lighthouse → Generate report
```

---

## 📋 프로젝트 현황

### ✅ 완료된 항목
- ✅ E2E 테스트 환경 설정
- ✅ 676개 유닛 테스트 + 통합 테스트 작성
- ✅ 100% 테스트 통과율
- ✅ RLS 정책 설정
- ✅ Server Action 보안 검증
- ✅ 성능 최적화 방안 수립

### 🔄 진행 중인 항목
- 🔄 Password Protection 활성화
- 🔄 Function Search Path 수정
- 🔄 이미지 최적화 구현

### 📝 계획 중인 항목
- 📝 도시 상세페이지 확장 (Phase 1-6)
- 📝 Lighthouse 성능 최적화
- 📝 Database 인덱스 추가
- 📝 CI/CD 파이프라인 구축

---

## 🔗 관련 파일

### 주요 파일 위치
```
/
├── e2e/                           # E2E 테스트
│   ├── tests/                     # 테스트 파일
│   ├── pages/                     # Page Object Model
│   ├── fixtures/                  # 테스트 데이터
│   └── config/                    # 테스트 설정
├── docs/                          # 문서 (이 디렉토리)
│   ├── testing/                   # 테스트 관련 문서
│   ├── features/                  # 기능 설명서
│   └── devops/                    # DevOps 가이드
├── app/                           # Next.js App Router
│   ├── cities/[id]/               # 도시 상세페이지
│   ├── auth/                      # 인증 관련
│   └── actions/                   # Server Actions
├── components/                    # React 컴포넌트
├── hooks/                         # React 훅
├── lib/                           # 유틸리티 함수
└── utils/                         # 헬퍼 함수
```

---

## 📊 프로젝트 통계

| 항목 | 수치 | 상태 |
|------|------|------|
| **총 테스트 수** | 676개 | ✅ |
| **테스트 통과율** | 100% | ✅ |
| **평균 커버리지** | 90%+ | ✅ |
| **E2E 테스트 | 22개 | ✅ |
| **보안 점수** | 92% | 🔄 |
| **성능 최적화** | 준비 완료 | 📝 |

---

## 🛠 기술 스택

### 테스팅
- **Playwright**: E2E 테스트 자동화
- **Jest**: 유닛 테스트
- **@testing-library/react**: React 컴포넌트 테스트

### 프레임워크
- **Next.js 15**: 풀스택 웹 프레임워크
- **React 19**: UI 라이브러리
- **TypeScript**: 타입 안정성

### 데이터베이스
- **Supabase**: PostgreSQL 기반 백엔드
- **PostgreSQL**: RLS, 외래 키 제약

### 스타일링
- **Tailwind CSS**: 유틸리티 기반 CSS

---

## 📞 문서 네비게이션

### 테스터/QA 담당자
1. [E2E 테스트 실행 가이드](./testing/e2e-guide.md) - 테스트 실행 방법
2. [E2E 테스트 설정 가이드](./testing/e2e-setup.md) - 환경 설정

### 개발자
1. [테스트 작성 패턴](./testing/test-patterns.md) - 테스트 작성 방법
2. [테스트 의존성 맵](./testing/test-dependencies.md) - 테스트 구조 이해
3. [도시 상세페이지 제작](./features/city-detail-page.md) - 기능 구현 가이드

### 데브옵스/보안
1. [보안 체크리스트](./devops/security.md) - 보안 설정 확인
2. [성능 최적화 가이드](./devops/performance.md) - 배포 전 최적화

---

## ✨ 최근 업데이트

- **2025-10-30**: 테스트 완료 보고서 (676개 테스트, 100% 통과)
- **2025-10-28**: E2E 테스트 실행 가이드 업데이트
- **2025-10-27**: 도시 상세페이지 제작 분석 문서 추가
- **2025-10-25**: 성능 최적화 및 보안 체크리스트 추가

---

## 🎯 다음 단계

1. **테스트 실행**: [E2E 테스트 실행 가이드](./testing/e2e-guide.md) 참고
2. **기능 구현**: [도시 상세페이지 제작](./features/city-detail-page.md) 참고
3. **배포 준비**: [성능 최적화 가이드](./devops/performance.md) & [보안 체크리스트](./devops/security.md) 참고

---

## 📝 문서 작성 정책

- 모든 문서는 **Markdown** 형식으로 작성됩니다
- 각 문서는 **명확한 목차**와 **예시**를 포함합니다
- **현황 상태**는 항상 최신 정보로 유지됩니다
- 작업이 완료되면 **체크리스트**를 업데이트합니다

---

**마지막 업데이트**: 2025년 11월 3일
**문서 버전**: 1.0
**상태**: 📖 지속적으로 업데이트 중
