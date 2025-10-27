'use client'

import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  onChange?: (rating: number) => void
  readOnly?: boolean
  size?: number
}

export default function StarRating({
  rating,
  onChange,
  readOnly = false,
  size = 20,
}: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => !readOnly && onChange?.(star)}
          disabled={readOnly}
          className={`transition-colors ${
            readOnly ? 'cursor-default' : 'cursor-pointer hover:opacity-70'
          }`}
          type="button"
        >
          <Star
            size={size}
            className={
              star <= rating
                ? 'fill-yellow-500 text-yellow-500'
                : 'text-gray-300'
            }
          />
        </button>
      ))}
    </div>
  )
}
