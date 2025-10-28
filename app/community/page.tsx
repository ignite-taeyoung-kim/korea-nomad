'use client'

import { useState, useEffect } from 'react'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useEvents } from '@/hooks/useEvents'
import { createEvent } from '@/app/actions/events'
import { fetchCities } from '@/lib/supabase/queries'
import EventFilter from '@/components/community/EventFilter'
import EventList from '@/components/community/EventList'
import MemberList from '@/components/community/MemberList'
import CommunityNewsFeed from '@/components/community/CommunityNewsFeed'
import CreateEventForm from '@/components/community/CreateEventForm'
import { Users } from 'lucide-react'

export default function CommunityPage() {
  const { user, isAuthenticated, loading: userLoading } = useUserProfile()
  const {
    filteredEvents,
    selectedCity,
    selectedCategory,
    setSelectedCity,
    setSelectedCategory,
    refetch,
    isLoading: eventsLoading,
  } = useEvents()

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [cities, setCities] = useState<any[]>([])
  const [citiesLoading, setCitiesLoading] = useState(true)

  // Load cities
  useEffect(() => {
    const loadCities = async () => {
      try {
        const data = await fetchCities()
        setCities(data)
      } catch (error) {
        console.error('도시 목록 조회 오류:', error)
      } finally {
        setCitiesLoading(false)
      }
    }

    loadCities()
  }, [])

  const handleCreateEvent = async (eventData: any) => {
    if (!user?.id) {
      alert('로그인이 필요합니다.')
      return
    }

    try {
      const result = await createEvent({
        cityId: eventData.city_id,
        title: eventData.title,
        description: eventData.description,
        category: eventData.category,
        date: eventData.date,
        time: eventData.time,
        location: eventData.location,
      })

      if (!result.error) {
        setShowCreateForm(false)
        // Refetch events to show the new event
        await refetch()
      } else {
        alert(result.error)
      }
    } catch (error) {
      console.error('이벤트 생성 오류:', error)
      alert('이벤트 생성에 실패했습니다.')
    }
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
            {isAuthenticated && !showCreateForm && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="w-full mb-6 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                + 이벤트 만들기
              </button>
            )}

            {/* Create Event Form */}
            {showCreateForm && isAuthenticated && (
              <div className="mb-8">
                <CreateEventForm
                  cities={cities}
                  userId={user?.id || ''}
                  userName={user?.name || '익명의 사용자'}
                  onEventCreated={handleCreateEvent}
                  onCancel={() => setShowCreateForm(false)}
                />
              </div>
            )}

            {/* Login Prompt */}
            {!isAuthenticated && (
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
              participatingIds={[]}
              onToggleParticipation={() => {}}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Community News Feed */}
            {filteredEvents.length > 0 && (
              <CommunityNewsFeed
                recentEvents={filteredEvents.slice(0, 3)}
                recentMembers={[]}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
