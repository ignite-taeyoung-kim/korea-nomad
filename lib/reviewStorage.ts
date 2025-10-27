import { Review } from './types'
import { reviews as mockReviews } from './data'

const REVIEW_KEY_PREFIX = 'nomad_reviews_city_'

// Get all reviews for a city (mock + localStorage)
export function getReviewsForCity(cityId: string): Review[] {
  if (typeof window === 'undefined') return []

  // Get mock reviews for this city
  const mockCityReviews = mockReviews.filter((r) => r.city_id === cityId)

  // Get localStorage reviews for this city
  const storedReviews = getStoredReviewsForCity(cityId)

  // Combine and sort by created_at (newest first)
  return [...mockCityReviews, ...storedReviews].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })
}

// Get reviews from localStorage only
function getStoredReviewsForCity(cityId: string): Review[] {
  if (typeof window === 'undefined') return []

  try {
    const key = `${REVIEW_KEY_PREFIX}${cityId}`
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

// Add a new review
export function addReview(cityId: string, review: Omit<Review, 'id'>): Review {
  if (typeof window === 'undefined')
    throw new Error('Cannot add review on server')

  const newReview: Review = {
    ...review,
    id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  }

  const stored = getStoredReviewsForCity(cityId)
  const updated = [...stored, newReview]

  try {
    const key = `${REVIEW_KEY_PREFIX}${cityId}`
    localStorage.setItem(key, JSON.stringify(updated))
  } catch {
    console.error('Failed to save review')
  }

  return newReview
}

// Update an existing review
export function updateReview(
  cityId: string,
  reviewId: string,
  updates: Partial<Omit<Review, 'id' | 'user_id' | 'city_id' | 'created_at'>>
): Review | null {
  if (typeof window === 'undefined')
    throw new Error('Cannot update review on server')

  const stored = getStoredReviewsForCity(cityId)
  const index = stored.findIndex((r) => r.id === reviewId)

  if (index === -1) return null

  const updated = [...stored]
  updated[index] = { ...updated[index], ...updates }

  try {
    const key = `${REVIEW_KEY_PREFIX}${cityId}`
    localStorage.setItem(key, JSON.stringify(updated))
  } catch {
    console.error('Failed to update review')
  }

  return updated[index]
}

// Delete a review
export function deleteReview(cityId: string, reviewId: string): boolean {
  if (typeof window === 'undefined')
    throw new Error('Cannot delete review on server')

  const stored = getStoredReviewsForCity(cityId)
  const filtered = stored.filter((r) => r.id !== reviewId)

  if (filtered.length === stored.length) return false // Not found

  try {
    const key = `${REVIEW_KEY_PREFIX}${cityId}`
    localStorage.setItem(key, JSON.stringify(filtered))
  } catch {
    console.error('Failed to delete review')
  }

  return true
}

// Calculate average rating for a city
export function getAverageRating(cityId: string): number {
  const reviews = getReviewsForCity(cityId)
  if (reviews.length === 0) return 0

  const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
  return parseFloat((sum / reviews.length).toFixed(1))
}

// Get reviews sorted by date (newest first)
export function getReviewsByDate(cityId: string): Review[] {
  return getReviewsForCity(cityId).sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })
}

// Get reviews sorted by rating (highest first)
export function getReviewsByRating(cityId: string): Review[] {
  return getReviewsForCity(cityId).sort((a, b) => b.rating - a.rating)
}
