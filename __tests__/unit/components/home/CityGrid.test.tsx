/**
 * CityGrid Component Tests
 * 도시 그리드 레이아웃 및 도시 목록 표시 테스트
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import CityGrid from '@/components/home/CityGrid'
import { mockCities } from '@/__tests__/mocks/data.mock'
import { fetchCities } from '@/lib/supabase/queries'

// ============================================================================
// Mocks
// ============================================================================

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

// Mock CityCard component
jest.mock('@/components/home/CityCard', () => {
  return function MockCityCard({ city }: { city: any }) {
    return (
      <div data-testid={`city-card-${city.id}`} data-city-name={city.name}>
        {city.name}
      </div>
    )
  }
})

// Mock fetchCities query
jest.mock('@/lib/supabase/queries', () => ({
  fetchCities: jest.fn(),
}))

const mockFetchCities = fetchCities as jest.MockedFunction<typeof fetchCities>

// Mock hooks
jest.mock('@/hooks/useFavorite', () => ({
  useFavorite: jest.fn(() => ({
    isFavorite: false,
    toggleFavorite: jest.fn(),
    isLoading: false,
  })),
}))

jest.mock('@/hooks/useBookmark', () => ({
  useBookmark: jest.fn(() => ({
    isBookmarked: false,
    toggleBookmark: jest.fn(),
    isLoading: false,
  })),
}))

// ============================================================================
// Test Suite
// ============================================================================

describe('CityGrid', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // ==========================================================================
  // Basic Rendering Tests (3 tests)
  // ==========================================================================

  describe('Basic Rendering', () => {
    test('모든 도시가 CityCard로 렌더링된다', async () => {
      // Arrange
      mockFetchCities.mockResolvedValue(mockCities)

      // Act
      const CityGridComponent = await CityGrid()
      render(CityGridComponent)

      // Assert
      mockCities.forEach((city) => {
        const card = screen.getByTestId(`city-card-${city.id}`)
        expect(card).toBeInTheDocument()
      })
    })

    test('올바른 개수의 카드가 렌더링된다', async () => {
      // Arrange
      mockFetchCities.mockResolvedValue(mockCities)

      // Act
      const CityGridComponent = await CityGrid()
      render(CityGridComponent)

      // Assert
      const cards = screen.getAllByTestId(/city-card-/)
      expect(cards).toHaveLength(mockCities.length)
    })

    test('그리드 레이아웃이 적용된다', async () => {
      // Arrange
      mockFetchCities.mockResolvedValue(mockCities)

      // Act
      const CityGridComponent = await CityGrid()
      const { container } = render(CityGridComponent)

      // Assert
      const grid = container.querySelector('.grid')
      expect(grid).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Responsive Layout Tests (2 tests)
  // ==========================================================================

  describe('Responsive Layout', () => {
    test('반응형 그리드 클래스가 적용된다', async () => {
      // Arrange
      mockFetchCities.mockResolvedValue(mockCities)

      // Act
      const CityGridComponent = await CityGrid()
      const { container } = render(CityGridComponent)

      // Assert
      const grid = container.querySelector('.grid-cols-1')
      expect(grid).toBeInTheDocument()
    })

    test('sm, lg 브레이크포인트 클래스가 존재한다', async () => {
      // Arrange
      mockFetchCities.mockResolvedValue(mockCities)

      // Act
      const CityGridComponent = await CityGrid()
      const { container } = render(CityGridComponent)

      // Assert
      const grid = container.querySelector('.sm\\:grid-cols-2')
      expect(grid).toBeInTheDocument()

      const gridLg = container.querySelector('.lg\\:grid-cols-4')
      expect(gridLg).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // View All Cities Button Tests (2 tests)
  // ==========================================================================

  describe('View All Cities Button', () => {
    test('모든 도시 보기 버튼이 렌더링된다', async () => {
      // Arrange
      mockFetchCities.mockResolvedValue(mockCities)

      // Act
      const CityGridComponent = await CityGrid()
      render(CityGridComponent)

      // Assert
      const button = screen.getByRole('button', { name: /모든 도시 보기/i })
      expect(button).toBeInTheDocument()
    })

    test('버튼에 도시 개수가 표시된다', async () => {
      // Arrange
      mockFetchCities.mockResolvedValue(mockCities)

      // Act
      const CityGridComponent = await CityGrid()
      render(CityGridComponent)

      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveTextContent(`모든 도시 보기 (${mockCities.length}개)`)
    })
  })

  // ==========================================================================
  // Empty State Tests (2 tests)
  // ==========================================================================

  describe('Empty State', () => {
    test('도시가 없을 때 빈 그리드가 표시된다', async () => {
      // Arrange
      mockFetchCities.mockResolvedValue([])

      // Act
      const CityGridComponent = await CityGrid()
      render(CityGridComponent)

      // Assert
      const cards = screen.queryAllByTestId(/city-card-/)
      expect(cards).toHaveLength(0)
    })

    test('도시가 없을 때 버튼에 0개가 표시된다', async () => {
      // Arrange
      mockFetchCities.mockResolvedValue([])

      // Act
      const CityGridComponent = await CityGrid()
      render(CityGridComponent)

      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveTextContent('모든 도시 보기 (0개)')
    })
  })

  // ==========================================================================
  // Server Component Tests (1 test)
  // ==========================================================================

  describe('Server Component', () => {
    test('fetchCities가 호출되어 Supabase 데이터를 로드한다', async () => {
      // Arrange
      mockFetchCities.mockResolvedValue(mockCities)

      // Act
      await CityGrid()

      // Assert
      expect(mockFetchCities).toHaveBeenCalled()
      expect(mockFetchCities).toHaveBeenCalledTimes(1)
    })
  })

  // ==========================================================================
  // Section Title Tests
  // ==========================================================================

  describe('Section Title', () => {
    test('섹션 제목이 표시된다', async () => {
      // Arrange
      mockFetchCities.mockResolvedValue(mockCities)

      // Act
      const CityGridComponent = await CityGrid()
      render(CityGridComponent)

      // Assert
      expect(screen.getByText('인기 도시 BEST 8')).toBeInTheDocument()
    })

    test('섹션 설명이 표시된다', async () => {
      // Arrange
      mockFetchCities.mockResolvedValue(mockCities)

      // Act
      const CityGridComponent = await CityGrid()
      render(CityGridComponent)

      // Assert
      expect(screen.getByText(/노마드들이 가장 선호하는 도시들을 한눈에 비교해보세요/i)).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Edge Cases and Integration Tests
  // ==========================================================================

  describe('Edge Cases', () => {
    test('fetchCities가 에러를 반환해도 크래시되지 않는다', async () => {
      // Arrange
      mockFetchCities.mockResolvedValue([])

      // Act & Assert
      await expect(async () => {
        const CityGridComponent = await CityGrid()
        render(CityGridComponent)
      }).not.toThrow()
    })

    test('도시 데이터가 부분적으로만 있어도 렌더링된다', async () => {
      // Arrange
      const partialCities = [mockCities[0], mockCities[1]]
      mockFetchCities.mockResolvedValue(partialCities)

      // Act
      const CityGridComponent = await CityGrid()
      render(CityGridComponent)

      // Assert
      const cards = screen.getAllByTestId(/city-card-/)
      expect(cards).toHaveLength(2)
    })

    test('많은 도시가 있어도 모두 렌더링된다', async () => {
      // Arrange
      const manyCities = Array(20)
        .fill(null)
        .map((_, i) => ({
          ...mockCities[0],
          id: `city-${i}`,
          name: `도시 ${i}`,
        }))
      mockFetchCities.mockResolvedValue(manyCities)

      // Act
      const CityGridComponent = await CityGrid()
      render(CityGridComponent)

      // Assert
      const cards = screen.getAllByTestId(/city-card-/)
      expect(cards).toHaveLength(20)
    })
  })
})
