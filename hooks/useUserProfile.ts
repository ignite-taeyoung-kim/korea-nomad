'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { UserProfile } from '@/lib/types'

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  const supabase = createClient()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get current user from auth
        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser()

        if (authError || !authUser) {
          setUser(null)
          setProfile(null)
          setLoading(false)
          return
        }

        setUser(authUser)

        // Fetch user profile from public.users
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single()

        if (profileError) {
          console.error('프로필 조회 오류:', profileError)
          setError('프로필을 가져올 수 없습니다')
          setProfile(null)
        } else {
          setProfile(userProfile as UserProfile)
        }
      } catch (err) {
        console.error('프로필 조회 중 오류:', err)
        setError('예상치 못한 오류가 발생했습니다')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()

    // Set up listener for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user)
        // Re-fetch profile when auth state changes
        const { data: userProfile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (userProfile) {
          setProfile(userProfile as UserProfile)
        }
      } else {
        setUser(null)
        setProfile(null)
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  return {
    profile,
    user,
    loading,
    error,
    isAuthenticated: !!user,
  }
}
