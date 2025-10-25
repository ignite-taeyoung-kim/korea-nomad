import Link from 'next/link'
import { Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-earth-50 to-primary-50 border-t border-earth-200 mt-16 nature-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-bold text-lg text-primary-700 mb-4">
              <span className="text-2xl">🌿</span>
              <span>한국 노마드</span>
            </div>
            <p className="text-earth-600 text-sm">
              한국에서 노마드 생활을 위한 모든 정보를 한곳에서 제공합니다.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-nature-900 mb-4">서비스</h3>
            <div className="flex flex-wrap gap-4 text-sm text-earth-600">
              <Link href="/" className="hover:text-primary-700 transition-colors">홈</Link>
              <span className="text-earth-400">|</span>
              <Link href="/cities" className="hover:text-primary-700 transition-colors">도시 검색</Link>
              <span className="text-earth-400">|</span>
              <Link href="/community" className="hover:text-primary-700 transition-colors">커뮤니티</Link>
              <span className="text-earth-400">|</span>
              <Link href="/guide" className="hover:text-primary-700 transition-colors">가이드</Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-nature-900 mb-4">정보</h3>
            <div className="flex flex-wrap gap-4 text-sm text-earth-600">
              <a href="#" className="hover:text-primary-700 transition-colors">이용약관</a>
              <span className="text-earth-400">|</span>
              <a href="#" className="hover:text-primary-700 transition-colors">개인정보처리방침</a>
              <span className="text-earth-400">|</span>
              <a href="#" className="hover:text-primary-700 transition-colors">연락처</a>
              <span className="text-earth-400">|</span>
              <a href="#" className="hover:text-primary-700 transition-colors">FAQ</a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-nature-900 mb-4">연락처</h3>
            <ul className="space-y-3 text-sm text-earth-600">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-primary-700" />
                <a href="mailto:contact@koreannomads.com" className="hover:text-primary-700 transition-colors">
                  contact@koreannomads.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-primary-700" />
                <span>Seoul, Korea</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-earth-200 pt-8">
          <div className="flex flex-row items-center justify-between gap-8">
            <p className="text-sm text-earth-600">
              © 2025 Korean Nomad Cities. All rights reserved.
            </p>
            <div className="flex flex-row gap-4 text-sm text-earth-600">
              <a href="#" className="hover:text-primary-700 transition-colors">이용약관</a>
              <span>|</span>
              <a href="#" className="hover:text-primary-700 transition-colors">개인정보</a>
              <span>|</span>
              <a href="#" className="hover:text-primary-700 transition-colors">문의</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
