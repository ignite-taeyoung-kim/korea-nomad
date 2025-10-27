'use client'

import { useState, useEffect, useCallback } from 'react'
import { Event } from '@/lib/types'
import { events as mockEvents } from '@/lib/data'
import {
  getParticipations,
  toggleParticipation,
  addParticipation,
} from '@/lib/eventParticipation'

interface UseEventsReturn {
  events: Event[]
  filteredEvents: Event[]
  participatingIds: string[]
  selectedCity: string | null
  selectedCategory: Event['category'] | null
  setSelectedCity: (cityId: string | null) => void
  setSelectedCategory: (category: Event['category'] | null) => void
  toggleEventParticipation: (eventId: string) => void
  addNewEvent: (event: Omit<Event, 'id'>) => void
  isLoading: boolean
}

export function useEvents(): UseEventsReturn {
  const [events, setEvents] = useState<Event[]>([])
  const [participatingIds, setParticipatingIds] = useState<string[]>([])
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Event['category'] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load initial data
  useEffect(() => {
    setIsLoading(true)
    const loadedParticipations = getParticipations()
    setParticipatingIds(loadedParticipations)
    setEvents(mockEvents)
    setIsLoading(false)
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

  const handleToggleParticipation = useCallback((eventId: string) => {
    const isNowParticipating = toggleParticipation(eventId)
    setParticipatingIds((prev) => {
      if (isNowParticipating) {
        return [...prev, eventId]
      } else {
        return prev.filter((id) => id !== eventId)
      }
    })
  }, [])

  const handleAddNewEvent = useCallback((event: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...event,
      id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }
    setEvents((prev) => [newEvent, ...prev])
    // Auto-participate in own event
    addParticipation(newEvent.id)
    setParticipatingIds((prev) => [...prev, newEvent.id])
  }, [])

  return {
    events,
    filteredEvents,
    participatingIds,
    selectedCity,
    selectedCategory,
    setSelectedCity,
    setSelectedCategory,
    toggleEventParticipation: handleToggleParticipation,
    addNewEvent: handleAddNewEvent,
    isLoading,
  }
}
