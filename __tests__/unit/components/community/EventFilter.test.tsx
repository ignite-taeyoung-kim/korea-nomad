/**
 * EventFilter Component Tests
 * 이벤트 필터 컴포넌트의 렌더링, 필터링 기능 테스트
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import EventFilter from '@/components/community/EventFilter'
import { mockCities } from '@/__tests__/mocks/data.mock'
import { Event } from '@/lib/types'

// ============================================================================
// Test Suite
// ============================================================================

describe('EventFilter', () => {
  const mockOnCityChange = jest.fn()
  const mockOnCategoryChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  // ==========================================================================
  // City Filter Tests (2 tests)
  // ==========================================================================

  describe('City Filter', () => {
    test('도시 선택 드롭다운이 표시된다', () => {
      // Arrange & Act
      render(
        <EventFilter
          cities={mockCities}
          onCityChange={mockOnCityChange}
          onCategoryChange={mockOnCategoryChange}
        />
      )

      // Assert
      expect(screen.getByText('도시별 필터')).toBeInTheDocument()
      expect(screen.getByText('모든 도시')).toBeInTheDocument()
      expect(screen.getByText(/서울/)).toBeInTheDocument()
      expect(screen.getByText(/강릉/)).toBeInTheDocument()
    })

    test('도시 선택 시 onCityChange가 호출된다', () => {
      // Arrange
      const { container } = render(
        <EventFilter
          cities={mockCities}
          onCityChange={mockOnCityChange}
          onCategoryChange={mockOnCategoryChange}
        />
      )

      // Act
      const citySelect = container.querySelector('select') as HTMLSelectElement
      fireEvent.change(citySelect, { target: { value: 'seoul' } })

      // Assert
      expect(mockOnCityChange).toHaveBeenCalledWith('seoul')
    })
  })

  // ==========================================================================
  // Category Filter Tests (2 tests)
  // ==========================================================================

  describe('Category Filter', () => {
    test('카테고리 선택 드롭다운이 표시된다', () => {
      // Arrange & Act
      render(
        <EventFilter
          cities={mockCities}
          onCityChange={mockOnCityChange}
          onCategoryChange={mockOnCategoryChange}
        />
      )

      // Assert
      expect(screen.getByText('카테고리별 필터')).toBeInTheDocument()
      expect(screen.getByText('모든 카테고리')).toBeInTheDocument()
      expect(screen.getByText('네트워킹')).toBeInTheDocument()
      expect(screen.getByText('워크숍')).toBeInTheDocument()
      expect(screen.getByText('사교')).toBeInTheDocument()
      expect(screen.getByText('스포츠')).toBeInTheDocument()
      expect(screen.getByText('문화')).toBeInTheDocument()
    })

    test('카테고리 선택 시 onCategoryChange가 호출된다', () => {
      // Arrange
      const { container } = render(
        <EventFilter
          cities={mockCities}
          onCityChange={mockOnCityChange}
          onCategoryChange={mockOnCategoryChange}
        />
      )

      // Act
      const selects = container.querySelectorAll('select')
      const categorySelect = selects[1] // Second select is category
      fireEvent.change(categorySelect, { target: { value: 'networking' } })

      // Assert
      expect(mockOnCategoryChange).toHaveBeenCalledWith('networking')
    })
  })

  // ==========================================================================
  // Both Filters Tests (2 tests)
  // ==========================================================================

  describe('Both Filters', () => {
    test('도시와 카테고리 필터를 동시에 적용할 수 있다', () => {
      // Arrange
      const { container } = render(
        <EventFilter
          cities={mockCities}
          selectedCity="seoul"
          selectedCategory="networking"
          onCityChange={mockOnCityChange}
          onCategoryChange={mockOnCategoryChange}
        />
      )

      // Act
      const selects = container.querySelectorAll('select')
      const citySelect = selects[0] as HTMLSelectElement
      const categorySelect = selects[1] as HTMLSelectElement

      // Assert
      expect(citySelect.value).toBe('seoul')
      expect(categorySelect.value).toBe('networking')
    })

    test('두 필터가 AND 로직으로 작동한다', () => {
      // Arrange
      const { container, rerender } = render(
        <EventFilter
          cities={mockCities}
          onCityChange={mockOnCityChange}
          onCategoryChange={mockOnCategoryChange}
        />
      )

      // Act - Apply city filter
      const selects = container.querySelectorAll('select')
      const citySelect = selects[0]
      fireEvent.change(citySelect, { target: { value: 'seoul' } })

      // Assert
      expect(mockOnCityChange).toHaveBeenCalledWith('seoul')

      // Act - Apply category filter
      rerender(
        <EventFilter
          cities={mockCities}
          selectedCity="seoul"
          onCityChange={mockOnCityChange}
          onCategoryChange={mockOnCategoryChange}
        />
      )

      const updatedSelects = container.querySelectorAll('select')
      const categorySelect = updatedSelects[1]
      fireEvent.change(categorySelect, { target: { value: 'networking' } })

      // Assert
      expect(mockOnCategoryChange).toHaveBeenCalledWith('networking')
    })
  })

  // ==========================================================================
  // Clear Filters Tests (2 tests)
  // ==========================================================================

  describe('Clear Filters', () => {
    test('빈 값 선택 시 필터가 초기화된다 (도시)', () => {
      // Arrange
      const { container } = render(
        <EventFilter
          cities={mockCities}
          selectedCity="seoul"
          onCityChange={mockOnCityChange}
          onCategoryChange={mockOnCategoryChange}
        />
      )

      // Act
      const citySelect = container.querySelector('select') as HTMLSelectElement
      fireEvent.change(citySelect, { target: { value: '' } })

      // Assert
      expect(mockOnCityChange).toHaveBeenCalledWith('')
    })

    test('빈 값 선택 시 필터가 초기화된다 (카테고리)', () => {
      // Arrange
      const { container } = render(
        <EventFilter
          cities={mockCities}
          selectedCategory="networking"
          onCityChange={mockOnCityChange}
          onCategoryChange={mockOnCategoryChange}
        />
      )

      // Act
      const selects = container.querySelectorAll('select')
      const categorySelect = selects[1]
      fireEvent.change(categorySelect, { target: { value: '' } })

      // Assert
      expect(mockOnCategoryChange).toHaveBeenCalledWith(null)
    })
  })
})
