'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { isFavorite as checkFavorite, fetchUserFavorites } from '@/lib/supabase/queries'

export function useFavorite(cityId: string) {
  const [isFav, setIsFav] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  // Initialize favorite state from Supabase
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          setIsFav(false)
          setIsLoading(false)
          return
        }

        const isFavStatus = await checkFavorite(user.id, cityId)
        setIsFav(isFavStatus)
      } catch (error) {
        console.error('즐겨찾기 상태 확인 오류:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkFavoriteStatus()
  }, [cityId, supabase])

  // Toggle favorite
  const toggleFavorite = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        alert('로그인이 필요합니다')
        return
      }

      if (isFav) {
        // Remove from favorites
        await supabase.from('favorites').delete().eq('user_id', user.id).eq('city_id', cityId)
        setIsFav(false)
      } else {
        // Add to favorites
        await supabase.from('favorites').insert({
          user_id: user.id,
          city_id: cityId,
        })
        setIsFav(true)
      }
    } catch (error) {
      console.error('즐겨찾기 토글 오류:', error)
    }
  }, [isFav, cityId, supabase])

  return {
    isFavorite: isFav,
    toggleFavorite,
    isLoading,
  }
}

// Get all favorite city IDs
export function useFavoritesList() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          setFavorites([])
          setIsLoading(false)
          return
        }

        const favoriteIds = await fetchUserFavorites(user.id)
        setFavorites(favoriteIds)
      } catch (error) {
        console.error('즐겨찾기 목록 조회 오류:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFavorites()
  }, [supabase])

  return {
    favorites,
    isLoading,
  }
}
