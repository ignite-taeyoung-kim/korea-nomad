# 🎬 E2E 테스트 실행 가이드

## 📌 현재 상황

**생성된 테스트 파일:**
- `e2e/tests/home/homepage.spec.ts` - 홈페이지 전체 테스트 (17개 테스트)
- `e2e/tests/home/simple-test.spec.ts` - 기본 테스트 (6개 테스트)

**테스트 요구사항 (slash command로 요청):**
1. ✅ http://localhost:3000 으로 이동
2. ✅ 홈페이지에 로고가 존재하는지 확인
3. ✅ 홈페이지에 도시 카드들이 존재하는지 확인
4. ✅ 처음 접속하면 필터가 적용 안 돼 있는지 확인
5. ✅ 필터가 적용 안 돼 있으면 데이터베이스의 모든 도시가 표시되는지 확인

---

## 🚀 테스트 실행 방법

### Step 1: 터미널을 2개 열기

**터미널 1 - 앱 실행**
```bash
npm run dev
# http://localhost:3000에서 실행될 때까지 대기
```

**터미널 2 - 테스트 실행**

### Step 2: 테스트 선택

**옵션 A: 간단한 테스트 (권장)**
```bash
npm run test:e2e:ui -- e2e/tests/home/simple-test.spec.ts
```

**옵션 B: 전체 홈페이지 테스트**
```bash
npm run test:e2e:ui -- e2e/tests/home/homepage.spec.ts
```

**옵션 C: 헤드리스 모드 (UI 없이)**
```bash
npm run test:e2e -- e2e/tests/home/simple-test.spec.ts
```

**옵션 D: 디버그 모드 (한 줄씩 실행)**
```bash
npm run test:e2e:debug -- e2e/tests/home/simple-test.spec.ts
```

---

## 📋 테스트 내용 상세

### simple-test.spec.ts (6개 테스트)

1. **홈페이지에 접속 가능한지 확인**
   - localhost:3000 접속 ✓

2. **페이지 제목이 있는지 확인**
   - 페이지 title 태그 확인

3. **페이지에 텍스트 내용이 있는지 확인**
   - body 요소에 텍스트 존재 확인

4. **요소 개수 확인**
   - div, button, a 요소 개수 출력 및 확인

5. **카드 요소 개수 확인**
   - [class*="card"], article, [class*="item"] 요소 찾기
   - **중요**: 도시 카드가 실제로 렌더링되는지 확인!

6. **네비게이션 존재 확인**
   - nav, header, [role="navigation"] 확인

### homepage.spec.ts (17개 테스트)

#### 기본 렌더링 (7개)
- 로고 존재
- 도시 카드 존재
- 필터 미적용
- 모든 도시 표시 (5개 도시)
- 각 카드 필수 정보
- 카드 클릭 시 상세 페이지 이동
- 네비게이션 작동

#### 카드 상호작용 (3개)
- 마우스 호버 효과
- 좋아요 버튼 존재
- 북마크 버튼 존재

#### 레이아웃 및 성능 (4개)
- 페이지 제목
- 페이지 로드 시간 (5초 이내)
- 콘솔 에러 확인

---

## 📊 예상 결과

### ✅ 모든 테스트 통과하는 경우
```
✓ 홈페이지에 접속 가능한지 확인 (123ms)
✓ 페이지 제목이 있는지 확인 (45ms)
✓ 페이지에 텍스트 내용이 있는지 확인 (56ms)
✓ 요소 개수 확인 (78ms)
✓ 카드 요소 개수 확인 (89ms)
✓ 네비게이션 존재 확인 (67ms)

6 passed
```

### ❌ 테스트 실패하는 경우
```
✗ 카드 요소 개수 확인
  Error: expected 0 to be greater than 0
```

**해석**: 도시 카드가 렌더링되지 않음
→ 선택자를 조정해야 함

---

## 🔍 콘솔 출력 해석

테스트가 실행되면 다음과 같은 로그가 출력됩니다:

```
페이지 제목: Korea Nomad - 한국 노마드
div 개수: 234
button 개수: 15
link 개수: 42
card 클래스 요소: 5
Card 클래스 요소: 0
article 요소: 0
item 클래스 요소: 5
nav 요소: 1
header 요소: 1
navigation 역할 요소: 0
```

**중요 확인 사항:**
- `card 클래스 요소: 5` 또는 `item 클래스 요소: 5` 또는 `article 요소: 5` → ✅ 도시 카드 렌더링됨!
- `nav 요소: 1` → ✅ 네비게이션 있음!

---

## 💡 선택자 조정 가이드

만약 테스트가 실패하면, 실제 HTML 구조를 확인하고 선택자를 조정해야 합니다.

### 도시 카드 찾기
```typescript
// 현재 사용 중인 선택자
'[data-testid="city-card"], .city-card, [class*="Card"], article, .card'

// 추가 시도할 선택자
'[class*="city"], section, .container > *, main > *'
```

### 로고 찾기
```typescript
// 현재 사용 중인 선택자
'header a, nav a, [data-testid="logo"], .logo'

// 추가 시도할 선택자
'a:first-of-type, [class*="logo"], img[alt*="logo"]'
```

---

## 🎯 다음 단계

1. **simple-test.spec.ts 먼저 실행**
   - 기본 기능 확인
   - 콘솔 로그로 실제 요소 개수 파악

2. **콘솔 로그 기반으로 선택자 조정**
   - 도시 카드의 실제 클래스/id 확인
   - homepage.spec.ts의 선택자 수정

3. **homepage.spec.ts 실행**
   - 더 자세한 테스트 수행
   - 각 기능별 동작 확인

4. **최종 테스트**
   - 모든 17개 테스트 통과 확인

---

## 📞 문제 해결

### 문제 1: "Cannot find element"
```
Solution: 선택자가 잘못됨
→ 브라우저 DevTools에서 실제 요소 선택
→ 클래스/id 확인 후 선택자 수정
```

### 문제 2: "Element not visible"
```
Solution: 요소가 있지만 숨겨짐
→ 페이지 로드 시간 증가
→ waitForTimeout 시간 조정
```

### 문제 3: "Timeout"
```
Solution: 페이지가 너무 오래 걸림
→ 네트워크 속도 확인
→ API 응답 속도 확인
```

---

## ✅ 최종 체크리스트

- [ ] `npm run dev` 실행 (터미널 1)
- [ ] `npm run test:e2e:ui -- e2e/tests/home/simple-test.spec.ts` 실행 (터미널 2)
- [ ] 테스트 결과 확인
- [ ] 콘솔 로그 분석
- [ ] 필요시 선택자 조정
- [ ] 모든 테스트 통과 확인
- [ ] 결과 보고

---

**준비 완료! 테스트를 실행하세요! 🚀**
