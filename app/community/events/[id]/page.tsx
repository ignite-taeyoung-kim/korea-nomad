'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { events, cities } from '@/lib/data'
import { ArrowLeft, Clock, MapPin, Users, Heart } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getParticipations, toggleParticipation } from '@/lib/eventParticipation'

const categoryLabel: Record<string, string> = {
  networking: '네트워킹',
  workshop: '워크숍',
  social: '사교',
  sports: '스포츠',
  culture: '문화',
}

const categoryColor: Record<string, string> = {
  networking: 'bg-blue-100 text-blue-700',
  workshop: 'bg-purple-100 text-purple-700',
  social: 'bg-green-100 text-green-700',
  sports: 'bg-orange-100 text-orange-700',
  culture: 'bg-pink-100 text-pink-700',
}

export default function EventDetailPage() {
  const params = useParams()
  const eventId = params?.id as string

  const event = events.find((e) => e.id === eventId)
  const city = event ? cities.find((c) => c.id === event.city_id) : null

  const [isParticipating, setIsParticipating] = useState(false)
  const [participantCount, setParticipantCount] = useState(event?.participant_count || 0)

  useEffect(() => {
    if (event) {
      const participations = getParticipations()
      setIsParticipating(participations.includes(event.id))
    }
  }, [event])

  if (!event || !city) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">이벤트를 찾을 수 없습니다.</p>
          <Link href="/community" className="text-primary-600 hover:text-primary-700 font-medium">
            커뮤니티로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  const handleToggleParticipation = () => {
    const newState = toggleParticipation(event.id)
    setIsParticipating(newState)
    setParticipantCount((prev) => (newState ? prev + 1 : prev - 1))
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/community"
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 font-medium"
          >
            <ArrowLeft size={18} />
            돌아가기
          </Link>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${categoryColor[event.category]}`}>
                  {categoryLabel[event.category]}
                </span>
                <span className="text-sm text-gray-500">{city.emoji} {city.name}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                {event.title}
              </h1>
              <p className="text-gray-600">주최자: {event.creator_name}</p>
            </div>
            <button
              onClick={handleToggleParticipation}
              className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                isParticipating
                  ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              <Heart size={20} className={isParticipating ? 'fill-red-600' : ''} />
              {isParticipating ? '참가 취소' : '참가하기'}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Description */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">이벤트 소개</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{event.description}</p>
            </div>

            {/* Event Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">이벤트 정보</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Clock size={20} className="text-primary-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">날짜 및 시간</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(event.date)} {event.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin size={20} className="text-primary-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">장소</p>
                    <p className="font-medium text-gray-900">{event.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Users size={20} className="text-primary-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">참가자</p>
                    <p className="font-medium text-gray-900">{participantCount}명</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-primary-50 rounded-lg border border-primary-200 p-6 sticky top-4">
              <h3 className="font-bold text-gray-900 mb-4">이벤트 요약</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">카테고리</p>
                  <p className="font-medium text-gray-900">{categoryLabel[event.category]}</p>
                </div>
                <div>
                  <p className="text-gray-600">도시</p>
                  <p className="font-medium text-gray-900">
                    {city.emoji} {city.name}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">시작 시간</p>
                  <p className="font-medium text-gray-900">{event.time}</p>
                </div>
                <div className="pt-3 border-t border-primary-200">
                  <p className="text-gray-600 mb-2">현재 참가자</p>
                  <p className="text-2xl font-bold text-primary-600">{participantCount}명</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
