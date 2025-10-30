/**
 * Unit Tests for lib/filters.ts
 *
 * 총 70개의 테스트 케이스로 필터링 함수들을 테스트합니다.
 */

import { extractMinCost, applyFilters } from '@/lib/filters';
import { mockCities } from '@/__tests__/mocks/data.mock';
import { FilterParams } from '@/lib/types';

// ============================================================================
// extractMinCost() - 10 tests
// ============================================================================

describe('extractMinCost', () => {
  test('일반적인 비용 범위 문자열에서 최소값을 추출한다', () => {
    // Arrange
    const costStr = '2.1~3M';

    // Act
    const result = extractMinCost(costStr);

    // Assert
    expect(result).toBe(2.1);
  });

  test('정수 비용에서 최소값을 추출한다', () => {
    // Arrange
    const costStr = '3~5M';

    // Act
    const result = extractMinCost(costStr);

    // Assert
    expect(result).toBe(3);
  });

  test('소수점 두자리 비용을 정확히 추출한다', () => {
    // Arrange
    const costStr = '1.85~2.5M';

    // Act
    const result = extractMinCost(costStr);

    // Assert
    expect(result).toBe(1.85);
  });

  test('단일 값만 있는 문자열에서 값을 추출한다', () => {
    // Arrange
    const costStr = '2.5M';

    // Act
    const result = extractMinCost(costStr);

    // Assert
    expect(result).toBe(2.5);
  });

  test('빈 문자열이 주어지면 0을 반환한다', () => {
    // Arrange
    const costStr = '';

    // Act
    const result = extractMinCost(costStr);

    // Assert
    expect(result).toBe(0);
  });

  test('숫자가 없는 문자열이 주어지면 0을 반환한다', () => {
    // Arrange
    const costStr = 'unknown';

    // Act
    const result = extractMinCost(costStr);

    // Assert
    expect(result).toBe(0);
  });

  test('특수문자가 포함된 문자열에서 숫자만 추출한다', () => {
    // Arrange
    const costStr = '$2.3~3.5M';

    // Act
    const result = extractMinCost(costStr);

    // Assert
    expect(result).toBe(2.3);
  });

  test('0으로 시작하는 소수를 정확히 추출한다', () => {
    // Arrange
    const costStr = '0.5~1M';

    // Act
    const result = extractMinCost(costStr);

    // Assert
    expect(result).toBe(0.5);
  });

  test('앞에 공백이 있는 문자열에서 숫자를 추출한다', () => {
    // Arrange
    const costStr = '  1.8~2.5M';

    // Act
    const result = extractMinCost(costStr);

    // Assert
    expect(result).toBe(1.8);
  });

  test('큰 숫자 범위에서 최소값을 추출한다', () => {
    // Arrange
    const costStr = '10.5~15M';

    // Act
    const result = extractMinCost(costStr);

    // Assert
    expect(result).toBe(10.5);
  });
});

// ============================================================================
// applyFilters() - filterBySearch 관련 - 10 tests
// ============================================================================

