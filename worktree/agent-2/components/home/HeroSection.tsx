'use client'

import { stats } from '@/lib/data'
import { Search, Filter } from 'lucide-react'
import { useState } from 'react'

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="bg-cyber-dark cyber-grid py-12 sm:py-16 lg:py-20 border-b-2 border-neon-blue shadow-neon-blue relative overflow-hidden">
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/5 via-transparent to-neon-blue/5 animate-pulse-neon"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Main Title */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold neon-text-pink mb-4 animate-glow">
            🌍 한국에서 노마드 생활하기 🌍
          </h1>
          <p className="text-lg sm:text-xl text-neon-blue">
            당신에게 맞는 도시를 찾아보세요
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
              className="w-full px-4 py-3 pl-12 bg-cyber-gray border-2 border-neon-purple/50 rounded-lg focus:outline-none focus:border-neon-purple focus:shadow-neon-purple text-white placeholder-gray-400 transition-all"
            />
            <Search className="absolute left-4 top-3.5 text-neon-purple" size={18} />
          </div>

          <button className="px-6 py-3 bg-cyber-gray border-2 border-neon-blue/50 rounded-lg font-medium text-neon-blue hover:bg-cyber-gray-light hover:border-neon-blue hover:shadow-neon-blue transition-all flex items-center justify-center gap-2 whitespace-nowrap">
            <Filter size={18} />
            <span>필터 적용</span>
          </button>

          <button className="px-6 py-3 bg-gradient-to-r from-neon-pink to-neon-purple text-white rounded-lg font-bold hover:shadow-neon-pink transition-all flex items-center justify-center gap-2 whitespace-nowrap">
            <Search size={18} />
            <span>검색</span>
          </button>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 p-4 bg-cyber-gray border-2 border-neon-green/50 rounded-lg inline-block text-sm text-gray-300 shadow-neon-green">
          <span className="font-medium text-neon-green">💡 팁:</span> 도시 카드를 클릭하여 상세 정보를 확인하세요
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
    <div className="bg-cyber-gray rounded-lg border-2 border-neon-blue/30 p-4 hover:border-neon-blue hover:shadow-neon-blue transition-all">
      <div className="text-2xl sm:text-3xl mb-2">{icon}</div>
      <p className="text-xs sm:text-sm text-gray-400 mb-1">{label}</p>
      <p className="text-lg sm:text-xl font-bold text-neon-blue">{value}</p>
    </div>
  )
}
