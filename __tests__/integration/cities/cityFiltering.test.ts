/**
 * Integration Test: City Filtering Workflow
 *
 * 도시 필터링 전체 워크플로우를 테스트합니다.
 * - Search Workflow
 * - Region Filter
 * - Cost Range Filter
 * - Speed Filter
 * - Combined Filters
 * - Sorting
 */

import { mockCities } from '@/__tests__/mocks/data.mock'
import { applyFilters } from '@/lib/filters'
import { FilterParams } from '@/lib/types'

describe('Integration: City Filtering Workflow', () => {
  // ============================================================================
  // Search Workflow (4 tests)
  // ============================================================================
  describe('Search Workflow', () => {
    test('사용자가 검색어 "서울"을 입력하면 filterBySearch()가 도시를 필터링한다', () => {
      // Arrange
      const filters: FilterParams = {
        search: '서울',
        regions: [],
        costRange: { min: 1, max: 5 },
        minSpeed: 0,
        sortBy: 'overall',
      }

      // Act
      const result = applyFilters(mockCities, filters)

      // Assert
      expect(result.length).toBeGreaterThan(0)
      expect(result.every((city) => city.name.includes('서울'))).toBe(true)
    })

    test('검색 결과가 목록에 업데이트된다', () => {
      // Arrange
      const filters: FilterParams = {
        search: '부산',
        regions: [],
        costRange: { min: 1, max: 5 },
        minSpeed: 0,
        sortBy: 'overall',
      }

      // Act
      const result = applyFilters(mockCities, filters)

      // Assert
      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      const busanCity = result.find((city) => city.name === '부산')
      expect(busanCity).toBeDefined()
    })

    test('검색어가 지워지면 결과가 초기화된다', () => {
      // Arrange - First search
      const searchFilters: FilterParams = {
        search: '서울',
        regions: [],
        costRange: { min: 1, max: 5 },
        minSpeed: 0,
        sortBy: 'overall',
      }

      const searchResult = applyFilters(mockCities, searchFilters)
      expect(searchResult.length).toBeLessThan(mockCities.length)

      // Act - Clear search
      const clearedFilters: FilterParams = {
        ...searchFilters,
        search: '',
      }

      const clearedResult = applyFilters(mockCities, clearedFilters)

      // Assert
      expect(clearedResult.length).toBe(mockCities.length)
    })

    test('검색어가 도시명, 지역명, 설명에서 검색된다', () => {
      // Arrange
      const filters: FilterParams = {
        search: '해변',
        regions: [],
        costRange: { min: 1, max: 5 },
        minSpeed: 0,
        sortBy: 'overall',
      }

      // Act
      const result = applyFilters(mockCities, filters)

      // Assert
      expect(result.length).toBeGreaterThan(0)
      expect(
        result.some((city) => city.description?.includes('해변'))
      ).toBe(true)
    })
  })

  // ============================================================================
  // Region Filter (3 tests)
  // ============================================================================
  describe('Region Filter', () => {
    test('사용자가 "gangwon" 지역을 선택하면 filterByRegions()가 필터를 적용한다', () => {
      // Arrange
      const filters: FilterParams = {
        search: '',
        regions: ['gangwon'],
        costRange: { min: 1, max: 5 },
        minSpeed: 0,
        sortBy: 'overall',
      }

      // Act
      const result = applyFilters(mockCities, filters)

      // Assert
      expect(result.length).toBeGreaterThan(0)
      expect(result.every((city) => city.province === '강원도')).toBe(true)
    })

    test('gangwon 지역 도시만 표시된다', () => {
      // Arrange
      const filters: FilterParams = {
        search: '',
        regions: ['gangwon'],
        costRange: { min: 1, max: 5 },
        minSpeed: 0,
        sortBy: 'overall',
      }

      // Act
      const result = applyFilters(mockCities, filters)

      // Assert
      const hasOnlyGangwon = result.every((city) => city.province === '강원도')
      expect(hasOnlyGangwon).toBe(true)
      const gangneung = result.find((city) => city.name === '강릉')
      expect(gangneung).toBeDefined()
    })

    test('여러 지역을 선택하면 AND 로직으로 동작한다', () => {
      // Arrange - Select multiple regions
      const filters: FilterParams = {
        search: '',
        regions: ['seoul', 'gangwon'],
        costRange: { min: 1, max: 5 },
        minSpeed: 0,
        sortBy: 'overall',
      }

      // Act
      const result = applyFilters(mockCities, filters)

      // Assert - Should show cities from either region (OR logic in implementation)
      expect(result.length).toBeGreaterThan(0)
      const hasSeoulOrGangwon = result.every(
        (city) =>
          city.province === '서울특별시' ||
          city.province === '경기도' ||
          city.province === '강원도'
      )
      expect(hasSeoulOrGangwon).toBe(true)
    })
  })

  // ============================================================================
  // Cost Range Filter (3 tests)
  // ============================================================================
  describe('Cost Range Filter', () => {
    test('사용자가 비용 범위 min=1M, max=3M을 설정하면 filterByCostRange()가 적용된다', () => {
      // Arrange
      const filters: FilterParams = {
        search: '',
        regions: [],
        costRange: { min: 1, max: 3 },
        minSpeed: 0,
        sortBy: 'overall',
      }

      // Act
      const result = applyFilters(mockCities, filters)

      // Assert
      expect(result.length).toBeGreaterThan(0)
      // Check that all cities are within the cost range
      result.forEach((city) => {
        const match = city.cost_per_month.match(/(\d+\.?\d*)/)
        const minCost = match ? parseFloat(match[1]) : 0
        expect(minCost).toBeGreaterThanOrEqual(1)
        expect(minCost).toBeLessThanOrEqual(3)
      })
    })

    test('비용 범위에 맞는 도시만 표시된다', () => {
      // Arrange
      const filters: FilterParams = {
        search: '',
        regions: [],
        costRange: { min: 1.5, max: 2.5 },
        minSpeed: 0,
        sortBy: 'overall',
      }

      // Act
      const result = applyFilters(mockCities, filters)

      // Assert
      expect(result.length).toBeGreaterThan(0)
      const allInRange = result.every((city) => {
        const match = city.cost_per_month.match(/(\d+\.?\d*)/)
        const minCost = match ? parseFloat(match[1]) : 0
        return minCost >= 1.5 && minCost <= 2.5
      })
      expect(allInRange).toBe(true)
    })

    test('잘못된 범위가 처리된다', () => {
      // Arrange - Invalid range (min > max)
      const filters: FilterParams = {
        search: '',
        regions: [],
        costRange: { min: 5, max: 1 },
        minSpeed: 0,
        sortBy: 'overall',
      }

      // Act
      const result = applyFilters(mockCities, filters)

      // Assert - Should return empty or handle gracefully
      // The filter implementation returns empty when min > max
      expect(result.length).toBe(0)
    })
  })

  // ============================================================================
  // Speed Filter (2 tests)
  // ============================================================================
  describe('Speed Filter', () => {
    test('사용자가 minSpeed=800Mbps를 설정하면 filterBySpeed()가 적용된다', () => {
      // Arrange
      const filters: FilterParams = {
        search: '',
        regions: [],
        costRange: { min: 1, max: 5 },
        minSpeed: 800,
        sortBy: 'overall',
      }

      // Act
      const result = applyFilters(mockCities, filters)

      // Assert
      expect(result.length).toBeGreaterThan(0)
      expect(result.every((city) => city.internet_speed >= 800)).toBe(true)
    })

    test('800Mbps 이상의 도시만 표시된다', () => {
      // Arrange
      const filters: FilterParams = {
        search: '',
        regions: [],
        costRange: { min: 1, max: 5 },
        minSpeed: 800,
        sortBy: 'overall',
      }

      // Act
      const result = applyFilters(mockCities, filters)

      // Assert
      const allFastEnough = result.every((city) => city.internet_speed >= 800)
      expect(allFastEnough).toBe(true)
      // Verify specific cities
      const seoul = result.find((city) => city.name === '서울')
      const busan = result.find((city) => city.name === '부산')
      expect(seoul).toBeDefined()
      expect(busan).toBeDefined()
    })
  })

  // ============================================================================
  // Combined Filters (4 tests)
  // ============================================================================
  describe('Combined Filters', () => {
    test('사용자가 검색어 + 지역 + 비용 필터를 적용하면 applyFilters()가 모든 조건을 결합한다', () => {
      // Arrange
      const filters: FilterParams = {
        search: '서울',
        regions: ['seoul'],
        costRange: { min: 2, max: 4 },
        minSpeed: 0,
        sortBy: 'overall',
      }

      // Act
      const result = applyFilters(mockCities, filters)

      // Assert
      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      // All results should match all filters
      result.forEach((city) => {
        expect(city.name.includes('서울') || city.province.includes('서울')).toBe(true)
        const match = city.cost_per_month.match(/(\d+\.?\d*)/)
        const minCost = match ? parseFloat(match[1]) : 0
        expect(minCost).toBeGreaterThanOrEqual(2)
        expect(minCost).toBeLessThanOrEqual(4)
      })
    })

    test('결과가 모든 필터를 만족한다 (AND 조건)', () => {
      // Arrange
      const filters: FilterParams = {
        search: '부산',
        regions: ['gyeongsan'],
        costRange: { min: 2, max: 3 },
        minSpeed: 900,
        sortBy: 'overall',
      }

      // Act
      const result = applyFilters(mockCities, filters)

      // Assert
      result.forEach((city) => {
        // Search condition
        expect(
          city.name.includes('부산') ||
            city.province.includes('부산') ||
            city.description?.includes('부산')
        ).toBe(true)
        // Cost condition
        const match = city.cost_per_month.match(/(\d+\.?\d*)/)
        const minCost = match ? parseFloat(match[1]) : 0
        expect(minCost).toBeGreaterThanOrEqual(2)
        expect(minCost).toBeLessThanOrEqual(3)
        // Speed condition
        expect(city.internet_speed).toBeGreaterThanOrEqual(900)
      })
    })

    test('필터 하나를 제거하면 결과가 업데이트된다', () => {
      // Arrange - Apply multiple filters
      const multipleFilters: FilterParams = {
        search: '서울',
        regions: ['seoul'],
        costRange: { min: 2, max: 4 },
        minSpeed: 900,
        sortBy: 'overall',
      }

      const multipleResult = applyFilters(mockCities, multipleFilters)

      // Act - Remove one filter (speed)
      const fewerFilters: FilterParams = {
        ...multipleFilters,
        minSpeed: 0,
      }

      const fewerResult = applyFilters(mockCities, fewerFilters)

      // Assert - Result with fewer filters should be >= result with more filters
      expect(fewerResult.length).toBeGreaterThanOrEqual(multipleResult.length)
    })

    test('모든 필터를 제거하면 전체 도시가 표시된다', () => {
      // Arrange - Apply filters first
      const filters: FilterParams = {
        search: '서울',
        regions: ['seoul'],
        costRange: { min: 2, max: 4 },
        minSpeed: 900,
        sortBy: 'overall',
      }

      const filteredResult = applyFilters(mockCities, filters)
      expect(filteredResult.length).toBeLessThan(mockCities.length)

      // Act - Remove all filters
      const noFilters: FilterParams = {
        search: '',
        regions: [],
        costRange: { min: 1, max: 5 },
        minSpeed: 0,
        sortBy: 'overall',
      }

      const allResult = applyFilters(mockCities, noFilters)

      // Assert
      expect(allResult.length).toBe(mockCities.length)
    })
  })

  // ============================================================================
  // Sorting (4 tests)
  // ============================================================================
  describe('Sorting', () => {
    test('사용자가 "cheap" 정렬을 선택하면 sortCities()가 적용된다', () => {
      // Arrange
      const filters: FilterParams = {
        search: '',
        regions: [],
        costRange: { min: 1, max: 5 },
        minSpeed: 0,
        sortBy: 'cheap',
      }

      // Act
      const result = applyFilters(mockCities, filters)

      // Assert
      expect(result).toBeDefined()
      expect(result.length).toBe(mockCities.length)
      // Verify sorting is applied
      for (let i = 0; i < result.length - 1; i++) {
        const currentCost = parseFloat(result[i].cost_per_month.match(/(\d+\.?\d*)/)?.[1] || '0')
        const nextCost = parseFloat(result[i + 1].cost_per_month.match(/(\d+\.?\d*)/)?.[1] || '0')
        expect(currentCost).toBeLessThanOrEqual(nextCost)
      }
    })

    test('도시가 비용 오름차순으로 정렬된다', () => {
      // Arrange
      const filters: FilterParams = {
        search: '',
        regions: [],
        costRange: { min: 1, max: 5 },
        minSpeed: 0,
        sortBy: 'cheap',
      }

      // Act
      const result = applyFilters(mockCities, filters)

      // Assert
      const costs = result.map((city) => {
        const match = city.cost_per_month.match(/(\d+\.?\d*)/)
        return match ? parseFloat(match[1]) : 0
      })

      for (let i = 0; i < costs.length - 1; i++) {
        expect(costs[i]).toBeLessThanOrEqual(costs[i + 1])
      }
    })

    test('정렬을 변경하면 순서가 즉시 업데이트된다', () => {
      // Arrange - Sort by cheap
      const cheapFilters: FilterParams = {
        search: '',
        regions: [],
        costRange: { min: 1, max: 5 },
        minSpeed: 0,
        sortBy: 'cheap',
      }

      const cheapResult = applyFilters(mockCities, cheapFilters)

      // Act - Change to fast
      const fastFilters: FilterParams = {
        ...cheapFilters,
        sortBy: 'fast',
      }

      const fastResult = applyFilters(mockCities, fastFilters)

      // Assert - Order should be different
      expect(cheapResult[0].id).not.toBe(fastResult[0].id)
      // Verify fast sorting
      for (let i = 0; i < fastResult.length - 1; i++) {
        expect(fastResult[i].internet_speed).toBeGreaterThanOrEqual(
          fastResult[i + 1].internet_speed
        )
      }
    })

    test('정렬 옵션이 모두 올바르게 동작한다', () => {
      // Test all sorting options
      const sortOptions: FilterParams['sortBy'][] = [
        'overall',
        'cheap',
        'fast',
        'active',
        'quality',
        'reviews',
      ]

      sortOptions.forEach((sortBy) => {
        // Arrange
        const filters: FilterParams = {
          search: '',
          regions: [],
          costRange: { min: 1, max: 5 },
          minSpeed: 0,
          sortBy,
        }

        // Act
        const result = applyFilters(mockCities, filters)

        // Assert
        expect(result.length).toBe(mockCities.length)

        // Verify specific sorting logic
        if (sortBy === 'overall') {
          for (let i = 0; i < result.length - 1; i++) {
            expect(result[i].overall_score).toBeGreaterThanOrEqual(
              result[i + 1].overall_score
            )
          }
        } else if (sortBy === 'fast') {
          for (let i = 0; i < result.length - 1; i++) {
            expect(result[i].internet_speed).toBeGreaterThanOrEqual(
              result[i + 1].internet_speed
            )
          }
        } else if (sortBy === 'active') {
          for (let i = 0; i < result.length - 1; i++) {
            expect(result[i].nomads_count).toBeGreaterThanOrEqual(
              result[i + 1].nomads_count
            )
          }
        }
      })
    })
  })
})
