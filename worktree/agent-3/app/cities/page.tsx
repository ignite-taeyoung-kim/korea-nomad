import { cities } from '@/lib/data'
import CityCard from '@/components/home/CityCard'
import FilterSidebar from '@/components/cities/FilterSidebar'

export default function CitiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            모든 도시 찾아보기
          </h1>
          <p className="text-gray-600">
            한국의 모든 도시를 비교하고 당신의 노마드 생활을 계획하세요 ({cities.length}개)
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <FilterSidebar />

          {/* Cities Grid */}
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cities.map((city) => (
                <CityCard key={city.id} city={city} />
              ))}
            </div>

            {/* Empty State */}
            {cities.length === 0 && (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  해당하는 도시가 없습니다
                </h3>
                <p className="text-gray-600">
                  필터를 조정하고 다시 시도해보세요
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
