'use client'

import { useState } from 'react'
import { Review } from '@/lib/types'
import ReviewCard from './ReviewCard'

interface ReviewListProps {
  reviews: Review[]
  currentUserId: string | null
  onEditReview?: (review: Review) => void
  onDeleteReview?: (reviewId: string) => void
  displayLimit?: number
}

export default function ReviewList({
  reviews,
  currentUserId,
  onEditReview,
  onDeleteReview,
  displayLimit = 5,
}: ReviewListProps) {
  const [displayCount, setDisplayCount] = useState(displayLimit)

  if (reviews.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">아직 리뷰가 없습니다.</p>
        <p className="text-sm text-gray-400 mt-1">첫 번째 리뷰를 작성해주세요!</p>
      </div>
    )
  }

  const displayedReviews = reviews.slice(0, displayCount)
  const hasMore = displayCount < reviews.length

  return (
    <div>
      <div className="space-y-4">
        {displayedReviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            currentUserId={currentUserId}
            onEdit={() => onEditReview?.(review)}
            onDelete={() => onDeleteReview?.(review.id)}
          />
        ))}
      </div>

      {/* More Button */}
      {hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setDisplayCount((prev) => prev + displayLimit)}
            className="px-6 py-2 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
          >
            더보기 ({displayCount}/{reviews.length})
          </button>
        </div>
      )}
    </div>
  )
}
