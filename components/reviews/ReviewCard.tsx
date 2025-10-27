'use client'

import { Review } from '@/lib/types'
import StarRating from '@/components/common/StarRating'
import { MoreVertical, Trash2, Edit2 } from 'lucide-react'
import { useState } from 'react'

interface ReviewCardProps {
  review: Review
  currentUserId: string | null
  onEdit?: () => void
  onDelete?: () => void
}

export default function ReviewCard({
  review,
  currentUserId,
  onEdit,
  onDelete,
}: ReviewCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const isAuthor = currentUserId === review.user_id

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (
      date.toDateString() === today.toDateString()
    ) {
      return '오늘'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return '어제'
    } else {
      return date.toLocaleDateString('ko-KR')
    }
  }

  return (
    <div className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold text-gray-900">{review.username}</p>
            {isAuthor && (
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded">
                본인
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">{formatDate(review.created_at)}</p>
        </div>
        {isAuthor && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="옵션"
            >
              <MoreVertical size={16} className="text-gray-400" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    onEdit?.()
                    setShowMenu(false)
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 first:rounded-t-lg"
                >
                  <Edit2 size={14} />
                  수정
                </button>
                <button
                  onClick={() => {
                    onDelete?.()
                    setShowMenu(false)
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 last:rounded-b-lg"
                >
                  <Trash2 size={14} />
                  삭제
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Star Rating */}
      <div className="mb-2">
        <StarRating rating={review.rating} readOnly={true} size={16} />
      </div>

      {/* Title */}
      <p className="font-semibold text-gray-900 mb-2">{review.title}</p>

      {/* Content */}
      <p className="text-gray-700 leading-relaxed">{review.content}</p>
    </div>
  )
}
