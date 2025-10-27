'use client'

import { UserProfile } from './types'
import { currentUser } from './data'

const STORAGE_KEY = 'nomad_user_profile'

export function getProfile(): UserProfile {
  if (typeof window === 'undefined') {
    return currentUser
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : currentUser
  } catch {
    return currentUser
  }
}

export function saveProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  } catch (error) {
    console.error('Failed to save profile:', error)
  }
}

export function updateProfileName(name: string): void {
  const profile = getProfile()
  const updated = { ...profile, name }
  saveProfile(updated)
}

export function updateProfileBio(bio: string): void {
  const profile = getProfile()
  const updated = { ...profile, bio }
  saveProfile(updated)
}

export function updateProfileAvatar(avatar_url: string): void {
  const profile = getProfile()
  const updated = { ...profile, avatar_url }
  saveProfile(updated)
}
