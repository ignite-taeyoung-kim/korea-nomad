/**
 * Unit Tests for hooks/useFilters.ts
 *
 * 총 15개의 테스트 케이스로 URL 기반 필터 상태 관리 훅을 테스트합니다.
 */

import { renderHook, act } from '@testing-library/react';
import { useFilters } from '@/hooks/useFilters';
import { useRouter, useSearchParams } from 'next/navigation';

// ============================================================================
// Mock Setup
// ============================================================================

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

const mockPush = jest.fn();
const mockRouter = {
  push: mockPush,
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
};

// Mock URLSearchParams helper
const createMockSearchParams = (params: Record<string, string> = {}) => {
  const searchParams = new URLSearchParams(params);
  return {
    get: (key: string) => searchParams.get(key),
    toString: () => searchParams.toString(),
  } as any;
};

// ============================================================================
// Initial State Tests - 3 tests
// ============================================================================

describe('useFilters - Initial State', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  test('URL에 쿼리 파라미터가 없으면 기본 필터를 반환한다', () => {
    // Arrange
    (useSearchParams as jest.Mock).mockReturnValue(createMockSearchParams());

    // Act
    const { result } = renderHook(() => useFilters());

    // Assert
    expect(result.current.filters).toEqual({
      search: '',
      regions: [],
      costRange: { min: 1, max: 5 },
      minSpeed: 0,
      sortBy: 'overall',
    });
  });

  test('URL에 쿼리 파라미터가 있으면 파싱된 필터를 반환한다', () => {
    // Arrange
    (useSearchParams as jest.Mock).mockReturnValue(
      createMockSearchParams({
        search: 'seoul',
        regions: 'seoul,gangwon',
        costMin: '2',
        costMax: '4',
        speed: '100',
        sort: 'cheap',
      })
    );

    // Act
    const { result } = renderHook(() => useFilters());

    // Assert
    expect(result.current.filters).toEqual({
      search: 'seoul',
      regions: ['seoul', 'gangwon'],
      costRange: { min: 2, max: 4 },
      minSpeed: 100,
      sortBy: 'cheap',
    });
  });

  test('여러 파라미터가 올바르게 파싱된다', () => {
    // Arrange
    (useSearchParams as jest.Mock).mockReturnValue(
      createMockSearchParams({
        search: 'busan',
        regions: 'busan,gyeongnam,jeju',
        costMin: '1',
        costMax: '3',
        speed: '500',
        sort: 'popular',
      })
    );

    // Act
    const { result } = renderHook(() => useFilters());

    // Assert
    expect(result.current.filters.search).toBe('busan');
    expect(result.current.filters.regions).toEqual(['busan', 'gyeongnam', 'jeju']);
    expect(result.current.filters.costRange.min).toBe(1);
    expect(result.current.filters.costRange.max).toBe(3);
    expect(result.current.filters.minSpeed).toBe(500);
    expect(result.current.filters.sortBy).toBe('popular');
  });
});

// ============================================================================
// updateFilters() Tests - 4 tests
// ============================================================================

describe('useFilters - updateFilters()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  test('필터 업데이트 시 URL searchParams가 변경된다', () => {
    // Arrange
    (useSearchParams as jest.Mock).mockReturnValue(createMockSearchParams());
    const { result } = renderHook(() => useFilters());

    // Act
    act(() => {
      result.current.updateFilters({ search: 'gangneung' });
    });

    // Assert
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('search=gangneung'),
      expect.objectContaining({ scroll: false })
    );
  });

  test('브라우저 히스토리가 업데이트된다', () => {
    // Arrange
    (useSearchParams as jest.Mock).mockReturnValue(createMockSearchParams());
    const { result } = renderHook(() => useFilters());

    // Act
    act(() => {
      result.current.updateFilters({ search: 'jeonju' });
    });

    // Assert
    expect(mockRouter.push).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
  });

  test('스크롤 위치가 유지된다', () => {
    // Arrange
    (useSearchParams as jest.Mock).mockReturnValue(createMockSearchParams());
    const { result } = renderHook(() => useFilters());

    // Act
    act(() => {
      result.current.updateFilters({ search: 'daegu' });
    });

    // Assert
    expect(mockPush).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ scroll: false })
    );
  });

  test('부분 필터 업데이트가 가능하다', () => {
    // Arrange
    (useSearchParams as jest.Mock).mockReturnValue(
      createMockSearchParams({
        search: 'seoul',
        regions: 'seoul,gyeonggi',
      })
    );
    const { result } = renderHook(() => useFilters());

    // Act
    act(() => {
      result.current.updateFilters({ costRange: { min: 2, max: 4 } });
    });

    // Assert: 기존 파라미터는 유지되고 새로운 파라미터가 추가됨
    const callArgs = mockPush.mock.calls[0][0];
    expect(callArgs).toContain('search=seoul');
    expect(callArgs).toMatch(/regions=seoul/); // URL 인코딩으로 %2C가 될 수 있음
    expect(callArgs).toContain('costMin=2');
    expect(callArgs).toContain('costMax=4');
  });
});

