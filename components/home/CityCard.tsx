import Link from 'next/link'
import { City } from '@/lib/types'
import { Star, Wifi, Users, Coffee, Zap, Smile, MessageCircle, ArrowRight } from 'lucide-react'

interface CityCardProps {
  city: City
}

export default function CityCard({ city }: CityCardProps) {
  return (
    <Link href={`/cities/${city.id}`}>
      <div className="bg-white border border-gray-200 rounded-lg hover:shadow-lg hover:border-primary-300 transition-all duration-300 overflow-hidden cursor-pointer group">
        {/* Header with emoji and city info */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-primary-50 to-transparent">
          <div className="text-4xl mb-3">{city.emoji}</div>
          <h3 className="text-lg font-bold text-gray-900">{city.name}</h3>
          <p className="text-sm text-gray-600">{city.province}</p>
        </div>

        {/* Score Section */}
        <div className="px-6 pt-4 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Star size={16} className="text-yellow-500 fill-yellow-500" />
            <span className="font-bold text-gray-900">{city.overall_score}/10</span>
          </div>
        </div>

        {/* Main Stats */}
        <div className="px-6 py-4 space-y-3 border-b border-gray-100">
          <StatRow icon="💰" label="월 생활비" value={city.cost_per_month} />
          <StatRow icon="📶" label="인터넷 속도" value={`${city.internet_speed} Mbps`} />
          <StatRow icon="👥" label="현재 노마드" value={`${city.nomads_count}명`} />
          <StatRow icon="☕" label="카페 평점" value={`${city.cafe_rating}/5`} />
        </div>

        {/* Score Breakdown */}
        <div className="px-6 py-4 space-y-2 border-b border-gray-100 text-sm">
          <ScoreItem icon={<Zap size={14} />} label="업무" value={city.work_score} />
          <ScoreItem icon={<Smile size={14} />} label="삶의질" value={city.quality_score} />
        </div>

        {/* Reviews */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2 text-sm text-gray-600">
          <MessageCircle size={14} />
          <span>{city.reviews_count}개 리뷰</span>
        </div>

        {/* Action Button */}
        <div className="px-6 py-4 bg-primary-50 group-hover:bg-primary-100 transition-colors flex items-center justify-between">
          <span className="font-medium text-primary-600 text-sm">상세 보기</span>
          <ArrowRight size={16} className="text-primary-600 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  )
}

interface StatRowProps {
  icon: string
  label: string
  value: string
}

function StatRow({ icon, label, value }: StatRowProps) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-600">
        <span className="mr-1">{icon}</span>
        {label}
      </span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  )
}

interface ScoreItemProps {
  icon: React.ReactNode
  label: string
  value: number
}

function ScoreItem({ icon, label, value }: ScoreItemProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-gray-700">
        {icon}
        {label}: {value}
      </span>
      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
          style={{ width: `${(value / 10) * 100}%` }}
        />
      </div>
    </div>
  )
}
