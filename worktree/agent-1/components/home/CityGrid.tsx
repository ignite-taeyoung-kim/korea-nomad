import { cities } from '@/lib/data'
import CityCard from './CityCard'

export default function CityGrid() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
      {/* Section Title */}
      <div className="mb-12">
        <h2 className="text-2xl sm:text-3xl font-semibold text-black mb-3 tracking-tight">
          인기 도시 BEST 8
        </h2>
        <p className="text-gray-600">
          노마드들이 가장 선호하는 도시들을 한눈에 비교해보세요
        </p>
      </div>

      {/* City Cards Grid */}
      <div className="grid grid-cols-3 gap-10 auto-cols-fr">
        {cities.map((city) => (
          <CityCard key={city.id} city={city} />
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-16 text-center">
        <button className="px-10 py-4 bg-black text-white hover:bg-gray-800 transition-colors text-base">
          모든 도시 보기 ({cities.length}개)
        </button>
      </div>
    </div>
  )
}
