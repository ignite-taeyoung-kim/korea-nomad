/**
 * Unit Tests: lib/types.ts
 * TypeScript 타입 정의 검증 테스트 (10 tests)
 */

import {
  City,
  Review,
  Event,
  FilterParams,
  UserProfile,
} from '@/lib/types'
import { mockCities, mockReviews, mockEvents } from '@/__tests__/mocks/data.mock'

describe('lib/types.ts', () => {
  // ==========================================================================
  // City type: 3 tests
  // ==========================================================================
  describe('City type', () => {
    test('City 타입이 모든 필수 필드를 포함한다', () => {
      // Arrange
      const city: City = {
        id: 'test-city',
        name: '테스트도시',
        province: '테스트특별시',
        emoji: '🏙️',
        overall_score: 8.5,
        cost_per_month: '2.0~3.0M',
        internet_speed: 900,
        nomads_count: 500,
        cafe_rating: 4.5,
        work_score: 8.0,
        quality_score: 8.2,
        reviews_count: 100,
      }

      // Act & Assert
      expect(city.id).toBe('test-city')
      expect(city.name).toBe('테스트도시')
      expect(city.province).toBe('테스트특별시')
      expect(city.emoji).toBe('🏙️')
      expect(city.overall_score).toBe(8.5)
      expect(city.cost_per_month).toBe('2.0~3.0M')
      expect(city.internet_speed).toBe(900)
      expect(city.nomads_count).toBe(500)
      expect(city.cafe_rating).toBe(4.5)
      expect(city.work_score).toBe(8.0)
      expect(city.quality_score).toBe(8.2)
      expect(city.reviews_count).toBe(100)
    })

    test('City 타입이 선택적 필드를 포함할 수 있다', () => {
      // Arrange
      const cityWithOptional: City = {
        id: 'test-city',
        name: '테스트도시',
        province: '테스트특별시',
        emoji: '🏙️',
        overall_score: 8.5,
        cost_per_month: '2.0~3.0M',
        internet_speed: 900,
        nomads_count: 500,
        cafe_rating: 4.5,
        work_score: 8.0,
        quality_score: 8.2,
        reviews_count: 100,
        likes_count: 200,
        dislikes_count: 10,
        description: '테스트 설명',
        image_url: 'https://example.com/image.jpg',
        gallery_images: ['image1.jpg', 'image2.jpg'],
      }

      // Act & Assert
      expect(cityWithOptional.likes_count).toBe(200)
      expect(cityWithOptional.dislikes_count).toBe(10)
      expect(cityWithOptional.description).toBe('테스트 설명')
      expect(cityWithOptional.image_url).toBe('https://example.com/image.jpg')
      expect(cityWithOptional.gallery_images).toHaveLength(2)
    })

    test('Mock 데이터의 도시가 City 타입과 호환된다', () => {
      // Arrange & Act
      const city: City = mockCities[0]

      // Assert
      expect(city).toHaveProperty('id')
      expect(city).toHaveProperty('name')
      expect(city).toHaveProperty('overall_score')
      expect(typeof city.id).toBe('string')
      expect(typeof city.name).toBe('string')
      expect(typeof city.overall_score).toBe('number')
    })
  })

  // ==========================================================================
  // Review type: 2 tests
  // ==========================================================================
  describe('Review type', () => {
    test('Review 타입의 모든 필드가 올바른 타입이다', () => {
      // Arrange
      const review: Review = {
        id: 'review-1',
        user_id: 'user-1',
        city_id: 'city-1',
        title: '좋은 도시',
        content: '정말 좋은 도시입니다.',
        rating: 5,
        created_at: '2024-10-30',
        username: 'TestUser',
      }

      // Act & Assert
      expect(typeof review.id).toBe('string')
      expect(typeof review.user_id).toBe('string')
      expect(typeof review.city_id).toBe('string')
      expect(typeof review.title).toBe('string')
      expect(typeof review.content).toBe('string')
      expect(typeof review.rating).toBe('number')
      expect(typeof review.created_at).toBe('string')
      expect(typeof review.username).toBe('string')
    })

    test('Review의 rating이 1부터 5 사이의 값이다', () => {
      // Arrange
      const validRatings = [1, 2, 3, 4, 5]

      // Act & Assert
      validRatings.forEach((rating) => {
        const review: Review = {
          id: 'test',
          user_id: 'user',
          city_id: 'city',
          title: 'test',
          content: 'test',
          rating: rating,
          created_at: '2024-10-30',
          username: 'test',
        }
        expect(review.rating).toBeGreaterThanOrEqual(1)
        expect(review.rating).toBeLessThanOrEqual(5)
      })
    })
  })

  // ==========================================================================
  // Event type: 2 tests
  // ==========================================================================
  describe('Event type', () => {
    test('Event의 category가 5가지 값 중 하나이다', () => {
      // Arrange
      const validCategories = [
        'networking',
        'workshop',
        'social',
        'sports',
        'culture',
      ] as const

      // Act & Assert
      validCategories.forEach((category) => {
        const event: Event = {
          id: 'event-1',
          city_id: 'city-1',
          title: 'Test Event',
          description: 'Test Description',
          category: category,
          date: '2024-11-01',
          time: '18:00',
          location: 'Test Location',
          creator_id: 'user-1',
          creator_name: 'Test User',
          participant_count: 10,
          created_at: '2024-10-30',
        }
        expect(event.category).toBe(category)
      })
    })

    test('Event가 모든 필수 필드와 선택적 필드를 포함한다', () => {
      // Arrange
      const event: Event = {
        id: 'event-1',
        city_id: 'city-1',
        title: 'Test Event',
        description: 'Test Description',
        category: 'networking',
        date: '2024-11-01',
        time: '18:00',
        location: 'Test Location',
        creator_id: 'user-1',
        creator_name: 'Test User',
        participant_count: 10,
        created_at: '2024-10-30',
      }

      // Act & Assert
      expect(event).toHaveProperty('id')
      expect(event).toHaveProperty('city_id')
      expect(event).toHaveProperty('title')
      expect(event).toHaveProperty('description')
      expect(event).toHaveProperty('category')
      expect(event).toHaveProperty('date')
      expect(event).toHaveProperty('time')
      expect(event).toHaveProperty('location')
      expect(event).toHaveProperty('creator_id')
      expect(event).toHaveProperty('creator_name')
      expect(event).toHaveProperty('participant_count')
    })
  })

  // ==========================================================================
  // FilterParams type: 2 tests
  // ==========================================================================
  describe('FilterParams type', () => {
    test('FilterParams의 sortBy가 6가지 값 중 하나이다', () => {
      // Arrange
      const validSortOptions = [
        'overall',
        'cheap',
        'fast',
        'active',
        'quality',
        'reviews',
      ] as const

      // Act & Assert
      validSortOptions.forEach((sortBy) => {
        const filterParams: FilterParams = {
          search: '',
          regions: [],
          costRange: { min: 0, max: 5000000 },
          minSpeed: 0,
          sortBy: sortBy,
        }
        expect(filterParams.sortBy).toBe(sortBy)
      })
    })

    test('FilterParams가 costRange와 minSpeed 필드를 올바르게 포함한다', () => {
      // Arrange
      const filterParams: FilterParams = {
        search: '서울',
        regions: ['seoul', 'gangwon'],
        costRange: { min: 1000000, max: 3000000 },
        minSpeed: 500,
        sortBy: 'overall',
        showFavorites: true,
        showBookmarks: false,
      }

      // Act & Assert
      expect(filterParams.costRange).toHaveProperty('min')
      expect(filterParams.costRange).toHaveProperty('max')
      expect(filterParams.costRange.min).toBe(1000000)
      expect(filterParams.costRange.max).toBe(3000000)
      expect(filterParams.minSpeed).toBe(500)
      expect(filterParams.showFavorites).toBe(true)
      expect(filterParams.showBookmarks).toBe(false)
    })
  })

  // ==========================================================================
  // Type compatibility: 1 test
  // ==========================================================================
  describe('Type compatibility', () => {
    test('모든 Mock 데이터가 해당 타입과 호환된다', () => {
      // Arrange & Act
      const cities: City[] = mockCities
      const reviews: Review[] = mockReviews
      const events: Event[] = mockEvents

      // Assert
      expect(Array.isArray(cities)).toBe(true)
      expect(Array.isArray(reviews)).toBe(true)
      expect(Array.isArray(events)).toBe(true)

      // 첫 번째 요소 타입 검증
      if (cities.length > 0) {
        expect(cities[0]).toHaveProperty('id')
        expect(cities[0]).toHaveProperty('name')
      }

      if (reviews.length > 0) {
        expect(reviews[0]).toHaveProperty('id')
        expect(reviews[0]).toHaveProperty('rating')
      }

      if (events.length > 0) {
        expect(events[0]).toHaveProperty('id')
        expect(events[0]).toHaveProperty('category')
      }
    })
  })
})
