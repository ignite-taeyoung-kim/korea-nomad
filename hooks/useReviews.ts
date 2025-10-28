'use client'

import { useState, useEffect, useCallback } from 'react'
import { Review } from '@/lib/types'
import { fetchReviewsByCityId } from '@/lib/supabase/queries'

interface UseReviewsReturn {
  reviews: Review[]
  averageRating: number
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  sortedByDate: () => Review[]
  sortedByRating: () => Review[]
}

export function useReviews(cityId: string): UseReviewsReturn {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load reviews on mount or when cityId changes
  useEffect(() => {
    const loadReviews = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const loadedReviews = await fetchReviewsByCityId(cityId)
        setReviews(loadedReviews)
      } catch (err) {
        console.error('리뷰 조회 오류:', err)
        setError('리뷰를 가져올 수 없습니다')
      } finally {
        setIsLoading(false)
      }
    }

    loadReviews()
  }, [cityId])

  const refetch = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const loadedReviews = await fetchReviewsByCityId(cityId)
      setReviews(loadedReviews)
    } catch (err) {
      console.error('리뷰 조회 오류:', err)
      setError('리뷰를 가져올 수 없습니다')
    } finally {
      setIsLoading(false)
    }
  }, [cityId])

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0

  // Sort by date (newest first)
  const sortedByDate = useCallback(() => {
    return [...reviews].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  }, [reviews])

  // Sort by rating (highest first)
  const sortedByRating = useCallback(() => {
    return [...reviews].sort((a, b) => b.rating - a.rating)
  }, [reviews])

  return {
    reviews,
    averageRating,
    isLoading,
    error,
    refetch,
    sortedByDate,
    sortedByRating,
  }
}