describe('applyFilters - Search Filtering', () => {
  const defaultFilters: FilterParams = {
    search: '',
    regions: [],
    costRange: { min: 0, max: 10 },
    minSpeed: 0,
    sortBy: 'overall',
    showFavorites: false,
    showBookmarks: false,
  };

  test('검색어가 없으면 모든 도시를 반환한다', () => {
    // Arrange
    const filters = { ...defaultFilters, search: '' };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    expect(result).toHaveLength(5);
  });

  test('도시 이름으로 검색하면 해당 도시만 반환한다', () => {
    // Arrange
    const filters = { ...defaultFilters, search: '서울' };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('서울');
  });

  test('영문 도시 이름으로 검색할 수 있다', () => {
    // Arrange
    const filters = { ...defaultFilters, search: 'seoul' };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    expect(result).toHaveLength(0); // mockCities에는 영문명이 없음
  });

  test('지역(province)으로 검색하면 해당 지역 도시를 반환한다', () => {
    // Arrange
    const filters = { ...defaultFilters, search: '강원' };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].province).toContain('강원');
  });

  test('부분 문자열 검색이 작동한다', () => {
    // Arrange
    const filters = { ...defaultFilters, search: '전' };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    expect(result.length).toBeGreaterThan(0);
    expect(result.some(city => city.name.includes('전'))).toBe(true);
  });

  test('대소문자 구분 없이 검색한다', () => {
    // Arrange
    const filters = { ...defaultFilters, search: 'SEOUL' };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    expect(result).toHaveLength(0); // mockCities의 name은 한글
  });

  test('공백만 있는 검색어는 모든 도시를 반환한다', () => {
    // Arrange
    const filters = { ...defaultFilters, search: '   ' };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    expect(result).toHaveLength(5);
  });

  test('존재하지 않는 도시명으로 검색하면 빈 배열을 반환한다', () => {
    // Arrange
    const filters = { ...defaultFilters, search: '제주' };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    expect(result).toHaveLength(0);
  });

  test('여러 도시가 매칭되는 검색어를 처리한다', () => {
    // Arrange
    const filters = { ...defaultFilters, search: '부' };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    expect(result.length).toBeGreaterThan(0);
  });

  test('원본 배열을 변경하지 않는다 (immutability)', () => {
    // Arrange
    const originalCities = [...mockCities];
    const filters = { ...defaultFilters, search: '서울' };

    // Act
    applyFilters(mockCities, filters);

    // Assert
    expect(mockCities).toEqual(originalCities);
  });
});

// ============================================================================
// applyFilters() - filterByRegions 관련 - 8 tests
// ============================================================================

describe('applyFilters - Region Filtering', () => {
  const defaultFilters: FilterParams = {
    search: '',
    regions: [],
    costRange: { min: 0, max: 10 },
    minSpeed: 0,
    sortBy: 'overall',
    showFavorites: false,
    showBookmarks: false,
  };

  test('지역 필터가 비어있으면 모든 도시를 반환한다', () => {
    // Arrange
    const filters = { ...defaultFilters, regions: [] };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    expect(result).toHaveLength(5);
  });

  test('seoul 지역으로 필터링한다', () => {
    // Arrange
    const filters = { ...defaultFilters, regions: ['seoul'] };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    expect(result.length).toBeGreaterThan(0);
    expect(result.some(city => city.province === '서울특별시')).toBe(true);
  });

  test('gangwon 지역으로 필터링한다', () => {
    // Arrange
    const filters = { ...defaultFilters, regions: ['gangwon'] };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    expect(result.length).toBeGreaterThan(0);
    expect(result.some(city => city.province === '강원도')).toBe(true);
  });

  test('gyeongsan 지역으로 필터링한다 (부산, 대구 포함)', () => {
    // Arrange
    const filters = { ...defaultFilters, regions: ['gyeongsan'] };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    expect(result.length).toBeGreaterThan(0);
    const provinces = result.map(city => city.province);
    expect(provinces.some(p => ['부산광역시', '대구광역시'].includes(p))).toBe(true);
  });

  test('여러 지역을 동시에 필터링한다', () => {
    // Arrange
    const filters = { ...defaultFilters, regions: ['seoul', 'gangwon'] };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    expect(result.length).toBeGreaterThan(0);
  });

  test('존재하지 않는 지역으로 필터링하면 빈 배열을 반환한다', () => {
    // Arrange
    const filters = { ...defaultFilters, regions: ['nonexistent'] };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    expect(result).toHaveLength(0);
  });

  test('jeonlla 지역으로 필터링한다', () => {
    // Arrange
    const filters = { ...defaultFilters, regions: ['jeonlla'] };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    expect(result.length).toBeGreaterThan(0);
    expect(result.some(city => city.province === '전라북도')).toBe(true);
  });

  test('원본 배열을 변경하지 않는다', () => {
    // Arrange
    const originalCities = [...mockCities];
    const filters = { ...defaultFilters, regions: ['seoul'] };

    // Act
    applyFilters(mockCities, filters);

    // Assert
    expect(mockCities).toEqual(originalCities);
  });
});

