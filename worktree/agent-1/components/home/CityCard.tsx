import Link from 'next/link'
import { City } from '@/lib/types'
import { Star, Zap, Smile, MessageCircle, ArrowRight } from 'lucide-react'

interface CityCardProps {
  city: City
}

export default function CityCard({ city }: CityCardProps) {
  const backgroundStyle = city.image_url
    ? { backgroundImage: `url(${city.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : {}

  const blurredBackgroundStyle = city.image_url
    ? { backgroundImage: `url(${city.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(4px) brightness(0.2)' }
    : {}

  return (
    <Link href={`/cities/${city.id}`} className="block">
      <div
        className="relative border border-gray-200 hover:border-gray-400 transition-all duration-300 overflow-hidden cursor-pointer group min-h-96 flex flex-col hover:-translate-y-1 hover:shadow-xl text-center rounded-lg"
        style={backgroundStyle}
      >
        {/* Blurred background for hover state */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
          style={blurredBackgroundStyle}
        />
        {/* Dark Overlay - Always visible but more transparent on hover */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70 group-hover:from-black/20 group-hover:to-black/40 transition-all duration-300 z-10" />

        {/* Front Content - Emoji, City Name and Score (Always Visible) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
          <div className="text-7xl mb-4 drop-shadow-lg">{city.emoji}</div>
          <h3 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">{city.name}</h3>
          <div className="inline-flex items-center gap-3 bg-black/70 text-white px-6 py-3 rounded-full backdrop-blur-sm border border-white/20 shadow-lg">
            <Star size={20} className="fill-current" />
            <span className="font-bold text-xl">{city.overall_score}</span>
            <span className="text-sm">/10</span>
          </div>
        </div>

        {/* Back Content - All Details (Show on Hover) */}
        <div className="relative z-20 flex flex-col h-full p-7 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Header with city info */}
          <div className="text-center mb-6">
            <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">{city.name}</h3>
            <p className="text-xs text-gray-200 tracking-wide uppercase font-medium drop-shadow">{city.province}</p>
          </div>

          {/* Main Stats */}
          <div className="space-y-4 flex-1 overflow-y-auto">
            <StatRow label="월 생활비" value={city.cost_per_month} />
            <StatRow label="인터넷 속도" value={`${city.internet_speed} Mbps`} />
            <StatRow label="현재 노마드" value={`${city.nomads_count}명`} />
            <StatRow label="카페 평점" value={`${city.cafe_rating}/5`} />
          </div>

          {/* Score Breakdown */}
          <div className="space-y-3 my-6 border-t border-white/20 pt-6">
            <ScoreItem icon={<Zap size={15} />} label="업무" value={city.work_score} />
            <ScoreItem icon={<Smile size={15} />} label="삶의질" value={city.quality_score} />
          </div>

          {/* Reviews */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-200 border-t border-white/20 pt-4">
            <MessageCircle size={16} />
            <span className="font-medium">{city.reviews_count}개 리뷰</span>
          </div>

          {/* Action Button */}
          <div className="flex items-center justify-center gap-2 mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
            <span className="font-bold text-sm text-white">상세 보기</span>
            <ArrowRight size={16} className="text-white" />
          </div>
        </div>
      </div>
    </Link>
  )
}

interface StatRowProps {
  label: string
  value: string
}

function StatRow({ label, value }: StatRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-gray-100 font-medium">{label}</span>
      <span className="font-bold text-white">{value}</span>
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
    <div className="flex items-center justify-between gap-4">
      <span className="flex items-center gap-2 text-gray-100 font-medium">
        <span className="text-white">{icon}</span>
        {label}
      </span>
      <div className="flex items-center gap-2">
        <span className="font-bold text-white text-sm">{value}</span>
        <div className="w-16 h-2 bg-white/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-300"
            style={{ width: `${(value / 10) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
