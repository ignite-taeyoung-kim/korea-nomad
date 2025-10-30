/**
 * CityActionButtons Component Tests
 * 도시 액션 버튼(좋아요/북마크) 컴포넌트의 렌더링, 상호작용 테스트
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import CityActionButtons from '@/components/cities/CityActionButtons'
import { useFavorite } from '@/hooks/useFavorite'
import { useBookmark } from '@/hooks/useBookmark'

// ============================================================================
// Mocks
// ============================================================================

// Mock useFavorite hook
jest.mock('@/hooks/useFavorite')
const mockUseFavorite = useFavorite as jest.MockedFunction<typeof useFavorite>

// Mock useBookmark hook
jest.mock('@/hooks/useBookmark')
const mockUseBookmark = useBookmark as jest.MockedFunction<typeof useBookmark>

// ============================================================================
// Test Suite
// ============================================================================

describe('CityActionButtons', () => {
  const mockToggleFavorite = jest.fn()
  const mockToggleBookmark = jest.fn()

  beforeEach(() => {
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
  // With Text Tests (4 tests)
  // ==========================================================================

  describe('With Text (showText=true)', () => {
    test('좋아요 버튼이 "좋아요" 텍스트를 표시한다', () => {
      // Arrange & Act
      render(<CityActionButtons cityId="seoul" showText={true} />)

      // Assert
      expect(screen.getByText('좋아요')).toBeInTheDocument()
    })

    test('좋아요 활성화 시 "좋아요 취소" 텍스트를 표시한다', () => {
      // Arrange
      mockUseFavorite.mockReturnValue({
        isFavorite: true,
        toggleFavorite: mockToggleFavorite,
        isLoading: false,
      })

      // Act
      render(<CityActionButtons cityId="seoul" showText={true} />)

      // Assert
      expect(screen.getByText('좋아요 취소')).toBeInTheDocument()
    })

    test('북마크 버튼이 "북마크" 또는 "북마크 취소" 텍스트를 표시한다', () => {
      // Arrange & Act
      render(<CityActionButtons cityId="seoul" showText={true} />)

      // Assert - default state
      expect(screen.getByText('북마크')).toBeInTheDocument()

      // Act - toggle bookmark
      mockUseBookmark.mockReturnValue({
        isBookmarked: true,
        toggleBookmark: mockToggleBookmark,
        isLoading: false,
      })
      render(<CityActionButtons cityId="seoul" showText={true} />)

      // Assert - active state
      expect(screen.getByText('북마크 취소')).toBeInTheDocument()
    })

    test('활성화된 버튼이 색상으로 구분된다', () => {
      // Arrange
      mockUseFavorite.mockReturnValue({
        isFavorite: true,
        toggleFavorite: mockToggleFavorite,
        isLoading: false,
      })
      mockUseBookmark.mockReturnValue({
        isBookmarked: true,
        toggleBookmark: mockToggleBookmark,
        isLoading: false,
      })

      // Act
      const { container } = render(<CityActionButtons cityId="seoul" showText={true} />)

      // Assert
      const buttons = container.querySelectorAll('button')
      expect(buttons[0]).toHaveClass('bg-red-50')
      expect(buttons[0]).toHaveClass('text-red-600')
      expect(buttons[1]).toHaveClass('bg-blue-50')
      expect(buttons[1]).toHaveClass('text-blue-600')
    })
  })

  // ==========================================================================
  // Icon Only Tests (3 tests)
  // ==========================================================================

  describe('Icon Only (showText=false)', () => {
    test('아이콘만 표시되고 텍스트는 표시되지 않는다', () => {
      // Arrange & Act
      render(<CityActionButtons cityId="seoul" showText={false} />)

      // Assert
      expect(screen.queryByText('좋아요')).not.toBeInTheDocument()
      expect(screen.queryByText('북마크')).not.toBeInTheDocument()
    })

    test('좋아요 버튼에 Heart 아이콘이 표시된다', () => {
      // Arrange & Act
      const { container } = render(<CityActionButtons cityId="seoul" showText={false} />)

      // Assert
      const buttons = container.querySelectorAll('button')
      expect(buttons[0]).toHaveAttribute('title', '좋아요')
      // Heart icon is rendered as SVG
      expect(buttons[0].querySelector('svg')).toBeInTheDocument()
    })

    test('북마크 버튼에 Bookmark 아이콘이 표시된다', () => {
      // Arrange & Act
      const { container } = render(<CityActionButtons cityId="seoul" showText={false} />)

      // Assert
      const buttons = container.querySelectorAll('button')
      expect(buttons[1]).toHaveAttribute('title', '북마크')
      // Bookmark icon is rendered as SVG
      expect(buttons[1].querySelector('svg')).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Interactions Tests (2 tests)
  // ==========================================================================

  describe('Interactions', () => {
    test('좋아요 버튼 클릭 시 toggleFavorite가 호출된다', () => {
      // Arrange
      render(<CityActionButtons cityId="seoul" showText={true} />)

      // Act
      const favoriteButton = screen.getByText('좋아요')
      fireEvent.click(favoriteButton)

      // Assert
      expect(mockToggleFavorite).toHaveBeenCalledTimes(1)
    })

    test('북마크 버튼 클릭 시 toggleBookmark가 호출된다', () => {
      // Arrange
      render(<CityActionButtons cityId="seoul" showText={true} />)

      // Act
      const bookmarkButton = screen.getByText('북마크')
      fireEvent.click(bookmarkButton)

      // Assert
      expect(mockToggleBookmark).toHaveBeenCalledTimes(1)
    })
  })

  // ==========================================================================
  // Mobile Responsive Tests (1 test)
  // ==========================================================================

  describe('Mobile Responsive', () => {
    test('작은 화면에서도 버튼이 올바르게 표시된다', () => {
      // Arrange & Act
      const { container } = render(<CityActionButtons cityId="seoul" showText={false} />)

      // Assert
      const buttonsContainer = container.querySelector('.flex.gap-2')
      expect(buttonsContainer).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Additional Edge Cases
  // ==========================================================================

  describe('Edge Cases', () => {
    test('활성화된 좋아요 버튼이 올바른 스타일을 가진다', () => {
      // Arrange
      mockUseFavorite.mockReturnValue({
        isFavorite: true,
        toggleFavorite: mockToggleFavorite,
        isLoading: false,
      })

      // Act
      const { container } = render(<CityActionButtons cityId="seoul" showText={false} />)

      // Assert
      const favoriteButton = container.querySelectorAll('button')[0]
      const heartIcon = favoriteButton.querySelector('svg')
      expect(heartIcon).toHaveClass('fill-red-500')
    })

    test('활성화된 북마크 버튼이 올바른 스타일을 가진다', () => {
      // Arrange
      mockUseBookmark.mockReturnValue({
        isBookmarked: true,
        toggleBookmark: mockToggleBookmark,
        isLoading: false,
      })

      // Act
      const { container } = render(<CityActionButtons cityId="seoul" showText={false} />)

      // Assert
      const bookmarkButton = container.querySelectorAll('button')[1]
      const bookmarkIcon = bookmarkButton.querySelector('svg')
      expect(bookmarkIcon).toHaveClass('fill-blue-500')
    })

    test('기본적으로 showText가 false이다', () => {
      // Arrange & Act
      render(<CityActionButtons cityId="seoul" />)

      // Assert
      expect(screen.queryByText('좋아요')).not.toBeInTheDocument()
      expect(screen.queryByText('북마크')).not.toBeInTheDocument()
    })

    test('다른 도시 ID로 훅이 호출된다', () => {
      // Arrange
      const cityId = 'busan'

      // Act
      render(<CityActionButtons cityId={cityId} showText={true} />)

      // Assert
      expect(mockUseFavorite).toHaveBeenCalledWith(cityId)
      expect(mockUseBookmark).toHaveBeenCalledWith(cityId)
    })

    test('버튼에 호버 스타일이 적용된다', () => {
      // Arrange & Act
      const { container } = render(<CityActionButtons cityId="seoul" showText={true} />)

      // Assert
      const buttons = container.querySelectorAll('button')
      expect(buttons[0]).toHaveClass('transition-colors')
      expect(buttons[1]).toHaveClass('transition-colors')
    })
  })
})
