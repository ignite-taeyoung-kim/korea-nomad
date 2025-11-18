# 🎨 Figma Design System

Korea Nomad 프로젝트의 디자인 시스템 및 Figma 스펙 관리 가이드입니다.

## 📁 파일 구조

```
docs/design/
├── README.md              ← 이 파일
├── figma-spec.json        ← Figma 프로젝트 스펙 (데이터베이스, API, 컴포넌트)
├── design-tokens.json     ← 디자인 토큰 (색상, 타이포그래피, 간격 등)
└── component-library.md   ← 컴포넌트 라이브러리 카탈로그 (예정)
```

## 📊 파일별 역할

### 1. `figma-spec.json`
**목적**: 기술 스펙 정보를 Figma와 동기화

포함 내용:
- 프로젝트 정보 (이름, 버전, 스택)
- 데이터베이스 스키마 (테이블, 컬럼, 인덱스)
- API 엔드포인트 (경로, 메서드, 요청/응답)
- 컴포넌트 목록 (위치, 설명)

**용도**:
- 디자이너가 컴포넌트 설계 시 필요한 데이터 구조 확인
- API 통합 설계
- 동적 데이터 흐름 이해

### 2. `design-tokens.json`
**목적**: 디자인 시스템의 일관성을 위한 토큰 정의

포함 내용:
- 색상 팔레트 (primary, secondary, neutral, etc.)
- 타이포그래피 (폰트, 크기, 굵기, 헤딩)
- 간격 시스템 (4px 그리드 기반)
- 테두리 반경 (모서리 곡률)
- 그림자 (elevation levels)
- 반응형 breakpoints
- 컴포넌트 스타일 (버튼, 카드, 입력, 배지)
- 애니메이션 (지속 시간, 이징)

**용도**:
- Figma에서 일관된 디자인 언어 적용
- 개발 시 Tailwind CSS 매핑
- Tokens Studio 플러그인과 동기화

## 🔄 Figma 동기화 워크플로우

### 방법 1: Tokens Studio 플러그인 (권장) ⭐

**설정 방법**:

1. Figma에서 **Tokens Studio for Figma** 플러그인 설치
2. Tokens Studio 패널 열기
3. Settings → Sync → JSON 연결
4. 이 저장소의 raw 파일 URL 입력:
   ```
   https://raw.githubusercontent.com/[your-repo]/korea-nomad/main/docs/design/design-tokens.json
   ```
5. "Sync from file" 클릭

**자동 동기화**:
- GitHub Actions로 자동화 가능
- 코드 변경 시 자동으로 Figma 토큰 업데이트

### 방법 2: 수동 업데이트

1. `design-tokens.json` 편집
2. Figma에서 수동으로 토큰 업데이트
3. 개발팀에 변경사항 공유

### 방법 3: Storybook 연동

개발 및 디자인 컴포넌트를 한곳에서 관리:

```bash
# Storybook 설치 (향후 적용)
npm install --save-dev @storybook/react @storybook/addon-links @storybook/addon-essentials
```

## 📱 응답형 디자인

### Breakpoints

| 이름 | 크기 | 용도 |
|------|------|------|
| mobile | 320px | 스마트폰 |
| tablet | 640px | 태블릿 |
| desktop | 1024px | 데스크톱 |
| wide | 1280px | 큰 화면 |
| ultrawide | 1536px | 초대형 화면 |

### 레이아웃 원칙

- **Mobile First**: 모바일부터 설계 시작
- **4px Grid**: 모든 간격은 4px의 배수
- **Flexible Components**: 컴포넌트는 유연하게 확장 가능

## 🎯 색상 시스템

### 주요 색상

- **Primary (청색)**: 브랜드 주색, CTA 버튼
- **Secondary (보라색)**: 강조, 호버 상태
- **Success (초록색)**: 성공, 완료
- **Warning (주황색)**: 경고, 주의
- **Error (빨강색)**: 에러, 위험
- **Neutral (회색)**: 배경, 텍스트, 보더

### 색상 레벨

