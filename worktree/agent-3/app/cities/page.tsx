'use client'

import { Suspense } from 'react'
import { cities } from '@/lib/data'
import CityCard from '@/components/home/CityCard'
import FilterSidebar from '@/components/cities/FilterSidebar'
import SearchBar from '@/components/cities/SearchBar'
import EmptyState from '@/components/cities/EmptyState'
import { useFilters } from '@/hooks/useFilters'
import { applyFilters } from '@/lib/filters'

function CitiesContent() {
  const { filters, updateFilters, resetFilters } = useFilters()

  const filteredCities = applyFilters(cities, filters)

  const handleSearchChange = (search: string) => {
    updateFilters({ search })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            모든 도시 찾아보기
          </h1>
          <p className="text-gray-600">
            한국의 모든 도시를 비교하고 당신의 노마드 생활을 계획하세요 ({filteredCities.length}개)
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <FilterSidebar filters={filters} onFiltersChange={updateFilters} onReset={resetFilters} />

          {/* Cities Grid */}
          <div className="flex-1 min-w-0">
            {/* Search Bar */}
            <SearchBar value={filters.search} onChange={handleSearchChange} />

            {/* Cities Grid */}
            {filteredCities.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCities.map((city) => (
                  <CityCard key={city.id} city={city} />
                ))}
              </div>
            ) : (
              <EmptyState onReset={resetFilters} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CitiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <CitiesContent />
    </Suspense>
  )
}
