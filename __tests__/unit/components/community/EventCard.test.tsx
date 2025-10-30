/**
 * EventCard Component Tests
 * 이벤트 카드 컴포넌트의 렌더링, 상호작용, 기능 테스트
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import EventCard from '@/components/community/EventCard'
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

// ============================================================================
// Test Suite
// ============================================================================

describe('EventCard', () => {
  // ==========================================================================
  // Basic Rendering Tests (4 tests)
  // ==========================================================================

  describe('Basic Rendering', () => {
    test('이벤트 제목이 Link로 표시된다', () => {
      // Arrange
      const event = mockEvents[0]

      // Act
      render(<EventCard event={event} />)

      // Assert
      const titleLink = screen.getByText(event.title)
      expect(titleLink).toBeInTheDocument()
      expect(titleLink.closest('a')).toHaveAttribute(
        'href',
        `/community/events/${event.id}`
      )
    })

    test('카테고리 배지가 표시된다', () => {
      // Arrange
      const event = mockEvents[0] // networking category

      // Act
      render(<EventCard event={event} />)

      // Assert
      expect(screen.getByText('네트워킹')).toBeInTheDocument()
    })

    test('생성자 이름이 표시된다', () => {
      // Arrange
      const event = mockEvents[0]

      // Act
      render(<EventCard event={event} />)

      // Assert
      expect(screen.getByText(event.creator_name)).toBeInTheDocument()
    })

    test('설명이 line-clamp-2로 표시된다', () => {
      // Arrange
      const event = mockEvents[0]

      // Act
      const { container } = render(<EventCard event={event} />)

      // Assert
      const description = screen.getByText(event.description)
      expect(description).toBeInTheDocument()
      expect(description).toHaveClass('line-clamp-2')
    })
  })

  // ==========================================================================
  // Category Colors Tests (3 tests)
  // ==========================================================================

  describe('Category Colors', () => {
    test('networking 카테고리는 파란색으로 표시된다', () => {
      // Arrange
      const event = { ...mockEvents[0], category: 'networking' as const }

      // Act
      const { container } = render(<EventCard event={event} />)

      // Assert
      const badge = screen.getByText('네트워킹')
      expect(badge).toHaveClass('bg-blue-100', 'text-blue-700')
    })

    test('workshop 카테고리는 보라색으로 표시된다', () => {
      // Arrange
      const event = { ...mockEvents[1], category: 'workshop' as const }

      // Act
      render(<EventCard event={event} />)

      // Assert
      const badge = screen.getByText('워크숍')
      expect(badge).toHaveClass('bg-purple-100', 'text-purple-700')
    })

    test('social 카테고리는 초록색으로 표시된다', () => {
      // Arrange
      const event = { ...mockEvents[2], category: 'social' as const }

      // Act
      render(<EventCard event={event} />)

      // Assert
      const badge = screen.getByText('사교')
      expect(badge).toHaveClass('bg-green-100', 'text-green-700')
    })
  })

  // ==========================================================================
  // Info Section Tests (2 tests)
  // ==========================================================================

  describe('Info Section', () => {
    test('날짜와 시간이 Clock 아이콘과 함께 표시된다', () => {
      // Arrange
      const event = mockEvents[0]

      // Act
      const { container } = render(<EventCard event={event} />)

      // Assert
      expect(screen.getByText(new RegExp(event.time))).toBeInTheDocument()
      const clockIcon = container.querySelector('svg')
      expect(clockIcon).toBeInTheDocument()
    })

    test('장소가 MapPin 아이콘과 함께 표시되고 참가자 수가 User 아이콘과 표시된다', () => {
      // Arrange
      const event = mockEvents[0]

      // Act
      const { container } = render(<EventCard event={event} />)

      // Assert
      expect(screen.getByText(event.location)).toBeInTheDocument()
      expect(screen.getByText(`${event.participant_count}명 참가`)).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Participation Button Tests (2 tests)
  // ==========================================================================

  describe('Participation Button', () => {
    test('참가하지 않은 상태에서 Heart 아이콘이 회색으로 표시된다', () => {
      // Arrange
      const event = mockEvents[0]
      const mockToggle = jest.fn()

      // Act
      const { container } = render(
        <EventCard event={event} isParticipating={false} onToggleParticipation={mockToggle} />
      )

      // Assert
      const button = screen.getByTitle('참가')
      expect(button).toBeInTheDocument()
      const heartIcon = button.querySelector('svg')
      expect(heartIcon).toHaveClass('text-gray-300')
    })

    test('참가 버튼 클릭 시 onToggleParticipation이 호출되고 색상이 빨간색으로 변경된다', () => {
      // Arrange
      const event = mockEvents[0]
      const mockToggle = jest.fn()

      // Act
      const { rerender } = render(
        <EventCard event={event} isParticipating={false} onToggleParticipation={mockToggle} />
      )

      const button = screen.getByTitle('참가')
      fireEvent.click(button)

      // Assert
      expect(mockToggle).toHaveBeenCalled()

      // Simulate state change by re-rendering with isParticipating=true
      rerender(
        <EventCard event={event} isParticipating={true} onToggleParticipation={mockToggle} />
      )

      const updatedButton = screen.getByTitle('참가 취소')
      const heartIcon = updatedButton.querySelector('svg')
      expect(heartIcon).toHaveClass('fill-red-500', 'text-red-500')
    })
  })
})
