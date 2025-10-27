'use client'

import { useState, useEffect } from 'react'
import { reviews } from '@/lib/data'
import { getParticipations } from '@/lib/eventParticipation'
import { getFavorites } from '@/lib/storage'
import { getBookmarks } from '@/lib/storage'
import { MessageCircle, CalendarCheck, Heart, Bookmark } from 'lucide-react'

interface StatItem {
  label: string
  value: number
  icon: React.ReactNode
  color: string
}

export default function ActivityStats() {
  const [stats, setStats] = useState<StatItem[]>([])

  useEffect(() => {
    const userReviews = reviews.filter((r) => r.user_id === 'current_user_123')
    const participations = getParticipations()
    const favorites = getFavorites()
    const bookmarks = getBookmarks()

    const activityStats: StatItem[] = [
      {
        label: '작성한 리뷰',
        value: userReviews.length,
        icon: <MessageCircle size={24} />,
        color: 'bg-blue-50 text-blue-600',
      },
      {
        label: '참가한 이벤트',
        value: participations.length,
        icon: <CalendarCheck size={24} />,
        color: 'bg-green-50 text-green-600',
      },
      {
        label: '좋아요한 도시',
        value: favorites.length,
        icon: <Heart size={24} />,
        color: 'bg-red-50 text-red-600',
      },
      {
        label: '북마크한 도시',
        value: bookmarks.length,
        icon: <Bookmark size={24} />,
        color: 'bg-yellow-50 text-yellow-600',
      },
    ]

    setStats(activityStats)
  }, [])

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`${stat.color} rounded-lg p-4 flex flex-col items-center gap-2`}
        >
          {stat.icon}
          <div className="text-center">
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm font-medium">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
