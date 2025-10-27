'use client'

import { useState, useEffect, useCallback } from 'react'
import { UserProfile } from '@/lib/types'
import {
  getProfile,
  saveProfile,
  updateProfileName,
  updateProfileBio,
  updateProfileAvatar,
} from '@/lib/userProfile'

interface UseProfileReturn {
  profile: UserProfile | null
  updateName: (name: string) => void
  updateBio: (bio: string) => void
  updateAvatar: (avatar_url: string) => void
  isLoading: boolean
}

export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load profile on mount
  useEffect(() => {
    setIsLoading(true)
    const loadedProfile = getProfile()
    setProfile(loadedProfile)
    setIsLoading(false)
  }, [])

  const handleUpdateName = useCallback((name: string) => {
    updateProfileName(name)
    setProfile((prev) => (prev ? { ...prev, name } : null))
  }, [])

  const handleUpdateBio = useCallback((bio: string) => {
    updateProfileBio(bio)
    setProfile((prev) => (prev ? { ...prev, bio } : null))
  }, [])

  const handleUpdateAvatar = useCallback((avatar_url: string) => {
    updateProfileAvatar(avatar_url)
    setProfile((prev) => (prev ? { ...prev, avatar_url } : null))
  }, [])

  return {
    profile,
    updateName: handleUpdateName,
    updateBio: handleUpdateBio,
    updateAvatar: handleUpdateAvatar,
    isLoading,
  }
}
