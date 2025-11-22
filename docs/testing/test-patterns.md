# 테스트 작성 패턴 가이드

모든 테스트 작성자가 따라야 할 공통 패턴과 규칙을 정의합니다.

## 📋 기본 구조: AAA (Arrange-Act-Assert)

모든 테스트는 다음 세 가지 단계로 구성되어야 합니다:

```typescript
describe('기능명', () => {
  test('상황에서 기대값을 반환한다', () => {
    // 1️⃣ Arrange: 테스트 데이터 준비
    const input = { /* ... */ };
    const expected = { /* ... */ };

    // 2️⃣ Act: 함수/컴포넌트 실행
    const result = functionToTest(input);

    // 3️⃣ Assert: 결과 검증
    expect(result).toEqual(expected);
  });
});
```

## 🎯 유틸리티 함수 테스트

### 예시 1: 순수 함수
```typescript
describe('extractMinCost', () => {
  test('비용 범위 문자열에서 최소값을 추출한다', () => {
    // Arrange
    const costStr = '2.1~3M';

    // Act
    const result = extractMinCost(costStr);

    // Assert
    expect(result).toBe(2.1);
  });

  test('빈 문자열이 주어지면 0을 반환한다', () => {
    expect(extractMinCost('')).toBe(0);
  });

  test('null이 주어지면 에러를 던진다', () => {
    expect(() => extractMinCost(null)).toThrow();
  });
});
```

### 예시 2: 배열 변환 함수
```typescript
describe('filterBySearch', () => {
  test('검색어에 일치하는 도시만 반환한다', () => {
    // Arrange
    const cities = [
      { id: '1', name: '서울' },
      { id: '2', name: '부산' },
    ];

    // Act
    const result = filterBySearch(cities, { search: '서울' });

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('서울');
  });

  test('원본 배열을 변경하지 않는다 (immutability)', () => {
    const cities = [{ id: '1', name: '서울' }];
    const citiesCopy = [...cities];

    filterBySearch(cities, { search: 'test' });

    expect(cities).toEqual(citiesCopy);
  });
});
```

## 🪝 훅 테스트

### 예시: useState를 사용하는 훅
```typescript
import { renderHook, act } from '@testing-library/react';
import { useFilters } from '@/hooks/useFilters';

describe('useFilters', () => {
  test('초기 상태를 반환한다', () => {
    // Arrange & Act
    const { result } = renderHook(() => useFilters());

    // Assert
    expect(result.current.filters.search).toBe('');
    expect(result.current.filters.regions).toEqual([]);
  });

  test('필터를 업데이트할 수 있다', () => {
    // Arrange
    const { result } = renderHook(() => useFilters());

    // Act
    act(() => {
      result.current.updateFilters({ search: 'seoul' });
    });

    // Assert
    expect(result.current.filters.search).toBe('seoul');
  });
});
```

### 예시: 비동기 훅
```typescript
describe('useReviews', () => {
  test('도시 ID가 주어지면 리뷰를 로드한다', async () => {
    // Arrange
    const { result, waitForNextUpdate } = renderHook(() =>
      useReviews('seoul')
    );

    // 초기 로딩 상태 확인
    expect(result.current.isLoading).toBe(true);

    // Act & Assert
    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.reviews).toHaveLength(3); // Mock 데이터
  });
});
```

## 🧩 컴포넌트 테스트

### 예시 1: Props 렌더링
```typescript
import { render, screen } from '@testing-library/react';
import { CityCard } from '@/components/home/CityCard';

describe('CityCard', () => {
  test('도시 정보를 표시한다', () => {
    // Arrange
    const mockCity = {
      id: 'seoul',
      name: '서울',
      emoji: '🏙️',
      // ... 다른 props
    };

    // Act
    render(<CityCard city={mockCity} />);

    // Assert
    expect(screen.getByText('서울')).toBeInTheDocument();
    expect(screen.getByText('🏙️')).toBeInTheDocument();
  });
});
```

### 예시 2: 사용자 상호작용
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { ReviewForm } from '@/components/reviews/ReviewForm';

