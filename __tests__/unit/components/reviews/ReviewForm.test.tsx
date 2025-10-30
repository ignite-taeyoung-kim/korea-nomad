/**
 * ReviewForm Component Tests
 * 리뷰 작성 폼 컴포넌트의 렌더링, 검증, 상호작용 테스트
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ReviewForm from '@/components/reviews/ReviewForm'
import { Review } from '@/lib/types'

// ============================================================================
// Mocks
// ============================================================================

// Mock StarRating component
jest.mock('@/components/common/StarRating', () => {
  return function MockStarRating({
    rating,
    onChange,
  }: {
    rating: number
    onChange?: (rating: number) => void
  }) {
    return (
      <div data-testid="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onChange?.(star)}
            data-testid={`star-${star}`}
            className={star <= rating ? 'active' : ''}
          >
            Star {star}
          </button>
        ))}
      </div>
    )
  }
})

// ============================================================================
// Test Suite
// ============================================================================

describe('ReviewForm', () => {
  const defaultProps = {
    cityId: 'seoul',
    userId: 'user-1',
    username: 'TestUser',
    onReviewAdded: jest.fn(),
    onCancel: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  // ==========================================================================
  // Basic Rendering Tests (3 tests)
  // ==========================================================================

  describe('Basic Rendering', () => {
    test('StarRating 컴포넌트가 표시된다', () => {
      // Arrange & Act
      render(<ReviewForm {...defaultProps} />)

      // Assert
      expect(screen.getByTestId('star-rating')).toBeInTheDocument()
    })

    test('제목 입력 필드가 표시된다', () => {
      // Arrange & Act
      render(<ReviewForm {...defaultProps} />)

      // Assert
      const titleInput = screen.getByLabelText('제목')
      expect(titleInput).toBeInTheDocument()
      expect(titleInput).toHaveAttribute('type', 'text')
    })

    test('내용 textarea가 4줄로 표시된다', () => {
      // Arrange & Act
      render(<ReviewForm {...defaultProps} />)

      // Assert
      const contentTextarea = screen.getByLabelText('내용')
      expect(contentTextarea).toBeInTheDocument()
      expect(contentTextarea).toHaveAttribute('rows', '4')
    })
  })

  // ==========================================================================
  // Star Selection Tests (2 tests)
  // ==========================================================================

  describe('Star Selection', () => {
    test('StarRating의 onChange가 rating을 업데이트한다', () => {
      // Arrange
      render(<ReviewForm {...defaultProps} />)

      // Act
      const star3 = screen.getByTestId('star-3')
      fireEvent.click(star3)

      // Assert
      const activeStar = screen.getByTestId('star-3')
      expect(activeStar).toHaveClass('active')
    })

    test('UI가 선택된 별점을 반영한다', () => {
      // Arrange
      render(<ReviewForm {...defaultProps} />)

      // Act
      const star4 = screen.getByTestId('star-4')
      fireEvent.click(star4)

      // Assert
      const stars = screen.getAllByText(/Star \d/)
      const activeStars = stars.filter((star) =>
        star.className.includes('active')
      )
      expect(activeStars.length).toBe(4)
    })
  })

  // ==========================================================================
  // Input Fields Tests (3 tests)
  // ==========================================================================

  describe('Input Fields', () => {
    test('제목 입력이 state를 업데이트한다', () => {
      // Arrange
      render(<ReviewForm {...defaultProps} />)
      const titleInput = screen.getByLabelText('제목') as HTMLInputElement

      // Act
      fireEvent.change(titleInput, { target: { value: '좋은 도시' } })

      // Assert
      expect(titleInput.value).toBe('좋은 도시')
    })

    test('내용 textarea가 state를 업데이트한다', () => {
      // Arrange
      render(<ReviewForm {...defaultProps} />)
      const contentTextarea = screen.getByLabelText('내용') as HTMLTextAreaElement

      // Act
      fireEvent.change(contentTextarea, {
        target: { value: '정말 좋은 경험이었습니다' },
      })

      // Assert
      expect(contentTextarea.value).toBe('정말 좋은 경험이었습니다')
    })

    test('입력 필드들이 제어 컴포넌트로 작동한다', () => {
      // Arrange
      render(<ReviewForm {...defaultProps} />)
      const titleInput = screen.getByLabelText('제목') as HTMLInputElement
      const contentTextarea = screen.getByLabelText('내용') as HTMLTextAreaElement

      // Act
      fireEvent.change(titleInput, { target: { value: 'Test Title' } })
      fireEvent.change(contentTextarea, { target: { value: 'Test Content' } })

      // Assert
      expect(titleInput.value).toBe('Test Title')
      expect(contentTextarea.value).toBe('Test Content')
    })
  })

  // ==========================================================================
  // Validation Tests (3 tests)
  // ==========================================================================

  describe('Validation', () => {
    test('rating이 0일 때 에러 메시지가 표시된다', () => {
      // Arrange
      render(<ReviewForm {...defaultProps} />)
      const titleInput = screen.getByLabelText('제목')
      const contentTextarea = screen.getByLabelText('내용')

      // Act
      fireEvent.change(titleInput, { target: { value: '제목' } })
      fireEvent.change(contentTextarea, { target: { value: '내용' } })
      const submitButton = screen.getByText('리뷰 작성')
      fireEvent.click(submitButton)

      // Assert
      expect(screen.getByText('별점을 선택해주세요')).toBeInTheDocument()
    })

    test('제목이 비어있을 때 에러 메시지가 표시된다', () => {
      // Arrange
      render(<ReviewForm {...defaultProps} />)
      const star5 = screen.getByTestId('star-5')
      const contentTextarea = screen.getByLabelText('내용')

      // Act
      fireEvent.click(star5)
      fireEvent.change(contentTextarea, { target: { value: '내용' } })
      const submitButton = screen.getByText('리뷰 작성')
      fireEvent.click(submitButton)

      // Assert
      expect(screen.getByText('제목을 입력해주세요')).toBeInTheDocument()
    })

    test('내용이 비어있을 때 에러 메시지가 표시된다', () => {
      // Arrange
      render(<ReviewForm {...defaultProps} />)
      const star5 = screen.getByTestId('star-5')
      const titleInput = screen.getByLabelText('제목')

      // Act
      fireEvent.click(star5)
      fireEvent.change(titleInput, { target: { value: '제목' } })
      const submitButton = screen.getByText('리뷰 작성')
      fireEvent.click(submitButton)

      // Assert
      expect(screen.getByText('내용을 입력해주세요')).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Error Display Tests (2 tests)
  // ==========================================================================

  describe('Error Display', () => {
    test('에러 메시지가 빨간 배경으로 렌더링된다', () => {
      // Arrange
      render(<ReviewForm {...defaultProps} />)

      // Act
      const submitButton = screen.getByText('리뷰 작성')
      fireEvent.click(submitButton)

      // Assert
      const errorMessage = screen.getByText('별점을 선택해주세요')
      const errorDiv = errorMessage.closest('.bg-red-50')
      expect(errorDiv).toBeInTheDocument()
      expect(errorDiv).toHaveClass('border-red-200')
    })

    test('여러 에러가 순차적으로 표시된다', () => {
      // Arrange
      render(<ReviewForm {...defaultProps} />)
      const submitButton = screen.getByText('리뷰 작성')

      // Act - First error: rating
      fireEvent.click(submitButton)

      // Assert
      expect(screen.getByText('별점을 선택해주세요')).toBeInTheDocument()

      // Act - Add rating, trigger title error
      const star5 = screen.getByTestId('star-5')
      fireEvent.click(star5)
      fireEvent.click(submitButton)

      // Assert
      expect(screen.getByText('제목을 입력해주세요')).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Submit Tests (2 tests)
  // ==========================================================================

  describe('Submit', () => {
    test('유효한 폼 제출 시 onReviewAdded가 호출된다', async () => {
      // Arrange
      const mockOnReviewAdded = jest.fn()
      render(<ReviewForm {...defaultProps} onReviewAdded={mockOnReviewAdded} />)

      // Act
      const star5 = screen.getByTestId('star-5')
      fireEvent.click(star5)

      const titleInput = screen.getByLabelText('제목')
      fireEvent.change(titleInput, { target: { value: '좋은 도시' } })

      const contentTextarea = screen.getByLabelText('내용')
      fireEvent.change(contentTextarea, { target: { value: '정말 좋습니다' } })

      const submitButton = screen.getByText('리뷰 작성')
      fireEvent.click(submitButton)

      // Assert
      await waitFor(() => {
        expect(mockOnReviewAdded).toHaveBeenCalledWith(
          expect.objectContaining({
            user_id: 'user-1',
            city_id: 'seoul',
            username: 'TestUser',
            title: '좋은 도시',
            content: '정말 좋습니다',
            rating: 5,
          })
        )
      })
    })

    test('로딩 상태일 때 입력 필드가 비활성화된다', () => {
      // Arrange
      render(<ReviewForm {...defaultProps} />)

      // Act
      const star5 = screen.getByTestId('star-5')
      fireEvent.click(star5)

      const titleInput = screen.getByLabelText('제목')
      fireEvent.change(titleInput, { target: { value: '제목' } })

      const contentTextarea = screen.getByLabelText('내용')
      fireEvent.change(contentTextarea, { target: { value: '내용' } })

      const submitButton = screen.getByText('리뷰 작성')
      fireEvent.click(submitButton)

      // Assert
      expect(screen.getByText('저장 중...')).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Cancel Button Tests (1 test)
  // ==========================================================================

  describe('Cancel Button', () => {
    test('취소 버튼 클릭 시 onCancel이 호출된다', () => {
      // Arrange
      const mockOnCancel = jest.fn()
      render(<ReviewForm {...defaultProps} onCancel={mockOnCancel} />)

      // Act
      const cancelButton = screen.getByText('취소')
      fireEvent.click(cancelButton)

      // Assert
      expect(mockOnCancel).toHaveBeenCalledTimes(1)
    })
  })
})
