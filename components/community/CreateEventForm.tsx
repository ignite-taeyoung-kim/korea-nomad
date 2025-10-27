'use client'

import { useState, useCallback } from 'react'
import { Event, City } from '@/lib/types'

interface CreateEventFormProps {
  cities: City[]
  userId: string
  userName: string
  onEventCreated: (event: Omit<Event, 'id'>) => void
  onCancel?: () => void
}

const categories: Event['category'][] = ['networking', 'workshop', 'social', 'sports', 'culture']
const categoryLabel: Record<Event['category'], string> = {
  networking: '네트워킹',
  workshop: '워크숍',
  social: '사교',
  sports: '스포츠',
  culture: '문화',
}

export default function CreateEventForm({
  cities,
  userId,
  userName,
  onEventCreated,
  onCancel,
}: CreateEventFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<Event['category']>('networking')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('18:00')
  const [location, setLocation] = useState('')
  const [cityId, setCityId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      setError('')

      // Validate
      if (!title.trim()) {
        setError('이벤트 제목을 입력해주세요')
        return
      }
      if (!description.trim()) {
        setError('이벤트 설명을 입력해주세요')
        return
      }
      if (!date) {
        setError('날짜를 선택해주세요')
        return
      }
      if (!location.trim()) {
        setError('장소를 입력해주세요')
        return
      }
      if (!cityId) {
        setError('도시를 선택해주세요')
        return
      }

      setIsLoading(true)

      setTimeout(() => {
        const newEvent: Omit<Event, 'id'> = {
          city_id: cityId,
          title: title.trim(),
          description: description.trim(),
          category,
          date,
          time,
          location: location.trim(),
          creator_id: userId,
          creator_name: userName,
          participant_count: 1,
          created_at: new Date().toISOString().split('T')[0],
        }

        onEventCreated(newEvent)
        setTitle('')
        setDescription('')
        setCategory('networking')
        setDate('')
        setTime('18:00')
        setLocation('')
        setCityId('')
        setIsLoading(false)
      }, 300)
    },
    [title, description, category, date, time, location, cityId, userId, userName, onEventCreated]
  )

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">새 이벤트 생성</h3>

      {/* Title */}
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
          이벤트 제목
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="이벤트 제목을 입력해주세요"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          disabled={isLoading}
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
          설명
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="이벤트 설명을 입력해주세요"
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          disabled={isLoading}
        />
      </div>

      {/* City */}
      <div className="mb-4">
        <label htmlFor="city" className="block text-sm font-semibold text-gray-900 mb-2">
          도시
        </label>
        <select
          id="city"
          value={cityId}
          onChange={(e) => setCityId(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          disabled={isLoading}
        >
          <option value="">도시를 선택해주세요</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.emoji} {city.name}
            </option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div className="mb-4">
        <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-2">
          카테고리
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as Event['category'])}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          disabled={isLoading}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {categoryLabel[cat]}
            </option>
          ))}
        </select>
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="date" className="block text-sm font-semibold text-gray-900 mb-2">
            날짜
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="time" className="block text-sm font-semibold text-gray-900 mb-2">
            시간
          </label>
          <input
            id="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Location */}
      <div className="mb-4">
        <label htmlFor="location" className="block text-sm font-semibold text-gray-900 mb-2">
          장소
        </label>
        <input
          id="location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="이벤트 개최 장소를 입력해주세요"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          disabled={isLoading}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '생성 중...' : '이벤트 생성'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            취소
          </button>
        )}
      </div>
    </form>
  )
}
