/**
 * Unit Tests for hooks/useUserProfile.ts
 *
 * 총 15개의 테스트 케이스로 Supabase 인증 프로필 관리 훅을 테스트합니다.
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { createMockUserProfile } from '@/__tests__/mocks/data.mock';

// ============================================================================
// Mock Setup
// ============================================================================

const mockGetUser = jest.fn();
const mockOnAuthStateChange = jest.fn();
const mockFrom = jest.fn();
const mockUnsubscribe = jest.fn();

const mockSupabaseClient = {
  auth: {
    getUser: mockGetUser,
    onAuthStateChange: mockOnAuthStateChange,
  },
  from: mockFrom,
};

jest.mock('@/utils/supabase/client', () => ({
  createClient: jest.fn(() => mockSupabaseClient),
}));

const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  created_at: new Date('2024-01-01').toISOString(),
};

const mockUserProfile = createMockUserProfile({
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  bio: 'Test bio',
});

// ============================================================================
// Initial Mount Tests - 3 tests
// ============================================================================

describe('useUserProfile - Initial Mount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUnsubscribe.mockClear();
  });

  test('Supabase auth.getUser()가 호출된다', async () => {
    // Arrange
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: mockUserProfile, error: null }),
        }),
      }),
    });
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: mockUnsubscribe } },
    });

    // Act
    renderHook(() => useUserProfile());

    // Assert
    await waitFor(() => {
      expect(mockGetUser).toHaveBeenCalled();
    });
  });

  test('loading이 true에서 false로 전환된다', async () => {
    // Arrange
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: mockUserProfile, error: null }),
        }),
      }),
    });
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: mockUnsubscribe } },
    });

    // Act
    const { result } = renderHook(() => useUserProfile());

    // Assert
    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  test('에러 상태가 처리된다', async () => {
    // Arrange
    const authError = { message: 'Authentication failed' };
    mockGetUser.mockResolvedValue({ data: { user: null }, error: authError });
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: mockUnsubscribe } },
    });

    // Act
    const { result } = renderHook(() => useUserProfile());

    // Assert
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.user).toBe(null);
    expect(result.current.profile).toBe(null);
  });
});

// ============================================================================
// User Authentication Tests - 2 tests
// ============================================================================

describe('useUserProfile - User Authentication', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUnsubscribe.mockClear();
  });

  test('user !== null일 때 isAuthenticated = true', async () => {
    // Arrange
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: mockUserProfile, error: null }),
        }),
      }),
    });
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: mockUnsubscribe } },
    });

    // Act
    const { result } = renderHook(() => useUserProfile());

    // Assert
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
  });

  test('user === null일 때 isAuthenticated = false', async () => {
    // Arrange
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: mockUnsubscribe } },
    });

    // Act
    const { result } = renderHook(() => useUserProfile());

    // Assert
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
  });
});

// ============================================================================
// Profile Query Tests - 3 tests
// ============================================================================

describe('useUserProfile - Profile Query', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUnsubscribe.mockClear();
  });

  test('users 테이블이 user_id로 조회된다', async () => {
    // Arrange
    const mockSelect = jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({ data: mockUserProfile, error: null }),
      }),
    });
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    mockFrom.mockReturnValue({ select: mockSelect });
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: mockUnsubscribe } },
    });

    // Act
    renderHook(() => useUserProfile());

    // Assert
    await waitFor(() => {
      expect(mockFrom).toHaveBeenCalledWith('users');
    });
  });

  test('프로필 객체가 반환된다', async () => {
    // Arrange
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: mockUserProfile, error: null }),
        }),
      }),
    });
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: mockUnsubscribe } },
    });

    // Act
    const { result } = renderHook(() => useUserProfile());

    // Assert
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.profile).toEqual(mockUserProfile);
  });

  test('프로필을 찾을 수 없으면 profile = null', async () => {
    // Arrange
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Profile not found' },
          }),
        }),
      }),
    });
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: mockUnsubscribe } },
    });

    // Act
    const { result } = renderHook(() => useUserProfile());

    // Assert
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.profile).toBe(null);
  });
});

// ============================================================================
// onAuthStateChange Subscription Tests - 3 tests
// ============================================================================

describe('useUserProfile - onAuthStateChange Subscription', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUnsubscribe.mockClear();
  });

  test('로그인 시 프로필이 업데이트된다', async () => {
    // Arrange
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

    const mockAuthStateCallback = jest.fn();
    mockOnAuthStateChange.mockImplementation((callback) => {
      mockAuthStateCallback.mockImplementation(callback);
      return { data: { subscription: { unsubscribe: mockUnsubscribe } } };
    });

    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: mockUserProfile, error: null }),
        }),
      }),
    });

    // Act
    const { result } = renderHook(() => useUserProfile());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Simulate login
    await act(async () => {
      await mockAuthStateCallback('SIGNED_IN', { user: mockUser });
    });

    // Assert
    expect(result.current.user).toEqual(mockUser);
  });

  test('로그아웃 시 profile = null, user = null', async () => {
    // Arrange
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });

    const mockAuthStateCallback = jest.fn();
    mockOnAuthStateChange.mockImplementation((callback) => {
      mockAuthStateCallback.mockImplementation(callback);
      return { data: { subscription: { unsubscribe: mockUnsubscribe } } };
    });

    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: mockUserProfile, error: null }),
        }),
      }),
    });

    // Act
    const { result } = renderHook(() => useUserProfile());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Simulate logout
    await act(async () => {
      await mockAuthStateCallback('SIGNED_OUT', { user: null });
    });

    // Assert
    expect(result.current.user).toBe(null);
    expect(result.current.profile).toBe(null);
  });

  test('언마운트 시 구독이 정리된다', async () => {
    // Arrange
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: mockUserProfile, error: null }),
        }),
      }),
    });
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: mockUnsubscribe } },
    });

    // Act
    const { unmount } = renderHook(() => useUserProfile());

    await waitFor(() => {
      expect(mockOnAuthStateChange).toHaveBeenCalled();
    });

    unmount();

    // Assert
    expect(mockUnsubscribe).toHaveBeenCalled();
  });
});

// ============================================================================
// Error Handling Tests - 2 tests
// ============================================================================

describe('useUserProfile - Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUnsubscribe.mockClear();
  });

  test('Supabase 쿼리 실패 시 에러 상태가 된다', async () => {
    // Arrange
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Database error' },
          }),
        }),
      }),
    });
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: mockUnsubscribe } },
    });

    // Act
    const { result } = renderHook(() => useUserProfile());

    // Assert
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.error).toBe('프로필을 가져올 수 없습니다');
    expect(result.current.profile).toBe(null);
  });

  test('에러 메시지가 정확하다', async () => {
    // Arrange
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockRejectedValue(new Error('Network error')),
        }),
      }),
    });
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: mockUnsubscribe } },
    });

    // Act
    const { result } = renderHook(() => useUserProfile());

    // Assert
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.error).toBe('예상치 못한 오류가 발생했습니다');
  });
});

// ============================================================================
// Cleanup on Remount Tests - 2 tests
// ============================================================================

describe('useUserProfile - Cleanup on Remount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUnsubscribe.mockClear();
  });

  test('이전 구독이 해제된다', async () => {
    // Arrange
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: mockUserProfile, error: null }),
        }),
      }),
    });
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: mockUnsubscribe } },
    });

    // Act
    const { unmount, rerender } = renderHook(() => useUserProfile());

    await waitFor(() => {
      expect(mockOnAuthStateChange).toHaveBeenCalled();
    });

    // First unmount
    unmount();
    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);

    // Remount
    const { unmount: unmount2 } = renderHook(() => useUserProfile());

    await waitFor(() => {
      expect(mockOnAuthStateChange).toHaveBeenCalledTimes(2);
    });

    unmount2();

    // Assert
    expect(mockUnsubscribe).toHaveBeenCalledTimes(2);
  });

  test('중복 구독이 방지된다', async () => {
    // Arrange
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: mockUserProfile, error: null }),
        }),
      }),
    });
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: mockUnsubscribe } },
    });

    // Act
    renderHook(() => useUserProfile());

    await waitFor(() => {
      expect(mockOnAuthStateChange).toHaveBeenCalledTimes(1);
    });

    // Assert: onAuthStateChange는 한 번만 호출되어야 함
    expect(mockOnAuthStateChange).toHaveBeenCalledTimes(1);
  });
});