describe('ReviewForm', () => {
  test('제목과 내용을 입력하고 제출할 수 있다', () => {
    // Arrange
    const mockOnSubmit = jest.fn();
    render(<ReviewForm onSubmit={mockOnSubmit} />);

    // Act
    const titleInput = screen.getByLabelText(/제목/i);
    fireEvent.change(titleInput, { target: { value: '좋아요' } });

    const contentInput = screen.getByLabelText(/내용/i);
    fireEvent.change(contentInput, { target: { value: '정말 좋습니다' } });

    const submitButton = screen.getByRole('button', { name: /작성/i });
    fireEvent.click(submitButton);

    // Assert
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: '좋아요',
        content: '정말 좋습니다',
      })
    );
  });

  test('필수 필드가 비어있으면 에러 메시지를 표시한다', () => {
    // Arrange
    render(<ReviewForm />);

    // Act
    fireEvent.click(screen.getByRole('button', { name: /작성/i }));

    // Assert
    expect(screen.getByText(/제목을 입력해주세요/i)).toBeInTheDocument();
  });
});
```

## 🔧 Mock 사용

### localStorage Mock
```typescript
describe('storage.ts', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('좋아요를 저장하고 조회할 수 있다', () => {
    // Arrange & Act
    addFavorite('seoul');

    // Assert
    expect(isFavorite('seoul')).toBe(true);
    expect(localStorage.getItem('nomad_favorites_user')).toBeDefined();
  });
});
```

### Supabase Mock
```typescript
import { setMockUser, setMockQueryResult } from '@/__tests__/mocks/supabase.mock';

describe('useReviews', () => {
  test('Supabase에서 리뷰를 조회한다', async () => {
    // Arrange
    setMockUser({ id: 'user-1' });
    const mockReviews = [
      { id: '1', rating: 5, title: '좋아요' },
    ];
    setMockQueryResult(mockReviews);

    // Act
    const { result } = renderHook(() => useReviews('seoul'));
    await waitFor(() => !result.current.isLoading);

    // Assert
    expect(result.current.reviews).toEqual(mockReviews);
  });
});
```

## ✅ 에러 처리 패턴

### 정상 케이스 + 에러 케이스
```typescript
describe('filterBySearch', () => {
  // 정상 케이스
  test('검색어가 있으면 필터링한다', () => {
    const result = filterBySearch([...], { search: 'seoul' });
    expect(result).toHaveLength(1);
  });

  // 엣지 케이스
  test('검색어가 null이면 모든 도시를 반환한다', () => {
    const result = filterBySearch([...], { search: null });
    expect(result).toHaveLength(8);
  });

  // 에러 케이스
  test('도시 배열이 null이면 에러를 던진다', () => {
    expect(() => filterBySearch(null, { search: 'seoul' })).toThrow();
  });
});
```

## 📊 테스트 건수 예상

각 파일당 테스트 케이스:

| 파일 | 건수 | 추정 시간 |
|------|------|---------|
| 필터링 함수 | 70 | 2-3시간 |
| 유틸 함수 | 25 | 1-2시간 |
| localStorage | 30 | 1-2시간 |
| 훅 (상태) | 15 | 1-2시간 |
| 훅 (데이터) | 15 | 2-3시간 |
| 컴포넌트 | 18 | 2-3시간 |

## 🎨 네이밍 컨벤션

```typescript
// ✅ 좋은 예
test('필터링을 적용하면 해당 도시만 반환한다', () => { });
test('검색어가 없으면 모든 도시를 반환한다', () => { });
test('생활비 범위 밖인 도시는 필터링된다', () => { });

// ❌ 나쁜 예
test('필터 테스트', () => { });
test('work', () => { });
test('t1', () => { });
```

## 🧹 테스트 정리

```typescript
describe('리뷰 저장소', () => {
  beforeEach(() => {
    // 각 테스트 전에 실행
    localStorage.clear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    // 각 테스트 후에 실행
    jest.clearAllMocks();
  });

  test('...', () => {
    // 테스트
  });
});
```

## 📝 주석 작성

```typescript
describe('유틸리티', () => {
  test('생활비 범위를 파싱한다', () => {
    // Given: 비용 범위 문자열
    const costStr = '2.1~3M';

    // When: 최소값을 추출
    const result = extractMinCost(costStr);

    // Then: 최소값 2.1이 반환
    expect(result).toBe(2.1);
  });
});
```

## ⚡ 성능 팁

```typescript
// ❌ 느린 테스트: 매 테스트마다 새로운 Mock 생성
test('...', () => {
  const data = generateMockData(); // 매번 생성
});

// ✅ 빠른 테스트: Mock 재사용
const mockData = generateMockData();
test('...', () => {
  const result = filter(mockData);
});
```

---

이 패턴을 따르면 일관되고 유지보수하기 쉬운 테스트 코드를 작성할 수 있습니다! 🎉
