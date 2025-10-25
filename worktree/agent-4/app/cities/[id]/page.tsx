import { cities } from '@/lib/data'
import { notFound } from 'next/navigation'
import { ArrowLeft, Star, Users, Wifi, Coffee, MapPin, MessageCircle } from 'lucide-react'
import Link from 'next/link'

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
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Star size={20} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-2xl font-bold text-gray-900">{city.overall_score}/10</span>
                </div>
                <div className="text-gray-600">
                  <span className="font-medium text-gray-900">{city.reviews_count}</span>개 리뷰
                </div>
              </div>
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
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MessageCircle size={24} />
              리뷰 ({city.reviews_count})
            </h2>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm">
              리뷰 작성하기
            </button>
          </div>

          {/* Review Items */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">사용자 리뷰 {i}</p>
                    <p className="text-sm text-gray-600">1주일 전</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        size={16}
                        className={j < 4 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700">
                  이 도시의 카페 문화가 정말 좋습니다. 인터넷도 빠르고 노마드 커뮤니티도 활발해요.
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
            관심 도시 추가
          </button>
          <button className="flex-1 px-6 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            공유하기
          </button>
        </div>
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
