'use client'

import Link from 'next/link'
import { Event } from '@/lib/types'
import { Heart, MapPin, Clock, Users } from 'lucide-react'
import { useState } from 'react'

interface EventCardProps {
  event: Event
  isParticipating?: boolean
  onToggleParticipation?: () => void
}

const categoryLabel: Record<Event['category'], string> = {
  networking: '네트워킹',
  workshop: '워크숍',
  social: '사교',
  sports: '스포츠',
  culture: '문화',
}

const categoryColor: Record<Event['category'], string> = {
  networking: 'bg-blue-100 text-blue-700',
  workshop: 'bg-purple-100 text-purple-700',
  social: 'bg-green-100 text-green-700',
  sports: 'bg-orange-100 text-orange-700',
  culture: 'bg-pink-100 text-pink-700',
}

export default function EventCard({
  event,
  isParticipating = false,
  onToggleParticipation,
}: EventCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <Link
            href={`/community/events/${event.id}`}
            className="text-lg font-bold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2"
          >
            {event.title}
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs font-medium px-2 py-0.5 rounded ${categoryColor[event.category]}`}>
              {categoryLabel[event.category]}
            </span>
            <span className="text-xs text-gray-500">{event.creator_name}</span>
          </div>
        </div>
        <button
          onClick={onToggleParticipation}
          className="p-2 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
          title={isParticipating ? '참가 취소' : '참가'}
        >
          <Heart
            size={20}
            className={
              isParticipating
                ? 'fill-red-500 text-red-500'
                : 'text-gray-300 hover:text-red-500'
            }
          />
        </button>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>

      {/* Event Details */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock size={16} className="flex-shrink-0" />
          <span>
            {formatDate(event.date)} {event.time}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin size={16} className="flex-shrink-0" />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users size={16} className="flex-shrink-0" />
          <span>{event.participant_count}명 참가</span>
        </div>
      </div>

      {/* View Details Link */}
      <Link
        href={`/community/events/${event.id}`}
        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
      >
        자세히 보기 →
      </Link>
    </div>
  )
}
