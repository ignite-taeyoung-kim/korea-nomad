/**
 * Unit Tests: lib/eventParticipation.ts
 * localStorage 기반 이벤트 참여 관리 테스트 (15 tests)
 */

import {
  getParticipations,
  isParticipating,
  addParticipation,
  removeParticipation,
  toggleParticipation,
} from '@/lib/eventParticipation'

describe('lib/eventParticipation.ts', () => {
  const STORAGE_KEY = 'nomad_event_participations_user'

  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  // ==========================================================================
  // getParticipations(): 3 tests
  // ==========================================================================
  describe('getParticipations', () => {
    test('참여 중인 이벤트 ID 배열을 반환한다', () => {
      // Arrange
      const eventIds = ['event-1', 'event-2', 'event-3']
      localStorage.setItem(STORAGE_KEY, JSON.stringify(eventIds))

      // Act
      const result = getParticipations()

      // Assert
      expect(result).toEqual(eventIds)
      expect(result.length).toBe(3)
    })

    test('저장된 데이터가 없으면 빈 배열을 반환한다', () => {
      // Arrange
      // localStorage is empty

      // Act
      const result = getParticipations()

      // Assert
      expect(result).toEqual([])
      expect(Array.isArray(result)).toBe(true)
    })

    test('localStorage에 저장된 데이터를 정확히 파싱한다', () => {
      // Arrange
      const eventIds = ['event-a', 'event-b']
      localStorage.setItem(STORAGE_KEY, JSON.stringify(eventIds))

      // Act
      const result = getParticipations()

      // Assert
      expect(result).toEqual(['event-a', 'event-b'])
      expect(result[0]).toBe('event-a')
      expect(result[1]).toBe('event-b')
    })
  })

  // ==========================================================================
  // isParticipating(): 2 tests
  // ==========================================================================
  describe('isParticipating', () => {
    test('참여 중인 이벤트에 대해 true를 반환한다', () => {
      // Arrange
      const eventId = 'event-123'
      localStorage.setItem(STORAGE_KEY, JSON.stringify([eventId, 'event-456']))

      // Act
      const result = isParticipating(eventId)

      // Assert
      expect(result).toBe(true)
    })

    test('참여하지 않은 이벤트에 대해 false를 반환한다', () => {
      // Arrange
      const eventId = 'event-999'
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(['event-123', 'event-456'])
      )

      // Act
      const result = isParticipating(eventId)

      // Assert
      expect(result).toBe(false)
    })
  })

  // ==========================================================================
  // addParticipation(): 3 tests
  // ==========================================================================
  describe('addParticipation', () => {
    test('새로운 이벤트 참여를 추가한다', () => {
      // Arrange
      const eventId = 'event-new'

      // Act
      addParticipation(eventId)
      const result = getParticipations()

      // Assert
      expect(result).toContain(eventId)
      expect(result.length).toBe(1)
    })

    test('중복된 이벤트는 추가하지 않는다', () => {
      // Arrange
      const eventId = 'event-duplicate'
      localStorage.setItem(STORAGE_KEY, JSON.stringify([eventId]))

      // Act
      addParticipation(eventId)
      const result = getParticipations()

      // Assert
      expect(result.length).toBe(1)
      expect(result).toEqual([eventId])
    })

    test('추가된 참여가 localStorage에 저장된다', () => {
      // Arrange
      const eventId = 'event-save'

      // Act
      addParticipation(eventId)
      const stored = localStorage.getItem(STORAGE_KEY)

      // Assert
      expect(stored).not.toBeNull()
      const parsed = JSON.parse(stored!)
      expect(parsed).toContain(eventId)
    })
  })

  // ==========================================================================
  // removeParticipation(): 2 tests
  // ==========================================================================
  describe('removeParticipation', () => {
    test('이벤트 참여를 제거한다', () => {
      // Arrange
      const eventId = 'event-remove'
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([eventId, 'event-keep'])
      )

      // Act
      removeParticipation(eventId)
      const result = getParticipations()

      // Assert
      expect(result).not.toContain(eventId)
      expect(result).toContain('event-keep')
      expect(result.length).toBe(1)
    })

    test('존재하지 않는 이벤트를 제거해도 에러가 발생하지 않는다', () => {
      // Arrange
      const existingEvent = 'event-1'
      const nonExistentEvent = 'event-999'
      localStorage.setItem(STORAGE_KEY, JSON.stringify([existingEvent]))

      // Act & Assert
      expect(() => removeParticipation(nonExistentEvent)).not.toThrow()
      const result = getParticipations()
      expect(result).toEqual([existingEvent])
    })
  })

  // ==========================================================================
  // toggleParticipation(): 3 tests
  // ==========================================================================
  describe('toggleParticipation', () => {
    test('참여하지 않은 이벤트를 토글하면 참여 상태가 되고 true를 반환한다', () => {
      // Arrange
      const eventId = 'event-toggle-on'

      // Act
      const result = toggleParticipation(eventId)

      // Assert
      expect(result).toBe(true)
      expect(isParticipating(eventId)).toBe(true)
    })

    test('참여 중인 이벤트를 토글하면 참여 취소되고 false를 반환한다', () => {
      // Arrange
      const eventId = 'event-toggle-off'
      addParticipation(eventId)

      // Act
      const result = toggleParticipation(eventId)

      // Assert
      expect(result).toBe(false)
      expect(isParticipating(eventId)).toBe(false)
    })

    test('토글을 두 번 호출하면 원래 상태로 돌아온다', () => {
      // Arrange
      const eventId = 'event-double-toggle'

      // Act
      const result1 = toggleParticipation(eventId) // false -> true
      const result2 = toggleParticipation(eventId) // true -> false

      // Assert
      expect(result1).toBe(true)
      expect(result2).toBe(false)
      expect(isParticipating(eventId)).toBe(false)
    })
  })

  // ==========================================================================
  // localStorage errors: 2 tests
  // ==========================================================================
  describe('localStorage error handling', () => {
    test('localStorage에 손상된 데이터가 있으면 빈 배열을 반환한다', () => {
      // Arrange
      localStorage.setItem(STORAGE_KEY, 'invalid json data')

      // Act
      const result = getParticipations()

      // Assert
      expect(result).toEqual([])
      expect(Array.isArray(result)).toBe(true)
    })

    test('localStorage 접근 에러 시 에러를 로그하고 계속 진행한다', () => {
      // Arrange
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      const originalSetItem = localStorage.setItem
      localStorage.setItem = jest.fn(() => {
        throw new Error('localStorage access denied')
      })

      // Act
      addParticipation('event-error')

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to save participation'
      )

      // Cleanup
      localStorage.setItem = originalSetItem
      consoleErrorSpy.mockRestore()
    })
  })
})
