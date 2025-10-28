'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export interface CreateEventInput {
  cityId: string
  title: string
  description: string
  category: 'networking' | 'workshop' | 'social' | 'sports' | 'culture'
  date: string
  time: string
  location: string
}

export async function createEvent(input: CreateEventInput) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { error: '인증되지 않은 사용자입니다', data: null }
    }

    // Get user profile for creator name
    const { data: userProfile } = await supabase
      .from('users')
      .select('name')
      .eq('id', user.id)
      .single()

    const eventId = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const { data, error } = await supabase.from('events').insert({
      id: eventId,
      city_id: input.cityId,
      title: input.title,
      description: input.description,
      category: input.category,
      date: input.date,
      time: input.time,
      location: input.location,
      creator_id: user.id,
      creator_name: userProfile?.name || user.email?.split('@')[0] || '익명',
      participant_count: 1, // Creator automatically participates
    })

    if (error) {
      console.error('이벤트 생성 오류:', error)
      return { error: '이벤트 생성에 실패했습니다', data: null }
    }

    revalidatePath('/community')
    revalidatePath(`/cities/${input.cityId}`)

    return { error: null, data: { id: eventId } }
  } catch (error) {
    console.error('이벤트 생성 중 오류:', error)
    return { error: '예상치 못한 오류가 발생했습니다', data: null }
  }
}

export async function deleteEvent(eventId: string) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { error: '인증되지 않은 사용자입니다' }
    }

    // Check if user is the creator of this event
    const { data: event, error: fetchError } = await supabase
      .from('events')
      .select('creator_id, city_id')
      .eq('id', eventId)
      .single()

    if (fetchError || !event) {
      return { error: '이벤트를 찾을 수 없습니다' }
    }

    if (event.creator_id !== user.id) {
      return { error: '이 이벤트를 삭제할 권한이 없습니다' }
    }

    const { error: deleteError } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId)

    if (deleteError) {
      console.error('이벤트 삭제 오류:', deleteError)
      return { error: '이벤트 삭제에 실패했습니다' }
    }

    revalidatePath('/community')
    revalidatePath(`/cities/${event.city_id}`)

    return { error: null }
  } catch (error) {
    console.error('이벤트 삭제 중 오류:', error)
    return { error: '예상치 못한 오류가 발생했습니다' }
  }
}

export async function updateEventParticipantCount(
  eventId: string,
  increment: boolean
) {
  try {
    const supabase = await createClient()

    const { data: event, error: fetchError } = await supabase
      .from('events')
      .select('participant_count')
      .eq('id', eventId)
      .single()

    if (fetchError || !event) {
      return { error: '이벤트를 찾을 수 없습니다' }
    }

    const newCount = Math.max(
      1,
      event.participant_count + (increment ? 1 : -1)
    )

    const { error: updateError } = await supabase
      .from('events')
      .update({ participant_count: newCount })
      .eq('id', eventId)

    if (updateError) {
      console.error('이벤트 업데이트 오류:', updateError)
      return { error: '이벤트 업데이트에 실패했습니다' }
    }

    revalidatePath('/community')

    return { error: null }
  } catch (error) {
    console.error('이벤트 업데이트 중 오류:', error)
    return { error: '예상치 못한 오류가 발생했습니다' }
  }
}
