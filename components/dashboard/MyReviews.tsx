'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Review } from '@/lib/types'
import { reviews as mockReviews } from '@/lib/data'
import { deleteReview } from '@/lib/reviewStorage'
import { cities } from '@/lib/data'
import { Trash2, MessageCircle } from 'lucide-react'

export default function MyReviews() {
  const [userReviews, setUserReviews] = useState<Review[]>([])

  useEffect(() => {
    const myReviews = mockReviews.filter((r) => r.user_id === 'current_user_123')
    setUserReviews(myReviews)
  }, [])

  const handleDeleteReview = (cityId: string, reviewId: string) => {
    if (confirm('리뷰를 삭제하시겠습니까?')) {
      deleteReview(cityId, reviewId)
      setUserReviews((prev) => prev.filter((r) => r.id !== reviewId))
    }
  }

  const getCityName = (cityId: string): string => {
    return cities.find((c) => c.id === cityId)?.name || '도시'
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (userReviews.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <MessageCircle size={40} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-600 mb-4">작성한 리뷰가 없습니다.</p>
        <Link href="/cities" className="text-primary-600 hover:text-primary-700 font-medium">
          도시 리뷰 작성하기
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {userReviews.map((review) => (
        <div key={review.id} className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Link
                  href={`/cities/${review.city_id}`}
                  className="text-primary-600 hover:text-primary-700 font-semibold"
                >
                  {getCityName(review.city_id)}
                </Link>
                <span className="text-yellow-500">{'⭐'.repeat(review.rating)}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">{review.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{formatDate(review.created_at)}</p>
            </div>
            <button
              onClick={() => handleDeleteReview(review.city_id, review.id)}
              className="text-red-600 hover:text-red-700 transition-colors p-2"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <p className="text-gray-700 leading-relaxed mb-3">{review.content}</p>

          <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-600">작성자: {review.username}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
