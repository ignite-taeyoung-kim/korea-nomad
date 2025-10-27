'use client'

import { useState } from 'react'
import { Review } from '@/lib/types'
import { useReviews } from '@/hooks/useReviews'
import ReviewForm from './ReviewForm'
import ReviewList from './ReviewList'
import ReviewModal from './ReviewModal'
import StarRating from '@/components/common/StarRating'
import { MessageCircle } from 'lucide-react'

interface CityReviewsSectionProps {
  cityId: string
  reviewCount: number
}

export default function CityReviewsSection({
  cityId,
  reviewCount,
}: CityReviewsSectionProps) {
  const {
    reviews,
    averageRating,
    addNewReview,
    updateExistingReview,
    deleteExistingReview,
  } = useReviews(cityId)

  const [showForm, setShowForm] = useState(false)
  const [editingReview, setEditingReview] = useState<Review | null>(null)

  // For demo purposes, using mock user
  // In real app, this would come from auth context
  const currentUserId = 'current_user_123'
  const currentUsername = '로그인 사용자'
  const isLoggedIn = true // In real app, check from auth context

  const handleAddReview = (review: Omit<Review, 'id'>) => {
    addNewReview(review)
    setShowForm(false)
  }

  const handleUpdateReview = (updates: Partial<Review>) => {
    if (editingReview) {
      updateExistingReview(editingReview.id, updates)
      setEditingReview(null)
    }
  }

  const handleDeleteReview = () => {
    if (editingReview) {
      deleteExistingReview(editingReview.id)
      setEditingReview(null)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-2">
            <MessageCircle size={24} />
            리뷰 ({reviews.length})
          </h2>
          {averageRating > 0 && (
            <div className="flex items-center gap-2">
              <StarRating rating={Math.round(averageRating)} readOnly size={16} />
              <span className="text-sm text-gray-600">
                {averageRating.toFixed(1)}/5 ({reviews.length}개)
              </span>
            </div>
          )}
        </div>
        {isLoggedIn && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
          >
            {showForm ? '취소' : '리뷰 작성하기'}
          </button>
        )}
      </div>

      {/* Review Form */}
      {showForm && isLoggedIn && (
        <div className="mb-6">
          <ReviewForm
            cityId={cityId}
            userId={currentUserId}
            username={currentUsername}
            onReviewAdded={handleAddReview}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Login Prompt */}
      {!isLoggedIn && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
          리뷰를 작성하려면 로그인이 필요합니다.
        </div>
      )}

      {/* Review List */}
      <ReviewList
        reviews={reviews}
        currentUserId={currentUserId}
        onEditReview={setEditingReview}
        onDeleteReview={deleteExistingReview}
      />

      {/* Edit Modal */}
      {editingReview && (
        <ReviewModal
          review={editingReview}
          onSave={handleUpdateReview}
          onDelete={handleDeleteReview}
          onCancel={() => setEditingReview(null)}
        />
      )}
    </div>
  )
}
