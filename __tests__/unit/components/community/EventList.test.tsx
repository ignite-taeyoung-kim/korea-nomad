/**
 * EventList Component Tests
 * 이벤트 리스트 컴포넌트의 렌더링, 레이아웃, 빈 상태 테스트
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import EventList from '@/components/community/EventList'
import { mockEvents } from '@/__tests__/mocks/data.mock'

// ============================================================================
// Mocks
// ============================================================================

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

// Mock EventCard component
jest.mock('@/components/community/EventCard', () => {
  return function MockEventCard({ event }: { event: any }) {
    return <div data-testid={`event-card-${event.id}`}>{event.title}</div>
  }
})

// ============================================================================
// Test Suite
// ============================================================================

describe('EventList', () => {
  const mockOnToggleParticipation = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  // ==========================================================================
  // Rendering Tests (2 tests)
  // ==========================================================================

  describe('Rendering', () => {
    test('이벤트들이 EventCard로 렌더링된다', () => {
      // Arrange
      const events = mockEvents

      // Act
      render(<EventList events={events} />)

      // Assert
      events.forEach((event) => {
        expect(screen.getByTestId(`event-card-${event.id}`)).toBeInTheDocument()
        expect(screen.getByText(event.title)).toBeInTheDocument()
      })
    })

    test('모든 이벤트가 표시된다', () => {
      // Arrange
      const events = mockEvents

      // Act
      render(<EventList events={events} />)

      // Assert
      const eventCards = screen.getAllByTestId(/event-card-/)
      expect(eventCards).toHaveLength(events.length)
    })
  })

  // ==========================================================================
  // Empty State Tests (2 tests)
  // ==========================================================================

  describe('Empty State', () => {
    test('이벤트가 없으면 "진행 중인 이벤트가 없습니다" 메시지가 표시된다', () => {
      // Arrange
      const events: any[] = []

      // Act
      render(<EventList events={events} />)

      // Assert
      expect(screen.getByText('진행 중인 이벤트가 없습니다.')).toBeInTheDocument()
    })

    test('빈 상태 메시지가 명확하게 표시된다', () => {
      // Arrange
      const events: any[] = []

      // Act
      render(<EventList events={events} />)

      // Assert
      expect(screen.getByText('진행 중인 이벤트가 없습니다.')).toBeInTheDocument()
      expect(
        screen.getByText('곧 더 많은 이벤트가 추가될 예정입니다.')
      ).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Event Layout Tests (2 tests)
  // ==========================================================================

  describe('Event Layout', () => {
    test('올바른 그리드 레이아웃이 적용된다', () => {
      // Arrange
      const events = mockEvents

      // Act
      const { container } = render(<EventList events={events} />)

      // Assert
      const gridContainer = container.querySelector('.grid')
      expect(gridContainer).toBeInTheDocument()
      expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2')
    })

    test('반응형 디자인이 적용된다', () => {
      // Arrange
      const events = mockEvents

      // Act
      const { container } = render(<EventList events={events} />)

      // Assert
      const gridContainer = container.querySelector('.grid')
      expect(gridContainer).toHaveClass('grid-cols-1') // mobile
      expect(gridContainer).toHaveClass('md:grid-cols-2') // desktop
    })
  })

  // ==========================================================================
  // Event Count Tests (2 tests)
  // ==========================================================================

  describe('Event Count', () => {
    test('이벤트 개수가 정확하게 렌더링된다', () => {
      // Arrange
      const events = mockEvents

      // Act
      render(<EventList events={events} />)

      // Assert
      const eventCards = screen.getAllByTestId(/event-card-/)
      expect(eventCards).toHaveLength(mockEvents.length)
    })

    test('필터링 후 개수가 업데이트된다', () => {
      // Arrange
      const filteredEvents = [mockEvents[0]]

      // Act
      const { rerender } = render(<EventList events={mockEvents} />)

      // Initial count
      let eventCards = screen.getAllByTestId(/event-card-/)
      expect(eventCards).toHaveLength(mockEvents.length)

      // Rerender with filtered events
      rerender(<EventList events={filteredEvents} />)

      // Assert
      eventCards = screen.getAllByTestId(/event-card-/)
      expect(eventCards).toHaveLength(1)
    })
  })
})
