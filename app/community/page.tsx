'use client'

import { useState } from 'react'
import { cities, newMembers } from '@/lib/data'
import { useEvents } from '@/hooks/useEvents'
import EventFilter from '@/components/community/EventFilter'
import EventList from '@/components/community/EventList'
import MemberList from '@/components/community/MemberList'
import CommunityNewsFeed from '@/components/community/CommunityNewsFeed'
import CreateEventForm from '@/components/community/CreateEventForm'
import { Users } from 'lucide-react'

export default function CommunityPage() {
  const {
    filteredEvents,
    participatingIds,
    selectedCity,
    selectedCategory,
    setSelectedCity,
    setSelectedCategory,
    toggleEventParticipation,
    addNewEvent,
  } = useEvents()

  const [showCreateForm, setShowCreateForm] = useState(false)

  // Mock: Check if logged in (in real app, use auth context)
  const isLoggedIn = true
  const currentUserId = 'current_user_123'
  const currentUserName = '로그인 사용자'

  const handleCreateEvent = (event: Parameters<typeof addNewEvent>[0]) => {
    addNewEvent(event)
    setShowCreateForm(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Users size={32} className="text-primary-600" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">커뮤니티</h1>
          </div>
          <p className="text-gray-600">
            노마드들이 모여 경험을 나누고 새로운 친구를 사귀는 공간입니다.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Create Event Button */}
            {isLoggedIn && !showCreateForm && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="w-full mb-6 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                + 이벤트 만들기
              </button>
            )}

            {/* Create Event Form */}
            {showCreateForm && isLoggedIn && (
              <div className="mb-8">
                <CreateEventForm
                  cities={cities}
                  userId={currentUserId}
                  userName={currentUserName}
                  onEventCreated={handleCreateEvent}
                  onCancel={() => setShowCreateForm(false)}
                />
              </div>
            )}

            {/* Login Prompt */}
            {!isLoggedIn && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
                이벤트를 만들려면 로그인이 필요합니다.
              </div>
            )}

            {/* Event Filter */}
            <EventFilter
              cities={cities}
              selectedCity={selectedCity}
              selectedCategory={selectedCategory}
              onCityChange={(cityId) => setSelectedCity(cityId || null)}
              onCategoryChange={setSelectedCategory}
            />

            {/* Event List */}
            <EventList
              events={filteredEvents}
              participatingIds={participatingIds}
              onToggleParticipation={toggleEventParticipation}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Community News Feed */}
            <CommunityNewsFeed
              recentEvents={filteredEvents.slice(0, 3)}
              recentMembers={newMembers}
            />

            {/* Member List */}
            <MemberList members={newMembers} />
          </div>
        </div>
      </div>
    </div>
  )
}
