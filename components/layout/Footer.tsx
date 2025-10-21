import Link from 'next/link'
import { Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-bold text-lg text-primary-600 mb-4">
              <span className="text-2xl">🇰🇷</span>
              <span>한국 노마드</span>
            </div>
            <p className="text-gray-600 text-sm">
              한국에서 노마드 생활을 위한 모든 정보를 한곳에서 제공합니다.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">서비스</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/" className="hover:text-primary-600 transition-colors">홈</Link></li>
              <li><Link href="/cities" className="hover:text-primary-600 transition-colors">도시 검색</Link></li>
              <li><Link href="/community" className="hover:text-primary-600 transition-colors">커뮤니티</Link></li>
              <li><Link href="/guide" className="hover:text-primary-600 transition-colors">가이드</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">정보</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-primary-600 transition-colors">이용약관</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">개인정보처리방침</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">연락처</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">연락처</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-primary-600" />
                <a href="mailto:contact@koreannomads.com" className="hover:text-primary-600 transition-colors">
                  contact@koreannomads.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-primary-600" />
                <span>Seoul, Korea</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <p className="text-sm text-gray-600">
              © 2025 Korean Nomad Cities. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 sm:mt-0 text-sm text-gray-600">
              <a href="#" className="hover:text-primary-600 transition-colors">이용약관</a>
              <span>|</span>
              <a href="#" className="hover:text-primary-600 transition-colors">개인정보</a>
              <span>|</span>
              <a href="#" className="hover:text-primary-600 transition-colors">문의</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
