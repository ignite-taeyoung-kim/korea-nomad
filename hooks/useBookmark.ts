'use client'

import { useState, useEffect, useCallback } from 'react'
import { getBookmarks, addBookmark, removeBookmark, isBookmarked } from '@/lib/storage'

export function useBookmark(cityId: string) {
  const [isBookmark, setIsBookmark] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize bookmark state from localStorage
  useEffect(() => {
    setIsBookmark(isBookmarked(cityId))
    setIsLoading(false)
  }, [cityId])

  // Toggle bookmark
  const toggleBookmark = useCallback(() => {
    if (isBookmark) {
      removeBookmark(cityId)
      setIsBookmark(false)
    } else {
      addBookmark(cityId)
      setIsBookmark(true)
    }
  }, [isBookmark, cityId])

  return {
    isBookmarked: isBookmark,
    toggleBookmark,
    isLoading,
  }
}

// Get all bookmarked city IDs
export function useBookmarksList() {
  const [bookmarks, setBookmarks] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setBookmarks(getBookmarks())
    setIsLoading(false)
  }, [])

  return {
    bookmarks,
    isLoading,
  }
}