각 색상마다 명도에 따른 50~900 레벨:
- **50, 100**: 매우 밝은 배경
- **500**: 기본 색상
- **600, 700**: 진한 버전 (호버, 활성)
- **900**: 가장 진한 버전 (텍스트)

## 🔤 타이포그래피

### 폰트

- **Sans-serif**: 기본 텍스트 (시스템 폰트)
- **Mono**: 코드, 기술 텍스트

### 크기 및 행간

| 사용처 | 크기 | 행간 | 굵기 |
|--------|------|------|------|
| 본문 | 16px | 24px | 400 |
| 작은 텍스트 | 14px | 20px | 400 |
| 큰 제목 (H1) | 36px | 44px | 700 |
| 중간 제목 (H3) | 24px | 32px | 600 |

## 📐 간격 시스템

4px 기반 그리드:

| 토큰 | 크기 | 용도 |
|------|------|------|
| 1 | 4px | 아주 작은 간격 |
| 2 | 8px | 작은 간격 (텍스트 내부) |
| 3 | 12px | 기본 간격 |
| 4 | 16px | 표준 간격 (패딩, 마진) |
| 6 | 24px | 섹션 간격 |
| 8 | 32px | 큰 섹션 간격 |

## 🧩 컴포넌트 스타일

### 버튼

**Primary**:
- 배경: Primary 500
- 텍스트: White
- 패딩: 8px 16px
- 테두리 반경: 8px

**Secondary**:
- 배경: Neutral 100
- 텍스트: Primary 600
- 보더: 1px Neutral 300

### 카드

- 배경: White
- 패딩: 16px
- 테두리 반경: 12px
- 그림자: 작음

### 입력 필드

- 배경: White
- 패딩: 8px 12px
- 보더: 1px Neutral 300
- 테두리 반径: 8px
- 포커스 시: Primary 색상 보더

## 🎬 애니메이션

| 이름 | 지속 시간 | 이징 | 용도 |
|------|---------|------|------|
| Fast | 150ms | ease-in-out | 간단한 상호작용 |
| Normal | 300ms | ease-in-out | 기본 애니메이션 |
| Slow | 500ms | ease-out | 모달, 페이드 |

## 🔗 관련 문서

- [UI 와이어프레임](../architecture/ui-wireframes.md) - ASCII 디자인 문서
- [프로젝트 SPEC](../../SPEC.md) - 전체 프로젝트 스펙

## 📚 유용한 도구

### Figma 플러그인

1. **Tokens Studio for Figma** - 토큰 관리 및 동기화
2. **Figma REST API** - 자동화 및 외부 연동
3. **Design QA** - 디자인 일관성 검사

### 개발 도구

1. **Tailwind CSS** - 디자인 토큰 → CSS 클래스
2. **Storybook** - 컴포넌트 카탈로그
3. **Chromatic** - Storybook 배포 및 VCS 연동

## 🚀 Next Steps

**단기 (2주)**:
- [ ] Figma 파일 생성 및 토큰 설정
- [ ] Tokens Studio 플러그인 연동
- [ ] 모든 주요 컴포넌트 설계

**중기 (1개월)**:
- [ ] 컴포넌트 라이브러리 작성
- [ ] Storybook 연동
- [ ] 개발팀과 동기화

**장기 (진행 중)**:
- [ ] Figma ↔ 코드 자동 동기화
- [ ] 디자인 시스템 버전 관리
- [ ] 디자인 가이드 문서화

## ❓ 자주 묻는 질문

**Q: Figma에서 토큰을 변경하면 코드에 자동 반영되나요?**
A: Tokens Studio를 통해 설정하면 자동 동기화 가능합니다. GitHub Actions로 자동화할 수 있습니다.

**Q: 디자인 시스템을 버전 관리할 수 있나요?**
A: 네, git에서 `design-tokens.json` 변경사항으로 버전 관리합니다.

**Q: 새로운 색상을 추가하려면?**
A: `design-tokens.json`에 새 색상을 추가하고, Figma에서 동기화합니다.

---

**Last Updated**: 2025-11-18
**Version**: 1.0
**Status**: ✅ Active
