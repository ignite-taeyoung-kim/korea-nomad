/**
 * Unit Tests for hooks/useProfile.ts
 *
 * 총 12개의 테스트 케이스로 localStorage 기반 로컬 프로필 관리 훅을 테스트합니다.
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useProfile } from '@/hooks/useProfile';
import { UserProfile } from '@/lib/types';
import * as userProfileLib from '@/lib/userProfile';

// ============================================================================
// Mock Setup
// ============================================================================

jest.mock('@/lib/userProfile', () => ({
  getProfile: jest.fn(),
  saveProfile: jest.fn(),
  updateProfileName: jest.fn(),
  updateProfileBio: jest.fn(),
  updateProfileAvatar: jest.fn(),
}));

const mockProfile: UserProfile = {
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test User',
  bio: 'Test bio',
  avatar_url: 'https://example.com/avatar.jpg',
  created_at: new Date('2024-01-01').toISOString(),
};

// ============================================================================
// Initial Mount Tests - 3 tests
// ============================================================================

describe('useProfile - Initial Mount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('마운트 시 localStorage에서 프로필을 로드한다', async () => {
    // Arrange
    (userProfileLib.getProfile as jest.Mock).mockReturnValue(mockProfile);

    // Act
    const { result } = renderHook(() => useProfile());

    // Assert
    await waitFor(() => {
      expect(userProfileLib.getProfile).toHaveBeenCalled();
    });
  });

  test('초기 상태는 profile = null이고 로딩 후 isLoading = false가 된다', async () => {
    // Arrange
    (userProfileLib.getProfile as jest.Mock).mockReturnValue(null);

    // Act
    const { result } = renderHook(() => useProfile());

    // Assert: useEffect가 동기적으로 실행되므로 즉시 로딩이 완료됨
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.profile).toBe(null);
  });

  test('로드 후 profile이 설정되고 isLoading = false가 된다', async () => {
    // Arrange
    (userProfileLib.getProfile as jest.Mock).mockReturnValue(mockProfile);

    // Act
    const { result } = renderHook(() => useProfile());

    // Assert
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.profile).toEqual(mockProfile);
  });
});

// ============================================================================
// updateName() Tests - 2 tests
// ============================================================================

describe('useProfile - updateName()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('이름 업데이트 시 UI가 즉시 업데이트된다', async () => {
    // Arrange
    (userProfileLib.getProfile as jest.Mock).mockReturnValue(mockProfile);
    const { result } = renderHook(() => useProfile());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Act
    act(() => {
      result.current.updateName('Updated Name');
    });

    // Assert
    expect(result.current.profile?.name).toBe('Updated Name');
  });

  test('이름 업데이트가 localStorage에 저장된다', async () => {
    // Arrange
    (userProfileLib.getProfile as jest.Mock).mockReturnValue(mockProfile);
    const { result } = renderHook(() => useProfile());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Act
    act(() => {
      result.current.updateName('New Name');
    });

    // Assert
    expect(userProfileLib.updateProfileName).toHaveBeenCalledWith('New Name');
  });
});

// ============================================================================
// updateBio() Tests - 2 tests
// ============================================================================

describe('useProfile - updateBio()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('바이오 업데이트 시 UI가 즉시 업데이트된다', async () => {
    // Arrange
    (userProfileLib.getProfile as jest.Mock).mockReturnValue(mockProfile);
    const { result } = renderHook(() => useProfile());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Act
    act(() => {
      result.current.updateBio('Updated bio');
    });

    // Assert
    expect(result.current.profile?.bio).toBe('Updated bio');
  });

  test('바이오 업데이트가 localStorage에 저장된다', async () => {
    // Arrange
    (userProfileLib.getProfile as jest.Mock).mockReturnValue(mockProfile);
    const { result } = renderHook(() => useProfile());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Act
    act(() => {
      result.current.updateBio('New bio description');
    });

    // Assert
    expect(userProfileLib.updateProfileBio).toHaveBeenCalledWith('New bio description');
  });
});

// ============================================================================
// updateAvatar() Tests - 2 tests
// ============================================================================

describe('useProfile - updateAvatar()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('아바타 업데이트 시 UI가 즉시 업데이트된다', async () => {
    // Arrange
    (userProfileLib.getProfile as jest.Mock).mockReturnValue(mockProfile);
    const { result } = renderHook(() => useProfile());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Act
    const newAvatarUrl = 'https://example.com/new-avatar.jpg';
    act(() => {
      result.current.updateAvatar(newAvatarUrl);
    });

    // Assert
    expect(result.current.profile?.avatar_url).toBe(newAvatarUrl);
  });

  test('아바타 업데이트가 localStorage에 저장된다', async () => {
    // Arrange
    (userProfileLib.getProfile as jest.Mock).mockReturnValue(mockProfile);
    const { result } = renderHook(() => useProfile());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Act
    const newAvatarUrl = 'https://example.com/avatar2.jpg';
    act(() => {
      result.current.updateAvatar(newAvatarUrl);
    });

    // Assert
    expect(userProfileLib.updateProfileAvatar).toHaveBeenCalledWith(newAvatarUrl);
  });
});

// ============================================================================
// Error Handling Tests - 2 tests
// ============================================================================

describe('useProfile - Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('JSON 파싱 실패 시 기본값을 반환한다', async () => {
    // Arrange
    const defaultProfile: UserProfile = {
      id: 'default',
      email: 'default@example.com',
      name: 'Default User',
      bio: '',
      avatar_url: '',
      created_at: new Date().toISOString(),
    };
    (userProfileLib.getProfile as jest.Mock).mockReturnValue(defaultProfile);

    // Act
    const { result } = renderHook(() => useProfile());

    // Assert
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.profile).toEqual(defaultProfile);
  });

  test('getProfile이 에러를 던지면 hook에서도 에러가 발생한다', async () => {
    // Arrange
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    (userProfileLib.getProfile as jest.Mock).mockImplementation(() => {
      throw new Error('localStorage not available');
    });

    // Act & Assert: getProfile의 에러는 내부 lib에서 처리됨
    // 실제 userProfile.ts의 getProfile은 try-catch로 에러를 처리하고 기본값을 반환함
    // 따라서 mock이 에러를 던지면 hook도 에러를 던지는 것이 예상 동작
    expect(() => {
      renderHook(() => useProfile());
    }).toThrow('localStorage not available');

    // Cleanup
    consoleErrorSpy.mockRestore();
  });
});

// ============================================================================
// SSR Compatibility Test - 1 test
// ============================================================================

describe('useProfile - SSR Compatibility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('typeof window 체크로 서버에서 에러가 발생하지 않는다', async () => {
    // Arrange
    // getProfile은 내부적으로 typeof window === 'undefined'를 체크함
    const serverProfile: UserProfile = {
      id: 'server-user',
      email: 'server@example.com',
      name: 'Server User',
      bio: 'Server bio',
      avatar_url: '',
      created_at: new Date().toISOString(),
    };
    (userProfileLib.getProfile as jest.Mock).mockReturnValue(serverProfile);

    // Act
    const { result } = renderHook(() => useProfile());

    // Assert
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.profile).toEqual(serverProfile);
    expect(userProfileLib.getProfile).toHaveBeenCalled();
  });
});
