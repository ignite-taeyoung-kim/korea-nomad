'use client'

import { Event, NewMember } from '@/lib/types'
import { Calendar, UserPlus, Zap } from 'lucide-react'

interface CommunityNewsFeedProps {
  recentEvents: Event[]
  recentMembers: NewMember[]
}

export default function CommunityNewsFeed({
  recentEvents,
  recentMembers,
}: CommunityNewsFeedProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const diffTime = today.getTime() - date.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return '오늘'
    if (diffDays === 1) return '어제'
    if (diffDays < 7) return `${diffDays}일 전`
    return date.toLocaleDateString('ko-KR')
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Zap size={20} className="text-primary-600" />
        <h2 className="text-lg font-bold text-gray-900">커뮤니티 뉴스</h2>
      </div>

      <div className="space-y-4">
        {/* Recent Events */}
        {recentEvents.length > 0 && (
          <>
            <div className="pb-4 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">최신 이벤트</h3>
              <div className="space-y-2">
                {recentEvents.slice(0, 3).map((event) => (
                  <div key={event.id} className="flex items-start gap-3 text-sm">
                    <Calendar size={16} className="text-primary-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{event.title}</p>
                      <p className="text-xs text-gray-500">{formatDate(event.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Recent Members */}
        {recentMembers.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">새 멤버 가입</h3>
            <div className="space-y-2">
              {recentMembers.slice(0, 3).map((member) => (
                <div key={member.id} className="flex items-center gap-3 text-sm">
                  <UserPlus size={16} className="text-green-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{member.username}</p>
                    <p className="text-xs text-gray-500">{formatDate(member.joined_date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {recentEvents.length === 0 && recentMembers.length === 0 && (
          <p className="text-center text-gray-500 py-4">아직 소식이 없습니다.</p>
        )}
      </div>
    </div>
  )
}
