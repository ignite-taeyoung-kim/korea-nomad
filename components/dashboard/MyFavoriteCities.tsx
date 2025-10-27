'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { City } from '@/lib/types'
import { cities } from '@/lib/data'
import { getFavorites, removeFavorite } from '@/lib/storage'
import { Heart } from 'lucide-react'

export default function MyFavoriteCities() {
  const [favoriteCities, setFavoriteCities] = useState<City[]>([])

  useEffect(() => {
    const favoriteIds = getFavorites()
    const favs = cities.filter((city) => favoriteIds.includes(city.id))
    setFavoriteCities(favs)
  }, [])

  const handleRemoveFavorite = (cityId: string) => {
    removeFavorite(cityId)
    setFavoriteCities((prev) => prev.filter((city) => city.id !== cityId))
  }

  if (favoriteCities.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <Heart size={40} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-600 mb-4">좋아요한 도시가 없습니다.</p>
        <Link href="/cities" className="text-primary-600 hover:text-primary-700 font-medium">
          도시 탐색하기
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {favoriteCities.map((city) => (
        <div
          key={city.id}
          className="bg-white rounded-lg border border-gray-200 p-4 hover:border-primary-300 transition-colors group"
        >
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-900">{city.emoji} {city.name}</h3>
            <button
              onClick={() => handleRemoveFavorite(city.id)}
              className="text-red-600 hover:text-red-700 transition-colors"
            >
              <Heart size={20} className="fill-red-600" />
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-2">{city.province}</p>

          <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
            <div>
              <p className="text-gray-600">생활비</p>
              <p className="font-semibold text-gray-900">{city.cost_per_month}</p>
            </div>
            <div>
              <p className="text-gray-600">평점</p>
              <p className="font-semibold text-gray-900">⭐ {city.overall_score}</p>
            </div>
          </div>

          <Link
            href={`/cities/${city.id}`}
            className="inline-block w-full px-3 py-2 bg-primary-50 text-primary-600 rounded font-medium text-center text-sm hover:bg-primary-100 transition-colors"
          >
            상세 보기
          </Link>
        </div>
      ))}
    </div>
  )
}
