'use client'

import { NewMember } from '@/lib/types'
import { UserPlus } from 'lucide-react'

interface MemberListProps {
  members: NewMember[]
}

export default function MemberList({ members }: MemberListProps) {
  if (members.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">커뮤니티 멤버가 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <UserPlus size={20} className="text-primary-600" />
        <h2 className="text-lg font-bold text-gray-900">최신 가입 멤버</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">
                {member.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{member.username}</p>
              <p className="text-xs text-gray-500">
                {new Date(member.joined_date).toLocaleDateString('ko-KR')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
