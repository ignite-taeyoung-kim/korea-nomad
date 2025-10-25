'use client'

import { stats } from '@/lib/data'
import { Search, Filter } from 'lucide-react'
import { useState } from 'react'

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="bg-gradient-to-br from-primary-50 via-earth-50 to-nature-50 py-12 sm:py-16 lg:py-20 border-b border-earth-200 nature-pattern">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Title */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-nature-900 mb-4">
            🌿 한국에서 노마드 생활하기 🌿
          </h1>
          <p className="text-lg sm:text-xl text-earth-700">
            자연과 함께하는 당신에게 맞는 도시를 찾아보세요
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8 py-8">
          <StatCard
            icon="💼"
            label="참여 사용자"
            value={stats.total_users.toLocaleString('ko-KR')}
          />
          <StatCard
            icon="🏙️"
            label="분석 도시"
            value={stats.total_cities}
          />
          <StatCard
            icon="⭐️"
            label="평가된 항목"
            value={`${stats.total_items_rated}+`}
          />
          <StatCard
            icon="📝"
            label="작성된 리뷰"
            value={`${stats.total_reviews.toLocaleString('ko-KR')}개`}
          />
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="도시 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-earth-300 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent leaf-shadow"
            />
            <Search className="absolute left-4 top-3.5 text-earth-500" size={18} />
          </div>

          <button className="px-6 py-3 bg-earth-50 border border-earth-300 rounded-xl font-medium text-earth-700 hover:bg-earth-100 transition-colors flex items-center justify-center gap-2 whitespace-nowrap leaf-shadow">
            <Filter size={18} />
            <span>필터 적용</span>
          </button>

          <button className="px-6 py-3 bg-gradient-to-r from-primary-600 to-nature-600 text-white rounded-xl font-medium hover:from-primary-700 hover:to-nature-700 transition-all flex items-center justify-center gap-2 whitespace-nowrap leaf-shadow">
            <Search size={18} />
            <span>검색</span>
          </button>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 p-4 bg-earth-50/80 backdrop-blur-sm border border-earth-200 rounded-xl inline-block text-sm text-earth-700 leaf-shadow">
          <span className="font-medium text-nature-900">🌱 팁:</span> 도시 카드를 클릭하여 상세 정보를 확인하세요
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  icon: string
  label: string
  value: string | number
}

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-earth-200 p-4 hover:shadow-lg transition-all leaf-shadow">
      <div className="text-2xl sm:text-3xl mb-2">{icon}</div>
      <p className="text-xs sm:text-sm text-earth-600 mb-1">{label}</p>
      <p className="text-lg sm:text-xl font-bold text-nature-900">{value}</p>
    </div>
  )
}
