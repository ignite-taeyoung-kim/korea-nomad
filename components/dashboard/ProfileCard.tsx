'use client'

import { UserProfile } from '@/lib/types'
import { Edit2 } from 'lucide-react'

interface ProfileCardProps {
  profile: UserProfile | null
  onEditClick: () => void
}

export default function ProfileCard({ profile, onEditClick }: ProfileCardProps) {
  if (!profile) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-gray-600">프로필을 로드할 수 없습니다.</p>
      </div>
    )
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-xl font-bold text-primary-600">
              {profile.name.charAt(0)}
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
            <p className="text-gray-600">{profile.email}</p>
            <p className="text-sm text-gray-500 mt-1">
              가입일: {formatDate(profile.created_at)}
            </p>
          </div>
        </div>
        <button
          onClick={onEditClick}
          className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors font-medium"
        >
          <Edit2 size={18} />
          수정
        </button>
      </div>

      {profile.bio && (
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">소개</h3>
          <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
        </div>
      )}
    </div>
  )
}
