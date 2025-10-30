/**
 * Unit Tests for hooks/useReviews.ts
 *
 * 총 15개의 테스트 케이스로 Supabase 리뷰 조회 훅을 테스트합니다.
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useReviews } from '@/hooks/useReviews';
import { Review } from '@/lib/types';

// ============================================================================
// Mock Setup
// ============================================================================

// Mock Supabase queries
jest.mock('@/lib/supabase/queries', () => ({
  fetchReviewsByCityId: jest.fn(),
}));

import { fetchReviewsByCityId as mockFetchReviewsByCityId } from '@/lib/supabase/queries';

// Mock review data
const mockReviews: Review[] = [
  {
    id: 'review-1',
    user_id: 'user-1',
    city_id: 'seoul',
    title: '좋은 도시',
    content: '서울은 정말 좋은 도시입니다.',
    rating: 5,
    created_at: new Date('2024-10-20').toISOString(),
    username: 'Alice',
  },
  {
    id: 'review-2',
    user_id: 'user-2',
    city_id: 'seoul',
    title: '괜찮아요',
    content: '전반적으로 만족합니다.',
    rating: 4,
    created_at: new Date('2024-10-18').toISOString(),
    username: 'Bob',
  },
  {
    id: 'review-3',
    user_id: 'user-3',
    city_id: 'seoul',
    title: '보통이에요',
    content: '특별한 점은 없습니다.',
    rating: 3,
    created_at: new Date('2024-10-15').toISOString(),
    username: 'Charlie',
  },
];

// ============================================================================
// Initial State Tests - 3 tests
// ============================================================================

describe('useReviews - Initial State', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('cityId가 전달되면 Supabase에서 쿼리한다', async () => {
    // Arrange
    (mockFetchReviewsByCityId as jest.Mock).mockResolvedValue(mockReviews);

    // Act
    const { result } = renderHook(() => useReviews('seoul'));

    // Assert
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockFetchReviewsByCityId).toHaveBeenCalledWith('seoul');
    expect(result.current.reviews).toEqual(mockReviews);
  });

  test('isLoading이 true → false로 변경된다', async () => {
    // Arrange
    (mockFetchReviewsByCityId as jest.Mock).mockResolvedValue(mockReviews);

    // Act
    const { result } = renderHook(() => useReviews('busan'));

    // Assert: 초기 로딩 상태
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isLoading).toBe(false);
  });

  test('초기 에러 상태가 null이다', async () => {
    // Arrange
    (mockFetchReviewsByCityId as jest.Mock).mockResolvedValue(mockReviews);

    // Act
    const { result } = renderHook(() => useReviews('gangneung'));

    // Assert: 에러가 없음
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeNull();
  });
});

// ============================================================================
// Review Data Tests - 3 tests
// ============================================================================

describe('useReviews - Review Data', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('reviews가 Review[] 배열로 반환된다 (최신순 정렬)', async () => {
    // Arrange
    const sortedReviews = [...mockReviews].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    (mockFetchReviewsByCityId as jest.Mock).mockResolvedValue(sortedReviews);

    // Act
    const { result } = renderHook(() => useReviews('seoul'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Assert
    expect(Array.isArray(result.current.reviews)).toBe(true);
    expect(result.current.reviews).toHaveLength(3);
    expect(result.current.reviews[0].id).toBe('review-1'); // 최신순
  });

  test('averageRating이 자동으로 계산된다', async () => {
    // Arrange
    (mockFetchReviewsByCityId as jest.Mock).mockResolvedValue(mockReviews);

    // Act
    const { result } = renderHook(() => useReviews('seoul'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Assert: (5 + 4 + 3) / 3 = 4
    expect(result.current.averageRating).toBe(4);
  });

  test('averageRating 계산이 정확하다 ([3, 4, 5] → 4)', async () => {
    // Arrange
    const testReviews: Review[] = [
      { ...mockReviews[0], rating: 3 },
      { ...mockReviews[1], rating: 4 },
      { ...mockReviews[2], rating: 5 },
    ];
    (mockFetchReviewsByCityId as jest.Mock).mockResolvedValue(testReviews);

    // Act
    const { result } = renderHook(() => useReviews('test-city'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Assert: (3 + 4 + 5) / 3 = 4
    expect(result.current.averageRating).toBe(4);
  });
});

// ============================================================================
// cityId Change Tests - 2 tests
// ============================================================================

describe('useReviews - cityId Change', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('새로운 cityId로 변경 시 재로드된다', async () => {
    // Arrange
    const seoulReviews = mockReviews;
    const busanReviews: Review[] = [
      { ...mockReviews[0], id: 'review-4', city_id: 'busan' },
    ];

    (mockFetchReviewsByCityId as jest.Mock)
      .mockResolvedValueOnce(seoulReviews)
      .mockResolvedValueOnce(busanReviews);

    // Act
    const { result, rerender } = renderHook(
      ({ cityId }) => useReviews(cityId),
      { initialProps: { cityId: 'seoul' } }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.reviews).toHaveLength(3);

    // Change cityId
    rerender({ cityId: 'busan' });

    await waitFor(() => {
      expect(mockFetchReviewsByCityId).toHaveBeenCalledWith('busan');
    });

    await waitFor(() => {
      expect(result.current.reviews).toHaveLength(1);
    });

    expect(result.current.reviews[0].city_id).toBe('busan');
  });

  test('이전 리뷰가 폐기되고 새로운 리뷰로 교체된다', async () => {
    // Arrange
    const oldReviews = mockReviews;
    const newReviews: Review[] = [
      { ...mockReviews[0], id: 'review-new', content: 'New review' },
    ];

    (mockFetchReviewsByCityId as jest.Mock)
      .mockResolvedValueOnce(oldReviews)
      .mockResolvedValueOnce(newReviews);

    // Act
    const { result, rerender } = renderHook(
      ({ cityId }) => useReviews(cityId),
      { initialProps: { cityId: 'seoul' } }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const oldReviewIds = result.current.reviews.map(r => r.id);

    // Change cityId
    rerender({ cityId: 'gangneung' });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const newReviewIds = result.current.reviews.map(r => r.id);

    // Assert: 완전히 다른 리뷰 데이터
    expect(newReviewIds).not.toEqual(oldReviewIds);
    expect(result.current.reviews[0].content).toBe('New review');
  });
});

// ============================================================================
// refetch() Tests - 2 tests
// ============================================================================

describe('useReviews - refetch()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('수동으로 다시 로드할 수 있다', async () => {
    // Arrange
    (mockFetchReviewsByCityId as jest.Mock)
      .mockResolvedValueOnce(mockReviews)
      .mockResolvedValueOnce([...mockReviews, { ...mockReviews[0], id: 'review-new' }]);

    const { result } = renderHook(() => useReviews('seoul'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.reviews).toHaveLength(3);

    // Act: refetch
    await act(async () => {
      await result.current.refetch();
    });

    // Assert
    await waitFor(() => {
      expect(result.current.reviews).toHaveLength(4);
    });

    expect(mockFetchReviewsByCityId).toHaveBeenCalledTimes(2);
  });

  test('refetch 시 isLoading 상태가 변경된다', async () => {
    // Arrange
    (mockFetchReviewsByCityId as jest.Mock).mockResolvedValue(mockReviews);

    const { result } = renderHook(() => useReviews('seoul'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Act: refetch
    act(() => {
      result.current.refetch();
    });

    // Assert: 로딩 상태로 변경
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });
});

// ============================================================================
// sortedByDate/Rating() Tests - 2 tests
// ============================================================================

describe('useReviews - Sorting', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('sortedByDate()가 정렬된 복사본을 반환한다 (원본 변경 없음)', async () => {
    // Arrange
    const unsortedReviews = [mockReviews[2], mockReviews[0], mockReviews[1]];
    (mockFetchReviewsByCityId as jest.Mock).mockResolvedValue(unsortedReviews);

    const { result } = renderHook(() => useReviews('seoul'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Act
    const sorted = result.current.sortedByDate();

    // Assert: 정렬된 복사본 (날짜 문자열 비교)
    expect(new Date(sorted[0].created_at).getTime()).toBeGreaterThan(new Date(sorted[1].created_at).getTime());
    expect(sorted).not.toBe(result.current.reviews); // 다른 배열 참조

    // 원본 불변성 확인
    expect(result.current.reviews).toEqual(unsortedReviews);
  });

  test('정렬 순서가 올바르다 (sortedByRating: 높은 순)', async () => {
    // Arrange
    const unsortedReviews = [
      { ...mockReviews[0], rating: 3 },
      { ...mockReviews[1], rating: 5 },
      { ...mockReviews[2], rating: 4 },
    ];
    (mockFetchReviewsByCityId as jest.Mock).mockResolvedValue(unsortedReviews);

    const { result } = renderHook(() => useReviews('seoul'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Act
    const sortedByRating = result.current.sortedByRating();

    // Assert: 5, 4, 3 순서
    expect(sortedByRating[0].rating).toBe(5);
    expect(sortedByRating[1].rating).toBe(4);
    expect(sortedByRating[2].rating).toBe(3);
  });
});

// ============================================================================
// Error Handling Tests - 2 tests
// ============================================================================

describe('useReviews - Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Supabase 쿼리 실패 시 에러 상태가 설정된다', async () => {
    // Arrange
    (mockFetchReviewsByCityId as jest.Mock).mockRejectedValue(new Error('Network error'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    // Act
    const { result } = renderHook(() => useReviews('seoul'));

    // Assert
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('리뷰를 가져올 수 없습니다');
    expect(consoleSpy).toHaveBeenCalledWith('리뷰 조회 오류:', expect.any(Error));

    consoleSpy.mockRestore();
  });

  test('에러 발생 시 로딩이 중단된다', async () => {
    // Arrange
    (mockFetchReviewsByCityId as jest.Mock).mockRejectedValue(new Error('Fetch failed'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    // Act
    const { result } = renderHook(() => useReviews('busan'));

    // Assert: 로딩 시작
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).not.toBeNull();
    expect(result.current.reviews).toEqual([]);

    consoleSpy.mockRestore();
  });
});

// ============================================================================
// Empty Reviews Test - 1 test
// ============================================================================

describe('useReviews - Empty Reviews', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('리뷰가 없으면 averageRating이 0이다', async () => {
    // Arrange
    (mockFetchReviewsByCityId as jest.Mock).mockResolvedValue([]);

    // Act
    const { result } = renderHook(() => useReviews('new-city'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Assert
    expect(result.current.reviews).toEqual([]);
    expect(result.current.averageRating).toBe(0);
  });
});
