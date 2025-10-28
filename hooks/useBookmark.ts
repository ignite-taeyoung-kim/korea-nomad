'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { isBookmarked as checkBookmarked, fetchUserBookmarks } from '@/lib/supabase/queries'

export function useBookmark(cityId: string) {
  const [isBookmark, setIsBookmark] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  // Initialize bookmark state from Supabase
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          setIsBookmark(false)
          setIsLoading(false)
          return
        }

        const isBookmarkedStatus = await checkBookmarked(user.id, cityId)
        setIsBookmark(isBookmarkedStatus)
      } catch (error) {
        console.error('북마크 상태 확인 오류:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkBookmarkStatus()
  }, [cityId, supabase])

  // Toggle bookmark
  const toggleBookmark = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        alert('로그인이 필요합니다')
        return
      }

      if (isBookmark) {
        // Remove from bookmarks
        await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('city_id', cityId)
        setIsBookmark(false)
      } else {
        // Add to bookmarks
        await supabase.from('bookmarks').insert({
          user_id: user.id,
          city_id: cityId,
        })
        setIsBookmark(true)
      }
    } catch (error) {
      console.error('북마크 토글 오류:', error)
    }
  }, [isBookmark, cityId, supabase])

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
  const supabase = createClient()

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          setBookmarks([])
          setIsLoading(false)
          return
        }

        const bookmarkIds = await fetchUserBookmarks(user.id)
        setBookmarks(bookmarkIds)
      } catch (error) {
        console.error('북마크 목록 조회 오류:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookmarks()
  }, [supabase])

  return {
    bookmarks,
    isLoading,
  }
}
