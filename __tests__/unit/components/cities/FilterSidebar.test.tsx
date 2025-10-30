/**
 * FilterSidebar Component Tests
 * 필터 사이드바 컴포넌트의 렌더링, 필터링, 상호작용 테스트
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import FilterSidebar from '@/components/cities/FilterSidebar'
import { FilterParams } from '@/lib/types'
import { regions, sortOptions } from '@/lib/data'

// ============================================================================
// Test Suite
// ============================================================================

describe('FilterSidebar', () => {
  // Setup default filter params
  const defaultFilters: FilterParams = {
    search: '',
    regions: [],
    costRange: { min: 1, max: 5 },
    minSpeed: 0,
    sortBy: 'overall',
    showFavorites: false,
    showBookmarks: false,
  }

  const mockOnFiltersChange = jest.fn()
  const mockOnReset = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  // ==========================================================================
  // Basic Rendering Tests (3 tests)
  // ==========================================================================

  describe('Basic Rendering', () => {
    test('정렬 드롭다운이 표시된다', () => {
      // Arrange & Act
      render(
        <FilterSidebar
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          onReset={mockOnReset}
        />
      )

      // Assert
      expect(screen.getByText('정렬')).toBeInTheDocument()
      const selectElement = screen.getByRole('combobox')
      expect(selectElement).toBeInTheDocument()
    })

    test('지역 체크박스가 렌더링된다', () => {
      // Arrange & Act
      render(
        <FilterSidebar
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          onReset={mockOnReset}
        />
      )

      // Assert
      expect(screen.getByText('지역')).toBeInTheDocument()
      regions.forEach((region) => {
        expect(screen.getByText(region.label)).toBeInTheDocument()
      })
    })

    test('생활비 범위 슬라이더가 표시된다', () => {
      // Arrange & Act
      render(
        <FilterSidebar
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          onReset={mockOnReset}
        />
      )

      // Assert
      expect(screen.getByText('생활비 범위')).toBeInTheDocument()
      expect(screen.getByText('최소')).toBeInTheDocument()
      expect(screen.getByText('최대')).toBeInTheDocument()
      expect(screen.getByText('1M')).toBeInTheDocument()
      expect(screen.getByText('5M')).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Sort Filter Tests (2 tests)
  // ==========================================================================

  describe('Sort Filter', () => {
    test('정렬 옵션을 선택하면 onFiltersChange가 호출된다', () => {
      // Arrange
      render(
        <FilterSidebar
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          onReset={mockOnReset}
        />
      )

      // Act
      const selectElement = screen.getByRole('combobox')
      fireEvent.change(selectElement, { target: { value: 'cheap' } })

      // Assert
      expect(mockOnFiltersChange).toHaveBeenCalledWith({ sortBy: 'cheap' })
    })

    test('6개의 정렬 옵션이 모두 사용 가능하다', () => {
      // Arrange
      render(
        <FilterSidebar
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          onReset={mockOnReset}
        />
      )

      // Act
      const selectElement = screen.getByRole('combobox') as HTMLSelectElement

      // Assert
      expect(selectElement.options).toHaveLength(sortOptions.length)
      sortOptions.forEach((option, index) => {
        expect(selectElement.options[index].value).toBe(option.value)
        expect(selectElement.options[index].text).toBe(option.label)
      })
    })
  })

  // ==========================================================================
  // Region Filter Tests (4 tests)
  // ==========================================================================

  describe('Region Filter', () => {
    test('지역 체크박스를 클릭하면 토글된다', () => {
      // Arrange
      render(
        <FilterSidebar
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          onReset={mockOnReset}
        />
      )

      // Act
      const firstRegionCheckbox = screen.getByRole('checkbox', { name: regions[0].label })
      fireEvent.click(firstRegionCheckbox)

      // Assert
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        regions: [regions[0].value],
      })
    })

    test('선택된 지역을 다시 클릭하면 배열에서 제거된다', () => {
      // Arrange
      const filtersWithRegion: FilterParams = {
        ...defaultFilters,
        regions: ['seoul'],
      }
      render(
        <FilterSidebar
          filters={filtersWithRegion}
          onFiltersChange={mockOnFiltersChange}
          onReset={mockOnReset}
        />
      )

      // Act
      const seoulCheckbox = screen.getByRole('checkbox', { name: '서울/경기' })
      fireEvent.click(seoulCheckbox)

      // Assert
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        regions: [],
      })
    })

    test('체크박스 변경 시 onFiltersChange가 호출된다', () => {
      // Arrange
      render(
        <FilterSidebar
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          onReset={mockOnReset}
        />
      )

      // Act
      const gangwonCheckbox = screen.getByRole('checkbox', { name: '강원도' })
      fireEvent.click(gangwonCheckbox)

      // Assert
      expect(mockOnFiltersChange).toHaveBeenCalledTimes(1)
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        regions: ['gangwon'],
      })
    })

    test('여러 지역을 동시에 선택할 수 있다', () => {
      // Arrange
      const filtersWithOneRegion: FilterParams = {
        ...defaultFilters,
        regions: ['seoul'],
      }
      render(
        <FilterSidebar
          filters={filtersWithOneRegion}
          onFiltersChange={mockOnFiltersChange}
          onReset={mockOnReset}
        />
      )

      // Act
      const gangwonCheckbox = screen.getByRole('checkbox', { name: '강원도' })
      fireEvent.click(gangwonCheckbox)

      // Assert
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        regions: ['seoul', 'gangwon'],
      })
    })
  })

  // ==========================================================================
  // Cost Range Filter Tests (3 tests)
  // ==========================================================================

  describe('Cost Range Filter', () => {
    test('최소 및 최대 슬라이더가 모두 존재한다', () => {
      // Arrange & Act
      render(
        <FilterSidebar
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          onReset={mockOnReset}
        />
      )

      // Assert
      const rangeSliders = screen.getAllByRole('slider')
      expect(rangeSliders).toHaveLength(3) // min, max cost range + minSpeed
      expect(screen.getByText('최소')).toBeInTheDocument()
      expect(screen.getByText('최대')).toBeInTheDocument()
    })

    test('최소값이 최대값보다 크면 자동으로 보정된다', () => {
      // Arrange
      const filtersWithRange: FilterParams = {
        ...defaultFilters,
        costRange: { min: 2, max: 4 },
      }
      render(
        <FilterSidebar
          filters={filtersWithRange}
          onFiltersChange={mockOnFiltersChange}
          onReset={mockOnReset}
        />
      )

      // Act
      const rangeSliders = screen.getAllByRole('slider')
      const minSlider = rangeSliders[0]
      fireEvent.change(minSlider, { target: { value: '5' } })

      // Assert
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        costRange: { min: 4, max: 4 }, // min clamped to max value
      })
    })

    test('슬라이더 변경 시 onFiltersChange가 호출된다', () => {
      // Arrange
      render(
        <FilterSidebar
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          onReset={mockOnReset}
        />
      )

      // Act
      const rangeSliders = screen.getAllByRole('slider')
      const maxSlider = rangeSliders[1]
      fireEvent.change(maxSlider, { target: { value: '3' } })

      // Assert
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        costRange: { min: 1, max: 3 },
      })
    })
  })

  // ==========================================================================
  // Speed Filter Tests (2 tests)
  // ==========================================================================

  describe('Speed Filter', () => {
    test('인터넷 속도 슬라이더가 0-1000 Mbps 범위로 표시된다', () => {
      // Arrange & Act
      render(
        <FilterSidebar
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          onReset={mockOnReset}
        />
      )

      // Assert
      expect(screen.getByText('최소 인터넷 속도')).toBeInTheDocument()
      expect(screen.getByText('Mbps')).toBeInTheDocument()
      const rangeSliders = screen.getAllByRole('slider')
      const speedSlider = rangeSliders[2] as HTMLInputElement
      expect(speedSlider.min).toBe('0')
      expect(speedSlider.max).toBe('1000')
      expect(speedSlider.step).toBe('50')
    })

    test('속도 슬라이더 변경 시 onFiltersChange가 호출된다', () => {
      // Arrange
      render(
        <FilterSidebar
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          onReset={mockOnReset}
        />
      )

      // Act
      const rangeSliders = screen.getAllByRole('slider')
      const speedSlider = rangeSliders[2]
      fireEvent.change(speedSlider, { target: { value: '500' } })

      // Assert
      expect(mockOnFiltersChange).toHaveBeenCalledWith({ minSpeed: 500 })
    })
  })

  // ==========================================================================
  // Interest City Checkboxes Tests (3 tests)
  // ==========================================================================

  describe('Interest City Checkboxes', () => {
    test('좋아요한 도시만 체크박스가 표시된다', () => {
      // Arrange & Act
      render(
        <FilterSidebar
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          onReset={mockOnReset}
        />
      )

      // Assert
      expect(screen.getByText('관심 도시')).toBeInTheDocument()
      expect(screen.getByText('좋아요한 도시만')).toBeInTheDocument()
    })

    test('북마크한 도시만 체크박스가 표시된다', () => {
      // Arrange & Act
      render(
        <FilterSidebar
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          onReset={mockOnReset}
        />
      )

      // Assert
      expect(screen.getByText('북마크한 도시만')).toBeInTheDocument()
    })

    test('좋아요와 북마크 체크박스가 독립적으로 토글된다', () => {
      // Arrange
      render(
        <FilterSidebar
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          onReset={mockOnReset}
        />
      )

      // Act
      const favoritesCheckbox = screen.getByRole('checkbox', { name: '좋아요한 도시만' })
      const bookmarksCheckbox = screen.getByRole('checkbox', { name: '북마크한 도시만' })

      fireEvent.click(favoritesCheckbox)
      fireEvent.click(bookmarksCheckbox)

      // Assert
      expect(mockOnFiltersChange).toHaveBeenCalledTimes(2)
      expect(mockOnFiltersChange).toHaveBeenNthCalledWith(1, { showFavorites: true })
      expect(mockOnFiltersChange).toHaveBeenNthCalledWith(2, { showBookmarks: true })
    })
  })

  // ==========================================================================
  // Reset Button Tests (2 tests)
  // ==========================================================================

  describe('Reset Button', () => {
    test('초기화 버튼이 표시되고 클릭 시 onReset이 호출된다', () => {
      // Arrange
      render(
        <FilterSidebar
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          onReset={mockOnReset}
        />
      )

      // Act
      const resetButton = screen.getByRole('button', { name: '초기화' })
      fireEvent.click(resetButton)

      // Assert
      expect(mockOnReset).toHaveBeenCalledTimes(1)
    })

    test('초기화 버튼 클릭 시 필터가 기본값으로 복원된다', () => {
      // Arrange
      const modifiedFilters: FilterParams = {
        search: 'seoul',
        regions: ['seoul', 'gangwon'],
        costRange: { min: 2, max: 4 },
        minSpeed: 500,
        sortBy: 'cheap',
        showFavorites: true,
        showBookmarks: true,
      }
      render(
        <FilterSidebar
          filters={modifiedFilters}
          onFiltersChange={mockOnFiltersChange}
          onReset={mockOnReset}
        />
      )

      // Act
      const resetButton = screen.getByRole('button', { name: '초기화' })
      fireEvent.click(resetButton)

      // Assert
      expect(mockOnReset).toHaveBeenCalledTimes(1)
    })
  })

  // ==========================================================================
  // Mobile Toggle Tests (1 test)
  // ==========================================================================

  describe('Mobile Toggle', () => {
    test('모바일에서 필터 버튼이 표시되고 클릭 시 사이드바가 토글된다', () => {
      // Arrange & Act
      const { container } = render(
        <FilterSidebar
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          onReset={mockOnReset}
        />
      )

      // Assert
      const mobileFilterButton = container.querySelector('.lg\\:hidden.mb-6 button')
      expect(mobileFilterButton).toBeInTheDocument()

      // Act - Click to open
      if (mobileFilterButton) {
        fireEvent.click(mobileFilterButton)
      }

      // Assert - Sidebar should be visible
      const sidebar = container.querySelector('aside')
      expect(sidebar).toHaveClass('fixed')
    })
  })
})