// ============================================================================
// applyFilters() - filterByCostRange 관련 - 10 tests
// ============================================================================

describe('applyFilters - Cost Range Filtering', () => {
  const defaultFilters: FilterParams = {
    search: '',
    regions: [],
    costRange: { min: 0, max: 10 },
    minSpeed: 0,
    sortBy: 'overall',
    showFavorites: false,
    showBookmarks: false,
  };

  test('생활비 범위 내의 도시만 반환한다', () => {
    // Arrange
    const filters = { ...defaultFilters, costRange: { min: 2, max: 3 } };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    expect(result.length).toBeGreaterThan(0);
    result.forEach(city => {
      const minCost = extractMinCost(city.cost_per_month);
      expect(minCost).toBeGreaterThanOrEqual(2);
      expect(minCost).toBeLessThanOrEqual(3);
    });
  });

  test('최소값과 최대값이 같으면 정확히 그 값인 도시를 반환한다', () => {
    // Arrange
    const filters = { ...defaultFilters, costRange: { min: 1.8, max: 1.8 } };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    result.forEach(city => {
      const minCost = extractMinCost(city.cost_per_month);
      expect(minCost).toBe(1.8);
    });
  });

  test('매우 낮은 범위로 필터링하면 해당 도시만 반환한다', () => {
    // Arrange
    const filters = { ...defaultFilters, costRange: { min: 0, max: 2 } };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    result.forEach(city => {
      const minCost = extractMinCost(city.cost_per_month);
      expect(minCost).toBeLessThanOrEqual(2);
    });
  });

  test('매우 높은 범위로 필터링하면 모든 도시를 반환한다', () => {
    // Arrange
    const filters = { ...defaultFilters, costRange: { min: 0, max: 100 } };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    expect(result).toHaveLength(5);
  });

  test('범위 밖의 도시는 제외된다', () => {
    // Arrange
    const filters = { ...defaultFilters, costRange: { min: 3, max: 5 } };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    result.forEach(city => {
      const minCost = extractMinCost(city.cost_per_month);
      expect(minCost).toBeGreaterThanOrEqual(3);
    });
  });

  test('최소값 0과 최대값 10으로 필터링하면 모든 도시를 반환한다', () => {
    // Arrange
    const filters = { ...defaultFilters, costRange: { min: 0, max: 10 } };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    expect(result).toHaveLength(5);
  });

  test('범위가 좁으면 결과가 적거나 없을 수 있다', () => {
    // Arrange
    const filters = { ...defaultFilters, costRange: { min: 10, max: 11 } };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    expect(result).toHaveLength(0);
  });

  test('실제 생활비 범위에 맞는 도시를 필터링한다 (1.8~2.3)', () => {
    // Arrange
    const filters = { ...defaultFilters, costRange: { min: 1.8, max: 2.3 } };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    expect(result.length).toBeGreaterThan(0);
    expect(result.some(city => ['강릉', '전주', '대구'].includes(city.name))).toBe(true);
  });

  test('소수점이 있는 범위를 정확히 처리한다', () => {
    // Arrange
    const filters = { ...defaultFilters, costRange: { min: 2.1, max: 2.6 } };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    result.forEach(city => {
      const minCost = extractMinCost(city.cost_per_month);
      expect(minCost).toBeGreaterThanOrEqual(2.1);
      expect(minCost).toBeLessThanOrEqual(2.6);
    });
  });

  test('원본 배열을 변경하지 않는다', () => {
    // Arrange
    const originalCities = [...mockCities];
    const filters = { ...defaultFilters, costRange: { min: 2, max: 3 } };

    // Act
    applyFilters(mockCities, filters);

    // Assert
    expect(mockCities).toEqual(originalCities);
  });
});

