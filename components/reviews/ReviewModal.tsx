'use client'

import { useState, useCallback } from 'react'
import { Review } from '@/lib/types'
import StarRating from '@/components/common/StarRating'
import { X } from 'lucide-react'

interface ReviewModalProps {
  review: Review
  onSave: (updates: Partial<Review>) => void
  onDelete: () => void
  onCancel: () => void
}

export default function ReviewModal({
  review,
  onSave,
  onDelete,
  onCancel,
}: ReviewModalProps) {
  const [rating, setRating] = useState(review.rating)
  const [title, setTitle] = useState(review.title)
  const [content, setContent] = useState(review.content)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSave = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      setError('')

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
      setTimeout(() => {
        onSave({
          rating,
          title: title.trim(),
          content: content.trim(),
        })
        setIsLoading(false)
      }, 300)
    },
    [rating, title, content, onSave]
  )

  const handleDelete = useCallback(() => {
    if (confirm('정말 이 리뷰를 삭제하시겠습니까?')) {
      setIsLoading(true)
      setTimeout(() => {
        onDelete()
        setIsLoading(false)
      }, 300)
    }
  }, [onDelete])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">리뷰 수정</h2>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 space-y-6">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              별점
            </label>
            <StarRating
              rating={rating}
              onChange={setRating}
              size={24}
            />
          </div>

          {/* Title */}
          <div>
            <label htmlFor="edit-title" className="block text-sm font-semibold text-gray-900 mb-2">
              제목
            </label>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="edit-content" className="block text-sm font-semibold text-gray-900 mb-2">
              내용
            </label>
            <textarea
              id="edit-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              disabled={isLoading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
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
              {isLoading ? '저장 중...' : '저장'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              취소
            </button>
          </div>

          {/* Delete Button */}
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium border border-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '삭제 중...' : '삭제'}
          </button>
        </form>
      </div>
    </div>
  )
}
