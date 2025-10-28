'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Review, City } from '@/lib/types'
import { deleteReview } from '@/app/actions/reviews'
import { fetchUserReviews, fetchCities } from '@/lib/supabase/queries'
import { useUserProfile } from '@/hooks/useUserProfile'
import { Trash2, MessageCircle } from 'lucide-react'

export default function MyReviews() {
  const { user, loading: userLoading } = useUserProfile()
  const [userReviews, setUserReviews] = useState<Review[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) {
        setIsLoading(false)
        return
      }

      try {
        const reviews = await fetchUserReviews(user.id)
        const citiesData = await fetchCities()
        setUserReviews(reviews)
        setCities(citiesData)
      } catch (error) {
        console.error('데이터 조회 오류:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (!userLoading) {
      loadData()
    }
  }, [user, userLoading])

  const handleDeleteReview = async (reviewId: string) => {
    if (confirm('리뷰를 삭제하시겠습니까?')) {
      const result = await deleteReview(reviewId)
      if (!result.error) {
        setUserReviews((prev) => prev.filter((r) => r.id !== reviewId))
      } else {
        alert(result.error)
      }
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

  if (isLoading || userLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p className="text-gray-600 mt-4">데이터 로딩 중...</p>
      </div>
    )
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
              onClick={() => handleDeleteReview(review.id)}
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
