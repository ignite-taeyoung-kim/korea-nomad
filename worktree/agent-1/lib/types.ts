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
  description?: string
  image_url?: string
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
}

export interface Meetup {
  id: string
  city_id: string
  title: string
  date: string
  location: string
}

export interface NewMember {
  id: string
  username: string
  joined_date: string
  avatar_url?: string
}
