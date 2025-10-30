/**
 * Unit Tests: lib/userProfile.ts
 * localStorage 기반 사용자 프로필 관리 테스트 (15 tests)
 */

import {
  getProfile,
  saveProfile,
  updateProfileName,
  updateProfileBio,
  updateProfileAvatar,
} from '@/lib/userProfile'
import { UserProfile } from '@/lib/types'
import { createMockUserProfile } from '@/__tests__/mocks/data.mock'

describe('lib/userProfile.ts', () => {
  const STORAGE_KEY = 'nomad_user_profile'

  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  // ==========================================================================
  // getProfile(): 3 tests
  // ==========================================================================
  describe('getProfile', () => {
    test('저장된 프로필을 반환한다', () => {
      // Arrange
      const mockProfile: UserProfile = createMockUserProfile({
        id: 'user-123',
        name: '테스트 유저',
        email: 'test@example.com',
      })
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockProfile))

      // Act
      const result = getProfile()

      // Assert
      expect(result.id).toBe('user-123')
      expect(result.name).toBe('테스트 유저')
      expect(result.email).toBe('test@example.com')
    })

    test('저장된 프로필이 없으면 기본 currentUser를 반환한다', () => {
      // Arrange
      // localStorage is empty

      // Act
      const result = getProfile()

      // Assert
      expect(result).toHaveProperty('id')
      expect(result).toHaveProperty('email')
      expect(result).toHaveProperty('name')
      expect(result).toHaveProperty('created_at')
    })

    test('모든 필드를 포함한 프로필을 반환한다', () => {
      // Arrange
      const mockProfile: UserProfile = createMockUserProfile({
        id: 'user-full',
        email: 'full@example.com',
        name: 'Full User',
        bio: 'Full bio',
        avatar_url: 'https://example.com/avatar.jpg',
      })
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockProfile))

      // Act
      const result = getProfile()

      // Assert
      expect(result.id).toBe('user-full')
      expect(result.email).toBe('full@example.com')
      expect(result.name).toBe('Full User')
      expect(result.bio).toBe('Full bio')
      expect(result.avatar_url).toBe('https://example.com/avatar.jpg')
      expect(result.created_at).toBeDefined()
    })
  })

  // ==========================================================================
  // saveProfile(): 3 tests
  // ==========================================================================
  describe('saveProfile', () => {
    test('완전한 프로필을 저장한다', () => {
      // Arrange
      const profile: UserProfile = createMockUserProfile({
        id: 'user-save',
        email: 'save@example.com',
        name: 'Save User',
        bio: 'This is my bio',
        avatar_url: 'https://example.com/save.jpg',
      })

      // Act
      saveProfile(profile)
      const stored = localStorage.getItem(STORAGE_KEY)

      // Assert
      expect(stored).not.toBeNull()
      const parsed = JSON.parse(stored!)
      expect(parsed.id).toBe('user-save')
      expect(parsed.name).toBe('Save User')
    })

    test('모든 필드를 포함하여 저장한다', () => {
      // Arrange
      const profile: UserProfile = {
        id: 'user-complete',
        email: 'complete@example.com',
        name: 'Complete User',
        bio: 'Complete bio text',
        avatar_url: 'https://example.com/complete.jpg',
        created_at: new Date().toISOString(),
      }

      // Act
      saveProfile(profile)
      const stored = localStorage.getItem(STORAGE_KEY)

      // Assert
      const parsed = JSON.parse(stored!)
      expect(parsed.id).toBe('user-complete')
      expect(parsed.email).toBe('complete@example.com')
      expect(parsed.name).toBe('Complete User')
      expect(parsed.bio).toBe('Complete bio text')
      expect(parsed.avatar_url).toBe('https://example.com/complete.jpg')
      expect(parsed.created_at).toBeDefined()
    })

    test('저장 후 localStorage가 업데이트된다', () => {
      // Arrange
      const profile1: UserProfile = createMockUserProfile({
        id: 'user-1',
        name: 'User One',
      })
      const profile2: UserProfile = createMockUserProfile({
        id: 'user-2',
        name: 'User Two',
      })

      // Act
      saveProfile(profile1)
      const stored1 = localStorage.getItem(STORAGE_KEY)
      saveProfile(profile2)
      const stored2 = localStorage.getItem(STORAGE_KEY)

      // Assert
      const parsed1 = JSON.parse(stored1!)
      const parsed2 = JSON.parse(stored2!)
      expect(parsed1.name).toBe('User One')
      expect(parsed2.name).toBe('User Two')
    })
  })

  // ==========================================================================
  // updateProfileName(): 2 tests
  // ==========================================================================
  describe('updateProfileName', () => {
    test('프로필 이름을 업데이트한다', () => {
      // Arrange
      const profile: UserProfile = createMockUserProfile({
        id: 'user-name',
        name: 'Original Name',
        email: 'name@example.com',
      })
      saveProfile(profile)

      // Act
      updateProfileName('Updated Name')
      const updated = getProfile()

      // Assert
      expect(updated.name).toBe('Updated Name')
      expect(updated.id).toBe('user-name')
      expect(updated.email).toBe('name@example.com')
    })

    test('이름만 변경하고 다른 필드는 유지한다', () => {
      // Arrange
      const profile: UserProfile = createMockUserProfile({
        id: 'user-preserve',
        name: 'Old Name',
        email: 'preserve@example.com',
        bio: 'My bio',
        avatar_url: 'https://example.com/avatar.jpg',
      })
      saveProfile(profile)

      // Act
      updateProfileName('New Name')
      const updated = getProfile()

      // Assert
      expect(updated.name).toBe('New Name')
      expect(updated.email).toBe('preserve@example.com')
      expect(updated.bio).toBe('My bio')
      expect(updated.avatar_url).toBe('https://example.com/avatar.jpg')
    })
  })

  // ==========================================================================
  // updateProfileBio(): 2 tests
  // ==========================================================================
  describe('updateProfileBio', () => {
    test('프로필 bio를 업데이트한다', () => {
      // Arrange
      const profile: UserProfile = createMockUserProfile({
        id: 'user-bio',
        name: 'Bio User',
        bio: 'Original bio',
      })
      saveProfile(profile)

      // Act
      updateProfileBio('Updated bio text')
      const updated = getProfile()

      // Assert
      expect(updated.bio).toBe('Updated bio text')
      expect(updated.name).toBe('Bio User')
    })

    test('bio만 변경하고 다른 필드는 유지한다', () => {
      // Arrange
      const profile: UserProfile = createMockUserProfile({
        id: 'user-bio-preserve',
        name: 'Preserve User',
        email: 'bio@example.com',
        bio: 'Old bio',
        avatar_url: 'https://example.com/old.jpg',
      })
      saveProfile(profile)

      // Act
      updateProfileBio('New bio')
      const updated = getProfile()

      // Assert
      expect(updated.bio).toBe('New bio')
      expect(updated.name).toBe('Preserve User')
      expect(updated.email).toBe('bio@example.com')
      expect(updated.avatar_url).toBe('https://example.com/old.jpg')
    })
  })

  // ==========================================================================
  // updateProfileAvatar(): 2 tests
  // ==========================================================================
  describe('updateProfileAvatar', () => {
    test('프로필 avatar URL을 업데이트한다', () => {
      // Arrange
      const profile: UserProfile = createMockUserProfile({
        id: 'user-avatar',
        name: 'Avatar User',
        avatar_url: 'https://example.com/old-avatar.jpg',
      })
      saveProfile(profile)

      // Act
      updateProfileAvatar('https://example.com/new-avatar.jpg')
      const updated = getProfile()

      // Assert
      expect(updated.avatar_url).toBe('https://example.com/new-avatar.jpg')
      expect(updated.name).toBe('Avatar User')
    })

    test('avatar만 변경하고 다른 필드는 유지한다', () => {
      // Arrange
      const profile: UserProfile = createMockUserProfile({
        id: 'user-avatar-preserve',
        name: 'Preserve Avatar',
        email: 'avatar@example.com',
        bio: 'Avatar bio',
        avatar_url: 'https://example.com/old.jpg',
      })
      saveProfile(profile)

      // Act
      updateProfileAvatar('https://example.com/new.jpg')
      const updated = getProfile()

      // Assert
      expect(updated.avatar_url).toBe('https://example.com/new.jpg')
      expect(updated.name).toBe('Preserve Avatar')
      expect(updated.email).toBe('avatar@example.com')
      expect(updated.bio).toBe('Avatar bio')
    })
  })

  // ==========================================================================
  // localStorage errors: 3 tests
  // ==========================================================================
  describe('localStorage error handling', () => {
    test('localStorage에 손상된 데이터가 있으면 기본 프로필을 반환한다', () => {
      // Arrange
      localStorage.setItem(STORAGE_KEY, 'invalid json data')

      // Act
      const result = getProfile()

      // Assert
      expect(result).toHaveProperty('id')
      expect(result).toHaveProperty('email')
      expect(result).toHaveProperty('name')
    })

    test('localStorage 접근 에러 시 에러를 로그하고 계속 진행한다', () => {
      // Arrange
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      const originalSetItem = localStorage.setItem
      localStorage.setItem = jest.fn(() => {
        throw new Error('localStorage access denied')
      })

      // Act
      const profile: UserProfile = createMockUserProfile({
        id: 'user-error',
        name: 'Error User',
      })
      saveProfile(profile)

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to save profile:',
        expect.any(Error)
      )

      // Cleanup
      localStorage.setItem = originalSetItem
      consoleErrorSpy.mockRestore()
    })

    test('부분 업데이트 시 에러가 발생해도 안전하게 처리한다', () => {
      // Arrange
      const profile: UserProfile = createMockUserProfile({
        id: 'user-partial',
        name: 'Partial User',
      })
      saveProfile(profile)

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      const originalSetItem = localStorage.setItem
      localStorage.setItem = jest.fn(() => {
        throw new Error('Storage error')
      })

      // Act & Assert
      expect(() => updateProfileName('New Name')).not.toThrow()
      expect(() => updateProfileBio('New Bio')).not.toThrow()
      expect(() =>
        updateProfileAvatar('https://example.com/new.jpg')
      ).not.toThrow()

      // Cleanup
      localStorage.setItem = originalSetItem
      consoleErrorSpy.mockRestore()
    })
  })
})
