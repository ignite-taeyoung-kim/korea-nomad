import Link from 'next/link'
import { Mail, MapPin, Crown } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-luxury-black border-t border-luxury-gold-500/20 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 font-luxury text-xl font-bold text-luxury-gold-500 mb-6">
              <span className="text-3xl">🇰🇷</span>
              <span className="tracking-wide">한국 노마드</span>
            </div>
            <p className="text-luxury-white-cream text-base leading-relaxed">
              한국에서 노마드 생활을 위한 모든 프리미엄 정보를 한곳에서 제공합니다.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-luxury font-semibold text-luxury-gold-500 mb-6 text-lg">서비스</h3>
            <div className="flex flex-wrap gap-5 text-base text-luxury-white-cream">
              <Link href="/" className="hover:text-luxury-gold-400 transition-colors">홈</Link>
              <span className="text-luxury-gold-500/50">|</span>
              <Link href="/cities" className="hover:text-luxury-gold-400 transition-colors">도시 검색</Link>
              <span className="text-luxury-gold-500/50">|</span>
              <Link href="/community" className="hover:text-luxury-gold-400 transition-colors">커뮤니티</Link>
              <span className="text-luxury-gold-500/50">|</span>
              <Link href="/guide" className="hover:text-luxury-gold-400 transition-colors">가이드</Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-luxury font-semibold text-luxury-gold-500 mb-6 text-lg">정보</h3>
            <div className="flex flex-wrap gap-5 text-base text-luxury-white-cream">
              <a href="#" className="hover:text-luxury-gold-400 transition-colors">이용약관</a>
              <span className="text-luxury-gold-500/50">|</span>
              <a href="#" className="hover:text-luxury-gold-400 transition-colors">개인정보처리방침</a>
              <span className="text-luxury-gold-500/50">|</span>
              <a href="#" className="hover:text-luxury-gold-400 transition-colors">연락처</a>
              <span className="text-luxury-gold-500/50">|</span>
              <a href="#" className="hover:text-luxury-gold-400 transition-colors">FAQ</a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-luxury font-semibold text-luxury-gold-500 mb-6 text-lg">연락처</h3>
            <ul className="space-y-4 text-base text-luxury-white-cream">
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-luxury-gold-500" />
                <a href="mailto:contact@koreannomads.com" className="hover:text-luxury-gold-400 transition-colors">
                  contact@koreannomads.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-luxury-gold-500" />
                <span>Seoul, Korea</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-luxury-gold-500/20 pt-8">
          <div className="flex flex-row items-center justify-between gap-8">
            <p className="text-base text-luxury-gold-300 font-light">
              © 2025 Korean Nomad Cities. All rights reserved.
            </p>
            <div className="flex flex-row gap-6 text-base text-luxury-gold-300">
              <a href="#" className="hover:text-luxury-gold-400 transition-colors">이용약관</a>
              <span className="text-luxury-gold-500/30">|</span>
              <a href="#" className="hover:text-luxury-gold-400 transition-colors">개인정보</a>
              <span className="text-luxury-gold-500/30">|</span>
              <a href="#" className="hover:text-luxury-gold-400 transition-colors">문의</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