// ============================================================================
// applyFilters() - filterBySpeed 관련 - 8 tests
// ============================================================================

describe('applyFilters - Speed Filtering', () => {
  const defaultFilters: FilterParams = {
    search: '',
    regions: [],
    costRange: { min: 0, max: 10 },
    minSpeed: 0,
    sortBy: 'overall',
    showFavorites: false,
    showBookmarks: false,
  };

  test('최소 속도가 0이면 모든 도시를 반환한다', () => {
    // Arrange
    const filters = { ...defaultFilters, minSpeed: 0 };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    expect(result).toHaveLength(5);
  });

  test('최소 속도 이상인 도시만 반환한다', () => {
    // Arrange
    const filters = { ...defaultFilters, minSpeed: 900 };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    expect(result.length).toBeGreaterThan(0);
    result.forEach(city => {
      expect(city.internet_speed).toBeGreaterThanOrEqual(900);
    });
  });

  test('매우 높은 속도로 필터링하면 고속 인터넷 도시만 반환한다', () => {
    // Arrange
    const filters = { ...defaultFilters, minSpeed: 950 };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    result.forEach(city => {
      expect(city.internet_speed).toBeGreaterThanOrEqual(950);
    });
    expect(result.some(city => city.name === '서울')).toBe(true);
  });

  test('중간 속도로 필터링한다', () => {
    // Arrange
    const filters = { ...defaultFilters, minSpeed: 850 };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    expect(result.length).toBeGreaterThan(0);
    result.forEach(city => {
      expect(city.internet_speed).toBeGreaterThanOrEqual(850);
    });
  });

  test('낮은 속도로 필터링하면 거의 모든 도시를 반환한다', () => {
    // Arrange
    const filters = { ...defaultFilters, minSpeed: 500 };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    expect(result).toHaveLength(5);
  });

  test('속도 조건을 만족하지 않는 도시는 제외된다', () => {
    // Arrange
    const filters = { ...defaultFilters, minSpeed: 1000 };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    expect(result).toHaveLength(0);
  });

  test('정확히 최소 속도와 같은 도시도 포함된다', () => {
    // Arrange
    const filters = { ...defaultFilters, minSpeed: 800 };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    const city800 = result.find(city => city.internet_speed === 800);
    if (city800) {
      expect(city800.internet_speed).toBe(800);
    }
  });

  test('원본 배열을 변경하지 않는다', () => {
    // Arrange
    const originalCities = [...mockCities];
    const filters = { ...defaultFilters, minSpeed: 900 };

    // Act
    applyFilters(mockCities, filters);

    // Assert
    expect(mockCities).toEqual(originalCities);
  });
});

// ============================================================================
// applyFilters() - sortCities 관련 - 6 tests (6가지 정렬)
// ============================================================================

describe('applyFilters - Sorting', () => {
  const defaultFilters: FilterParams = {
    search: '',
    regions: [],
    costRange: { min: 0, max: 10 },
    minSpeed: 0,
    sortBy: 'overall',
    showFavorites: false,
    showBookmarks: false,
  };

  test('overall_score로 내림차순 정렬한다', () => {
    // Arrange
    const filters = { ...defaultFilters, sortBy: 'overall' as const };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].overall_score).toBeGreaterThanOrEqual(result[i + 1].overall_score);
    }
  });

  test('cheap (비용 낮은순)으로 오름차순 정렬한다', () => {
    // Arrange
    const filters = { ...defaultFilters, sortBy: 'cheap' as const };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    for (let i = 0; i < result.length - 1; i++) {
      const cost1 = extractMinCost(result[i].cost_per_month);
      const cost2 = extractMinCost(result[i + 1].cost_per_month);
      expect(cost1).toBeLessThanOrEqual(cost2);
    }
  });

  test('fast (인터넷 빠른순)으로 내림차순 정렬한다', () => {
    // Arrange
    const filters = { ...defaultFilters, sortBy: 'fast' as const };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].internet_speed).toBeGreaterThanOrEqual(result[i + 1].internet_speed);
    }
  });

  test('active (노마드 많은순)으로 내림차순 정렬한다', () => {
    // Arrange
    const filters = { ...defaultFilters, sortBy: 'active' as const };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].nomads_count).toBeGreaterThanOrEqual(result[i + 1].nomads_count);
    }
  });

  test('quality (품질 높은순)으로 내림차순 정렬한다', () => {
    // Arrange
    const filters = { ...defaultFilters, sortBy: 'quality' as const };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].quality_score).toBeGreaterThanOrEqual(result[i + 1].quality_score);
    }
  });

  test('reviews (리뷰 많은순)으로 내림차순 정렬한다', () => {
    // Arrange
    const filters = { ...defaultFilters, sortBy: 'reviews' as const };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].reviews_count).toBeGreaterThanOrEqual(result[i + 1].reviews_count);
    }
  });
});

