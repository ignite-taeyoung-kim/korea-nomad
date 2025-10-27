'use client'

import { City, Event } from '@/lib/types'

interface EventFilterProps {
  cities: City[]
  selectedCity?: string | null
  selectedCategory?: Event['category'] | null
  onCityChange: (cityId: string | null) => void
  onCategoryChange: (category: Event['category'] | null) => void
}

const categoryLabel: Record<Event['category'], string> = {
  networking: '네트워킹',
  workshop: '워크숍',
  social: '사교',
  sports: '스포츠',
  culture: '문화',
}

const categories: Event['category'][] = ['networking', 'workshop', 'social', 'sports', 'culture']

export default function EventFilter({
  cities,
  selectedCity,
  selectedCategory,
  onCityChange,
  onCategoryChange,
}: EventFilterProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* City Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            도시별 필터
          </label>
          <select
            value={selectedCity || ''}
            onChange={(e) => onCityChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">모든 도시</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.emoji} {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            카테고리별 필터
          </label>
          <select
            value={selectedCategory || ''}
            onChange={(e) => onCategoryChange((e.target.value as Event['category']) || null)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">모든 카테고리</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {categoryLabel[category]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
