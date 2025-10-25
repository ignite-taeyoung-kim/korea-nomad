import HeroSection from '@/components/home/HeroSection'
import CityGrid from '@/components/home/CityGrid'
import CTASection from '@/components/home/CTASection'
import InfoSidebar from '@/components/layout/InfoSidebar'

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-8">
          {/* City Grid */}
          <div className="flex-1 min-w-0">
            <CityGrid />
          </div>

          {/* Info Sidebar */}
          <InfoSidebar />
        </div>
      </div>

      {/* CTA Section */}
      <CTASection />
    </div>
  )
}
