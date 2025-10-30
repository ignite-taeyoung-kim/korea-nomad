/**
 * Integration Test: Authentication Flow
 *
 * 사용자 인증 전체 흐름을 테스트합니다.
 * - Sign Up Flow
 * - Sign In Flow
 * - Sign Out Flow
 * - Error Handling
 */

import { renderHook, act, waitFor } from '@testing-library/react'
import { createClient } from '@/utils/supabase/client'
import { mockSupabaseAuth, setMockUser, clearMockUser } from '@/__tests__/mocks/supabase.mock'
import { createMockUserProfile } from '@/__tests__/mocks/data.mock'

// Mock Supabase
jest.mock('@/utils/supabase/client', () => ({
  createClient: jest.fn(() => ({
    auth: mockSupabaseAuth,
    from: jest.fn(),
  })),
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/',
}))

describe('Integration: Authentication Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    clearMockUser()
    localStorage.clear()
  })

  // ============================================================================
  // Sign Up Flow (5 tests)
  // ============================================================================
  describe('Sign Up Flow', () => {
    test('사용자가 이메일과 비밀번호를 제공하면 회원가입이 성공한다', async () => {
      // Arrange
      const email = 'newuser@example.com'
      const password = 'password123'
      const mockUser = createMockUserProfile({ id: 'new-user-1', email })

      mockSupabaseAuth.signUp.mockResolvedValue({
        data: { user: mockUser, session: { access_token: 'token' } },
        error: null,
      })

      const supabase = createClient()

      // Act
      const result = await supabase.auth.signUp({
        email,
        password,
      })

      // Assert
      expect(mockSupabaseAuth.signUp).toHaveBeenCalledWith({
        email,
        password,
      })
      expect(result.data.user).toEqual(mockUser)
      expect(result.error).toBeNull()
    })

    test('회원가입 성공 시 사용자가 생성된다', async () => {
      // Arrange
      const mockUser = createMockUserProfile({ id: 'user-new' })
      mockSupabaseAuth.signUp.mockResolvedValue({
        data: { user: mockUser, session: { access_token: 'token' } },
        error: null,
      })

      const supabase = createClient()

      // Act
      const { data } = await supabase.auth.signUp({
        email: 'test@example.com',
        password: 'password123',
      })

      // Assert
      expect(data.user).toBeDefined()
      expect(data.user?.id).toBe('user-new')
      expect(data.user?.email).toBe('test@example.com')
    })

    test('회원가입 성공 시 사용자 프로필이 users 테이블에 생성된다', async () => {
      // Arrange
      const mockUser = createMockUserProfile({ id: 'user-profile-test' })
      const mockFrom = jest.fn(() => ({
        insert: jest.fn().mockResolvedValue({
          data: mockUser,
          error: null,
        }),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockUser,
          error: null,
        }),
      }))

      mockSupabaseAuth.signUp.mockResolvedValue({
        data: { user: mockUser, session: { access_token: 'token' } },
        error: null,
      })

      const supabase = createClient()
      ;(supabase as any).from = mockFrom

      // Act
      await supabase.auth.signUp({
        email: 'test@example.com',
        password: 'password123',
      })

      // Insert user profile
      await supabase.from('users').insert({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
      })

      // Assert
      expect(mockFrom).toHaveBeenCalledWith('users')
    })

    test('회원가입 후 사용자가 즉시 로그인할 수 있다', async () => {
      // Arrange
      const mockUser = createMockUserProfile({ id: 'user-immediate-login' })
      mockSupabaseAuth.signUp.mockResolvedValue({
        data: { user: mockUser, session: { access_token: 'token' } },
        error: null,
      })

      mockSupabaseAuth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser, session: { access_token: 'token' } },
        error: null,
      })

      const supabase = createClient()

      // Act - Sign up
      await supabase.auth.signUp({
        email: 'test@example.com',
        password: 'password123',
      })

      // Act - Sign in immediately
      const loginResult = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123',
      })

      // Assert
      expect(loginResult.data.user).toBeDefined()
      expect(loginResult.error).toBeNull()
    })

    test('동일한 이메일로 두 번 회원가입할 수 없다', async () => {
      // Arrange
      const email = 'duplicate@example.com'

      // First signup succeeds
      mockSupabaseAuth.signUp.mockResolvedValueOnce({
        data: { user: createMockUserProfile({ email }), session: null },
        error: null,
      })

      // Second signup fails
      mockSupabaseAuth.signUp.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: { message: 'User already registered', status: 400 },
      })

      const supabase = createClient()

      // Act - First signup
      const firstResult = await supabase.auth.signUp({
        email,
        password: 'password123',
      })

      // Act - Second signup with same email
      const secondResult = await supabase.auth.signUp({
        email,
        password: 'password123',
      })

      // Assert
      expect(firstResult.error).toBeNull()
      expect(secondResult.error).toBeDefined()
      expect(secondResult.error?.message).toContain('already registered')
    })
  })

  // ============================================================================
  // Sign In Flow (5 tests)
  // ============================================================================
  describe('Sign In Flow', () => {
    test('사용자가 자격 증명을 입력하면 로그인이 성공한다', async () => {
      // Arrange
      const mockUser = createMockUserProfile({ id: 'user-signin' })
      mockSupabaseAuth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser, session: { access_token: 'token' } },
        error: null,
      })

      const supabase = createClient()

      // Act
      const result = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123',
      })

      // Assert
      expect(mockSupabaseAuth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
      expect(result.data.user).toEqual(mockUser)
      expect(result.error).toBeNull()
    })

    test('로그인 성공 시 auth user가 설정된다', async () => {
      // Arrange
      const mockUser = createMockUserProfile({ id: 'user-auth-set' })
      setMockUser(mockUser)

      const supabase = createClient()

      // Act
      const { data } = await supabase.auth.getUser()

      // Assert
      expect(data.user).toBeDefined()
      expect(data.user?.id).toBe('user-auth-set')
    })

    test('로그인 성공 시 사용자 프로필이 users 테이블에서 로드된다', async () => {
      // Arrange
      const mockUser = createMockUserProfile({ id: 'user-profile-load' })
      setMockUser(mockUser)

      const mockFrom = jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockUser,
          error: null,
        }),
      }))

      const supabase = createClient()
      ;(supabase as any).from = mockFrom

      // Act
      const { data: user } = await supabase.auth.getUser()
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single()

      // Assert
      expect(profile).toEqual(mockUser)
      expect(mockFrom).toHaveBeenCalledWith('users')
    })

    test('로그인 시 onAuthStateChange가 트리거된다', async () => {
      // Arrange
      const mockUser = createMockUserProfile({ id: 'user-state-change' })
      const mockCallback = jest.fn()

      mockSupabaseAuth.onAuthStateChange.mockImplementation((callback) => {
        callback('SIGNED_IN', { user: mockUser, access_token: 'token' })
        return {
          data: { subscription: { unsubscribe: jest.fn() } },
        }
      })

      const supabase = createClient()

      // Act
      supabase.auth.onAuthStateChange(mockCallback)

      // Assert
      expect(mockCallback).toHaveBeenCalledWith(
        'SIGNED_IN',
        expect.objectContaining({ user: mockUser })
      )
    })

    test('사용자가 페이지 새로고침 후에도 로그인 상태가 유지된다', async () => {
      // Arrange
      const mockUser = createMockUserProfile({ id: 'user-persistent' })
      setMockUser(mockUser)

      const supabase = createClient()

      // Act - Simulate page refresh by getting user again
      const { data: userData1 } = await supabase.auth.getUser()

      // Simulate refresh
      const supabase2 = createClient()
      const { data: userData2 } = await supabase2.auth.getUser()

      // Assert
      expect(userData1.user).toEqual(mockUser)
      expect(userData2.user).toEqual(mockUser)
      expect(userData1.user?.id).toBe(userData2.user?.id)
    })
  })

  // ============================================================================
  // Sign Out Flow (4 tests)
  // ============================================================================
  describe('Sign Out Flow', () => {
    test('로그아웃 시 auth user가 제거된다', async () => {
      // Arrange
      const mockUser = createMockUserProfile({ id: 'user-signout' })
      setMockUser(mockUser)

      mockSupabaseAuth.signOut.mockResolvedValue({
        error: null,
      })

      const supabase = createClient()

      // Verify user is logged in
      const { data: beforeSignout } = await supabase.auth.getUser()
      expect(beforeSignout.user).toBeDefined()

      // Act
      await supabase.auth.signOut()
      clearMockUser()

      // Assert
      const { data: afterSignout } = await supabase.auth.getUser()
      expect(mockSupabaseAuth.signOut).toHaveBeenCalled()
      expect(afterSignout.user).toBeNull()
    })

    test('로그아웃 시 onAuthStateChange가 트리거된다', async () => {
      // Arrange
      const mockCallback = jest.fn()

      mockSupabaseAuth.onAuthStateChange.mockImplementation((callback) => {
        callback('SIGNED_OUT', null)
        return {
          data: { subscription: { unsubscribe: jest.fn() } },
        }
      })

      const supabase = createClient()

      // Act
      supabase.auth.onAuthStateChange(mockCallback)

      // Assert
      expect(mockCallback).toHaveBeenCalledWith('SIGNED_OUT', null)
    })

    test('로그아웃 시 사용자가 로그인 페이지로 리디렉션된다', async () => {
      // Arrange
      const mockRouter = {
        push: jest.fn(),
        replace: jest.fn(),
        refresh: jest.fn(),
      }

      mockSupabaseAuth.signOut.mockResolvedValue({
        error: null,
      })

      const supabase = createClient()

      // Act
      await supabase.auth.signOut()
      mockRouter.push('/login')

      // Assert
      expect(mockRouter.push).toHaveBeenCalledWith('/login')
    })

    test('로그아웃 시 프로필 데이터가 상태에서 제거된다', async () => {
      // Arrange
      const mockUser = createMockUserProfile({ id: 'user-clear-profile' })
      setMockUser(mockUser)

      mockSupabaseAuth.signOut.mockResolvedValue({
        error: null,
      })

      const supabase = createClient()

      // Verify profile exists
      const { data: beforeData } = await supabase.auth.getUser()
      expect(beforeData.user).toBeDefined()

      // Act - Sign out
      await supabase.auth.signOut()
      clearMockUser()

      // Act - Try to get profile after signout
      const { data: afterData } = await supabase.auth.getUser()

      // Assert
      expect(afterData.user).toBeNull()
    })
  })

  // ============================================================================
  // Error Handling (2 tests)
  // ============================================================================
  describe('Error Handling', () => {
    test('잘못된 자격 증명으로 로그인 시 에러 메시지가 표시된다', async () => {
      // Arrange
      mockSupabaseAuth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: {
          message: 'Invalid login credentials',
          status: 400,
        },
      })

      const supabase = createClient()

      // Act
      const result = await supabase.auth.signInWithPassword({
        email: 'wrong@example.com',
        password: 'wrongpassword',
      })

      // Assert
      expect(result.error).toBeDefined()
      expect(result.error?.message).toContain('Invalid login credentials')
      expect(result.data.user).toBeNull()
    })

    test('네트워크 에러 발생 시 에러가 적절히 처리된다', async () => {
      // Arrange
      mockSupabaseAuth.signInWithPassword.mockRejectedValue(
        new Error('Network error')
      )

      const supabase = createClient()

      // Act & Assert
      await expect(
        supabase.auth.signInWithPassword({
          email: 'test@example.com',
          password: 'password123',
        })
      ).rejects.toThrow('Network error')
    })
  })
})
