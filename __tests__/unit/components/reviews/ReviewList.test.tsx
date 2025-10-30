/**
 * ReviewList Component Tests
 * 리뷰 목록 컴포넌트의 렌더링, 페이지네이션, 빈 상태 테스트
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ReviewList from '@/components/reviews/ReviewList'
import { Review } from '@/lib/types'
import { mockReviews, createMockReview } from '@/__tests__/mocks/data.mock'

// ============================================================================
// Mocks
// ============================================================================

// Mock ReviewCard component
jest.mock('@/components/reviews/ReviewCard', () => {
  return function MockReviewCard({
    review,
    onEdit,
    onDelete,
  }: {
    review: Review
    currentUserId: string | null
    onEdit?: () => void
    onDelete?: () => void
  }) {
    return (
      <div data-testid={`review-card-${review.id}`}>
        <div>{review.title}</div>
        <div>{review.content}</div>
        {onEdit && (
          <button onClick={onEdit} data-testid={`edit-${review.id}`}>
            Edit
          </button>
        )}
        {onDelete && (
          <button onClick={onDelete} data-testid={`delete-${review.id}`}>
            Delete
          </button>
        )}
      </div>
    )
  }
})

// ============================================================================
// Test Suite
// ============================================================================

describe('ReviewList', () => {
  const defaultProps = {
    reviews: mockReviews,
    currentUserId: 'user-1',
    onEditReview: jest.fn(),
    onDeleteReview: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  // ==========================================================================
  // Basic Rendering Tests (2 tests)
  // ==========================================================================

  describe('Basic Rendering', () => {
    test('모든 리뷰가 ReviewCard로 렌더링된다', () => {
      // Arrange
      const reviews = mockReviews.slice(0, 3)

      // Act
      render(<ReviewList {...defaultProps} reviews={reviews} />)

      // Assert
      reviews.forEach((review) => {
        expect(screen.getByTestId(`review-card-${review.id}`)).toBeInTheDocument()
      })
    })

    test('올바른 개수의 리뷰가 초기에 표시된다', () => {
      // Arrange
      const reviews = Array.from({ length: 10 }, (_, i) =>
        createMockReview({ id: `review-${i + 1}` })
      )

      // Act
      render(<ReviewList {...defaultProps} reviews={reviews} displayLimit={5} />)

      // Assert
      // Only first 5 should be visible
      for (let i = 0; i < 5; i++) {
        expect(screen.getByTestId(`review-card-review-${i + 1}`)).toBeInTheDocument()
      }
      // Remaining should not be visible
      for (let i = 5; i < 10; i++) {
        expect(
          screen.queryByTestId(`review-card-review-${i + 1}`)
        ).not.toBeInTheDocument()
      }
    })
  })

  // ==========================================================================
  // Pagination Tests (4 tests)
  // ==========================================================================

  describe('Pagination', () => {
    test('displayLimit의 기본값은 5이다', () => {
      // Arrange
      const reviews = Array.from({ length: 10 }, (_, i) =>
        createMockReview({ id: `review-${i + 1}` })
      )

      // Act
      render(<ReviewList {...defaultProps} reviews={reviews} />)

      // Assert
      // Only 5 reviews should be visible by default
      const visibleReviews = screen.getAllByTestId(/review-card/)
      expect(visibleReviews).toHaveLength(5)
    })

    test('초기에 displayLimit개의 리뷰만 표시된다', () => {
      // Arrange
      const reviews = Array.from({ length: 10 }, (_, i) =>
        createMockReview({ id: `review-${i + 1}` })
      )

      // Act
      render(<ReviewList {...defaultProps} reviews={reviews} displayLimit={3} />)

      // Assert
      const visibleReviews = screen.getAllByTestId(/review-card/)
      expect(visibleReviews).toHaveLength(3)
    })

    test('displayCount가 reviews.length보다 작으면 "더보기" 버튼이 표시된다', () => {
      // Arrange
      const reviews = Array.from({ length: 10 }, (_, i) =>
        createMockReview({ id: `review-${i + 1}` })
      )

      // Act
      render(<ReviewList {...defaultProps} reviews={reviews} displayLimit={5} />)

      // Assert
      expect(screen.getByText(/더보기/)).toBeInTheDocument()
      expect(screen.getByText('더보기 (5/10)')).toBeInTheDocument()
    })

    test('"더보기" 클릭 시 displayCount가 증가한다', () => {
      // Arrange
      const reviews = Array.from({ length: 10 }, (_, i) =>
        createMockReview({ id: `review-${i + 1}` })
      )
      render(<ReviewList {...defaultProps} reviews={reviews} displayLimit={5} />)

      // Act
      const moreButton = screen.getByText(/더보기/)
      fireEvent.click(moreButton)

      // Assert
      const visibleReviews = screen.getAllByTestId(/review-card/)
      expect(visibleReviews).toHaveLength(10)
    })
  })

  // ==========================================================================
  // Load More Tests (3 tests)
  // ==========================================================================

  describe('Load More', () => {
    test('모든 리뷰가 표시된 후 "더보기" 버튼이 표시된다', () => {
      // Arrange
      const reviews = Array.from({ length: 10 }, (_, i) =>
        createMockReview({ id: `review-${i + 1}` })
      )
      render(<ReviewList {...defaultProps} reviews={reviews} displayLimit={5} />)

      // Act
      const moreButton = screen.getByText(/더보기/)
      fireEvent.click(moreButton)

      // Assert
      const visibleReviews = screen.getAllByTestId(/review-card/)
      expect(visibleReviews).toHaveLength(10)
    })

    test('모든 리뷰가 표시되면 버튼이 사라진다', () => {
      // Arrange
      const reviews = Array.from({ length: 10 }, (_, i) =>
        createMockReview({ id: `review-${i + 1}` })
      )
      render(<ReviewList {...defaultProps} reviews={reviews} displayLimit={5} />)

      // Act
      const moreButton = screen.getByText(/더보기/)
      fireEvent.click(moreButton)

      // Assert
      expect(screen.queryByText(/더보기/)).not.toBeInTheDocument()
    })

    test('여러 번 클릭하면 추가 리뷰가 더 표시된다', () => {
      // Arrange
      const reviews = Array.from({ length: 15 }, (_, i) =>
        createMockReview({ id: `review-${i + 1}` })
      )
      render(<ReviewList {...defaultProps} reviews={reviews} displayLimit={5} />)

      // Act - First click
      const moreButton = screen.getByText(/더보기/)
      fireEvent.click(moreButton)
      let visibleReviews = screen.getAllByTestId(/review-card/)
      expect(visibleReviews).toHaveLength(10)

      // Act - Second click
      fireEvent.click(moreButton)
      visibleReviews = screen.getAllByTestId(/review-card/)

      // Assert
      expect(visibleReviews).toHaveLength(15)
    })
  })

  // ==========================================================================
  // Empty State Tests (2 tests)
  // ==========================================================================

  describe('Empty State', () => {
    test('리뷰가 없을 때 "아직 리뷰가 없습니다" 메시지가 표시된다', () => {
      // Arrange & Act
      render(<ReviewList {...defaultProps} reviews={[]} />)

      // Assert
      expect(screen.getByText('아직 리뷰가 없습니다.')).toBeInTheDocument()
    })

    test('빈 상태 메시지가 명확하게 표시된다', () => {
      // Arrange & Act
      render(<ReviewList {...defaultProps} reviews={[]} />)

      // Assert
      expect(screen.getByText('아직 리뷰가 없습니다.')).toBeInTheDocument()
      expect(screen.getByText('첫 번째 리뷰를 작성해주세요!')).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Callbacks Tests (1 test)
  // ==========================================================================

  describe('Callbacks', () => {
    test('ReviewCard의 콜백이 전달된다', () => {
      // Arrange
      const mockOnEdit = jest.fn()
      const mockOnDelete = jest.fn()
      const reviews = [mockReviews[0]]

      // Act
      render(
        <ReviewList
          {...defaultProps}
          reviews={reviews}
          onEditReview={mockOnEdit}
          onDeleteReview={mockOnDelete}
        />
      )

      const editButton = screen.getByTestId(`edit-${reviews[0].id}`)
      const deleteButton = screen.getByTestId(`delete-${reviews[0].id}`)

      fireEvent.click(editButton)
      fireEvent.click(deleteButton)

      // Assert
      expect(mockOnEdit).toHaveBeenCalledWith(reviews[0])
      expect(mockOnDelete).toHaveBeenCalledWith(reviews[0].id)
    })
  })
})
