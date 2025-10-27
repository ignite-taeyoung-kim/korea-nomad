'use client'

import { useState, useCallback } from 'react'
import { Review } from '@/lib/types'
import StarRating from '@/components/common/StarRating'

interface ReviewFormProps {
  cityId: string
  userId: string
  username: string
  onReviewAdded: (review: Omit<Review, 'id'>) => void
  onCancel?: () => void
}

export default function ReviewForm({
  cityId,
  userId,
  username,
  onReviewAdded,
  onCancel,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      setError('')

      // Validate
      if (rating === 0) {
        setError('별점을 선택해주세요')
        return
      }
      if (!title.trim()) {
        setError('제목을 입력해주세요')
        return
      }
      if (!content.trim()) {
        setError('내용을 입력해주세요')
        return
      }

      setIsLoading(true)

      // Simulate async operation
      setTimeout(() => {
        const newReview: Omit<Review, 'id'> = {
          user_id: userId,
          city_id: cityId,
          username,
          title: title.trim(),
          content: content.trim(),
          rating,
          created_at: new Date().toISOString().split('T')[0],
        }

        onReviewAdded(newReview)
        setRating(0)
        setTitle('')
        setContent('')
        setIsLoading(false)
      }, 300)
    },
    [rating, title, content, cityId, userId, username, onReviewAdded]
  )

  const handleCancel = useCallback(() => {
    setRating(0)
    setTitle('')
    setContent('')
    setError('')
    onCancel?.()
  }, [onCancel])

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">새로운 리뷰 작성</h3>

      {/* Star Rating */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          별점
        </label>
        <StarRating rating={rating} onChange={setRating} size={24} />
      </div>

      {/* Title */}
      <div className="mb-6">
        <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
          제목
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="리뷰 제목을 입력해주세요"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          disabled={isLoading}
        />
      </div>

      {/* Content */}
      <div className="mb-6">
        <label htmlFor="content" className="block text-sm font-semibold text-gray-900 mb-2">
          내용
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="리뷰 내용을 입력해주세요 (최소 10자)"
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          disabled={isLoading}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '저장 중...' : '리뷰 작성'}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          취소
        </button>
      </div>
    </form>
  )
}
