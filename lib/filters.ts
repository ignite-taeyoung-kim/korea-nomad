import { City, FilterParams } from './types'
import { getFavorites, getBookmarks } from './storage'

// 지역과 province 매핑
const regionMap: Record<string, string[]> = {
  seoul: ['서울특별시', '경기도'],
  gangwon: ['강원도'],
  jeonlla: ['전라북도', '전라남도', '광주광역시'],
  gyeongsan: ['부산광역시', '대구광역시', '경상북도', '경상남도'],
  chungcheong: ['충청북도', '충청남도', '대전광역시'],
  jeju: ['제주특별자치도'],
}

// cost_per_month 문자열에서 최소값 추출 (예: '2.1~3M' -> 2.1)
export function extractMinCost(costStr: string): number {
  const match = costStr.match(/(\d+\.?\d*)/);
  return match ? parseFloat(match[1]) : 0;
}

// 검색어로 필터링
function filterBySearch(cities: City[], search: string): City[] {
  if (!search.trim()) return cities;
  const lowerSearch = search.toLowerCase();
  return cities.filter(
    (city) =>
      city.name.toLowerCase().includes(lowerSearch) ||
      city.province.toLowerCase().includes(lowerSearch) ||
      city.description?.toLowerCase().includes(lowerSearch)
  );
}

// 지역으로 필터링
function filterByRegions(cities: City[], regions: string[]): City[] {
  if (regions.length === 0) return cities;
  return cities.filter((city) =>
    regions.some((region) =>
      regionMap[region]?.includes(city.province)
    )
  );
}

// 생활비 범위로 필터링
function filterByCostRange(
  cities: City[],
  costRange: { min: number; max: number }
): City[] {
  return cities.filter((city) => {
    const minCost = extractMinCost(city.cost_per_month);
    return minCost >= costRange.min && minCost <= costRange.max;
  });
}

// 인터넷 속도로 필터링
function filterBySpeed(cities: City[], minSpeed: number): City[] {
  if (minSpeed === 0) return cities;
  return cities.filter((city) => city.internet_speed >= minSpeed);
}

// 좋아요 필터링
function filterByFavorites(cities: City[], favorites: string[]): City[] {
  if (favorites.length === 0) return cities;
  return cities.filter((city) => favorites.includes(city.id));
}

// 북마크 필터링
function filterByBookmarks(cities: City[], bookmarks: string[]): City[] {
  if (bookmarks.length === 0) return cities;
  return cities.filter((city) => bookmarks.includes(city.id));
}

// 정렬 함수
function sortCities(cities: City[], sortBy: FilterParams['sortBy']): City[] {
  const sorted = [...cities];

  switch (sortBy) {
    case 'overall':
      return sorted.sort((a, b) => b.overall_score - a.overall_score);
    case 'cheap':
      return sorted.sort((a, b) => {
        const aCost = extractMinCost(a.cost_per_month);
        const bCost = extractMinCost(b.cost_per_month);
        return aCost - bCost;
      });
    case 'fast':
      return sorted.sort((a, b) => b.internet_speed - a.internet_speed);
    case 'active':
      return sorted.sort((a, b) => b.nomads_count - a.nomads_count);
    case 'quality':
      return sorted.sort((a, b) => b.quality_score - a.quality_score);
    case 'reviews':
      return sorted.sort((a, b) => b.reviews_count - a.reviews_count);
    default:
      return sorted;
  }
}

// 모든 필터 적용
export function applyFilters(cities: City[], filters: FilterParams): City[] {
  let filtered = cities;

  filtered = filterBySearch(filtered, filters.search);
  filtered = filterByRegions(filtered, filters.regions);
  filtered = filterByCostRange(filtered, filters.costRange);
  filtered = filterBySpeed(filtered, filters.minSpeed);

  // 좋아요/북마크 필터 (쇼 필터)
  if (filters.showFavorites) {
    const favorites = getFavorites();
    filtered = filterByFavorites(filtered, favorites);
  }
  if (filters.showBookmarks) {
    const bookmarks = getBookmarks();
    filtered = filterByBookmarks(filtered, bookmarks);
  }

  filtered = sortCities(filtered, filters.sortBy);

  return filtered;
}
