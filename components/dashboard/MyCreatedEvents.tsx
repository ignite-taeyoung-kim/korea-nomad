'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Event, City } from '@/lib/types'
import { fetchUserCreatedEvents, fetchCities } from '@/lib/supabase/queries'
import { useUserProfile } from '@/hooks/useUserProfile'
import { Users, Clock, MapPin } from 'lucide-react'

export default function MyCreatedEvents() {
  const { user, loading: userLoading } = useUserProfile()
  const [createdEvents, setCreatedEvents] = useState<Event[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) {
        setIsLoading(false)
        return
      }

      try {
        const events = await fetchUserCreatedEvents(user.id)
        const citiesData = await fetchCities()
        setCreatedEvents(events)
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

  if (createdEvents.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <Users size={40} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-600 mb-4">생성한 이벤트가 없습니다.</p>
        <Link href="/community" className="text-primary-600 hover:text-primary-700 font-medium">
          이벤트 만들기
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {createdEvents.map((event) => (
        <Link
          key={event.id}
          href={`/community/events/${event.id}`}
          className="bg-white rounded-lg border border-gray-200 p-4 hover:border-primary-300 hover:shadow-md transition-all"
        >
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-900 flex-1">{event.title}</h3>
            <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded">
              내가 주최
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-3">{event.description.substring(0, 80)}...</p>

          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>
                {formatDate(event.date)} {event.time}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">📍</span>
              <span>{getCityName(event.city_id)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">참가자: {event.participant_count}명</span>
            <span className="text-primary-600 text-sm font-medium">자세히 보기 →</span>
          </div>
        </Link>
      ))}
    </div>
  )
}
