'use client'

import { FilterParams } from '@/lib/types'
import { useSearchParams, useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'

export function useFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // URL 파라미터에서 필터 상태 읽기
  const filters: FilterParams = useMemo(() => {
    return {
      search: searchParams.get('search') || '',
      regions: searchParams.get('regions')?.split(',').filter(Boolean) || [],
      costRange: {
        min: parseInt(searchParams.get('costMin') || '1'),
        max: parseInt(searchParams.get('costMax') || '5'),
      },
      minSpeed: parseInt(searchParams.get('speed') || '0'),
      sortBy: (searchParams.get('sort') || 'overall') as FilterParams['sortBy'],
    };
  }, [searchParams])

  // 필터 업데이트 함수
  const updateFilters = useCallback((newFilters: Partial<FilterParams>) => {
    const params = new URLSearchParams(searchParams.toString())

    if (newFilters.search !== undefined) {
      newFilters.search ? params.set('search', newFilters.search) : params.delete('search')
    }

    if (newFilters.regions !== undefined) {
      newFilters.regions.length > 0
        ? params.set('regions', newFilters.regions.join(','))
        : params.delete('regions')
    }

    if (newFilters.costRange !== undefined) {
      params.set('costMin', newFilters.costRange.min.toString())
      params.set('costMax', newFilters.costRange.max.toString())
    }

    if (newFilters.minSpeed !== undefined) {
      newFilters.minSpeed > 0 ? params.set('speed', newFilters.minSpeed.toString()) : params.delete('speed')
    }

    if (newFilters.sortBy !== undefined) {
      params.set('sort', newFilters.sortBy)
    }

    router.push(`?${params.toString()}`, { scroll: false })
  }, [searchParams, router])

  // 필터 초기화
  const resetFilters = useCallback(() => {
    router.push('?', { scroll: false })
  }, [router])

  return {
    filters,
    updateFilters,
    resetFilters,
  }
}
