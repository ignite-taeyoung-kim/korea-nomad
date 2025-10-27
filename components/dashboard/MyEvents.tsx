'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Event } from '@/lib/types'
import { events } from '@/lib/data'
import { getParticipations } from '@/lib/eventParticipation'
import { cities } from '@/lib/data'
import { CalendarCheck, Clock, MapPin } from 'lucide-react'

export default function MyEvents() {
  const [participatedEvents, setParticipatedEvents] = useState<Event[]>([])

  useEffect(() => {
    const participationIds = getParticipations()
    const participated = events.filter((event) => participationIds.includes(event.id))
    setParticipatedEvents(participated)
  }, [])

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

  if (participatedEvents.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <CalendarCheck size={40} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-600 mb-4">참가한 이벤트가 없습니다.</p>
        <Link href="/community" className="text-primary-600 hover:text-primary-700 font-medium">
          커뮤니티 이벤트 탐색하기
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {participatedEvents.map((event) => (
        <Link
          key={event.id}
          href={`/community/events/${event.id}`}
          className="bg-white rounded-lg border border-gray-200 p-4 hover:border-primary-300 hover:shadow-md transition-all"
        >
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-900 flex-1">{event.title}</h3>
            <span className="text-xs font-medium px-2 py-1 bg-green-50 text-green-600 rounded">
              참가중
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
