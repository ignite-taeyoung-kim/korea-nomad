export interface Activity {
  id: string
  name: string
  category: 'food' | 'activity' | 'nature' | 'culture' | 'shopping'
  description: string
  icon: string
}

export interface Tip {
  id: string
  title: string
  description: string
  category: 'transport' | 'food' | 'culture' | 'safety' | 'accommodation'
  icon: string
}

export interface Weather {
  temperature: number
  condition: string
  icon: string
  humidity: number
}

export interface City {
  id: string
  name: string
  province: string
  emoji: string
  overall_score: number
  cost_per_month: string
  internet_speed: number
  nomads_count: number
  cafe_rating: number
  work_score: number
  quality_score: number
  reviews_count: number
  likes_count?: number
  dislikes_count?: number
  description?: string
  image_url?: string
  gallery_images?: string[]
  activities?: Activity[]
  tips?: Tip[]
  weather?: Weather
  currency?: {
    code: string
    exchange_rate: number
  }
}

export interface User {
  id: string
  email: string
  gender: string
  created_at: string
}

export interface Review {
  id: string
  user_id: string
  city_id: string
  title: string
  content: string
  rating: number
  created_at: string
  username: string
}

export interface Event {
  id: string
  city_id: string
  title: string
  description: string
  category: 'networking' | 'workshop' | 'social' | 'sports' | 'culture'
  date: string
  time: string
  location: string
  creator_id: string
  creator_name: string
  participant_count: number
  created_at: string
}

// Legacy support
export type Meetup = Event

export interface NewMember {
  id: string
  username: string
  joined_date: string
  avatar_url?: string
}

export interface FilterParams {
  search: string
  regions: string[]
  costRange: { min: number; max: number }
  minSpeed: number
  sortBy: 'overall' | 'cheap' | 'fast' | 'active' | 'quality' | 'reviews'
  showFavorites?: boolean
  showBookmarks?: boolean
}

export interface UserFavorites {
  cityIds: string[]
}

export interface UserBookmarks {
  cityIds: string[]
}

export interface UserProfile {
  id: string
  email: string
  name: string
  bio?: string
  avatar_url?: string
  created_at: string
}
