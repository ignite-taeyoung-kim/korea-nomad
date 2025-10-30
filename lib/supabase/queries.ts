import { createClient } from '@/utils/supabase/client'
import type { City, Review, Event } from '@/lib/types'

const supabase = createClient()

/**
 * Cities 관련 쿼리
 */
export async function fetchCities() {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .order('overall_score', { ascending: false })

  if (error) {
    console.error('도시 데이터 조회 오류:', error)
    return []
  }

  return data as City[]
}

export async function fetchCityById(id: string) {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('도시 상세 조회 오류:', error)
    return null
  }

  return data as City
}

/**
 * Reviews 관련 쿼리
 */
export async function fetchReviewsByCityId(cityId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('city_id', cityId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('리뷰 조회 오류:', error)
    return []
  }

  return data as Review[]
}

export async function fetchUserReviews(userId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('사용자 리뷰 조회 오류:', error)
    return []
  }

  return data as Review[]
}

export async function fetchReviewCount(cityId: string) {
  const { count, error } = await supabase
    .from('reviews')
    .select('*', { count: 'exact', head: true })
    .eq('city_id', cityId)

  if (error) {
    console.error('리뷰 카운트 조회 오류:', error)
    return 0
  }

  return count || 0
}

/**
 * Events 관련 쿼리
 */
export async function fetchEventsByCityId(cityId: string) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('city_id', cityId)
    .order('date', { ascending: true })

  if (error) {
    console.error('이벤트 조회 오류:', error)
    return []
  }

  return data as Event[]
}

export async function fetchUpcomingEvents(days: number = 30) {
  const today = new Date().toISOString().split('T')[0]
  const futureDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0]

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .gte('date', today)
    .lte('date', futureDate)
    .order('date', { ascending: true })

  if (error) {
    console.error('예정된 이벤트 조회 오류:', error)
    return []
  }

  return data as Event[]
}

export async function fetchUserCreatedEvents(userId: string) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('creator_id', userId)
    .order('date', { ascending: false })

  if (error) {
    console.error('사용자가 만든 이벤트 조회 오류:', error)
    return []
  }

  return data as Event[]
}

/**
 * Favorites 관련 쿼리
 */
export async function fetchUserFavorites(userId: string) {
  const { data, error } = await supabase
    .from('favorites')
    .select('city_id')
    .eq('user_id', userId)

  if (error) {
    console.error('즐겨찾기 조회 오류:', error)
    return []
  }

  return data.map((item) => item.city_id)
}

export async function fetchFavoritesCities(userId: string) {
  const { data, error } = await supabase
    .from('favorites')
    .select('cities(*)')
    .eq('user_id', userId)

  if (error) {
    console.error('즐겨찾기 도시 조회 오류:', error)
    return []
  }

  return data
    .filter((item) => item.cities !== null && Array.isArray(item.cities) && item.cities.length > 0)
    .map((item) => (item.cities as any[])[0])
}

export async function isFavorite(userId: string, cityId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('city_id', cityId)
    .single()

  if (error && error.code !== 'PGRST116') {
    // PGRST116 is "not found" error, which is expected
    console.error('즐겨찾기 확인 오류:', error)
  }

  return !!data
}

/**
 * Bookmarks 관련 쿼리
 */
export async function fetchUserBookmarks(userId: string) {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('city_id')
    .eq('user_id', userId)

  if (error) {
    console.error('북마크 조회 오류:', error)
    return []
  }

  return data.map((item) => item.city_id)
}

export async function fetchBookmarkedCities(userId: string) {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('cities(*)')
    .eq('user_id', userId)

  if (error) {
    console.error('북마크된 도시 조회 오류:', error)
    return []
  }

  return data
    .filter((item) => item.cities !== null && Array.isArray(item.cities) && item.cities.length > 0)
    .map((item) => (item.cities as any[])[0])
}

export async function isBookmarked(userId: string, cityId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', userId)
    .eq('city_id', cityId)
    .single()

  if (error && error.code !== 'PGRST116') {
    // PGRST116 is "not found" error, which is expected
    console.error('북마크 확인 오류:', error)
  }

  return !!data
}
