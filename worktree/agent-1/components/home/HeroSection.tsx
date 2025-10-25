'use client'

import { stats } from '@/lib/data'
import { Search, Filter } from 'lucide-react'
import { useState } from 'react'

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="bg-white py-16 sm:py-20 lg:py-28 border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        {/* Main Title */}
        <div className="mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-black mb-6 tracking-tight">
            한국에서 노마드 생활하기
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 font-light">
            당신에게 맞는 도시를 찾아보세요
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-16 py-12">
          <StatCard
            label="참여 사용자"
            value={stats.total_users.toLocaleString('ko-KR')}
          />
          <StatCard
            label="분석 도시"
            value={stats.total_cities}
          />
          <StatCard
            label="평가된 항목"
            value={`${stats.total_items_rated}+`}
          />
          <StatCard
            label="작성된 리뷰"
            value={`${stats.total_reviews.toLocaleString('ko-KR')}개`}
          />
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="도시 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-4 pl-12 border border-gray-300 focus:outline-none focus:border-black transition-colors text-base"
            />
            <Search className="absolute left-4 top-4 text-gray-400" size={20} />
          </div>

          <button className="px-6 py-4 bg-white border border-gray-300 text-gray-700 hover:border-black hover:text-black transition-colors flex items-center justify-center gap-2 whitespace-nowrap text-base">
            <Filter size={18} />
            <span>필터</span>
          </button>

          <button className="px-8 py-4 bg-black text-white hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 whitespace-nowrap text-base">
            <Search size={18} />
            <span>검색</span>
          </button>
        </div>

        {/* Quick Tips */}
        <div className="mt-12 p-5 bg-gray-50 border border-gray-200 inline-block text-sm text-gray-600">
          <span className="font-medium text-black">팁:</span> 도시 카드를 클릭하여 상세 정보를 확인하세요
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string | number
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="py-4">
      <p className="text-xs sm:text-sm text-gray-500 mb-2 uppercase tracking-wider">{label}</p>
      <p className="text-2xl sm:text-3xl font-semibold text-black">{value}</p>
    </div>
  )
}
