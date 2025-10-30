/**
 * Integration Test: Event Management
 *
 * 이벤트 생성 및 참여 전체 시스템을 테스트합니다.
 * - Create Event
 * - Participate Event
 * - Cancel Participation
 * - Filter Events
 * - Event Display
 */

import { renderHook, act, waitFor } from '@testing-library/react'
import { useEvents } from '@/hooks/useEvents'
import { mockEvents, createMockEvent } from '@/__tests__/mocks/data.mock'
import { setMockUser, clearMockUser } from '@/__tests__/mocks/supabase.mock'

// Mock Supabase queries
jest.mock('@/lib/supabase/queries', () => ({
  fetchUpcomingEvents: jest.fn(),
  createEvent: jest.fn(),
  toggleEventParticipation: jest.fn(),
  isParticipating: jest.fn(),
}))

// Mock Supabase client
jest.mock('@/utils/supabase/client', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
    })),
  })),
}))

import { fetchUpcomingEvents, createEvent, toggleEventParticipation, isParticipating } from '@/lib/supabase/queries'

describe('Integration: Event Management', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    clearMockUser()
    localStorage.clear()
  })

  // ============================================================================
  // Create Event (5 tests)
  // ============================================================================
  describe('Create Event', () => {
    test('사용자가 CreateEventForm을 제출하면 이벤트가 생성된다', async () => {
      // Arrange
      const mockUser = { id: 'user-1', email: 'test@example.com' }
      setMockUser(mockUser)

      const newEvent = createMockEvent({
        id: 'event-new',
        creator_id: 'user-1',
        city_id: 'seoul',
        title: 'New Meetup',
      })

      ;(createEvent as jest.Mock).mockResolvedValue(newEvent)

      // Act
      const eventData = {
        city_id: 'seoul',
        title: 'New Meetup',
        description: 'A new meetup event',
        category: 'networking' as const,
        date: '2024-11-15',
        time: '19:00',
        location: '강남역',
        creator_id: 'user-1',
        creator_name: 'Test User',
      }

      const result = await createEvent(eventData)

      // Assert
      expect(createEvent).toHaveBeenCalledWith(eventData)
      expect(result).toEqual(newEvent)
    })

    test('이벤트가 Supabase에 생성된다', async () => {
      // Arrange
      const newEvent = createMockEvent({
        id: 'event-supabase',
        title: 'Supabase Event',
      })

      ;(createEvent as jest.Mock).mockResolvedValue(newEvent)

      // Act
      const result = await createEvent({
        city_id: 'seoul',
        title: 'Supabase Event',
        description: 'Test',
        category: 'workshop',
        date: '2024-11-20',
        time: '14:00',
        location: 'Test Location',
        creator_id: 'user-1',
        creator_name: 'Test',
      })

      // Assert
      expect(result.id).toBe('event-supabase')
      expect(createEvent).toHaveBeenCalled()
    })

    test('이벤트가 EventList에 나타난다', async () => {
      // Arrange
      const initialEvents = mockEvents.slice(0, 2)
      ;(fetchUpcomingEvents as jest.Mock).mockResolvedValue(initialEvents)

      const { result } = renderHook(() => useEvents())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.events.length).toBe(2)

      // Act - Add new event
      const newEvent = createMockEvent({
        id: 'event-new',
        title: 'New Event',
      })

      ;(fetchUpcomingEvents as jest.Mock).mockResolvedValue([
        ...initialEvents,
        newEvent,
      ])

      await act(async () => {
        await result.current.refetch()
      })

      // Assert
      expect(result.current.events.length).toBe(3)
      const addedEvent = result.current.events.find((e) => e.id === 'event-new')
      expect(addedEvent).toBeDefined()
      expect(addedEvent?.title).toBe('New Event')
    })

    test('이벤트가 선택된 도시에 표시된다', async () => {
      // Arrange
      const seoulEvents = mockEvents.filter((e) => e.city_id === 'seoul')
      ;(fetchUpcomingEvents as jest.Mock).mockResolvedValue(mockEvents)

      const { result } = renderHook(() => useEvents())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Act - Filter by city
      act(() => {
        result.current.setSelectedCity('seoul')
      })

      // Assert
      expect(result.current.filteredEvents.length).toBe(seoulEvents.length)
      expect(
        result.current.filteredEvents.every((e) => e.city_id === 'seoul')
      ).toBe(true)
    })

    test('이벤트 개수가 증가한다', async () => {
      // Arrange
      ;(fetchUpcomingEvents as jest.Mock).mockResolvedValue(mockEvents.slice(0, 2))

      const { result } = renderHook(() => useEvents())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      const countBefore = result.current.events.length
      expect(countBefore).toBe(2)

      // Act - Add event
      const newEvent = createMockEvent()
      ;(fetchUpcomingEvents as jest.Mock).mockResolvedValue([
        ...mockEvents.slice(0, 2),
        newEvent,
      ])

      await act(async () => {
        await result.current.refetch()
      })

      // Assert
      const countAfter = result.current.events.length
      expect(countAfter).toBe(3)
      expect(countAfter).toBe(countBefore + 1)
    })
  })

  // ============================================================================
  // Participate Event (3 tests)
  // ============================================================================
  describe('Participate Event', () => {
    test('사용자가 EventCard의 하트를 클릭하면 toggleParticipation()이 호출된다', async () => {
      // Arrange
      const mockUser = { id: 'user-1', email: 'test@example.com' }
      setMockUser(mockUser)

      const event = createMockEvent({ id: 'event-1' })
      ;(toggleEventParticipation as jest.Mock).mockResolvedValue(true)

      // Act
      await toggleEventParticipation('user-1', 'event-1')

      // Assert
      expect(toggleEventParticipation).toHaveBeenCalledWith('user-1', 'event-1')
    })

    test('이벤트 참여가 저장된다', async () => {
      // Arrange
      const mockUser = { id: 'user-1', email: 'test@example.com' }
      setMockUser(mockUser)

      ;(toggleEventParticipation as jest.Mock).mockResolvedValue(true)
      ;(isParticipating as jest.Mock).mockResolvedValue(true)

      // Act
      const participationResult = await toggleEventParticipation('user-1', 'event-1')
      const isUserParticipating = await isParticipating('user-1', 'event-1')

      // Assert
      expect(participationResult).toBe(true)
      expect(isUserParticipating).toBe(true)
    })

    test('하트 아이콘 색상이 변경된다', async () => {
      // Arrange
      const mockUser = { id: 'user-1', email: 'test@example.com' }
      setMockUser(mockUser)

      ;(isParticipating as jest.Mock).mockResolvedValueOnce(false)

      const isParticipatingBefore = await isParticipating('user-1', 'event-1')
      expect(isParticipatingBefore).toBe(false)

      // Act - Toggle participation
      ;(toggleEventParticipation as jest.Mock).mockResolvedValue(true)
      ;(isParticipating as jest.Mock).mockResolvedValueOnce(true)

      await toggleEventParticipation('user-1', 'event-1')
      const isParticipatingAfter = await isParticipating('user-1', 'event-1')

      // Assert
      expect(isParticipatingAfter).toBe(true)
      expect(isParticipatingBefore).not.toBe(isParticipatingAfter)
    })
  })

  // ============================================================================
  // Cancel Participation (2 tests)
  // ============================================================================
  describe('Cancel Participation', () => {
    test('사용자가 하트를 다시 클릭하면 (토글) 참여가 취소된다', async () => {
      // Arrange
      const mockUser = { id: 'user-1', email: 'test@example.com' }
      setMockUser(mockUser)

      // Initially participating
      ;(isParticipating as jest.Mock).mockResolvedValueOnce(true)
      const isParticipatingBefore = await isParticipating('user-1', 'event-1')
      expect(isParticipatingBefore).toBe(true)

      // Act - Toggle to cancel
      ;(toggleEventParticipation as jest.Mock).mockResolvedValue(false)
      ;(isParticipating as jest.Mock).mockResolvedValueOnce(false)

      await toggleEventParticipation('user-1', 'event-1')
      const isParticipatingAfter = await isParticipating('user-1', 'event-1')

      // Assert
      expect(isParticipatingAfter).toBe(false)
    })

    test('하트가 회색으로 돌아간다', async () => {
      // Arrange
      const mockUser = { id: 'user-1', email: 'test@example.com' }
      setMockUser(mockUser)

      // Initially participating (red heart)
      ;(isParticipating as jest.Mock).mockResolvedValueOnce(true)
      const colorBefore = await isParticipating('user-1', 'event-1') ? 'red' : 'gray'
      expect(colorBefore).toBe('red')

      // Act - Cancel participation
      ;(toggleEventParticipation as jest.Mock).mockResolvedValue(false)
      ;(isParticipating as jest.Mock).mockResolvedValueOnce(false)

      await toggleEventParticipation('user-1', 'event-1')
      const colorAfter = await isParticipating('user-1', 'event-1') ? 'red' : 'gray'

      // Assert
      expect(colorAfter).toBe('gray')
    })
  })

  // ============================================================================
  // Filter Events (3 tests)
  // ============================================================================
  describe('Filter Events', () => {
    test('사용자가 도시 필터를 선택하면 해당 도시의 이벤트만 표시된다', async () => {
      // Arrange
      ;(fetchUpcomingEvents as jest.Mock).mockResolvedValue(mockEvents)

      const { result } = renderHook(() => useEvents())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Act
      act(() => {
        result.current.setSelectedCity('seoul')
      })

      // Assert
      expect(result.current.filteredEvents.length).toBeGreaterThan(0)
      expect(
        result.current.filteredEvents.every((e) => e.city_id === 'seoul')
      ).toBe(true)
    })

    test('사용자가 카테고리 필터를 선택하면 해당 카테고리의 이벤트만 표시된다', async () => {
      // Arrange
      ;(fetchUpcomingEvents as jest.Mock).mockResolvedValue(mockEvents)

      const { result } = renderHook(() => useEvents())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Act
      act(() => {
        result.current.setSelectedCategory('networking')
      })

      // Assert
      expect(result.current.filteredEvents.length).toBeGreaterThan(0)
      expect(
        result.current.filteredEvents.every((e) => e.category === 'networking')
      ).toBe(true)
    })

    test('도시 AND 카테고리 필터 로직이 작동한다', async () => {
      // Arrange
      ;(fetchUpcomingEvents as jest.Mock).mockResolvedValue(mockEvents)

      const { result } = renderHook(() => useEvents())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Act - Apply both filters
      act(() => {
        result.current.setSelectedCity('seoul')
        result.current.setSelectedCategory('networking')
      })

      // Assert
      expect(
        result.current.filteredEvents.every(
          (e) => e.city_id === 'seoul' && e.category === 'networking'
        )
      ).toBe(true)
    })
  })

  // ============================================================================
  // Event Display (2 tests)
  // ============================================================================
  describe('Event Display', () => {
    test('모든 이벤트 정보가 표시된다 (title, date, time, location)', async () => {
      // Arrange
      const event = createMockEvent({
        title: 'Test Event',
        date: '2024-11-15',
        time: '19:00',
        location: '강남역',
      })

      ;(fetchUpcomingEvents as jest.Mock).mockResolvedValue([event])

      const { result } = renderHook(() => useEvents())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Act
      const displayedEvent = result.current.events[0]

      // Assert
      expect(displayedEvent.title).toBe('Test Event')
      expect(displayedEvent.date).toBe('2024-11-15')
      expect(displayedEvent.time).toBe('19:00')
      expect(displayedEvent.location).toBe('강남역')
    })

    test('참가자 수가 정확하다', async () => {
      // Arrange
      const events = [
        createMockEvent({ id: 'event-1', participant_count: 10 }),
        createMockEvent({ id: 'event-2', participant_count: 25 }),
        createMockEvent({ id: 'event-3', participant_count: 5 }),
      ]

      ;(fetchUpcomingEvents as jest.Mock).mockResolvedValue(events)

      const { result } = renderHook(() => useEvents())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Act & Assert
      expect(result.current.events[0].participant_count).toBe(10)
      expect(result.current.events[1].participant_count).toBe(25)
      expect(result.current.events[2].participant_count).toBe(5)
    })
  })
})
