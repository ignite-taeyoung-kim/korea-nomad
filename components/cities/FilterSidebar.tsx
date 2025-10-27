'use client'

import { regions, sortOptions } from '@/lib/data'
import { useState } from 'react'
import { Filter, X } from 'lucide-react'
import { FilterParams } from '@/lib/types'

interface FilterSidebarProps {
  filters: FilterParams
  onFiltersChange: (filters: Partial<FilterParams>) => void
  onReset: () => void
}

export default function FilterSidebar({ filters, onFiltersChange, onReset }: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleRegion = (region: string) => {
    const newRegions = filters.regions.includes(region)
      ? filters.regions.filter((r) => r !== region)
      : [...filters.regions, region]
    onFiltersChange({ regions: newRegions })
  }

  const handleResetClick = () => {
    onReset()
  }

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Filter size={18} />
          <span>필터</span>
        </button>
      </div>

      {/* Filter Sidebar */}
      <aside
        className={`${
          isOpen ? 'fixed inset-0 z-50 bg-black/50 lg:static lg:bg-transparent lg:z-auto' : 'hidden lg:block'
        }`}
        onClick={() => isOpen && setIsOpen(false)}
      >
        <div
          className="bg-white w-full lg:w-80 h-screen lg:h-auto overflow-y-auto lg:rounded-lg lg:border lg:border-gray-200 lg:p-6 p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6 lg:mb-0 lg:hidden">
            <h2 className="text-lg font-bold text-gray-900">필터</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="lg:block hidden mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-1">필터 & 정렬</h2>
          </div>

          {/* Sort Options */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              정렬
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => onFiltersChange({ sortBy: e.target.value as FilterParams['sortBy'] })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Region Filter */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              지역
            </label>
            <div className="space-y-2">
              {regions.map((region) => (
                <label key={region.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.regions.includes(region.value)}
                    onChange={() => toggleRegion(region.value)}
                    className="w-4 h-4 accent-primary-600"
                  />
                  <span className="text-sm text-gray-700">{region.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Cost Range Filter */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              생활비 범위
            </label>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-600">최소</span>
                  <span className="text-sm font-medium text-gray-900">{filters.costRange.min}M</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={filters.costRange.min}
                  onChange={(e) =>
                    onFiltersChange({
                      costRange: {
                        ...filters.costRange,
                        min: Math.min(Number(e.target.value), filters.costRange.max),
                      },
                    })
                  }
                  className="w-full accent-primary-600"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-600">최대</span>
                  <span className="text-sm font-medium text-gray-900">{filters.costRange.max}M</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={filters.costRange.max}
                  onChange={(e) =>
                    onFiltersChange({
                      costRange: {
                        ...filters.costRange,
                        max: Math.max(Number(e.target.value), filters.costRange.min),
                      },
                    })
                  }
                  className="w-full accent-primary-600"
                />
              </div>
            </div>
          </div>

          {/* Speed Filter */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              최소 인터넷 속도
            </label>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-600">Mbps</span>
              <span className="text-sm font-medium text-gray-900">{filters.minSpeed}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1000"
              step="50"
              value={filters.minSpeed}
              onChange={(e) => onFiltersChange({ minSpeed: Number(e.target.value) })}
              className="w-full accent-primary-600"
            />
          </div>

          {/* User Interaction Filters */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              관심 도시
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.showFavorites ?? false}
                  onChange={(e) => onFiltersChange({ showFavorites: e.target.checked })}
                  className="w-4 h-4 accent-primary-600"
                />
                <span className="text-sm text-gray-700">좋아요한 도시만</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.showBookmarks ?? false}
                  onChange={(e) => onFiltersChange({ showBookmarks: e.target.checked })}
                  className="w-4 h-4 accent-primary-600"
                />
                <span className="text-sm text-gray-700">북마크한 도시만</span>
              </label>
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={handleResetClick}
            className="w-full px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
          >
            초기화
          </button>
        </div>
      </aside>
    </>
  )
}
