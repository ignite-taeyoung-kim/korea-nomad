import { cities } from '@/lib/data'
import CityCard from './CityCard'

export default function CityGrid() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section Title */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-nature-900 mb-2">
          인기 도시 BEST 8
        </h2>
        <p className="text-earth-700">
          자연과 함께하는 노마드들이 가장 선호하는 도시들을 한눈에 비교해보세요
        </p>
      </div>

      {/* City Cards Grid */}
      <div className="grid grid-cols-3 gap-10 auto-cols-fr">
        {cities.map((city) => (
          <CityCard key={city.id} city={city} />
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-12 text-center">
        <button className="px-8 py-3 bg-gradient-to-r from-primary-600 to-nature-600 text-white rounded-xl font-medium hover:from-primary-700 hover:to-nature-700 transition-all leaf-shadow">
          모든 도시 보기 ({cities.length}개)
        </button>
      </div>
    </div>
  )
}
