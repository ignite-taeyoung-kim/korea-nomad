/**
 * Unit Tests: lib/data.ts
 * Mock 데이터 구조 검증 테스트 (15 tests)
 */

import {
  cities,
  reviews,
  events,
  newMembers,
  stats,
} from '@/lib/data'

describe('lib/data.ts', () => {
  // ==========================================================================
  // cities array: 5 tests
  // ==========================================================================
  describe('cities array', () => {
    test('cities 배열이 8개의 도시를 포함한다', () => {
      // Arrange & Act
      const length = cities.length

      // Assert
      expect(length).toBe(8)
    })

    test('모든 도시가 필수 필드를 포함한다', () => {
      // Arrange
      const requiredFields = [
        'id',
        'name',
        'province',
        'emoji',
        'overall_score',
        'cost_per_month',
        'internet_speed',
        'nomads_count',
        'cafe_rating',
        'work_score',
        'quality_score',
        'reviews_count',
      ]

      // Act & Assert
      cities.forEach((city) => {
        requiredFields.forEach((field) => {
          expect(city).toHaveProperty(field)
          expect(city[field as keyof typeof city]).toBeDefined()
        })
      })
    })

    test('모든 도시의 ID가 고유하다', () => {
      // Arrange
      const ids = cities.map((city) => city.id)

      // Act
      const uniqueIds = new Set(ids)

      // Assert
      expect(uniqueIds.size).toBe(cities.length)
    })

    test('모든 도시의 점수가 0에서 10 사이의 범위에 있다', () => {
      // Arrange & Act
      cities.forEach((city) => {
        // Assert
        expect(city.overall_score).toBeGreaterThanOrEqual(0)
        expect(city.overall_score).toBeLessThanOrEqual(10)
        expect(city.work_score).toBeGreaterThanOrEqual(0)
        expect(city.work_score).toBeLessThanOrEqual(10)
        expect(city.quality_score).toBeGreaterThanOrEqual(0)
        expect(city.quality_score).toBeLessThanOrEqual(10)
        expect(city.cafe_rating).toBeGreaterThanOrEqual(0)
        expect(city.cafe_rating).toBeLessThanOrEqual(5)
      })
    })

    test('모든 도시가 선택적 필드들을 올바른 타입으로 포함한다', () => {
      // Arrange & Act
      cities.forEach((city) => {
        // Assert
        if (city.likes_count !== undefined) {
          expect(typeof city.likes_count).toBe('number')
        }
        if (city.dislikes_count !== undefined) {
          expect(typeof city.dislikes_count).toBe('number')
        }
        if (city.description !== undefined) {
          expect(typeof city.description).toBe('string')
        }
        if (city.gallery_images !== undefined) {
          expect(Array.isArray(city.gallery_images)).toBe(true)
        }
        if (city.activities !== undefined) {
          expect(Array.isArray(city.activities)).toBe(true)
        }
        if (city.tips !== undefined) {
          expect(Array.isArray(city.tips)).toBe(true)
        }
      })
    })
  })

  // ==========================================================================
  // reviews array: 4 tests
  // ==========================================================================
  describe('reviews array', () => {
    test('reviews 배열이 25개의 리뷰를 포함한다', () => {
      // Arrange & Act
      const length = reviews.length

      // Assert
      expect(length).toBe(25)
    })

    test('모든 리뷰의 rating이 1에서 5 사이의 범위에 있다', () => {
      // Arrange & Act
      reviews.forEach((review) => {
        // Assert
        expect(review.rating).toBeGreaterThanOrEqual(1)
        expect(review.rating).toBeLessThanOrEqual(5)
      })
    })

    test('모든 리뷰가 필수 필드를 포함한다', () => {
      // Arrange
      const requiredFields = [
        'id',
        'user_id',
        'city_id',
        'title',
        'content',
        'rating',
        'created_at',
        'username',
      ]

      // Act & Assert
      reviews.forEach((review) => {
        requiredFields.forEach((field) => {
          expect(review).toHaveProperty(field)
          expect(review[field as keyof typeof review]).toBeDefined()
        })
      })
    })

    test('모든 리뷰의 city_id가 유효한 도시 ID를 참조한다', () => {
      // Arrange
      const validCityIds = cities.map((city) => city.id)

      // Act & Assert
      reviews.forEach((review) => {
        expect(validCityIds).toContain(review.city_id)
      })
    })
  })

  // ==========================================================================
  // events array: 3 tests
  // ==========================================================================
  describe('events array', () => {
    test('모든 이벤트의 category가 유효한 값이다', () => {
      // Arrange
      const validCategories = [
        'networking',
        'workshop',
        'social',
        'sports',
        'culture',
      ]

      // Act & Assert
      events.forEach((event) => {
        expect(validCategories).toContain(event.category)
      })
    })

    test('모든 이벤트가 필수 필드를 포함한다', () => {
      // Arrange
      const requiredFields = [
        'id',
        'city_id',
        'title',
        'description',
        'category',
        'date',
        'time',
        'location',
        'creator_id',
        'creator_name',
        'participant_count',
      ]

      // Act & Assert
      events.forEach((event) => {
        requiredFields.forEach((field) => {
          expect(event).toHaveProperty(field)
          expect(event[field as keyof typeof event]).toBeDefined()
        })
      })
    })

    test('모든 이벤트의 city_id가 유효한 도시 ID를 참조한다', () => {
      // Arrange
      const validCityIds = cities.map((city) => city.id)

      // Act & Assert
      events.forEach((event) => {
        expect(validCityIds).toContain(event.city_id)
      })
    })
  })

  // ==========================================================================
  // newMembers & stats: 3 tests
  // ==========================================================================
  describe('newMembers and stats', () => {
    test('newMembers 배열이 필드를 올바르게 포함한다', () => {
      // Arrange & Act
      newMembers.forEach((member) => {
        // Assert
        expect(member).toHaveProperty('id')
        expect(member).toHaveProperty('username')
        expect(member).toHaveProperty('joined_date')
        expect(typeof member.id).toBe('string')
        expect(typeof member.username).toBe('string')
        expect(typeof member.joined_date).toBe('string')
      })
    })

    test('stats 객체가 모든 필수 필드를 포함한다', () => {
      // Arrange
      const requiredFields = [
        'total_users',
        'total_cities',
        'total_items_rated',
        'total_reviews',
        'monthly_meetups',
        'monthly_new_members',
      ]

      // Act & Assert
      requiredFields.forEach((field) => {
        expect(stats).toHaveProperty(field)
        expect(typeof stats[field as keyof typeof stats]).toBe('number')
      })
    })

    test('stats의 모든 값이 양수이다', () => {
      // Arrange
      const values = Object.values(stats)

      // Act & Assert
      values.forEach((value) => {
        expect(value).toBeGreaterThan(0)
        expect(typeof value).toBe('number')
      })
    })
  })
})
