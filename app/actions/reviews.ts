'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { v4 as uuidv4 } from 'crypto'

export interface CreateReviewInput {
  cityId: string
  title: string
  content: string
  rating: number
}

export interface UpdateReviewInput {
  reviewId: string
  title?: string
  content?: string
  rating?: number
}

export async function createReview(input: CreateReviewInput) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { error: '인증되지 않은 사용자입니다', data: null }
    }

    // Get user profile for username
    const { data: userProfile } = await supabase
      .from('users')
      .select('name')
      .eq('id', user.id)
      .single()

    const reviewId = `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const { data, error } = await supabase.from('reviews').insert({
      id: reviewId,
      user_id: user.id,
      city_id: input.cityId,
      title: input.title,
      content: input.content,
      rating: Math.min(5, Math.max(1, input.rating)), // Ensure rating is between 1-5
      username: userProfile?.name || user.email?.split('@')[0] || '익명',
    })

    if (error) {
      console.error('리뷰 생성 오류:', error)
      return { error: '리뷰 생성에 실패했습니다', data: null }
    }

    revalidatePath(`/cities/${input.cityId}`)
    revalidatePath('/dashboard')

    return { error: null, data: { id: reviewId } }
  } catch (error) {
    console.error('리뷰 생성 중 오류:', error)
    return { error: '예상치 못한 오류가 발생했습니다', data: null }
  }
}

export async function updateReview(input: UpdateReviewInput) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { error: '인증되지 않은 사용자입니다', data: null }
    }

    // Check if user owns this review
    const { data: review, error: fetchError } = await supabase
      .from('reviews')
      .select('user_id, city_id')
      .eq('id', input.reviewId)
      .single()

    if (fetchError || !review) {
      return { error: '리뷰를 찾을 수 없습니다', data: null }
    }

    if (review.user_id !== user.id) {
      return { error: '이 리뷰를 수정할 권한이 없습니다', data: null }
    }

    const updateData: any = {}
    if (input.title !== undefined) updateData.title = input.title
    if (input.content !== undefined) updateData.content = input.content
    if (input.rating !== undefined)
      updateData.rating = Math.min(5, Math.max(1, input.rating))

    const { error: updateError } = await supabase
      .from('reviews')
      .update(updateData)
      .eq('id', input.reviewId)

    if (updateError) {
      console.error('리뷰 수정 오류:', updateError)
      return { error: '리뷰 수정에 실패했습니다', data: null }
    }

    revalidatePath(`/cities/${review.city_id}`)
    revalidatePath('/dashboard')

    return { error: null, data: { id: input.reviewId } }
  } catch (error) {
    console.error('리뷰 수정 중 오류:', error)
    return { error: '예상치 못한 오류가 발생했습니다', data: null }
  }
}

export async function deleteReview(reviewId: string) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { error: '인증되지 않은 사용자입니다' }
    }

    // Check if user owns this review
    const { data: review, error: fetchError } = await supabase
      .from('reviews')
      .select('user_id, city_id')
      .eq('id', reviewId)
      .single()

    if (fetchError || !review) {
      return { error: '리뷰를 찾을 수 없습니다' }
    }

    if (review.user_id !== user.id) {
      return { error: '이 리뷰를 삭제할 권한이 없습니다' }
    }

    const { error: deleteError } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId)

    if (deleteError) {
      console.error('리뷰 삭제 오류:', deleteError)
      return { error: '리뷰 삭제에 실패했습니다' }
    }

    revalidatePath(`/cities/${review.city_id}`)
    revalidatePath('/dashboard')

    return { error: null }
  } catch (error) {
    console.error('리뷰 삭제 중 오류:', error)
    return { error: '예상치 못한 오류가 발생했습니다' }
  }
}
