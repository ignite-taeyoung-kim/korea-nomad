/**
 * 최적화된 Supabase 쿼리 함수
 * - 필요한 필드만 선택
 * - 페이지네이션 포함
 * - 캐싱 고려
 */

import { createClient } from '@/utils/supabase/client'
import type { City, Review, Event } from '@/lib/types'

const supabase = createClient()

// 페이지네이션 설정
const ITEMS_PER_PAGE = 20

/**
 * Cities 관련 쿼리 (최적화)
 */

// 필요한 필드만 선택
const CITY_SELECT = 'id,name,province,emoji,overall_score,cost_per_month,internet_speed,nomads_count,cafe_rating,work_score,quality_score,reviews_count,description,image_url,gallery_images,weather,currency'

export async function fetchCitiesOptimized(page: number = 1) {
  const start = (page - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE - 1

  const { data, error } = await supabase
    .from('cities')
    .select(CITY_SELECT)
    .order('overall_score', { ascending: false })
    .range(start, end)

  if (error) {
    console.error('도시 데이터 조회 오류:', error)
    return { data: [], total: 0 }
  }

  // 전체 개수 조회
  const { count } = await supabase
    .from('cities')
    .select('id', { count: 'exact', head: true })

  return {
    data: data as City[],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / ITEMS_PER_PAGE)
  }
}

export async function fetchCityByIdOptimized(id: string) {
  const { data, error } = await supabase
    .from('cities')
    .select(CITY_SELECT)
    .eq('id', id)
    .single()

  if (error) {
    console.error('도시 상세 조회 오류:', error)
    return null
  }

  return data as City
}

/**
 * Reviews 관련 쿼리 (최적화)
 */

const REVIEW_SELECT = 'id,user_id,city_id,title,content,rating,username,created_at'

export async function fetchReviewsByCityIdOptimized(cityId: string, page: number = 1) {
  const start = (page - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE - 1

  const { data, error } = await supabase
    .from('reviews')
    .select(REVIEW_SELECT)
    .eq('city_id', cityId)
    .order('created_at', { ascending: false })
    .range(start, end)

  if (error) {
    console.error('리뷰 조회 오류:', error)
    return { data: [], total: 0 }
  }

  // 전체 개수 조회
  const { count } = await supabase
    .from('reviews')
    .select('id', { count: 'exact', head: true })
    .eq('city_id', cityId)

  return {
    data: data as Review[],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / ITEMS_PER_PAGE)
  }
}

export async function fetchUserReviewsOptimized(userId: string, page: number = 1) {
  const start = (page - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE - 1

  const { data, error } = await supabase
    .from('reviews')
    .select(REVIEW_SELECT)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(start, end)

  if (error) {
    console.error('사용자 리뷰 조회 오류:', error)
    return { data: [], total: 0 }
  }

  // 전체 개수 조회
  const { count } = await supabase
    .from('reviews')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)

  return {
    data: data as Review[],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / ITEMS_PER_PAGE)
  }
}

/**
 * Events 관련 쿼리 (최적화)
 */

const EVENT_SELECT = 'id,city_id,title,description,category,date,time,location,creator_id,creator_name,participant_count,created_at'

export async function fetchEventsByCityIdOptimized(cityId: string, page: number = 1) {
  const start = (page - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE - 1

  const { data, error } = await supabase
    .from('events')
    .select(EVENT_SELECT)
    .eq('city_id', cityId)
    .order('date', { ascending: true })
    .range(start, end)

  if (error) {
    console.error('이벤트 조회 오류:', error)
    return { data: [], total: 0 }
  }

  // 전체 개수 조회
  const { count } = await supabase
    .from('events')
    .select('id', { count: 'exact', head: true })
    .eq('city_id', cityId)

  return {
    data: data as Event[],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / ITEMS_PER_PAGE)
  }
}

export async function fetchUpcomingEventsOptimized(days: number = 30, page: number = 1) {
  const today = new Date().toISOString().split('T')[0]
  const futureDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0]

  const start = (page - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE - 1

  const { data, error } = await supabase
    .from('events')
    .select(EVENT_SELECT)
    .gte('date', today)
    .lte('date', futureDate)
    .order('date', { ascending: true })
    .range(start, end)

  if (error) {
    console.error('예정된 이벤트 조회 오류:', error)
    return { data: [], total: 0 }
  }

  // 전체 개수 조회
  const { count } = await supabase
    .from('events')
    .select('id', { count: 'exact', head: true })
    .gte('date', today)
    .lte('date', futureDate)

  return {
    data: data as Event[],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / ITEMS_PER_PAGE)
  }
}

export async function fetchUserCreatedEventsOptimized(userId: string, page: number = 1) {
  const start = (page - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE - 1

  const { data, error } = await supabase
    .from('events')
    .select(EVENT_SELECT)
    .eq('creator_id', userId)
    .order('date', { ascending: false })
    .range(start, end)

  if (error) {
    console.error('사용자가 만든 이벤트 조회 오류:', error)
    return { data: [], total: 0 }
  }

  // 전체 개수 조회
  const { count } = await supabase
    .from('events')
    .select('id', { count: 'exact', head: true })
    .eq('creator_id', userId)

  return {
    data: data as Event[],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / ITEMS_PER_PAGE)
  }
}

/**
 * Favorites 관련 쿼리 (최적화)
 */

export async function fetchUserFavoritesOptimized(userId: string) {
  const { data, error } = await supabase
    .from('favorites')
    .select('city_id')
    .eq('user_id', userId)
    .limit(100) // 최대 100개

  if (error) {
    console.error('즐겨찾기 조회 오류:', error)
    return []
  }

  return data.map((item) => item.city_id)
}

export async function fetchFavoritesCitiesOptimized(userId: string, page: number = 1) {
  const start = (page - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE - 1

  const { data, error } = await supabase
    .from('favorites')
    .select(`city_id, cities(${CITY_SELECT})`)
    .eq('user_id', userId)
    .range(start, end)

  if (error) {
    console.error('즐겨찾기 도시 조회 오류:', error)
    return { data: [], total: 0 }
  }

  // 전체 개수 조회
  const { count } = await supabase
    .from('favorites')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)

  const cities = data
    .filter((item): item is { city_id: string; cities: City } => item.cities !== null)
    .map((item) => item.cities)

  return {
    data: cities,
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / ITEMS_PER_PAGE)
  }
}

/**
 * Bookmarks 관련 쿼리 (최적화)
 */

export async function fetchUserBookmarksOptimized(userId: string) {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('city_id')
    .eq('user_id', userId)
    .limit(100) // 최대 100개

  if (error) {
    console.error('북마크 조회 오류:', error)
    return []
  }

  return data.map((item) => item.city_id)
}

export async function fetchBookmarkedCitiesOptimized(userId: string, page: number = 1) {
  const start = (page - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE - 1

  const { data, error } = await supabase
    .from('bookmarks')
    .select(`city_id, cities(${CITY_SELECT})`)
    .eq('user_id', userId)
    .range(start, end)

  if (error) {
    console.error('북마크된 도시 조회 오류:', error)
    return { data: [], total: 0 }
  }

  // 전체 개수 조회
  const { count } = await supabase
    .from('bookmarks')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)

  const cities = data
    .filter((item): item is { cities: City | null } => item.cities !== null)
    .map((item) => item.cities as City)

  return {
    data: cities,
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / ITEMS_PER_PAGE)
  }
}
