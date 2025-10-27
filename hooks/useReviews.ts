'use client'

import { useState, useEffect, useCallback } from 'react'
import { Review } from '@/lib/types'
import {
  getReviewsForCity,
  addReview,
  updateReview,
  deleteReview,
  getAverageRating,
  getReviewsByDate,
  getReviewsByRating,
} from '@/lib/reviewStorage'

interface UseReviewsReturn {
  reviews: Review[]
  averageRating: number
  addNewReview: (
    review: Omit<Review, 'id'>
  ) => void
  updateExistingReview: (
    reviewId: string,
    updates: Partial<Omit<Review, 'id' | 'user_id' | 'city_id' | 'created_at'>>
  ) => void
  deleteExistingReview: (reviewId: string) => void
  getReviewsByDate: () => Review[]
  getReviewsByRating: () => Review[]
  isLoading: boolean
}

export function useReviews(cityId: string): UseReviewsReturn {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load reviews on mount or when cityId changes
  useEffect(() => {
    setIsLoading(true)
    const loadedReviews = getReviewsForCity(cityId)
    setReviews(loadedReviews)
    setIsLoading(false)
  }, [cityId])

  const addNewReview = useCallback(
    (review: Omit<Review, 'id'>) => {
      const newReview = addReview(cityId, review)
      setReviews((prev) => {
        const updated = [...prev, newReview]
        return updated.sort((a, b) => {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
        })
      })
    },
    [cityId]
  )

  const updateExistingReview = useCallback(
    (
      reviewId: string,
      updates: Partial<Omit<Review, 'id' | 'user_id' | 'city_id' | 'created_at'>>
    ) => {
      const updated = updateReview(cityId, reviewId, updates)
      if (updated) {
        setReviews((prev) =>
          prev.map((r) => (r.id === reviewId ? updated : r))
        )
      }
    },
    [cityId]
  )

  const deleteExistingReview = useCallback(
    (reviewId: string) => {
      const success = deleteReview(cityId, reviewId)
      if (success) {
        setReviews((prev) => prev.filter((r) => r.id !== reviewId))
      }
    },
    [cityId]
  )

  const averageRating = getAverageRating(cityId)

  const getReviewsByDateSorted = useCallback(
    () => getReviewsByDate(cityId),
    [cityId]
  )

  const getReviewsByRatingSorted = useCallback(
    () => getReviewsByRating(cityId),
    [cityId]
  )

  return {
    reviews,
    averageRating,
    addNewReview,
    updateExistingReview,
    deleteExistingReview,
    getReviewsByDate: getReviewsByDateSorted,
    getReviewsByRating: getReviewsByRatingSorted,
    isLoading,
  }
}