// ============================================================================
// resetFilters() Tests - 2 tests
// ============================================================================

describe('useFilters - resetFilters()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  test('모든 필터가 초기화된다', () => {
    // Arrange
    (useSearchParams as jest.Mock).mockReturnValue(
      createMockSearchParams({
        search: 'seoul',
        regions: 'seoul,gyeonggi',
        costMin: '2',
        costMax: '4',
      })
    );
    const { result } = renderHook(() => useFilters());

    // Act
    act(() => {
      result.current.resetFilters();
    });

    // Assert
    expect(mockPush).toHaveBeenCalledWith('?', expect.objectContaining({ scroll: false }));
  });

  test('URL에서 쿼리 파라미터가 제거된다', () => {
    // Arrange
    (useSearchParams as jest.Mock).mockReturnValue(
      createMockSearchParams({
        search: 'busan',
        sort: 'popular',
      })
    );
    const { result } = renderHook(() => useFilters());

    // Act
    act(() => {
      result.current.resetFilters();
    });

    // Assert
    expect(mockPush).toHaveBeenCalledWith('?', { scroll: false });
  });
});

// ============================================================================
// URL Parameter Parsing Tests - 4 tests
// ============================================================================

describe('useFilters - URL Parameter Parsing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  test('?search=seoul → filters.search = "seoul"', () => {
    // Arrange
    (useSearchParams as jest.Mock).mockReturnValue(
      createMockSearchParams({ search: 'seoul' })
    );

    // Act
    const { result } = renderHook(() => useFilters());

    // Assert
    expect(result.current.filters.search).toBe('seoul');
  });

  test('?regions=seoul,gangwon → filters.regions 배열', () => {
    // Arrange
    (useSearchParams as jest.Mock).mockReturnValue(
      createMockSearchParams({ regions: 'seoul,gangwon' })
    );

    // Act
    const { result } = renderHook(() => useFilters());

    // Assert
    expect(result.current.filters.regions).toEqual(['seoul', 'gangwon']);
  });

  test('?costMin=1&costMax=5 → filters.costRange', () => {
    // Arrange
    (useSearchParams as jest.Mock).mockReturnValue(
      createMockSearchParams({ costMin: '1', costMax: '5' })
    );

    // Act
    const { result } = renderHook(() => useFilters());

    // Assert
    expect(result.current.filters.costRange).toEqual({ min: 1, max: 5 });
  });

  test('?sort=cheap → filters.sortBy', () => {
    // Arrange
    (useSearchParams as jest.Mock).mockReturnValue(
      createMockSearchParams({ sort: 'cheap' })
    );

    // Act
    const { result } = renderHook(() => useFilters());

    // Assert
    expect(result.current.filters.sortBy).toBe('cheap');
  });
});

// ============================================================================
// URL Synchronization Test - 1 test
// ============================================================================

describe('useFilters - URL Synchronization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  test('필터 변경 시 URL과 동기화되고 페이지 새로고침 후에도 유지된다', () => {
    // Arrange
    (useSearchParams as jest.Mock).mockReturnValue(createMockSearchParams());
    const { result, rerender } = renderHook(() => useFilters());

    // Act: 필터 업데이트
    act(() => {
      result.current.updateFilters({
        search: 'gangneung',
        regions: ['gangwon'],
      });
    });

    // Assert: URL이 업데이트되었는지 확인
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('search=gangneung'),
      expect.any(Object)
    );
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('regions=gangwon'),
      expect.any(Object)
    );

    // Arrange: 페이지 새로고침 시뮬레이션 (새로운 searchParams)
    (useSearchParams as jest.Mock).mockReturnValue(
      createMockSearchParams({
        search: 'gangneung',
        regions: 'gangwon',
      })
    );

    // Act: 훅 재렌더링
    rerender();

    // Assert: 필터가 유지됨
    expect(result.current.filters.search).toBe('gangneung');
    expect(result.current.filters.regions).toEqual(['gangwon']);
  });
});

// ============================================================================
// Dependency Tracking Test - 1 test
// ============================================================================

describe('useFilters - Dependency Tracking', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  test('useRouter와 useSearchParams가 호출된다', () => {
    // Arrange
    (useSearchParams as jest.Mock).mockReturnValue(createMockSearchParams());

    // Act
    renderHook(() => useFilters());

    // Assert
    expect(useRouter).toHaveBeenCalled();
    expect(useSearchParams).toHaveBeenCalled();
  });
});
