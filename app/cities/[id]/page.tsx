'use client'

import { cities } from '@/lib/data'
import { notFound } from 'next/navigation'
import { ArrowLeft, Star, Users, Wifi, Coffee, MapPin, ChevronLeft, ChevronRight, X, Share2, Copy, Check } from 'lucide-react'
import Link from 'next/link'
import CityActionButtons from '@/components/cities/CityActionButtons'
import CityReviewsSection from '@/components/reviews/CityReviewsSection'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { copyToClipboard, shareToTwitter, shareToFacebook } from '@/lib/share'
import { City } from '@/lib/types'

interface Props {
  params: Promise<{ id: string }>
}

export default function CityDetailPage({ params }: Props) {
  const routerParams = useParams()
  const id = routerParams.id as string
  const [city, setCity] = useState<City | null>(null)
  const [selectedImageIdx, setSelectedImageIdx] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState(false)

  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''

  useEffect(() => {
    const foundCity = cities.find((c) => c.id === id)
    if (foundCity) {
      setCity(foundCity)
    }
    setIsLoading(false)
  }, [id])

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIdx === null || !city?.gallery_images) return

      if (e.key === 'Escape') {
        setSelectedImageIdx(null)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setSelectedImageIdx((selectedImageIdx - 1 + city.gallery_images.length) % city.gallery_images.length)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        setSelectedImageIdx((selectedImageIdx + 1) % city.gallery_images.length)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedImageIdx, city])

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50" />
  }

  if (!city) {
    notFound()
  }

  // 공유 함수들
  const handleCopyUrl = async () => {
    const success = await copyToClipboard(currentUrl)
    if (success) {
      setCopiedUrl(true)
      setTimeout(() => setCopiedUrl(false), 2000)
    }
  }

  const handleShareTwitter = () => {
    shareToTwitter({
      title: city.name,
      description: city.description || '멋진 노마드 도시',
      url: currentUrl,
      cityName: city.name,
      cityScore: city.overall_score,
    })
    setShowShareMenu(false)
  }

  const handleShareFacebook = () => {
    shareToFacebook({
      title: city.name,
      description: city.description || '멋진 노마드 도시',
      url: currentUrl,
      cityName: city.name,
      cityScore: city.overall_score,
    })
    setShowShareMenu(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header with Background Image */}
      <div className="relative h-96 sm:h-[420px] bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 overflow-hidden group">
        {/* Background Image with Zoom Effect */}
        {city.gallery_images && city.gallery_images[0] && (
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={city.gallery_images[0]}
              alt={city.name}
              className="w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}

        {/* Multiple Layer Overlay for Better Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/30 to-transparent" />

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-400/10 to-transparent rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative h-full flex flex-col justify-between">
          {/* Back Button */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full">
            <Link
              href="/cities"
              className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-2 font-medium group/btn"
            >
              <ArrowLeft size={18} className="group-hover/btn:-translate-x-1 transition-transform" />
              돌아가기
            </Link>
          </div>

          {/* Title Section */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
            <div className="flex items-end gap-6 sm:gap-8">
              <div className="text-7xl sm:text-8xl drop-shadow-2xl animate-bounce-slow">{city.emoji}</div>
              <div className="flex-1 pb-2">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2 drop-shadow-2xl leading-tight">
                  {city.name}
                </h1>
                <p className="text-lg sm:text-xl text-gray-100 flex items-center gap-2 drop-shadow-lg">
                  <MapPin size={20} />
                  {city.province}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            {/* Rating */}
            <div className="flex items-center gap-3 bg-gradient-to-br from-yellow-50 to-amber-50 px-4 py-2 rounded-lg">
              <Star size={22} className="text-yellow-500 fill-yellow-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-600 font-medium">평균 평점</p>
                <p className="text-xl font-bold text-gray-900">{city.overall_score}/10</p>
              </div>
            </div>

            <div className="border-l border-gray-200 h-10 hidden sm:block" />

            {/* Reviews */}
            <div className="flex items-center gap-3 bg-gradient-to-br from-blue-50 to-cyan-50 px-4 py-2 rounded-lg">
              <div>
                <p className="text-xs text-gray-600 font-medium">리뷰</p>
                <p className="text-xl font-bold text-gray-900">{city.reviews_count}개</p>
              </div>
            </div>

            <div className="border-l border-gray-200 h-10 hidden sm:block" />

            {/* Internet Speed */}
            <div className="flex items-center gap-3 bg-gradient-to-br from-green-50 to-emerald-50 px-4 py-2 rounded-lg">
              <Wifi size={22} className="text-green-600 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-600 font-medium">인터넷 속도</p>
                <p className="text-xl font-bold text-gray-900">{city.internet_speed} Mbps</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="ml-auto">
              <CityActionButtons cityId={city.id} />
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      {city.gallery_images && city.gallery_images.length > 0 && (
        <div className="bg-gradient-to-b from-white to-gray-50 border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">도시 갤러리</h2>
              <p className="text-gray-600">도시의 아름다운 순간들을 감상해보세요 (클릭하여 확대보기)</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {city.gallery_images.map((image, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className="group relative h-56 rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <img
                    src={image}
                    alt={`${city.name} gallery ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-white text-center">
                      <ChevronRight size={32} className="mb-2" />
                      <p className="text-sm font-medium">클릭하여 확대</p>
                    </div>
                  </div>

                  {/* Image Counter */}
                  <div className="absolute top-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {idx + 1}/{city.gallery_images!.length}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Image Modal Lightbox */}
      {selectedImageIdx !== null && city.gallery_images && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="gallery-modal-title">
          {/* Modal Content */}
          <div className="relative max-w-4xl w-full max-h-screen flex flex-col">
            {/* Close Button */}
            <button
              onClick={() => setSelectedImageIdx(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10 p-2 rounded-lg hover:bg-white/10"
              aria-label="갤러리 닫기"
              title="갤러리 닫기 (ESC)"
            >
              <X size={32} />
            </button>

            {/* Main Image */}
            <div className="relative flex-1 flex items-center justify-center overflow-hidden rounded-xl">
              <img
                src={city.gallery_images[selectedImageIdx]}
                alt={`${city.name} gallery ${selectedImageIdx + 1}`}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Navigation and Info */}
            <div className="mt-6 flex items-center justify-between text-white">
              {/* Previous Button */}
              <button
                onClick={() => setSelectedImageIdx((selectedImageIdx - 1 + city.gallery_images!.length) % city.gallery_images!.length)}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="이전 이미지 (왼쪽 화살표 키)"
                title="이전 이미지 (← 키)"
              >
                <ChevronLeft size={20} />
                <span className="hidden sm:inline">이전</span>
              </button>

              {/* Counter */}
              <div className="text-center">
                <p className="text-lg font-semibold" aria-live="polite">{selectedImageIdx + 1} / {city.gallery_images.length}</p>
              </div>

              {/* Next Button */}
              <button
                onClick={() => setSelectedImageIdx((selectedImageIdx + 1) % city.gallery_images!.length)}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="다음 이미지 (오른쪽 화살표 키)"
                title="다음 이미지 (→ 키)"
              >
                <span className="hidden sm:inline">다음</span>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          {/* Left Column - Basic Info */}
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">기본 정보</h2>
              <div className="h-1 w-16 bg-gradient-to-r from-primary-500 to-primary-400 rounded-full mt-2" />
            </div>
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

          {/* Right Column - Score Analysis */}
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">점수 분석</h2>
              <div className="h-1 w-16 bg-gradient-to-r from-primary-500 to-primary-400 rounded-full mt-2" />
            </div>
            <div className="space-y-5">
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
          <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl border border-primary-100 p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-3xl">📖</span>
              도시 소개
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">{city.description}</p>
          </div>
        )}

        {/* Activities Section */}
        {city.activities && city.activities.length > 0 && (
          <div className="mb-16">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-gray-900">추천 활동</h2>
              <div className="h-1 w-16 bg-gradient-to-r from-primary-500 to-primary-400 rounded-full mt-2" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {city.activities.map((activity) => (
                <div
                  key={activity.id}
                  className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start gap-5">
                    <span className="text-5xl group-hover:scale-110 transition-transform duration-300">{activity.icon}</span>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">{activity.name}</h3>
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">{activity.description}</p>
                      <span className="inline-block px-4 py-2 bg-gradient-to-r from-primary-50 to-blue-50 text-primary-700 rounded-full text-xs font-semibold border border-primary-200">
                        {activity.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips Section */}
        {city.tips && city.tips.length > 0 && (
          <div className="mb-16">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-gray-900">여행 팁</h2>
              <div className="h-1 w-16 bg-gradient-to-r from-primary-500 to-primary-400 rounded-full mt-2" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {city.tips.map((tip) => (
                <div
                  key={tip.id}
                  className="group bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl border border-blue-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-300 cursor-pointer relative overflow-hidden"
                >
                  {/* Background Gradient on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100/0 to-indigo-100/0 group-hover:from-blue-100/20 group-hover:to-indigo-100/20 transition-all duration-300" />

                  <div className="relative">
                    <div className="flex items-start gap-4 mb-3">
                      <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{tip.icon}</span>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{tip.title}</h3>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed mb-4">{tip.description}</p>
                    <span className="inline-block px-3 py-1 bg-blue-200/50 text-blue-700 rounded-full text-xs font-semibold">
                      {tip.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weather & Currency Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {city.weather && (
            <div className="group bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl border border-sky-200 p-8 hover:shadow-lg transition-all duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="text-5xl group-hover:scale-110 transition-transform duration-300">{city.weather.icon}</span>
                현재 날씨
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b-2 border-sky-200">
                  <span className="text-gray-600 font-medium">기온</span>
                  <span className="text-3xl font-bold text-sky-600">{city.weather.temperature}°C</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b-2 border-sky-200">
                  <span className="text-gray-600 font-medium">상태</span>
                  <span className="font-semibold text-gray-900 bg-white px-3 py-1 rounded-full text-sm">{city.weather.condition}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">습도</span>
                  <span className="text-2xl font-bold text-gray-900">{city.weather.humidity}%</span>
                </div>
              </div>
            </div>
          )}

          {city.currency && (
            <div className="group bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-8 hover:shadow-lg transition-all duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="text-5xl group-hover:scale-110 transition-transform duration-300">💱</span>
                환율 정보
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b-2 border-amber-200">
                  <span className="text-gray-600 font-medium">통화</span>
                  <span className="font-bold text-gray-900 text-2xl bg-white px-3 py-1 rounded-full">{city.currency.code}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">환율 (1 USD)</span>
                  <span className="font-bold text-amber-600 text-2xl">{city.currency.exchange_rate} {city.currency.code}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Related Cities Section */}
        <div className="mb-16">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900">비슷한 도시</h2>
            <div className="h-1 w-16 bg-gradient-to-r from-primary-500 to-primary-400 rounded-full mt-2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cities
              .filter((c) => c.id !== city.id)
              .slice(0, 3)
              .map((relatedCity) => (
                <Link
                  key={relatedCity.id}
                  href={`/cities/${relatedCity.id}`}
                  className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                >
                  {/* Emoji Header */}
                  <div className="h-40 bg-gradient-to-br from-primary-100 to-blue-100 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform duration-300">
                    {relatedCity.emoji}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-1">
                      {relatedCity.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 flex items-center gap-1">
                      <MapPin size={14} />
                      {relatedCity.province}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3 p-2 bg-yellow-50 rounded-lg">
                      <Star size={18} className="text-yellow-500 fill-yellow-500" />
                      <span className="font-bold text-gray-900">{relatedCity.overall_score}/10</span>
                    </div>

                    {/* Cost */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-lg">💰</span>
                      <span className="font-medium">{relatedCity.cost_per_month} / 월</span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>

        {/* Share Section */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200 p-8 mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-1">
                <Share2 size={28} className="text-purple-600" />
                이 도시를 공유하세요
              </h2>
              <p className="text-gray-600">친구들에게 {city.name}의 매력을 알려주세요</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Copy URL */}
            <button
              onClick={handleCopyUrl}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg transition-all duration-300 font-medium text-sm group"
            >
              {copiedUrl ? (
                <>
                  <Check size={18} className="text-green-600" />
                  <span className="hidden sm:inline text-green-600">복사됨</span>
                </>
              ) : (
                <>
                  <Copy size={18} className="text-gray-600 group-hover:text-gray-900" />
                  <span className="hidden sm:inline text-gray-600 group-hover:text-gray-900">링크 복사</span>
                </>
              )}
            </button>

            {/* Twitter */}
            <button
              onClick={handleShareTwitter}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-sky-100 hover:bg-sky-200 border border-sky-300 rounded-lg transition-all duration-300 font-medium text-sm text-sky-700"
            >
              <span>𝕏</span>
              <span className="hidden sm:inline">트위터</span>
            </button>

            {/* Facebook */}
            <button
              onClick={handleShareFacebook}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-100 hover:bg-blue-200 border border-blue-300 rounded-lg transition-all duration-300 font-medium text-sm text-blue-700"
            >
              <span>f</span>
              <span className="hidden sm:inline">페이스북</span>
            </button>

            {/* Share Menu Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 border border-purple-300 rounded-lg transition-all duration-300 font-medium text-sm text-purple-700"
              >
                <Share2 size={18} />
                <span className="hidden sm:inline">더보기</span>
              </button>

              {/* Share Menu Dropdown */}
              {showShareMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                  <button
                    onClick={handleCopyUrl}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Copy size={16} />
                      <span>링크 복사</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

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
    <div className="group bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between hover:shadow-md hover:border-primary-200 transition-all duration-300 cursor-pointer">
      <span className="text-gray-700 flex items-center gap-3">
        <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{icon}</span>
        <span className="font-medium text-gray-600">{label}</span>
      </span>
      <span className="text-lg font-bold text-primary-600">{value}</span>
    </div>
  )
}

interface ScoreCardProps {
  label: string
  score: number
  icon: string
}

function ScoreCard({ label, score, icon }: ScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 9) return 'from-green-400 to-green-600'
    if (score >= 7) return 'from-blue-400 to-blue-600'
    if (score >= 5) return 'from-yellow-400 to-yellow-600'
    return 'from-red-400 to-red-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 9) return '매우 우수'
    if (score >= 7) return '좋음'
    if (score >= 5) return '보통'
    return '주의'
  }

  const getBgGradient = (score: number) => {
    if (score >= 9) return 'from-green-50 to-emerald-50'
    if (score >= 7) return 'from-blue-50 to-cyan-50'
    if (score >= 5) return 'from-yellow-50 to-amber-50'
    return 'from-red-50 to-orange-50'
  }

  const bgGradient = getBgGradient(score)
  const scoreColor = getScoreColor(score)

  return (
    <div className={`group bg-gradient-to-br ${bgGradient} rounded-xl border-2 border-gray-200 p-6 hover:shadow-lg hover:border-primary-200 transition-all duration-300`}>
      <div className="flex items-start justify-between mb-6">
        <span className="font-semibold text-gray-900 flex items-center gap-3">
          <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{icon}</span>
          <div>
            <p className="text-lg">{label}</p>
            <p className="text-xs text-gray-500 font-normal mt-1 bg-white px-2 py-1 rounded-full">{getScoreLabel(score)}</p>
          </div>
        </span>
        <span className={`text-3xl font-bold bg-gradient-to-r ${scoreColor} bg-clip-text text-transparent`}>{score}/10</span>
      </div>
      <div className="space-y-2">
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden shadow-sm">
          <div
            className={`h-full bg-gradient-to-r ${scoreColor} rounded-full transition-all duration-700 shadow-md`}
            style={{ width: `${(score / 10) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 font-medium px-1">
          <span>낮음</span>
          <span>높음</span>
        </div>
      </div>
    </div>
  )
}
