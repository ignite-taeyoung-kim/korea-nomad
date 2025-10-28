'use client'

import { useState, useEffect, useCallback } from 'react'
import { Event } from '@/lib/types'
import { fetchUpcomingEvents } from '@/lib/supabase/queries'

interface UseEventsReturn {
  events: Event[]
  filteredEvents: Event[]
  selectedCity: string | null
  selectedCategory: Event['category'] | null
  setSelectedCity: (cityId: string | null) => void
  setSelectedCategory: (category: Event['category'] | null) => void
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useEvents(): UseEventsReturn {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Event['category'] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load initial data from Supabase
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const loadedEvents = await fetchUpcomingEvents(90) // Load events for next 90 days
        setEvents(loadedEvents)
      } catch (err) {
        console.error('이벤트 조회 오류:', err)
        setError('이벤트를 가져올 수 없습니다')
      } finally {
        setIsLoading(false)
      }
    }

    loadEvents()
  }, [])

  // Filter events
  const filteredEvents = events.filter((event) => {
    if (selectedCity && event.city_id !== selectedCity) {
      return false
    }
    if (selectedCategory && event.category !== selectedCategory) {
      return false
    }
    return true
  })

  const refetch = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const loadedEvents = await fetchUpcomingEvents(90)
      setEvents(loadedEvents)
    } catch (err) {
      console.error('이벤트 조회 오류:', err)
      setError('이벤트를 가져올 수 없습니다')
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    events,
    filteredEvents,
    selectedCity,
    selectedCategory,
    setSelectedCity,
    setSelectedCategory,
    isLoading,
    error,
    refetch,
  }
}