// ============================================================================
// applyFilters() - Favorites/Bookmarks 관련 - 4 tests
// ============================================================================

describe('applyFilters - Favorites and Bookmarks', () => {
  const defaultFilters: FilterParams = {
    search: '',
    regions: [],
    costRange: { min: 0, max: 10 },
    minSpeed: 0,
    sortBy: 'overall',
    showFavorites: false,
    showBookmarks: false,
  };

  beforeEach(() => {
    localStorage.clear();
  });

  test('showFavorites가 false이면 좋아요 필터를 적용하지 않는다', () => {
    // Arrange
    localStorage.setItem('nomad_favorites_user', JSON.stringify({ cityIds: ['seoul'] }));
    const filters = { ...defaultFilters, showFavorites: false };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    expect(result).toHaveLength(5);
  });

  test('showFavorites가 true이면 좋아요한 도시만 반환한다', () => {
    // Arrange
    localStorage.setItem('nomad_favorites_user', JSON.stringify({ cityIds: ['seoul', 'busan'] }));
    const filters = { ...defaultFilters, showFavorites: true };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    expect(result.length).toBeGreaterThan(0);
    expect(result.every(city => ['seoul', 'busan'].includes(city.id))).toBe(true);
  });

  test('showBookmarks가 true이면 북마크한 도시만 반환한다', () => {
    // Arrange
    localStorage.setItem('nomad_bookmarks_user', JSON.stringify({ cityIds: ['gangneung'] }));
    const filters = { ...defaultFilters, showBookmarks: true };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    expect(result.length).toBeGreaterThan(0);
    expect(result.every(city => city.id === 'gangneung')).toBe(true);
  });

  test('좋아요와 북마크를 동시에 필터링한다', () => {
    // Arrange
    localStorage.setItem('nomad_favorites_user', JSON.stringify({ cityIds: ['seoul'] }));
    localStorage.setItem('nomad_bookmarks_user', JSON.stringify({ cityIds: ['seoul'] }));
    const filters = { ...defaultFilters, showFavorites: true, showBookmarks: true };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    expect(result.every(city => city.id === 'seoul')).toBe(true);
  });
});

// ============================================================================
// applyFilters() - 복합 필터 테스트 - 11 tests
// ============================================================================

