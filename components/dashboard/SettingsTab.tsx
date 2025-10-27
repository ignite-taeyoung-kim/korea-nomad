'use client'

import { useState } from 'react'
import { Bell, Lock } from 'lucide-react'

interface SettingsState {
  emailNotifications: boolean
  eventNotifications: boolean
  reviewNotifications: boolean
  profilePrivate: boolean
  showActivity: boolean
}

export default function SettingsTab() {
  const [settings, setSettings] = useState<SettingsState>({
    emailNotifications: true,
    eventNotifications: true,
    reviewNotifications: false,
    profilePrivate: false,
    showActivity: true,
  })

  const handleToggle = (key: keyof SettingsState) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <div className="space-y-8">
      {/* Notifications Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Bell size={20} className="text-primary-600" />
          <h3 className="text-lg font-bold text-gray-900">알림 설정</h3>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
          {/* Email Notifications */}
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">이메일 알림</p>
              <p className="text-sm text-gray-600">중요한 소식을 이메일로 받습니다</p>
            </div>
            <button
              onClick={() => handleToggle('emailNotifications')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.emailNotifications ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Event Notifications */}
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">이벤트 알림</p>
              <p className="text-sm text-gray-600">새로운 이벤트 소식을 받습니다</p>
            </div>
            <button
              onClick={() => handleToggle('eventNotifications')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.eventNotifications ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.eventNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Review Notifications */}
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">리뷰 알림</p>
              <p className="text-sm text-gray-600">내 리뷰에 대한 반응을 받습니다</p>
            </div>
            <button
              onClick={() => handleToggle('reviewNotifications')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.reviewNotifications ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.reviewNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Lock size={20} className="text-primary-600" />
          <h3 className="text-lg font-bold text-gray-900">프라이버시 설정</h3>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
          {/* Profile Privacy */}
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">프로필 비공개</p>
              <p className="text-sm text-gray-600">프로필을 공개하지 않습니다</p>
            </div>
            <button
              onClick={() => handleToggle('profilePrivate')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.profilePrivate ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.profilePrivate ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Show Activity */}
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">활동 공개</p>
              <p className="text-sm text-gray-600">다른 사용자에게 활동을 보여줍니다</p>
            </div>
            <button
              onClick={() => handleToggle('showActivity')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.showActivity ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.showActivity ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
