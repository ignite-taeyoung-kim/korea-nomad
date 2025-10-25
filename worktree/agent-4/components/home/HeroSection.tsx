'use client'

import { stats } from '@/lib/data'
import { Search, Filter, Sparkles } from 'lucide-react'
import { useState } from 'react'

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="relative bg-luxury-radial py-16 sm:py-20 lg:py-28 border-b border-luxury-gold-500/20 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border border-luxury-gold-500 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 border border-luxury-gold-500 rounded-full"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Main Title */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="text-luxury-gold-500" size={32} />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-luxury font-bold text-luxury-white-cream tracking-wide">
              한국에서 노마드 생활하기
            </h1>
            <Sparkles className="text-luxury-gold-500" size={32} />
          </div>
          <p className="text-xl sm:text-2xl text-luxury-gold-300 font-light tracking-wide">
            당신에게 맞는 최고의 도시를 찾아보세요
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-12 py-12">
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
        <div className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="도시를 검색하세요..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pl-14 bg-luxury-black-light border-2 border-luxury-gold-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold-500 focus:border-luxury-gold-500 text-luxury-white-cream placeholder-luxury-gold-300/50 text-lg"
            />
            <Search className="absolute left-5 top-4.5 text-luxury-gold-500" size={22} />
          </div>

          <button className="px-8 py-4 bg-luxury-black-light border-2 border-luxury-gold-500/30 rounded-lg font-medium text-luxury-white-cream hover:bg-luxury-gold-500/10 hover:border-luxury-gold-500 transition-all flex items-center justify-center gap-2 whitespace-nowrap text-lg">
            <Filter size={22} />
            <span>필터</span>
          </button>

          <button className="px-8 py-4 bg-gradient-to-r from-luxury-gold-500 to-luxury-gold-600 text-luxury-black rounded-lg font-bold hover:shadow-luxury-lg transition-all hover:scale-105 flex items-center justify-center gap-2 whitespace-nowrap text-lg">
            <Search size={22} />
            <span>검색</span>
          </button>
        </div>

        {/* Quick Tips */}
        <div className="mt-12 p-6 bg-luxury-black-light/80 border border-luxury-gold-500/20 rounded-xl inline-block backdrop-blur-sm">
          <p className="text-base text-luxury-white-cream">
            <span className="font-bold text-luxury-gold-500 text-lg">✨ 팁:</span>
            <span className="ml-2">도시 카드를 클릭하여 상세 정보를 확인하세요</span>
          </p>
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
    <div className="bg-luxury-black-light rounded-xl border-2 border-luxury-gold-500/20 p-6 hover:shadow-luxury-lg hover:border-luxury-gold-500/40 transition-all backdrop-blur-sm">
      <div className="text-3xl sm:text-4xl mb-3">{icon}</div>
      <p className="text-sm sm:text-base text-luxury-gold-300 mb-2 font-light tracking-wide">{label}</p>
      <p className="text-2xl sm:text-3xl font-bold text-luxury-gold-500">{value}</p>
    </div>
  )
}
