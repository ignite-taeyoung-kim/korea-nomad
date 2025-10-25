import { cities } from '@/lib/data'
import CityCard from './CityCard'
import { Crown } from 'lucide-react'

export default function CityGrid() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Section Title */}
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Crown className="text-luxury-gold-500" size={32} />
          <h2 className="text-3xl sm:text-4xl font-luxury font-bold text-luxury-white-cream tracking-wide">
            인기 도시 BEST 8
          </h2>
          <Crown className="text-luxury-gold-500" size={32} />
        </div>
        <p className="text-lg text-luxury-gold-300 font-light">
          노마드들이 가장 선호하는 프리미엄 도시들을 한눈에 비교해보세요
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
        <button className="px-10 py-4 bg-gradient-to-r from-luxury-gold-500 to-luxury-gold-600 text-luxury-black rounded-xl font-bold hover:shadow-luxury-xl transition-all hover:scale-105 text-lg">
          모든 도시 보기 ({cities.length}개)
        </button>
      </div>
    </div>
  )
}
