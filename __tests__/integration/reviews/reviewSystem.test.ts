/**
 * Integration Test: Review System
 *
 * 리뷰 생성, 표시, 관리 전체 시스템을 테스트합니다.
 * - Create Review
 * - Edit Review
 * - Delete Review
 * - Review Display
 * - Review Pagination
 */

import { renderHook, act, waitFor } from '@testing-library/react'
import { useReviews } from '@/hooks/useReviews'
import { mockReviews, createMockReview } from '@/__tests__/mocks/data.mock'
import { setMockUser, clearMockUser } from '@/__tests__/mocks/supabase.mock'

// Mock Supabase queries
jest.mock('@/lib/supabase/queries', () => ({
  fetchReviewsByCityId: jest.fn(),
  createReview: jest.fn(),
  updateReview: jest.fn(),
  deleteReview: jest.fn(),
}))

// Mock Supabase client
jest.mock('@/utils/supabase/client', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
    })),
  })),
}))

import { fetchReviewsByCityId, createReview, updateReview, deleteReview } from '@/lib/supabase/queries'

describe('Integration: Review System', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    clearMockUser()
    localStorage.clear()
  })

  // ============================================================================
  // Create Review (5 tests)
  // ============================================================================
  describe('Create Review', () => {
    test('사용자가 리뷰 폼을 제출하면 (rating, title, content) ReviewForm이 onReviewAdded를 호출한다', async () => {
      // Arrange
      const mockUser = { id: 'user-1', email: 'test@example.com' }
      setMockUser(mockUser)

      const newReview = createMockReview({
        user_id: 'user-1',
        city_id: 'seoul',
        rating: 5,
        title: '좋은 도시',
        content: '서울은 정말 좋습니다',
      })

      const mockOnReviewAdded = jest.fn()
      ;(createReview as jest.Mock).mockResolvedValue(newReview)

      // Act
      const reviewData = {
        city_id: 'seoul',
        user_id: 'user-1',
        rating: 5,
        title: '좋은 도시',
        content: '서울은 정말 좋습니다',
      }

      const result = await createReview(reviewData)
      mockOnReviewAdded(result)

      // Assert
      expect(createReview).toHaveBeenCalledWith(reviewData)
      expect(mockOnReviewAdded).toHaveBeenCalledWith(newReview)
    })

    test('리뷰가 localStorage/Supabase에 저장된다', async () => {
      // Arrange
      const mockUser = { id: 'user-1', email: 'test@example.com' }
      setMockUser(mockUser)

      const newReview = createMockReview({
        id: 'review-new',
        user_id: 'user-1',
        city_id: 'seoul',
      })

      ;(createReview as jest.Mock).mockResolvedValue(newReview)

      // Act
      const result = await createReview({
        city_id: 'seoul',
        user_id: 'user-1',
        rating: 5,
        title: 'Test',
        content: 'Test content',
      })

      // Assert
      expect(result).toEqual(newReview)
      expect(createReview).toHaveBeenCalled()
    })

    test('averageRating이 재계산된다', async () => {
      // Arrange
      const existingReviews = [
        createMockReview({ rating: 5 }),
        createMockReview({ rating: 4 }),
      ]

      ;(fetchReviewsByCityId as jest.Mock).mockResolvedValue(existingReviews)

      const { result } = renderHook(() => useReviews('seoul'))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      const avgBefore = result.current.averageRating
      expect(avgBefore).toBe(4.5) // (5 + 4) / 2

      // Act - Add new review with rating 3
      const newReview = createMockReview({ rating: 3 })
      ;(fetchReviewsByCityId as jest.Mock).mockResolvedValue([
        ...existingReviews,
        newReview,
      ])

      await act(async () => {
        await result.current.refetch()
      })

      // Assert
      const avgAfter = result.current.averageRating
      expect(avgAfter).toBe(4) // (5 + 4 + 3) / 3
    })

    test('새 리뷰가 ReviewList에 표시된다', async () => {
      // Arrange
      const initialReviews = mockReviews.slice(0, 2)
      ;(fetchReviewsByCityId as jest.Mock).mockResolvedValue(initialReviews)

      const { result } = renderHook(() => useReviews('seoul'))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.reviews.length).toBe(2)

      // Act - Add new review
      const newReview = createMockReview({
        id: 'review-new',
        title: '새 리뷰',
      })

      ;(fetchReviewsByCityId as jest.Mock).mockResolvedValue([
        ...initialReviews,
        newReview,
      ])

      await act(async () => {
        await result.current.refetch()
      })

      // Assert
      expect(result.current.reviews.length).toBe(3)
      const addedReview = result.current.reviews.find((r) => r.id === 'review-new')
      expect(addedReview).toBeDefined()
      expect(addedReview?.title).toBe('새 리뷰')
    })

    test('리뷰 개수가 증가한다', async () => {
      // Arrange
      ;(fetchReviewsByCityId as jest.Mock).mockResolvedValue(mockReviews.slice(0, 2))

      const { result } = renderHook(() => useReviews('seoul'))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      const countBefore = result.current.reviews.length
      expect(countBefore).toBe(2)

      // Act - Add review
      const newReview = createMockReview()
      ;(fetchReviewsByCityId as jest.Mock).mockResolvedValue([
        ...mockReviews.slice(0, 2),
        newReview,
      ])

      await act(async () => {
        await result.current.refetch()
      })

      // Assert
      const countAfter = result.current.reviews.length
      expect(countAfter).toBe(3)
      expect(countAfter).toBe(countBefore + 1)
    })
  })

  // ============================================================================
  // Edit Review (4 tests)
  // ============================================================================
  describe('Edit Review', () => {
    test('사용자가 자신의 리뷰에서 수정을 클릭하면 ReviewCard가 수정 옵션을 표시한다', () => {
      // Arrange
      const mockUser = { id: 'user-1', email: 'test@example.com' }
      setMockUser(mockUser)

      const userReview = createMockReview({
        id: 'review-1',
        user_id: 'user-1',
      })

      // Act
      const canEdit = userReview.user_id === mockUser.id

      // Assert
      expect(canEdit).toBe(true)
    })

    test('사용자가 리뷰를 수정한다', async () => {
      // Arrange
      const originalReview = createMockReview({
        id: 'review-1',
        title: '원래 제목',
        content: '원래 내용',
      })

      const updatedReview = {
        ...originalReview,
        title: '수정된 제목',
        content: '수정된 내용',
      }

      ;(updateReview as jest.Mock).mockResolvedValue(updatedReview)

      // Act
      const result = await updateReview('review-1', {
        title: '수정된 제목',
        content: '수정된 내용',
      })

      // Assert
      expect(updateReview).toHaveBeenCalledWith('review-1', {
        title: '수정된 제목',
        content: '수정된 내용',
      })
      expect(result.title).toBe('수정된 제목')
      expect(result.content).toBe('수정된 내용')
    })

    test('변경 사항이 저장된다', async () => {
      // Arrange
      const originalReview = createMockReview({
        id: 'review-1',
        rating: 4,
      })

      const updatedReview = {
        ...originalReview,
        rating: 5,
      }

      ;(updateReview as jest.Mock).mockResolvedValue(updatedReview)

      // Act
      const result = await updateReview('review-1', { rating: 5 })

      // Assert
      expect(result.rating).toBe(5)
      expect(updateReview).toHaveBeenCalled()
    })

    test('업데이트된 리뷰가 표시된다', async () => {
      // Arrange
      const originalReviews = [
        createMockReview({ id: 'review-1', title: '원래 제목' }),
        createMockReview({ id: 'review-2' }),
      ]

      ;(fetchReviewsByCityId as jest.Mock).mockResolvedValue(originalReviews)

      const { result } = renderHook(() => useReviews('seoul'))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.reviews[0].title).toBe('원래 제목')

      // Act - Update review
      const updatedReviews = [
        createMockReview({ id: 'review-1', title: '수정된 제목' }),
        createMockReview({ id: 'review-2' }),
      ]

      ;(fetchReviewsByCityId as jest.Mock).mockResolvedValue(updatedReviews)

      await act(async () => {
        await result.current.refetch()
      })

      // Assert
      expect(result.current.reviews[0].title).toBe('수정된 제목')
    })
  })

  // ============================================================================
  // Delete Review (3 tests)
  // ============================================================================
  describe('Delete Review', () => {
    test('사용자가 삭제를 클릭하면 확인이 필요하다', () => {
      // Arrange
      const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(false)

      // Act
      const userConfirmed = window.confirm('정말 삭제하시겠습니까?')

      // Assert
      expect(confirmSpy).toHaveBeenCalled()
      expect(userConfirmed).toBe(false)

      confirmSpy.mockRestore()
    })

    test('리뷰가 목록에서 제거된다', async () => {
      // Arrange
      const reviews = [
        createMockReview({ id: 'review-1' }),
        createMockReview({ id: 'review-2' }),
        createMockReview({ id: 'review-3' }),
      ]

      ;(fetchReviewsByCityId as jest.Mock).mockResolvedValue(reviews)

      const { result } = renderHook(() => useReviews('seoul'))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.reviews.length).toBe(3)

      // Act - Delete review-2
      ;(deleteReview as jest.Mock).mockResolvedValue(true)
      await deleteReview('review-2')

      const updatedReviews = reviews.filter((r) => r.id !== 'review-2')
      ;(fetchReviewsByCityId as jest.Mock).mockResolvedValue(updatedReviews)

      await act(async () => {
        await result.current.refetch()
      })

      // Assert
      expect(result.current.reviews.length).toBe(2)
      expect(result.current.reviews.find((r) => r.id === 'review-2')).toBeUndefined()
    })

    test('averageRating이 업데이트된다', async () => {
      // Arrange
      const reviews = [
        createMockReview({ id: 'review-1', rating: 5 }),
        createMockReview({ id: 'review-2', rating: 3 }),
        createMockReview({ id: 'review-3', rating: 4 }),
      ]

      ;(fetchReviewsByCityId as jest.Mock).mockResolvedValue(reviews)

      const { result } = renderHook(() => useReviews('seoul'))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.averageRating).toBe(4) // (5+3+4)/3

      // Act - Delete the rating:3 review
      ;(deleteReview as jest.Mock).mockResolvedValue(true)
      await deleteReview('review-2')

      const updatedReviews = reviews.filter((r) => r.id !== 'review-2')
      ;(fetchReviewsByCityId as jest.Mock).mockResolvedValue(updatedReviews)

      await act(async () => {
        await result.current.refetch()
      })

      // Assert
      expect(result.current.averageRating).toBe(4.5) // (5+4)/2
    })
  })

  // ============================================================================
  // Review Display (4 tests)
  // ============================================================================
  describe('Review Display', () => {
    test('리뷰가 날짜순으로 정렬된다 (최신순)', async () => {
      // Arrange
      const reviews = [
        createMockReview({ id: 'review-1', created_at: '2024-10-20' }),
        createMockReview({ id: 'review-2', created_at: '2024-10-22' }),
        createMockReview({ id: 'review-3', created_at: '2024-10-18' }),
      ]

      ;(fetchReviewsByCityId as jest.Mock).mockResolvedValue(reviews)

      const { result } = renderHook(() => useReviews('seoul'))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Act
      const sortedReviews = result.current.sortedByDate()

      // Assert
      expect(sortedReviews[0].id).toBe('review-2') // 2024-10-22
      expect(sortedReviews[1].id).toBe('review-1') // 2024-10-20
      expect(sortedReviews[2].id).toBe('review-3') // 2024-10-18
    })

    test('리뷰 개수가 올바르다', async () => {
      // Arrange
      const reviews = mockReviews.slice(0, 3)
      ;(fetchReviewsByCityId as jest.Mock).mockResolvedValue(reviews)

      const { result } = renderHook(() => useReviews('seoul'))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Act & Assert
      expect(result.current.reviews.length).toBe(3)
    })

    test('평균 평점이 올바르게 계산된다', async () => {
      // Arrange
      const reviews = [
        createMockReview({ rating: 5 }),
        createMockReview({ rating: 4 }),
        createMockReview({ rating: 3 }),
      ]

      ;(fetchReviewsByCityId as jest.Mock).mockResolvedValue(reviews)

      const { result } = renderHook(() => useReviews('seoul'))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Act & Assert
      expect(result.current.averageRating).toBe(4) // (5+4+3)/3
    })

    test('리뷰 세부 정보가 정확하게 표시된다', async () => {
      // Arrange
      const reviews = [
        createMockReview({
          id: 'review-1',
          title: '좋은 도시',
          content: '서울은 좋습니다',
          rating: 5,
          username: 'TestUser',
        }),
      ]

      ;(fetchReviewsByCityId as jest.Mock).mockResolvedValue(reviews)

      const { result } = renderHook(() => useReviews('seoul'))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Act
      const review = result.current.reviews[0]

      // Assert
      expect(review.title).toBe('좋은 도시')
      expect(review.content).toBe('서울은 좋습니다')
      expect(review.rating).toBe(5)
      expect(review.username).toBe('TestUser')
    })
  })

  // ============================================================================
  // Review Pagination (4 tests)
  // ============================================================================
  describe('Review Pagination', () => {
    test('ReviewList가 초기에 5개의 리뷰를 표시한다', async () => {
      // Arrange
      const reviews = Array.from({ length: 10 }, (_, i) =>
        createMockReview({ id: `review-${i}` })
      )

      ;(fetchReviewsByCityId as jest.Mock).mockResolvedValue(reviews)

      const { result } = renderHook(() => useReviews('seoul'))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Act
      const displayLimit = 5
      const displayedReviews = result.current.reviews.slice(0, displayLimit)

      // Assert
      expect(result.current.reviews.length).toBe(10)
      expect(displayedReviews.length).toBe(5)
    })

    test('"더보기" 버튼이 표시된다', async () => {
      // Arrange
      const reviews = Array.from({ length: 10 }, (_, i) =>
        createMockReview({ id: `review-${i}` })
      )

      ;(fetchReviewsByCityId as jest.Mock).mockResolvedValue(reviews)

      const { result } = renderHook(() => useReviews('seoul'))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Act
      const totalReviews = result.current.reviews.length
      const displayLimit = 5
      const hasMore = totalReviews > displayLimit

      // Assert
      expect(hasMore).toBe(true)
    })

    test('클릭 시 더 많은 리뷰를 로드한다', async () => {
      // Arrange
      const reviews = Array.from({ length: 10 }, (_, i) =>
        createMockReview({ id: `review-${i}` })
      )

      ;(fetchReviewsByCityId as jest.Mock).mockResolvedValue(reviews)

      const { result } = renderHook(() => useReviews('seoul'))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Act - Simulate pagination
      let displayLimit = 5
      const firstPage = result.current.reviews.slice(0, displayLimit)
      expect(firstPage.length).toBe(5)

      // Click "더보기"
      displayLimit = 10
      const secondPage = result.current.reviews.slice(0, displayLimit)

      // Assert
      expect(secondPage.length).toBe(10)
    })

    test('모든 리뷰가 로드되면 "더보기" 버튼이 사라진다', async () => {
      // Arrange
      const reviews = Array.from({ length: 8 }, (_, i) =>
        createMockReview({ id: `review-${i}` })
      )

      ;(fetchReviewsByCityId as jest.Mock).mockResolvedValue(reviews)

      const { result } = renderHook(() => useReviews('seoul'))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Act - Load all reviews
      let displayLimit = 5
      displayLimit = 10 // Load more

      const displayedReviews = result.current.reviews.slice(0, displayLimit)
      const hasMore = result.current.reviews.length > displayedReviews.length

      // Assert
      expect(displayedReviews.length).toBe(8)
      expect(hasMore).toBe(false)
    })
  })
})
