import { cities } from '@/lib/data'
import { notFound } from 'next/navigation'
import { ArrowLeft, Star, Users, Wifi, Coffee, MapPin } from 'lucide-react'
import Link from 'next/link'
import CityActionButtons from '@/components/cities/CityActionButtons'
import CityReviewsSection from '@/components/reviews/CityReviewsSection'

interface Props {
  params: Promise<{ id: string }>
}

export default async function CityDetailPage({ params }: Props) {
  const { id } = await params
  const city = cities.find((c) => c.id === id)

  if (!city) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/cities"
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 font-medium"
          >
            <ArrowLeft size={18} />
            돌아가기
          </Link>

          <div className="flex items-start gap-6 sm:gap-8">
            <div className="text-5xl sm:text-6xl">{city.emoji}</div>
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                {city.name}
              </h1>
              <p className="text-lg text-gray-600 mb-4 flex items-center gap-2">
                <MapPin size={18} />
                {city.province}
              </p>
              <div className="flex items-center gap-4 flex-wrap mb-4">
                <div className="flex items-center gap-2">
                  <Star size={20} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-2xl font-bold text-gray-900">{city.overall_score}/10</span>
                </div>
                <div className="text-gray-600">
                  <span className="font-medium text-gray-900">{city.reviews_count}</span>개 리뷰
                </div>
              </div>
              <CityActionButtons cityId={city.id} />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Left Column */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">기본 정보</h2>
            <div className="space-y-4">
              <InfoCard
                icon="💰"
                label="월 생활비"
                value={city.cost_per_month}
              />
              <InfoCard
                icon="📶"
                label="인터넷 속도"
                value={`${city.internet_speed} Mbps`}
              />
              <InfoCard
                icon="👥"
                label="현재 노마드"
                value={`${city.nomads_count}명`}
              />
              <InfoCard
                icon="☕"
                label="카페 평점"
                value={`${city.cafe_rating}/5`}
              />
            </div>
          </div>

          {/* Right Column */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">점수 분석</h2>
            <div className="space-y-4">
              <ScoreCard
                label="업무 환경"
                score={city.work_score}
                icon="💻"
              />
              <ScoreCard
                label="삶의 질"
                score={city.quality_score}
                icon="🎉"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        {city.description && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">도시 소개</h2>
            <p className="text-gray-700 leading-relaxed">{city.description}</p>
          </div>
        )}

        {/* Reviews Section */}
        <CityReviewsSection cityId={city.id} reviewCount={city.reviews_count} />

        {/* Action Buttons */}
        <CityActionButtons cityId={city.id} showText={true} />
      </div>
    </div>
  )
}

interface InfoCardProps {
  icon: string
  label: string
  value: string | number
}

function InfoCard({ icon, label, value }: InfoCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between">
      <span className="text-gray-600">
        <span className="mr-2 text-xl">{icon}</span>
        {label}
      </span>
      <span className="text-lg font-bold text-gray-900">{value}</span>
    </div>
  )
}

interface ScoreCardProps {
  label: string
  score: number
  icon: string
}

function ScoreCard({ label, score, icon }: ScoreCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="font-medium text-gray-900 flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          {label}
        </span>
        <span className="text-xl font-bold text-gray-900">{score}/10</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
          style={{ width: `${(score / 10) * 100}%` }}
        />
      </div>
    </div>
  )
}
