'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export interface UpdateProfileInput {
  name?: string
  bio?: string
  avatar_url?: string
}

export async function updateUserProfile(data: UpdateProfileInput) {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { error: '인증되지 않은 사용자입니다' }
    }

    // Update user profile
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({
        name: data.name,
        bio: data.bio,
        avatar_url: data.avatar_url,
      })
      .eq('id', user.id)
      .select()

    if (updateError) {
      console.error('프로필 업데이트 오류:', updateError)
      return { error: '프로필 업데이트에 실패했습니다' }
    }

    // Revalidate dashboard and profile pages
    revalidatePath('/dashboard')
    revalidatePath('/auth/profile')

    return { data: updatedUser?.[0], error: null }
  } catch (error) {
    console.error('프로필 업데이트 중 오류:', error)
    return { error: '예상치 못한 오류가 발생했습니다' }
  }
}

export async function getUserProfile() {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { error: '인증되지 않은 사용자입니다', data: null }
    }

    // Fetch user profile from public.users
    const { data: profile, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (fetchError) {
      console.error('프로필 조회 오류:', fetchError)
      return { error: '프로필을 가져올 수 없습니다', data: null }
    }

    return { data: profile, error: null }
  } catch (error) {
    console.error('프로필 조회 중 오류:', error)
    return { error: '예상치 못한 오류가 발생했습니다', data: null }
  }
}

export async function getCurrentUser() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return { data: null, error: '사용자 정보를 가져올 수 없습니다' }
    }

    return { data: user, error: null }
  } catch (error) {
    console.error('현재 사용자 조회 중 오류:', error)
    return { data: null, error: '예상치 못한 오류가 발생했습니다' }
  }
}
