/**
 * Unit Tests for hooks/useBookmark.ts
 *
 * 총 12개의 테스트 케이스로 Supabase 북마크 관리 훅을 테스트합니다.
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useBookmark, useBookmarksList } from '@/hooks/useBookmark';

// ============================================================================
// Mock Setup
// ============================================================================

const mockGetUser = jest.fn();
const mockSelect = jest.fn();
const mockInsert = jest.fn();
const mockDelete = jest.fn();
const mockEq = jest.fn();

// Setup chainable mock methods for delete().eq().eq()
let deleteCallCount = 0;
const createDeleteChain = () => {
  deleteCallCount++;
  const chain = {
    eq: jest.fn().mockReturnThis(),
  };
  // Make eq() return a promise after the second call
  chain.eq.mockImplementation(function(this: any, column: string, value: any) {
    if (chain.eq.mock.calls.length >= 2) {
      return Promise.resolve({ data: null, error: null });
    }
    return chain;
  });
  mockDelete.mockReturnValue(chain);
  return chain;
};

// Mock Supabase client
jest.mock('@/utils/supabase/client', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: mockGetUser,
    },
    from: jest.fn((table: string) => ({
      select: mockSelect,
      insert: mockInsert,
      delete: () => createDeleteChain(),
    })),
  })),
}));

// Mock Supabase queries
jest.mock('@/lib/supabase/queries', () => ({
  isBookmarked: jest.fn(),
  fetchUserBookmarks: jest.fn(),
}));

import { isBookmarked as mockIsBookmarked, fetchUserBookmarks as mockFetchUserBookmarks } from '@/lib/supabase/queries';

// Mock window.alert
const mockAlert = jest.fn();
global.alert = mockAlert;

// ============================================================================
// useBookmark(cityId) - Initial State Tests - 6 tests
// ============================================================================

describe('useBookmark - Initial State', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('초기 상태가 Supabase에서 로드된다', async () => {
    // Arrange
    const mockUser = { id: 'user-1', email: 'test@example.com' };
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    (mockIsBookmarked as jest.Mock).mockResolvedValue(true);

    // Act
    const { result } = renderHook(() => useBookmark('seoul'));

    // Assert: 초기 로딩 상태
    expect(result.current.isLoading).toBe(true);

    // Wait for async operations
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isBookmarked).toBe(true);
    expect(mockIsBookmarked).toHaveBeenCalledWith('user-1', 'seoul');
  });

  test('isLoading 상태가 관리된다', async () => {
    // Arrange
    const mockUser = { id: 'user-1', email: 'test@example.com' };
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    (mockIsBookmarked as jest.Mock).mockResolvedValue(false);

    // Act
    const { result } = renderHook(() => useBookmark('busan'));

    // Assert: 초기에는 로딩 중
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isBookmarked).toBe(false);
  });

  test('cityId 변경 시 자동으로 재로드된다', async () => {
    // Arrange
    const mockUser = { id: 'user-1', email: 'test@example.com' };
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    (mockIsBookmarked as jest.Mock).mockResolvedValue(true);

    // Act
    const { result, rerender } = renderHook(
      ({ cityId }) => useBookmark(cityId),
      { initialProps: { cityId: 'seoul' } }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockIsBookmarked).toHaveBeenCalledWith('user-1', 'seoul');

    // Change cityId
    (mockIsBookmarked as jest.Mock).mockClear();
    rerender({ cityId: 'busan' });

    // Assert: New query made with new cityId
    await waitFor(() => {
      expect(mockIsBookmarked).toHaveBeenCalledWith('user-1', 'busan');
    });
  });

  test('인증 확인이 수행된다', async () => {
    // Arrange
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

    // Act
    const { result } = renderHook(() => useBookmark('seoul'));

    // Assert
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isBookmarked).toBe(false);
    expect(mockGetUser).toHaveBeenCalled();
    expect(mockIsBookmarked).not.toHaveBeenCalled();
  });

  test('Supabase 쿼리가 검증된다', async () => {
    // Arrange
    const mockUser = { id: 'user-456', email: 'user@example.com' };
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    (mockIsBookmarked as jest.Mock).mockResolvedValue(false);

    // Act
    const { result } = renderHook(() => useBookmark('gangneung'));

    // Assert
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockGetUser).toHaveBeenCalled();
    expect(mockIsBookmarked).toHaveBeenCalledWith('user-456', 'gangneung');
  });

  test('에러 처리가 수행된다', async () => {
    // Arrange
    const mockUser = { id: 'user-1', email: 'test@example.com' };
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    (mockIsBookmarked as jest.Mock).mockRejectedValue(new Error('Database error'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    // Act
    const { result } = renderHook(() => useBookmark('seoul'));

    // Assert
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(consoleSpy).toHaveBeenCalledWith('북마크 상태 확인 오류:', expect.any(Error));

    consoleSpy.mockRestore();
  });
});

// ============================================================================
// toggleBookmark() Tests - 4 tests
// ============================================================================

describe('useBookmark - toggleBookmark()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    deleteCallCount = 0;
    mockInsert.mockImplementation(() => Promise.resolve({ data: null, error: null }));
  });

  test('true ↔ false 토글이 동작한다 (true → Supabase delete 호출)', async () => {
    // Arrange
    const mockUser = { id: 'user-1', email: 'test@example.com' };
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    (mockIsBookmarked as jest.Mock).mockResolvedValue(true);

    const { result } = renderHook(() => useBookmark('seoul'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isBookmarked).toBe(true);

    // Act
    await act(async () => {
      await result.current.toggleBookmark();
    });

    // Assert: Supabase delete chain was created
    expect(deleteCallCount).toBeGreaterThan(0);
  });

  test('true ↔ false 토글이 동작한다 (false → true Supabase insert 호출)', async () => {
    // Arrange
    const mockUser = { id: 'user-1', email: 'test@example.com' };
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    (mockIsBookmarked as jest.Mock).mockResolvedValue(false);

    const { result } = renderHook(() => useBookmark('busan'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isBookmarked).toBe(false);

    // Act
    await act(async () => {
      await result.current.toggleBookmark();
    });

    // Assert: Supabase insert called
    expect(mockInsert).toHaveBeenCalledWith({
      user_id: 'user-1',
      city_id: 'busan',
    });
  });

  test('로그인하지 않은 경우 alert이 표시되고 토글이 방지된다', async () => {
    // Arrange
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });
    (mockIsBookmarked as jest.Mock).mockResolvedValue(false);

    const { result } = renderHook(() => useBookmark('seoul'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Act
    await act(async () => {
      await result.current.toggleBookmark();
    });

    // Assert
    expect(mockAlert).toHaveBeenCalledWith('로그인이 필요합니다');
    expect(mockInsert).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Supabase bookmarks 테이블이 업데이트된다', async () => {
    // Arrange
    const mockUser = { id: 'user-789', email: 'user789@example.com' };
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    (mockIsBookmarked as jest.Mock).mockResolvedValue(false);

    const { result } = renderHook(() => useBookmark('jeonju'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Act: Add to bookmarks
    await act(async () => {
      await result.current.toggleBookmark();
    });

    // Assert: Insert called with correct parameters
    expect(mockInsert).toHaveBeenCalledWith({
      user_id: 'user-789',
      city_id: 'jeonju',
    });
  });
});

// ============================================================================
// useBookmarksList() Tests - 2 tests
// ============================================================================

describe('useBookmarksList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('사용자의 모든 북마크가 조회된다', async () => {
    // Arrange
    const mockUser = { id: 'user-1', email: 'test@example.com' };
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    (mockFetchUserBookmarks as jest.Mock).mockResolvedValue(['seoul', 'busan', 'gangneung', 'daegu']);

    // Act
    const { result } = renderHook(() => useBookmarksList());

    // Assert: 초기 로딩
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.bookmarks).toEqual(['seoul', 'busan', 'gangneung', 'daegu']);
    expect(mockFetchUserBookmarks).toHaveBeenCalledWith('user-1');
  });

  test('빈 배열 처리가 올바르게 동작한다', async () => {
    // Arrange
    const mockUser = { id: 'user-2', email: 'user2@example.com' };
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    (mockFetchUserBookmarks as jest.Mock).mockResolvedValue([]);

    // Act
    const { result } = renderHook(() => useBookmarksList());

    // Assert
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.bookmarks).toEqual([]);
    expect(result.current.bookmarks).toHaveLength(0);
    expect(Array.isArray(result.current.bookmarks)).toBe(true);
  });
});
