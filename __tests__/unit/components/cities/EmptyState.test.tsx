/**
 * EmptyState Component Tests
 * 빈 상태 컴포넌트의 렌더링, 메시지 표시, 초기화 액션 테스트
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import EmptyState from '@/components/cities/EmptyState'

// ============================================================================
// Test Suite
// ============================================================================

describe('EmptyState', () => {
  const mockOnReset = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  // ==========================================================================
  // Rendering Tests (2 tests)
  // ==========================================================================

  describe('Rendering', () => {
    test('빈 상태 메시지가 표시된다', () => {
      // Arrange & Act
      render(<EmptyState onReset={mockOnReset} />)

      // Assert
      expect(screen.getByText('검색 결과가 없습니다')).toBeInTheDocument()
    })

    test('일러스트레이션/아이콘이 표시된다', () => {
      // Arrange & Act
      render(<EmptyState onReset={mockOnReset} />)

      // Assert
      expect(screen.getByText('🔍')).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Message Text Tests (2 tests)
  // ==========================================================================

  describe('Message Text', () => {
    test('"검색 결과가 없습니다" 메시지가 표시된다', () => {
      // Arrange & Act
      render(<EmptyState onReset={mockOnReset} />)

      // Assert
      const heading = screen.getByRole('heading', { name: '검색 결과가 없습니다' })
      expect(heading).toBeInTheDocument()
      expect(heading).toHaveClass('text-xl')
      expect(heading).toHaveClass('font-semibold')
    })

    test('도움말 제안이 표시된다', () => {
      // Arrange & Act
      render(<EmptyState onReset={mockOnReset} />)

      // Assert
      expect(screen.getByText('필터를 조정하고 다시 시도해보세요')).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Reset Action Tests (1 test)
  // ==========================================================================

  describe('Reset Action', () => {
    test('"필터 초기화" 버튼이 작동한다', () => {
      // Arrange
      render(<EmptyState onReset={mockOnReset} />)

      // Act
      const resetButton = screen.getByRole('button', { name: '필터 초기화' })
      fireEvent.click(resetButton)

      // Assert
      expect(mockOnReset).toHaveBeenCalledTimes(1)
    })
  })

  // ==========================================================================
  // Additional Edge Cases
  // ==========================================================================

  describe('Edge Cases', () => {
    test('onReset이 제공되지 않으면 버튼이 표시되지 않는다', () => {
      // Arrange & Act
      render(<EmptyState />)

      // Assert
      expect(screen.queryByRole('button', { name: '필터 초기화' })).not.toBeInTheDocument()
    })

    test('onReset이 null이면 버튼이 표시되지 않는다', () => {
      // Arrange & Act
      render(<EmptyState onReset={undefined} />)

      // Assert
      expect(screen.queryByRole('button', { name: '필터 초기화' })).not.toBeInTheDocument()
    })

    test('빈 상태 컨테이너에 올바른 스타일이 적용된다', () => {
      // Arrange & Act
      const { container } = render(<EmptyState onReset={mockOnReset} />)

      // Assert
      const emptyStateContainer = container.querySelector('.text-center')
      expect(emptyStateContainer).toBeInTheDocument()
      expect(emptyStateContainer).toHaveClass('py-16')
    })

    test('초기화 버튼에 올바른 스타일이 적용된다', () => {
      // Arrange & Act
      render(<EmptyState onReset={mockOnReset} />)

      // Assert
      const resetButton = screen.getByRole('button', { name: '필터 초기화' })
      expect(resetButton).toHaveClass('bg-primary-600')
      expect(resetButton).toHaveClass('text-white')
      expect(resetButton).toHaveClass('rounded-lg')
    })

    test('아이콘이 큰 크기로 표시된다', () => {
      // Arrange & Act
      const { container } = render(<EmptyState onReset={mockOnReset} />)

      // Assert
      const iconElement = container.querySelector('.text-5xl')
      expect(iconElement).toBeInTheDocument()
      expect(iconElement?.textContent).toBe('🔍')
    })

    test('메시지가 계층적 구조로 표시된다', () => {
      // Arrange & Act
      render(<EmptyState onReset={mockOnReset} />)

      // Assert
      const heading = screen.getByRole('heading')
      const description = screen.getByText('필터를 조정하고 다시 시도해보세요')

      expect(heading).toBeInTheDocument()
      expect(description).toBeInTheDocument()
      expect(heading.nextElementSibling).toBe(description)
    })

    test('초기화 버튼을 여러 번 클릭해도 정상 작동한다', () => {
      // Arrange
      render(<EmptyState onReset={mockOnReset} />)
      const resetButton = screen.getByRole('button', { name: '필터 초기화' })

      // Act
      fireEvent.click(resetButton)
      fireEvent.click(resetButton)
      fireEvent.click(resetButton)

      // Assert
      expect(mockOnReset).toHaveBeenCalledTimes(3)
    })
  })
})
