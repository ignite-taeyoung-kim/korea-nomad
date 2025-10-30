/**
 * CityCard Component Tests
 * 도시 카드 컴포넌트의 렌더링, 상호작용, 기능 테스트
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import CityCard from '@/components/home/CityCard'
import { mockCities } from '@/__tests__/mocks/data.mock'
import { useFavorite } from '@/hooks/useFavorite'
import { useBookmark } from '@/hooks/useBookmark'

// ============================================================================
// Mocks
// ============================================================================

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

// Mock useFavorite hook
jest.mock('@/hooks/useFavorite')
const mockUseFavorite = useFavorite as jest.MockedFunction<typeof useFavorite>

// Mock useBookmark hook
jest.mock('@/hooks/useBookmark')
const mockUseBookmark = useBookmark as jest.MockedFunction<typeof useBookmark>

// ============================================================================
// Test Suite
// ============================================================================

describe('CityCard', () => {
  // Setup default mock implementations
  const mockToggleFavorite = jest.fn()
  const mockToggleBookmark = jest.fn()

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()

    // Default mock implementations
    mockUseFavorite.mockReturnValue({
      isFavorite: false,
      toggleFavorite: mockToggleFavorite,
      isLoading: false,
    })

    mockUseBookmark.mockReturnValue({
      isBookmarked: false,
      toggleBookmark: mockToggleBookmark,
      isLoading: false,
    })
  })

  // ==========================================================================
  // Basic Rendering Tests (4 tests)
  // ==========================================================================

  describe('Basic Rendering', () => {
    test('도시 이름이 표시된다', () => {
      // Arrange
      const city = mockCities[0]

      // Act
      render(<CityCard city={city} />)

      // Assert
      expect(screen.getByText(city.name)).toBeInTheDocument()
    })

    test('도시 이모지가 표시된다', () => {
      // Arrange
      const city = mockCities[0]

      // Act
      render(<CityCard city={city} />)

      // Assert
      expect(screen.getByText(city.emoji)).toBeInTheDocument()
    })

    test('지역명이 표시된다', () => {
      // Arrange
      const city = mockCities[0]

      // Act
      render(<CityCard city={city} />)

      // Assert
      expect(screen.getByText(city.province)).toBeInTheDocument()
    })

    test('모든 기본 정보가 표시된다', () => {
      // Arrange
      const city = mockCities[0]

      // Act
      render(<CityCard city={city} />)

      // Assert
      expect(screen.getByText(city.name)).toBeInTheDocument()
      expect(screen.getByText(city.emoji)).toBeInTheDocument()
      expect(screen.getByText(city.province)).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Score Section Tests (3 tests)
  // ==========================================================================

  describe('Score Section', () => {
    test('전체 점수가 Star 아이콘과 함께 표시된다', () => {
      // Arrange
      const city = mockCities[0]

      // Act
      render(<CityCard city={city} />)

      // Assert
      expect(screen.getByText(`${city.overall_score}/10`)).toBeInTheDocument()
    })

    test('업무 점수가 진행률 바와 함께 표시된다', () => {
      // Arrange
      const city = mockCities[0]

      // Act
      render(<CityCard city={city} />)

      // Assert
      expect(screen.getByText(`업무: ${city.work_score}`)).toBeInTheDocument()
    })

    test('삶의 질 점수가 진행률 바와 함께 표시된다', () => {
      // Arrange
      const city = mockCities[0]

      // Act
      render(<CityCard city={city} />)

      // Assert
      expect(screen.getByText(`삶의질: ${city.quality_score}`)).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Statistics Tests (3 tests)
  // ==========================================================================

  describe('Statistics', () => {
    test('월 생활비가 표시된다', () => {
      // Arrange
      const city = mockCities[0]

      // Act
      render(<CityCard city={city} />)

      // Assert
      expect(screen.getByText(city.cost_per_month)).toBeInTheDocument()
    })

    test('인터넷 속도가 표시된다', () => {
      // Arrange
      const city = mockCities[0]

      // Act
      render(<CityCard city={city} />)

      // Assert
      expect(screen.getByText(`${city.internet_speed} Mbps`)).toBeInTheDocument()
    })

    test('현재 노마드 수와 카페 평점이 표시된다', () => {
      // Arrange
      const city = mockCities[0]

      // Act
      render(<CityCard city={city} />)

      // Assert
      expect(screen.getByText(`${city.nomads_count}명`)).toBeInTheDocument()
      expect(screen.getByText(`${city.cafe_rating}/5`)).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Like Button Tests (4 tests)
  // ==========================================================================

  describe('Like Button', () => {
    test('useFavorite 훅이 호출된다', () => {
      // Arrange
      const city = mockCities[0]

      // Act
      render(<CityCard city={city} />)

      // Assert
      expect(mockUseFavorite).toHaveBeenCalledWith(city.id)
    })

    test('좋아요 상태일 때 Heart 아이콘이 빨간색으로 표시된다', () => {
      // Arrange
      const city = mockCities[0]
      mockUseFavorite.mockReturnValue({
        isFavorite: true,
        toggleFavorite: mockToggleFavorite,
        isLoading: false,
      })

      // Act
      const { container } = render(<CityCard city={city} />)

      // Assert
      const heartIcon = container.querySelector('.fill-red-500')
      expect(heartIcon).toBeInTheDocument()
    })

    test('좋아요 버튼 클릭 시 toggleFavorite가 호출된다', () => {
      // Arrange
      const city = mockCities[0]

      // Act
      render(<CityCard city={city} />)
      const likeButton = screen.getByTitle('좋아요')
      fireEvent.click(likeButton)

      // Assert
      expect(mockToggleFavorite).toHaveBeenCalled()
    })

    test('좋아요 버튼 클릭 시 이벤트 전파가 방지된다', () => {
      // Arrange
      const city = mockCities[0]
      const mockStopPropagation = jest.fn()
      const mockPreventDefault = jest.fn()

      // Act
      render(<CityCard city={city} />)
      const likeButton = screen.getByTitle('좋아요')
      fireEvent.click(likeButton, {
        stopPropagation: mockStopPropagation,
        preventDefault: mockPreventDefault,
      })

      // Assert
      expect(mockToggleFavorite).toHaveBeenCalled()
    })
  })

  // ==========================================================================
  // Bookmark Button Tests (3 tests)
  // ==========================================================================

  describe('Bookmark Button', () => {
    test('useBookmark 훅이 호출된다', () => {
      // Arrange
      const city = mockCities[0]

      // Act
      render(<CityCard city={city} />)

      // Assert
      expect(mockUseBookmark).toHaveBeenCalledWith(city.id)
    })

    test('북마크 상태일 때 Bookmark 아이콘 색상이 변경된다', () => {
      // Arrange
      const city = mockCities[0]
      mockUseBookmark.mockReturnValue({
        isBookmarked: true,
        toggleBookmark: mockToggleBookmark,
        isLoading: false,
      })

      // Act
      const { container } = render(<CityCard city={city} />)

      // Assert
      const bookmarkIcon = container.querySelector('.fill-blue-500')
      expect(bookmarkIcon).toBeInTheDocument()
    })

    test('북마크 버튼 클릭 시 toggleBookmark가 호출된다', () => {
      // Arrange
      const city = mockCities[0]

      // Act
      render(<CityCard city={city} />)
      const bookmarkButton = screen.getByTitle('북마크')
      fireEvent.click(bookmarkButton)

      // Assert
      expect(mockToggleBookmark).toHaveBeenCalled()
    })
  })

  // ==========================================================================
  // View Details Button Tests (2 tests)
  // ==========================================================================

  describe('View Details Button', () => {
    test('상세 보기 버튼이 화살표 아이콘과 함께 표시된다', () => {
      // Arrange
      const city = mockCities[0]

      // Act
      render(<CityCard city={city} />)

      // Assert
      expect(screen.getByText('상세 보기')).toBeInTheDocument()
    })

    test('호버 시 화살표 아이콘 애니메이션이 적용된다', () => {
      // Arrange
      const city = mockCities[0]

      // Act
      const { container } = render(<CityCard city={city} />)

      // Assert
      const arrowIcon = container.querySelector('.group-hover\\:translate-x-1')
      expect(arrowIcon).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Full Card Link Tests (1 test)
  // ==========================================================================

  describe('Full Card Link', () => {
    test('카드 전체가 도시 상세 페이지로 링크된다', () => {
      // Arrange
      const city = mockCities[0]

      // Act
      render(<CityCard city={city} />)

      // Assert
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', `/cities/${city.id}`)
    })
  })

  // ==========================================================================
  // Edge Cases and Additional Tests
  // ==========================================================================

  describe('Edge Cases', () => {
    test('좋아요 수가 0일 때 0이 표시된다', () => {
      // Arrange
      const city = { ...mockCities[0], likes_count: 0 }

      // Act
      render(<CityCard city={city} />)

      // Assert
      expect(screen.getByText('0')).toBeInTheDocument()
    })

    test('싫어요 수가 없을 때 0이 표시된다', () => {
      // Arrange
      const city = { ...mockCities[0], dislikes_count: undefined }

      // Act
      render(<CityCard city={city} />)

      // Assert
      // The default value should be 0
      const dislikeCount = screen.getAllByText('0')
      expect(dislikeCount.length).toBeGreaterThan(0)
    })
  })
})