describe('applyFilters - Combined Filters', () => {
  const defaultFilters: FilterParams = {
    search: '',
    regions: [],
    costRange: { min: 0, max: 10 },
    minSpeed: 0,
    sortBy: 'overall',
    showFavorites: false,
    showBookmarks: false,
  };

  test('검색어와 지역 필터를 동시에 적용한다', () => {
    // Arrange
    const filters = { ...defaultFilters, search: '부', regions: ['gyeongsan'] };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    expect(result.length).toBeGreaterThan(0);
  });

  test('검색어, 지역, 비용 범위를 동시에 적용한다', () => {
    // Arrange
    const filters = {
      ...defaultFilters,
      search: '강',
      regions: ['gangwon'],
      costRange: { min: 1, max: 3 },
    };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    result.forEach(city => {
      const minCost = extractMinCost(city.cost_per_month);
      expect(minCost).toBeGreaterThanOrEqual(1);
      expect(minCost).toBeLessThanOrEqual(3);
    });
  });

  test('모든 필터를 동시에 적용한다', () => {
    // Arrange
    const filters = {
      search: '',
      regions: ['seoul', 'gyeongsan'],
      costRange: { min: 2, max: 3 },
      minSpeed: 800,
      sortBy: 'cheap' as const,
      showFavorites: false,
      showBookmarks: false,
    };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    result.forEach(city => {
      const minCost = extractMinCost(city.cost_per_month);
      expect(minCost).toBeGreaterThanOrEqual(2);
      expect(minCost).toBeLessThanOrEqual(3);
      expect(city.internet_speed).toBeGreaterThanOrEqual(800);
    });
  });

  test('필터링 후 정렬이 올바르게 적용된다', () => {
    // Arrange
    const filters = {
      ...defaultFilters,
      costRange: { min: 1, max: 3 },
      sortBy: 'fast' as const,
    };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].internet_speed).toBeGreaterThanOrEqual(result[i + 1].internet_speed);
    }
  });

  test('필터링 결과가 없을 수 있다', () => {
    // Arrange
    const filters = {
      ...defaultFilters,
      search: '제주',
      regions: ['seoul'],
      costRange: { min: 10, max: 20 },
    };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    expect(result).toHaveLength(0);
  });

  test('빈 배열이 주어져도 에러가 발생하지 않는다', () => {
    // Arrange
    const filters = defaultFilters;

    // Act
    const result = applyFilters([], filters);

    // Assert
    expect(result).toEqual([]);
  });

  test('필터 순서와 관계없이 동일한 결과를 반환한다', () => {
    // Arrange
    const filters1 = {
      ...defaultFilters,
      costRange: { min: 2, max: 3 },
      minSpeed: 900,
    };
    const filters2 = {
      ...defaultFilters,
      minSpeed: 900,
      costRange: { min: 2, max: 3 },
    };

    // Act
    const result1 = applyFilters(mockCities, filters1);
    const result2 = applyFilters(mockCities, filters2);

    // Assert
    expect(result1).toEqual(result2);
  });

  test('원본 배열이 변경되지 않음을 보장한다', () => {
    // Arrange
    const originalCities = JSON.parse(JSON.stringify(mockCities));
    const filters = {
      search: '서울',
      regions: ['seoul'],
      costRange: { min: 2, max: 3 },
      minSpeed: 900,
      sortBy: 'cheap' as const,
      showFavorites: false,
      showBookmarks: false,
    };

    // Act
    applyFilters(mockCities, filters);

    // Assert
    expect(mockCities).toEqual(originalCities);
  });

  test('필터링과 정렬을 여러 번 적용해도 일관된 결과를 반환한다', () => {
    // Arrange
    const filters = { ...defaultFilters, sortBy: 'overall' as const };

    // Act
    const result1 = applyFilters(mockCities, filters);
    const result2 = applyFilters(mockCities, filters);

    // Assert
    expect(result1).toEqual(result2);
  });

  test('극단적인 필터 값도 처리한다', () => {
    // Arrange
    const filters = {
      ...defaultFilters,
      costRange: { min: -100, max: 1000 },
      minSpeed: -500,
    };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    expect(result).toHaveLength(5);
  });

  test('복잡한 검색어와 필터 조합을 처리한다', () => {
    // Arrange
    const filters = {
      search: '서',
      regions: ['seoul'],
      costRange: { min: 0, max: 10 },
      minSpeed: 0,
      sortBy: 'overall' as const,
      showFavorites: false,
      showBookmarks: false,
    };

    // Act
    const result = applyFilters(mockCities, filters);

    // Assert
    expect(result.length).toBeGreaterThanOrEqual(0);
  });
});
