'use client'

import { useState } from 'react'
import { useUserProfile } from '@/hooks/useUserProfile'
import { updateUserProfile } from '@/app/auth/profile/actions'
import ProfileCard from '@/components/dashboard/ProfileCard'
import EditProfileForm from '@/components/dashboard/EditProfileForm'
import ActivityStats from '@/components/dashboard/ActivityStats'
import MyFavoriteCities from '@/components/dashboard/MyFavoriteCities'
import MyBookmarks from '@/components/dashboard/MyBookmarks'
import MyReviews from '@/components/dashboard/MyReviews'
import MyEvents from '@/components/dashboard/MyEvents'
import MyCreatedEvents from '@/components/dashboard/MyCreatedEvents'
import SettingsTab from '@/components/dashboard/SettingsTab'
import { User, Heart, Bookmark, MessageCircle, Settings } from 'lucide-react'

type TabType = 'profile' | 'activity' | 'settings'

export default function DashboardPage() {
  const { profile, isAuthenticated, loading } = useUserProfile()
  const [activeTab, setActiveTab] = useState<TabType>('profile')
  const [showEditForm, setShowEditForm] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveProfile = async (name: string, bio: string, avatar_url: string) => {
    setIsSaving(true)
    try {
      const result = await updateUserProfile({
        name,
        bio,
        avatar_url,
      })
      if (!result.error) {
        setShowEditForm(false)
      } else {
        alert(result.error)
      }
    } catch (error) {
      console.error('프로필 업데이트 오류:', error)
      alert('프로필 업데이트에 실패했습니다.')
    } finally {
      setIsSaving(false)
    }
  }

  const tabs = [
    { id: 'profile', label: '프로필', icon: User },
    { id: 'activity', label: '활동', icon: Heart },
    { id: 'settings', label: '설정', icon: Settings },
  ]

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  // Show not authenticated message
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-lg border border-gray-200 p-8">
          <p className="text-gray-600 mb-4">로그인이 필요합니다.</p>
          <a href="/auth/signin" className="inline-block px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">
            로그인하기
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">마이페이지</h1>
          <p className="text-gray-600 mt-2">프로필 관리 및 활동 내역을 확인하세요</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Card - Always visible */}
        <div className="mb-8">
          <ProfileCard profile={profile} onEditClick={() => setShowEditForm(true)} />
        </div>

        {/* Activity Stats */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">활동 통계</h2>
          <ActivityStats />
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <div className="flex gap-4 sm:gap-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`pb-4 px-2 font-medium text-sm sm:text-base flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                    isActive
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">좋아요한 도시</h2>
                <MyFavoriteCities />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">북마크한 도시</h2>
                <MyBookmarks />
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">작성한 리뷰</h2>
                <MyReviews />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">참가한 이벤트</h2>
                <MyEvents />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">만든 이벤트</h2>
                <MyCreatedEvents />
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">설정</h2>
              <SettingsTab />
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditForm && (
        <EditProfileForm
          profile={profile}
          onSave={handleSaveProfile}
          onCancel={() => setShowEditForm(false)}
        />
      )}
    </div>
  )
}
