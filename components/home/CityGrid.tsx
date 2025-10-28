import { fetchCities } from '@/lib/supabase/queries'
import CityCard from './CityCard'

export default async function CityGrid() {
  const cities = await fetchCities()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section Title */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          인기 도시 BEST 8
        </h2>
        <p className="text-gray-600">
          노마드들이 가장 선호하는 도시들을 한눈에 비교해보세요
        </p>
      </div>

      {/* City Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cities.map((city) => (
          <CityCard key={city.id} city={city} />
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-12 text-center">
        <button className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
          모든 도시 보기 ({cities.length}개)
        </button>
      </div>
    </div>
  )
}
