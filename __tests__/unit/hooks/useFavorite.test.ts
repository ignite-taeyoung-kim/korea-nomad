/**
 * Unit Tests for hooks/useFavorite.ts
 *
 * 총 12개의 테스트 케이스로 Supabase 즐겨찾기 관리 훅을 테스트합니다.
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useFavorite, useFavoritesList } from '@/hooks/useFavorite';

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
  isFavorite: jest.fn(),
  fetchUserFavorites: jest.fn(),
}));

import { isFavorite as mockIsFavorite, fetchUserFavorites as mockFetchUserFavorites } from '@/lib/supabase/queries';

// Mock window.alert
const mockAlert = jest.fn();
global.alert = mockAlert;

// ============================================================================
// useFavorite(cityId) - Initial State Tests - 6 tests
// ============================================================================

describe('useFavorite - Initial State', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('초기 상태에서 isFavorite가 Supabase에서 확인된다', async () => {
    // Arrange
    const mockUser = { id: 'user-1', email: 'test@example.com' };
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    (mockIsFavorite as jest.Mock).mockResolvedValue(true);

    // Act
    const { result } = renderHook(() => useFavorite('seoul'));

    // Assert: 초기 로딩 상태
    expect(result.current.isLoading).toBe(true);

    // Wait for async operations
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isFavorite).toBe(true);
    expect(mockIsFavorite).toHaveBeenCalledWith('user-1', 'seoul');
  });

  test('초기 로딩 후 isLoading이 false가 된다', async () => {
    // Arrange
    const mockUser = { id: 'user-1', email: 'test@example.com' };
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    (mockIsFavorite as jest.Mock).mockResolvedValue(false);

    // Act
    const { result } = renderHook(() => useFavorite('busan'));

    // Assert: 초기에는 로딩 중
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isFavorite).toBe(false);
  });

  test('cityId 변경 시 자동으로 재로드된다', async () => {
    // Arrange
    const mockUser = { id: 'user-1', email: 'test@example.com' };
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    (mockIsFavorite as jest.Mock).mockResolvedValue(true);

    // Act
    const { result, rerender } = renderHook(
      ({ cityId }) => useFavorite(cityId),
      { initialProps: { cityId: 'seoul' } }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockIsFavorite).toHaveBeenCalledWith('user-1', 'seoul');

    // Change cityId
    (mockIsFavorite as jest.Mock).mockClear();
    rerender({ cityId: 'busan' });

    // Assert: New query made with new cityId
    await waitFor(() => {
      expect(mockIsFavorite).toHaveBeenCalledWith('user-1', 'busan');
    });
  });

  test('로그인하지 않은 경우 isFavorite가 false이고 에러가 발생하지 않는다', async () => {
    // Arrange
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

    // Act
    const { result } = renderHook(() => useFavorite('seoul'));

    // Assert
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isFavorite).toBe(false);
    expect(mockIsFavorite).not.toHaveBeenCalled();
  });

  test('Supabase 쿼리가 올바르게 호출된다', async () => {
    // Arrange
    const mockUser = { id: 'user-123', email: 'user@example.com' };
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    (mockIsFavorite as jest.Mock).mockResolvedValue(false);

    // Act
    const { result } = renderHook(() => useFavorite('gangneung'));

    // Assert
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockGetUser).toHaveBeenCalled();
    expect(mockIsFavorite).toHaveBeenCalledWith('user-123', 'gangneung');
  });

  test('에러 발생 시 에러 상태가 처리된다', async () => {
    // Arrange
    const mockUser = { id: 'user-1', email: 'test@example.com' };
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    (mockIsFavorite as jest.Mock).mockRejectedValue(new Error('Network error'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    // Act
    const { result } = renderHook(() => useFavorite('seoul'));

    // Assert
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(consoleSpy).toHaveBeenCalledWith('즐겨찾기 상태 확인 오류:', expect.any(Error));

    consoleSpy.mockRestore();
  });
});

// ============================================================================
// toggleFavorite() Tests - 4 tests
// ============================================================================

describe('useFavorite - toggleFavorite()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    deleteCallCount = 0;
    // Mock insert to return a promise
    mockInsert.mockImplementation(() => Promise.resolve({ data: null, error: null }));
  });

  test('isFavorite가 true일 때 호출하면 Supabase delete가 호출된다', async () => {
    // Arrange
    const mockUser = { id: 'user-1', email: 'test@example.com' };
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    (mockIsFavorite as jest.Mock).mockResolvedValue(true);

    const { result } = renderHook(() => useFavorite('seoul'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isFavorite).toBe(true);

    // Act
    await act(async () => {
      await result.current.toggleFavorite();
    });

    // Assert: Supabase delete chain was created
    expect(deleteCallCount).toBeGreaterThan(0);
  });

  test('isFavorite가 false일 때 호출하면 Supabase insert가 호출된다', async () => {
    // Arrange
    const mockUser = { id: 'user-1', email: 'test@example.com' };
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    (mockIsFavorite as jest.Mock).mockResolvedValue(false);

    const { result } = renderHook(() => useFavorite('busan'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isFavorite).toBe(false);

    // Act
    await act(async () => {
      await result.current.toggleFavorite();
    });

    // Assert: Supabase insert called with correct data
    expect(mockInsert).toHaveBeenCalledWith({
      user_id: 'user-1',
      city_id: 'busan',
    });
  });

  test('로그인하지 않은 경우 alert이 표시된다', async () => {
    // Arrange
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });
    (mockIsFavorite as jest.Mock).mockResolvedValue(false);

    const { result } = renderHook(() => useFavorite('seoul'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Act
    await act(async () => {
      await result.current.toggleFavorite();
    });

    // Assert
    expect(mockAlert).toHaveBeenCalledWith('로그인이 필요합니다');
    expect(mockInsert).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Supabase favorites 테이블이 올바르게 업데이트된다 (insert)', async () => {
    // Arrange
    const mockUser = { id: 'user-123', email: 'user@example.com' };
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    (mockIsFavorite as jest.Mock).mockResolvedValue(false);

    const { result } = renderHook(() => useFavorite('jeonju'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Act: Add to favorites
    await act(async () => {
      await result.current.toggleFavorite();
    });

    // Assert: Insert called with correct parameters
    expect(mockInsert).toHaveBeenCalledWith({
      user_id: 'user-123',
      city_id: 'jeonju',
    });
  });
});

// ============================================================================
// useFavoritesList() Tests - 2 tests
// ============================================================================

describe('useFavoritesList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('사용자의 모든 즐겨찾기가 조회된다', async () => {
    // Arrange
    const mockUser = { id: 'user-1', email: 'test@example.com' };
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    (mockFetchUserFavorites as jest.Mock).mockResolvedValue(['seoul', 'busan', 'gangneung']);

    // Act
    const { result } = renderHook(() => useFavoritesList());

    // Assert: 초기 로딩
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.favorites).toEqual(['seoul', 'busan', 'gangneung']);
    expect(mockFetchUserFavorites).toHaveBeenCalledWith('user-1');
  });

  test('즐겨찾기가 없으면 빈 배열을 반환한다', async () => {
    // Arrange
    const mockUser = { id: 'user-2', email: 'user2@example.com' };
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    (mockFetchUserFavorites as jest.Mock).mockResolvedValue([]);

    // Act
    const { result } = renderHook(() => useFavoritesList());

    // Assert
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.favorites).toEqual([]);
    expect(result.current.favorites).toHaveLength(0);
  });
});
