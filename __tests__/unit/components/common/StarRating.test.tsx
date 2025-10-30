/**
 * StarRating Component Tests
 * 별점 컴포넌트의 렌더링, 상호작용, 기능 테스트
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import StarRating from '@/components/common/StarRating'

// ============================================================================
// Test Suite
// ============================================================================

describe('StarRating', () => {
  // ==========================================================================
  // Basic Rendering Tests (2 tests)
  // ==========================================================================

  describe('Basic Rendering', () => {
    test('5개의 별이 렌더링된다', () => {
      // Arrange & Act
      const { container } = render(<StarRating rating={0} />)

      // Assert
      const stars = container.querySelectorAll('button')
      expect(stars).toHaveLength(5)
    })

    test('별들이 올바른 순서로 배치된다', () => {
      // Arrange & Act
      const { container } = render(<StarRating rating={3} />)

      // Assert
      const stars = container.querySelectorAll('button')
      expect(stars[0]).toBeInTheDocument()
      expect(stars[1]).toBeInTheDocument()
      expect(stars[2]).toBeInTheDocument()
      expect(stars[3]).toBeInTheDocument()
      expect(stars[4]).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Rating Display Tests (3 tests)
  // ==========================================================================

  describe('Rating Display', () => {
    test('rating=1일 때 1개의 노란 별과 4개의 회색 별이 표시된다', () => {
      // Arrange & Act
      const { container } = render(<StarRating rating={1} />)

      // Assert
      const yellowStars = container.querySelectorAll('.fill-yellow-500')
      const grayStars = container.querySelectorAll('.text-gray-300')
      expect(yellowStars).toHaveLength(1)
      expect(grayStars).toHaveLength(4)
    })

    test('rating=3일 때 3개의 노란 별과 2개의 회색 별이 표시된다', () => {
      // Arrange & Act
      const { container } = render(<StarRating rating={3} />)

      // Assert
      const yellowStars = container.querySelectorAll('.fill-yellow-500')
      const grayStars = container.querySelectorAll('.text-gray-300')
      expect(yellowStars).toHaveLength(3)
      expect(grayStars).toHaveLength(2)
    })

    test('rating=5일 때 모든 별이 노란색으로 표시된다', () => {
      // Arrange & Act
      const { container } = render(<StarRating rating={5} />)

      // Assert
      const yellowStars = container.querySelectorAll('.fill-yellow-500')
      const grayStars = container.querySelectorAll('.text-gray-300')
      expect(yellowStars).toHaveLength(5)
      expect(grayStars).toHaveLength(0)
    })
  })

  // ==========================================================================
  // Interactive Mode Tests (4 tests)
  // ==========================================================================

  describe('Interactive Mode (readOnly=false)', () => {
    test('각 별이 클릭 가능하다', () => {
      // Arrange
      const mockOnChange = jest.fn()

      // Act
      const { container } = render(
        <StarRating rating={0} onChange={mockOnChange} readOnly={false} />
      )

      // Assert
      const stars = container.querySelectorAll('button')
      stars.forEach((star) => {
        expect(star).not.toBeDisabled()
      })
    })

    test('별 클릭 시 올바른 rating이 설정된다', () => {
      // Arrange
      const mockOnChange = jest.fn()
      const { container } = render(
        <StarRating rating={0} onChange={mockOnChange} readOnly={false} />
      )

      // Act
      const stars = container.querySelectorAll('button')
      fireEvent.click(stars[2]) // Click 3rd star (rating=3)

      // Assert
      expect(mockOnChange).toHaveBeenCalledWith(3)
    })

    test('별 클릭 시 onChange 콜백이 호출된다', () => {
      // Arrange
      const mockOnChange = jest.fn()
      const { container } = render(
        <StarRating rating={0} onChange={mockOnChange} readOnly={false} />
      )

      // Act
      const stars = container.querySelectorAll('button')
      fireEvent.click(stars[0])

      // Assert
      expect(mockOnChange).toHaveBeenCalledTimes(1)
    })

    test('UI가 즉시 업데이트된다', () => {
      // Arrange
      const mockOnChange = jest.fn()
      const { container, rerender } = render(
        <StarRating rating={0} onChange={mockOnChange} readOnly={false} />
      )

      // Act
      const stars = container.querySelectorAll('button')
      fireEvent.click(stars[3]) // Click 4th star (rating=4)

      // Simulate parent updating rating
      rerender(<StarRating rating={4} onChange={mockOnChange} readOnly={false} />)

      // Assert
      const yellowStars = container.querySelectorAll('.fill-yellow-500')
      expect(yellowStars).toHaveLength(4)
    })
  })

  // ==========================================================================
  // Read-only Mode Tests (2 tests)
  // ==========================================================================

  describe('Read-only Mode (readOnly=true)', () => {
    test('별이 클릭 불가능하다', () => {
      // Arrange
      const mockOnChange = jest.fn()

      // Act
      const { container } = render(
        <StarRating rating={3} onChange={mockOnChange} readOnly={true} />
      )

      // Assert
      const stars = container.querySelectorAll('button')
      stars.forEach((star) => {
        expect(star).toBeDisabled()
      })
    })

    test('커서가 default로 표시된다', () => {
      // Arrange & Act
      const { container } = render(<StarRating rating={3} readOnly={true} />)

      // Assert
      const stars = container.querySelectorAll('button')
      stars.forEach((star) => {
        expect(star).toHaveClass('cursor-default')
      })
    })
  })

  // ==========================================================================
  // Custom Size Tests (1 test)
  // ==========================================================================

  describe('Custom Size', () => {
    test('size prop이 아이콘 크기를 변경한다', () => {
      // Arrange & Act
      const { container } = render(<StarRating rating={3} size={24} />)

      // Assert
      const svgElements = container.querySelectorAll('svg')
      svgElements.forEach((svg) => {
        expect(svg).toHaveAttribute('width', '24')
        expect(svg).toHaveAttribute('height', '24')
      })
    })
  })
})
