import { UserFavorites, UserBookmarks } from './types'

const FAVORITES_KEY = 'nomad_favorites_user'
const BOOKMARKS_KEY = 'nomad_bookmarks_user'

// Favorites
export function getFavorites(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(FAVORITES_KEY)
    if (data) {
      const parsed: UserFavorites = JSON.parse(data)
      return parsed.cityIds
    }
  } catch (error) {
    console.error('Failed to get favorites:', error)
  }
  return []
}

export function addFavorite(cityId: string): void {
  if (typeof window === 'undefined') return
  try {
    const favorites = getFavorites()
    if (!favorites.includes(cityId)) {
      const data: UserFavorites = { cityIds: [...favorites, cityId] }
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(data))
    }
  } catch (error) {
    console.error('Failed to add favorite:', error)
  }
}

export function removeFavorite(cityId: string): void {
  if (typeof window === 'undefined') return
  try {
    const favorites = getFavorites()
    const data: UserFavorites = { cityIds: favorites.filter((id) => id !== cityId) }
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to remove favorite:', error)
  }
}

export function isFavorite(cityId: string): boolean {
  return getFavorites().includes(cityId)
}

// Bookmarks
export function getBookmarks(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(BOOKMARKS_KEY)
    if (data) {
      const parsed: UserBookmarks = JSON.parse(data)
      return parsed.cityIds
    }
  } catch (error) {
    console.error('Failed to get bookmarks:', error)
  }
  return []
}

export function addBookmark(cityId: string): void {
  if (typeof window === 'undefined') return
  try {
    const bookmarks = getBookmarks()
    if (!bookmarks.includes(cityId)) {
      const data: UserBookmarks = { cityIds: [...bookmarks, cityId] }
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(data))
    }
  } catch (error) {
    console.error('Failed to add bookmark:', error)
  }
}

export function removeBookmark(cityId: string): void {
  if (typeof window === 'undefined') return
  try {
    const bookmarks = getBookmarks()
    const data: UserBookmarks = { cityIds: bookmarks.filter((id) => id !== cityId) }
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to remove bookmark:', error)
  }
}

export function isBookmarked(cityId: string): boolean {
  return getBookmarks().includes(cityId)
}
