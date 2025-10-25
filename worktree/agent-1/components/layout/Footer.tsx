import Link from 'next/link'
import { Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 font-semibold text-lg text-black mb-4">
              <span className="text-2xl">🇰🇷</span>
              <span>한국 노마드</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              한국에서 노마드 생활을 위한 모든 정보를 한곳에서 제공합니다.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-black mb-4 text-sm uppercase tracking-wider">서비스</h3>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <Link href="/" className="hover:text-black transition-colors">홈</Link>
              <span className="text-gray-400">|</span>
              <Link href="/cities" className="hover:text-black transition-colors">도시 검색</Link>
              <span className="text-gray-400">|</span>
              <Link href="/community" className="hover:text-black transition-colors">커뮤니티</Link>
              <span className="text-gray-400">|</span>
              <Link href="/guide" className="hover:text-black transition-colors">가이드</Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-black mb-4 text-sm uppercase tracking-wider">정보</h3>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <a href="#" className="hover:text-black transition-colors">이용약관</a>
              <span className="text-gray-400">|</span>
              <a href="#" className="hover:text-black transition-colors">개인정보처리방침</a>
              <span className="text-gray-400">|</span>
              <a href="#" className="hover:text-black transition-colors">연락처</a>
              <span className="text-gray-400">|</span>
              <a href="#" className="hover:text-black transition-colors">FAQ</a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-black mb-4 text-sm uppercase tracking-wider">연락처</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-black" />
                <a href="mailto:contact@koreannomads.com" className="hover:text-black transition-colors">
                  contact@koreannomads.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-black" />
                <span>Seoul, Korea</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-row items-center justify-between gap-8">
            <p className="text-sm text-gray-500">
              © 2025 Korean Nomad Cities. All rights reserved.
            </p>
            <div className="flex flex-row gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-black transition-colors">이용약관</a>
              <span>|</span>
              <a href="#" className="hover:text-black transition-colors">개인정보</a>
              <span>|</span>
              <a href="#" className="hover:text-black transition-colors">문의</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
