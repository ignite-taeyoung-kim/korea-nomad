'use client'

import { Event } from '@/lib/types'
import EventCard from './EventCard'

interface EventListProps {
  events: Event[]
  participatingIds?: string[]
  onToggleParticipation?: (eventId: string) => void
}

export default function EventList({
  events,
  participatingIds = [],
  onToggleParticipation,
}: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">진행 중인 이벤트가 없습니다.</p>
        <p className="text-sm text-gray-400 mt-1">곧 더 많은 이벤트가 추가될 예정입니다.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          isParticipating={participatingIds.includes(event.id)}
          onToggleParticipation={() => onToggleParticipation?.(event.id)}
        />
      ))}
    </div>
  )
}
