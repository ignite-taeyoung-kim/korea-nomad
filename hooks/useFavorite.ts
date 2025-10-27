'use client'

import { useState, useEffect, useCallback } from 'react'
import { getFavorites, addFavorite, removeFavorite, isFavorite } from '@/lib/storage'

export function useFavorite(cityId: string) {
  const [isFav, setIsFav] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize favorite state from localStorage
  useEffect(() => {
    setIsFav(isFavorite(cityId))
    setIsLoading(false)
  }, [cityId])

  // Toggle favorite
  const toggleFavorite = useCallback(() => {
    if (isFav) {
      removeFavorite(cityId)
      setIsFav(false)
    } else {
      addFavorite(cityId)
      setIsFav(true)
    }
  }, [isFav, cityId])

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

  useEffect(() => {
    setFavorites(getFavorites())
    setIsLoading(false)
  }, [])

  return {
    favorites,
    isLoading,
  }
}
