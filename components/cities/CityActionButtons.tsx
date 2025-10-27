'use client'

import { Heart, Bookmark } from 'lucide-react'
import { useFavorite } from '@/hooks/useFavorite'
import { useBookmark } from '@/hooks/useBookmark'

interface CityActionButtonsProps {
  cityId: string
  showText?: boolean
}

export default function CityActionButtons({ cityId, showText = false }: CityActionButtonsProps) {
  const { isFavorite, toggleFavorite } = useFavorite(cityId)
  const { isBookmarked, toggleBookmark } = useBookmark(cityId)

  if (showText) {
    return (
      <div className="flex gap-4">
        <button
          onClick={toggleFavorite}
          className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
            isFavorite
              ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
              : 'bg-primary-600 text-white hover:bg-primary-700'
          }`}
        >
          <Heart size={20} className={isFavorite ? 'fill-red-600' : ''} />
          {isFavorite ? '좋아요 취소' : '좋아요'}
        </button>
        <button
          onClick={toggleBookmark}
          className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
            isBookmarked
              ? 'bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100'
              : 'bg-white border border-gray-300 text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Bookmark size={20} className={isBookmarked ? 'fill-blue-600' : ''} />
          {isBookmarked ? '북마크 취소' : '북마크'}
        </button>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={toggleFavorite}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        title={isFavorite ? '좋아요 취소' : '좋아요'}
      >
        <Heart
          size={24}
          className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}
        />
      </button>
      <button
        onClick={toggleBookmark}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        title={isBookmarked ? '북마크 취소' : '북마크'}
      >
        <Bookmark
          size={24}
          className={isBookmarked ? 'fill-blue-500 text-blue-500' : 'text-gray-400 hover:text-blue-500'}
        />
      </button>
    </div>
  )
}
