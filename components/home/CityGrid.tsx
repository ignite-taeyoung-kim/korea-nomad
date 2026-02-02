'use client'

import { useState, useEffect } from 'react'
import { fetchCities } from '@/lib/supabase/queries'
import CityCard from './CityCard'
import type { City } from '@/lib/types'

export default function CityGrid() {
  const [cities, setCities] = useState<City[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCities = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchCities()
        setCities(data || [])
        if (!data || data.length === 0) {
          setError(null)
        }
      } catch (err) {
        console.error('Failed to fetch cities:', err)
        setError('도시 정보를 불러오지 못했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    loadCities()
  }, [])

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-gray-600">
          도시 정보를 불러오는 중...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-red-600">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section Title */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          인기 도시 BEST 8
        </h2>
        <p className="text-gray-600">
          노마드들이 가장 선호하는 도시들을 한눈에 비교해보세요
        </p>
      </div>

      {/* City Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cities.map((city) => (
          <CityCard key={city.id} city={city} />
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-12 text-center">
        <button className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
          모든 도시 보기 ({cities.length}개)
        </button>
      </div>
    </div>
  )
}
