/**
 * ReviewCard Component Tests
 * 리뷰 카드 컴포넌트의 렌더링, 날짜 포맷팅, 메뉴 상호작용 테스트
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ReviewCard from '@/components/reviews/ReviewCard'
import { mockReviews } from '@/__tests__/mocks/data.mock'
import { Review } from '@/lib/types'

// ============================================================================
// Mocks
// ============================================================================

// Mock StarRating component
jest.mock('@/components/common/StarRating', () => {
  return function MockStarRating({
    rating,
    readOnly,
  }: {
    rating: number
    readOnly?: boolean
  }) {
    return (
      <div data-testid="star-rating" data-readonly={readOnly}>
        Rating: {rating}
      </div>
    )
  }
})

// ============================================================================
// Test Suite
// ============================================================================

describe('ReviewCard', () => {
  const mockReview: Review = {
    id: 'review-1',
    user_id: 'user-1',
    city_id: 'seoul',
    username: '테스트유저',
    title: '좋은 도시입니다',
    content: '서울은 정말 살기 좋은 도시입니다. 인터넷도 빠르고 카페도 많아요.',
    rating: 5,
    created_at: new Date().toISOString().split('T')[0],
  }

  const defaultProps = {
    review: mockReview,
    currentUserId: null,
    onEdit: jest.fn(),
    onDelete: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  // ==========================================================================
  // Basic Rendering Tests (3 tests)
  // ==========================================================================

  describe('Basic Rendering', () => {
    test('사용자명이 표시된다', () => {
      // Arrange & Act
      render(<ReviewCard {...defaultProps} />)

      // Assert
      expect(screen.getByText(mockReview.username)).toBeInTheDocument()
    })

    test('리뷰 날짜가 표시된다', () => {
      // Arrange & Act
      render(<ReviewCard {...defaultProps} />)

      // Assert
      expect(screen.getByText('오늘')).toBeInTheDocument()
    })

    test('별점이 표시된다', () => {
      // Arrange & Act
      render(<ReviewCard {...defaultProps} />)

      // Assert
      const starRating = screen.getByTestId('star-rating')
      expect(starRating).toBeInTheDocument()
      expect(starRating).toHaveTextContent('Rating: 5')
    })
  })

  // ==========================================================================
  // Author Badge Tests (2 tests)
  // ==========================================================================

  describe('Author Badge', () => {
    test('본인 작성 리뷰일 때 "본인" 배지가 표시된다', () => {
      // Arrange & Act
      render(<ReviewCard {...defaultProps} currentUserId="user-1" />)

      // Assert
      expect(screen.getByText('본인')).toBeInTheDocument()
    })

    test('본인 작성 리뷰가 아닐 때 배지가 숨겨진다', () => {
      // Arrange & Act
      render(<ReviewCard {...defaultProps} currentUserId="user-2" />)

      // Assert
      expect(screen.queryByText('본인')).not.toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Date Formatting Tests (3 tests)
  // ==========================================================================

  describe('Date Formatting', () => {
    test('오늘 작성된 리뷰는 "오늘"로 표시된다', () => {
      // Arrange
      const todayReview = {
        ...mockReview,
        created_at: new Date().toISOString().split('T')[0],
      }

      // Act
      render(<ReviewCard {...defaultProps} review={todayReview} />)

      // Assert
      expect(screen.getByText('오늘')).toBeInTheDocument()
    })

    test('어제 작성된 리뷰는 "어제"로 표시된다', () => {
      // Arrange
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayReview = {
        ...mockReview,
        created_at: yesterday.toISOString().split('T')[0],
      }

      // Act
      render(<ReviewCard {...defaultProps} review={yesterdayReview} />)

      // Assert
      expect(screen.getByText('어제')).toBeInTheDocument()
    })

    test('이전 날짜는 YYYY.MM.DD 형식으로 표시된다', () => {
      // Arrange
      const oldDate = new Date('2024-10-15')
      const oldReview = {
        ...mockReview,
        created_at: oldDate.toISOString().split('T')[0],
      }

      // Act
      render(<ReviewCard {...defaultProps} review={oldReview} />)

      // Assert
      const formattedDate = oldDate.toLocaleDateString('ko-KR')
      expect(screen.getByText(formattedDate)).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // More Menu Tests (3 tests)
  // ==========================================================================

  describe('More Menu', () => {
    test('본인 작성이 아닐 때 메뉴가 숨겨진다', () => {
      // Arrange & Act
      render(<ReviewCard {...defaultProps} currentUserId="user-2" />)

      // Assert
      expect(screen.queryByTitle('옵션')).not.toBeInTheDocument()
    })

    test('본인 작성일 때 메뉴가 표시된다', () => {
      // Arrange & Act
      render(<ReviewCard {...defaultProps} currentUserId="user-1" />)

      // Assert
      expect(screen.getByTitle('옵션')).toBeInTheDocument()
    })

    test('메뉴 클릭 시 수정/삭제 옵션이 표시된다', () => {
      // Arrange
      render(<ReviewCard {...defaultProps} currentUserId="user-1" />)

      // Act
      const menuButton = screen.getByTitle('옵션')
      fireEvent.click(menuButton)

      // Assert
      expect(screen.getByText('수정')).toBeInTheDocument()
      expect(screen.getByText('삭제')).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Edit/Delete Options Tests (2 tests)
  // ==========================================================================

  describe('Edit/Delete Options', () => {
    test('수정 클릭 시 onEdit가 호출된다', () => {
      // Arrange
      const mockOnEdit = jest.fn()
      render(
        <ReviewCard {...defaultProps} currentUserId="user-1" onEdit={mockOnEdit} />
      )

      // Act
      const menuButton = screen.getByTitle('옵션')
      fireEvent.click(menuButton)
      const editButton = screen.getByText('수정')
      fireEvent.click(editButton)

      // Assert
      expect(mockOnEdit).toHaveBeenCalledTimes(1)
    })

    test('삭제 클릭 시 onDelete가 호출된다', () => {
      // Arrange
      const mockOnDelete = jest.fn()
      render(
        <ReviewCard {...defaultProps} currentUserId="user-1" onDelete={mockOnDelete} />
      )

      // Act
      const menuButton = screen.getByTitle('옵션')
      fireEvent.click(menuButton)
      const deleteButton = screen.getByText('삭제')
      fireEvent.click(deleteButton)

      // Assert
      expect(mockOnDelete).toHaveBeenCalledTimes(1)
    })
  })

  // ==========================================================================
  // Star Rating Tests (1 test)
  // ==========================================================================

  describe('Star Rating', () => {
    test('StarRating이 readOnly 모드로 렌더링된다', () => {
      // Arrange & Act
      render(<ReviewCard {...defaultProps} />)

      // Assert
      const starRating = screen.getByTestId('star-rating')
      expect(starRating).toHaveAttribute('data-readonly', 'true')
    })
  })

  // ==========================================================================
  // Content Display Tests
  // ==========================================================================

  describe('Content Display', () => {
    test('리뷰 제목이 표시된다', () => {
      // Arrange & Act
      render(<ReviewCard {...defaultProps} />)

      // Assert
      expect(screen.getByText(mockReview.title)).toBeInTheDocument()
    })

    test('리뷰 내용이 표시된다', () => {
      // Arrange & Act
      render(<ReviewCard {...defaultProps} />)

      // Assert
      expect(screen.getByText(mockReview.content)).toBeInTheDocument()
    })
  })
})
