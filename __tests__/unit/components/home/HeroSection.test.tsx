/**
 * HeroSection Component Tests
 * 히어로 섹션 렌더링, 통계, 필터, 검색 기능 테스트
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import HeroSection from '@/components/home/HeroSection'
import { stats, budgetOptions, regions, environmentOptions, seasonOptions } from '@/lib/data'

// ============================================================================
// Mocks
// ============================================================================

// Mock FilterSelect component
jest.mock('@/components/home/FilterSelect', () => {
  return function MockFilterSelect({ label, value, options, onChange, placeholder, icon }: any) {
    return (
      <div data-testid={`filter-${label}`}>
        <span>{icon}</span>
        <span>{placeholder}</span>
        <select
          aria-label={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">{placeholder}</option>
          {options.map((opt: any) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    )
  }
})

// ============================================================================
// Test Suite
// ============================================================================

describe('HeroSection', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // ==========================================================================
  // Basic Rendering Tests (2 tests)
  // ==========================================================================

  describe('Basic Rendering', () => {
    test('타이틀이 표시된다', () => {
      // Arrange & Act
      render(<HeroSection />)

      // Assert
      expect(screen.getByText(/한국에서 노마드 생활하기/i)).toBeInTheDocument()
    })

    test('통계 카드가 4개 표시된다', () => {
      // Arrange & Act
      render(<HeroSection />)

      // Assert
      const statCards = screen.getAllByText(/참여 사용자|분석 도시|평가된 항목|작성된 리뷰/i)
      expect(statCards).toHaveLength(4)
    })
  })

  // ==========================================================================
  // Statistics Cards Tests (4 tests)
  // ==========================================================================

  describe('Statistics Cards', () => {
    test('참여 사용자 수가 표시된다', () => {
      // Arrange & Act
      render(<HeroSection />)

      // Assert
      expect(screen.getByText('참여 사용자')).toBeInTheDocument()
      expect(screen.getByText(stats.total_users.toLocaleString('ko-KR'))).toBeInTheDocument()
    })

    test('분석 도시 수가 표시된다', () => {
      // Arrange & Act
      render(<HeroSection />)

      // Assert
      expect(screen.getByText('분석 도시')).toBeInTheDocument()
      expect(screen.getByText(stats.total_cities.toString())).toBeInTheDocument()
    })

    test('평가된 항목 수가 표시된다', () => {
      // Arrange & Act
      render(<HeroSection />)

      // Assert
      expect(screen.getByText('평가된 항목')).toBeInTheDocument()
      expect(screen.getByText(`${stats.total_items_rated}+`)).toBeInTheDocument()
    })

    test('작성된 리뷰 수가 표시된다', () => {
      // Arrange & Act
      render(<HeroSection />)

      // Assert
      expect(screen.getByText('작성된 리뷰')).toBeInTheDocument()
      expect(screen.getByText(`${stats.total_reviews.toLocaleString('ko-KR')}개`)).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Filter Buttons Tests (4 tests)
  // ==========================================================================

  describe('Filter Buttons', () => {
    test('예산 필터 드롭다운이 표시된다', () => {
      // Arrange & Act
      render(<HeroSection />)

      // Assert
      const budgetFilter = screen.getByTestId('filter-예산')
      expect(budgetFilter).toBeInTheDocument()
      expect(budgetFilter).toHaveTextContent('예산 선택')
    })

    test('지역 필터 드롭다운이 표시된다', () => {
      // Arrange & Act
      render(<HeroSection />)

      // Assert
      const regionFilter = screen.getByTestId('filter-지역')
      expect(regionFilter).toBeInTheDocument()
      expect(regionFilter).toHaveTextContent('지역 선택')
    })

    test('환경 필터 드롭다운이 표시된다', () => {
      // Arrange & Act
      render(<HeroSection />)

      // Assert
      const environmentFilter = screen.getByTestId('filter-환경')
      expect(environmentFilter).toBeInTheDocument()
      expect(environmentFilter).toHaveTextContent('환경 선택')
    })

    test('계절 필터 드롭다운이 표시된다', () => {
      // Arrange & Act
      render(<HeroSection />)

      // Assert
      const seasonFilter = screen.getByTestId('filter-계절')
      expect(seasonFilter).toBeInTheDocument()
      expect(seasonFilter).toHaveTextContent('계절 선택')
    })
  })

  // ==========================================================================
  // Search Bar Tests (1 test)
  // ==========================================================================

  describe('Search Bar', () => {
    test('검색 입력창이 플레이스홀더와 함께 표시된다', () => {
      // Arrange & Act
      render(<HeroSection />)

      // Assert
      const searchInput = screen.getByPlaceholderText('도시 검색...')
      expect(searchInput).toBeInTheDocument()
      expect(searchInput).toHaveAttribute('type', 'text')
    })
  })

  // ==========================================================================
  // Filter Application Tests (1 test)
  // ==========================================================================

  describe('Filter Application', () => {
    test('필터 적용 버튼이 표시된다', () => {
      // Arrange & Act
      render(<HeroSection />)

      // Assert
      const filterButton = screen.getByRole('button', { name: /필터 적용/i })
      expect(filterButton).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Additional Tests for Complete Coverage
  // ==========================================================================

  describe('User Interactions', () => {
    test('검색어를 입력할 수 있다', () => {
      // Arrange
      render(<HeroSection />)
      const searchInput = screen.getByPlaceholderText('도시 검색...') as HTMLInputElement

      // Act
      fireEvent.change(searchInput, { target: { value: '서울' } })

      // Assert
      expect(searchInput.value).toBe('서울')
    })

    test('예산 필터를 선택할 수 있다', () => {
      // Arrange
      render(<HeroSection />)
      const budgetSelect = screen.getByLabelText('예산') as HTMLSelectElement

      // Act
      fireEvent.change(budgetSelect, { target: { value: 'under-1m' } })

      // Assert
      expect(budgetSelect.value).toBe('under-1m')
    })

    test('지역 필터를 선택할 수 있다', () => {
      // Arrange
      render(<HeroSection />)
      const regionSelect = screen.getByLabelText('지역') as HTMLSelectElement

      // Act
      fireEvent.change(regionSelect, { target: { value: 'seoul' } })

      // Assert
      expect(regionSelect.value).toBe('seoul')
    })

    test('환경 필터를 선택할 수 있다', () => {
      // Arrange
      render(<HeroSection />)
      const environmentSelect = screen.getByLabelText('환경') as HTMLSelectElement

      // Act
      fireEvent.change(environmentSelect, { target: { value: 'urban' } })

      // Assert
      expect(environmentSelect.value).toBe('urban')
    })

    test('계절 필터를 선택할 수 있다', () => {
      // Arrange
      render(<HeroSection />)
      const seasonSelect = screen.getByLabelText('계절') as HTMLSelectElement

      // Act
      fireEvent.change(seasonSelect, { target: { value: 'spring' } })

      // Assert
      expect(seasonSelect.value).toBe('spring')
    })
  })

  describe('Search and Filter Actions', () => {
    test('검색 버튼이 표시된다', () => {
      // Arrange & Act
      render(<HeroSection />)

      // Assert
      const searchButton = screen.getByRole('button', { name: /검색/i })
      expect(searchButton).toBeInTheDocument()
    })

    test('팁 메시지가 표시된다', () => {
      // Arrange & Act
      render(<HeroSection />)

      // Assert
      expect(screen.getByText(/도시 카드를 클릭하여 상세 정보를 확인하세요/i)).toBeInTheDocument()
    })
  })

  describe('Layout and Styling', () => {
    test('그라데이션 배경이 적용된다', () => {
      // Arrange & Act
      const { container } = render(<HeroSection />)

      // Assert
      const heroSection = container.querySelector('.bg-gradient-to-br')
      expect(heroSection).toBeInTheDocument()
    })

    test('반응형 그리드가 적용된다', () => {
      // Arrange & Act
      const { container } = render(<HeroSection />)

      // Assert
      const grid = container.querySelector('.grid')
      expect(grid).toBeInTheDocument()
    })
  })

  describe('Icons and Emojis', () => {
    test('통계 카드에 이모지가 표시된다', () => {
      // Arrange & Act
      render(<HeroSection />)

      // Assert
      expect(screen.getByText('💼')).toBeInTheDocument()
      expect(screen.getByText('🏙️')).toBeInTheDocument()
      expect(screen.getByText('⭐️')).toBeInTheDocument()
      expect(screen.getByText('📝')).toBeInTheDocument()
    })

    test('필터 아이콘이 표시된다', () => {
      // Arrange & Act
      render(<HeroSection />)

      // Assert
      const budgetFilter = screen.getByTestId('filter-예산')
      expect(budgetFilter).toHaveTextContent('💰')

      const regionFilter = screen.getByTestId('filter-지역')
      expect(regionFilter).toHaveTextContent('📍')

      const environmentFilter = screen.getByTestId('filter-환경')
      expect(environmentFilter).toHaveTextContent('🌍')

      const seasonFilter = screen.getByTestId('filter-계절')
      expect(seasonFilter).toHaveTextContent('📅')
    })
  })

  describe('Edge Cases', () => {
    test('모든 필터를 동시에 선택할 수 있다', () => {
      // Arrange
      render(<HeroSection />)

      // Act
      const budgetSelect = screen.getByLabelText('예산') as HTMLSelectElement
      const regionSelect = screen.getByLabelText('지역') as HTMLSelectElement
      const environmentSelect = screen.getByLabelText('환경') as HTMLSelectElement
      const seasonSelect = screen.getByLabelText('계절') as HTMLSelectElement

      fireEvent.change(budgetSelect, { target: { value: 'under-1m' } })
      fireEvent.change(regionSelect, { target: { value: 'seoul' } })
      fireEvent.change(environmentSelect, { target: { value: 'urban' } })
      fireEvent.change(seasonSelect, { target: { value: 'spring' } })

      // Assert
      expect(budgetSelect.value).toBe('under-1m')
      expect(regionSelect.value).toBe('seoul')
      expect(environmentSelect.value).toBe('urban')
      expect(seasonSelect.value).toBe('spring')
    })

    test('필터를 선택한 후 다시 초기화할 수 있다', () => {
      // Arrange
      render(<HeroSection />)
      const budgetSelect = screen.getByLabelText('예산') as HTMLSelectElement

      // Act
      fireEvent.change(budgetSelect, { target: { value: 'under-1m' } })
      fireEvent.change(budgetSelect, { target: { value: '' } })

      // Assert
      expect(budgetSelect.value).toBe('')
    })
  })
})
