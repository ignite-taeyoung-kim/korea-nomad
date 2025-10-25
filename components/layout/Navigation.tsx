'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Navigation() {
  const router = useRouter()

  const navItems = [
    { label: '홈', href: '/' },
    { label: '도시검색', href: '/cities' },
    { label: '커뮤니티', href: '/community' },
    { label: '가이드', href: '/guide' }
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-2xl">🇰🇷</span>
            <span className="text-lg font-bold text-gray-900 hidden sm:inline">
              한국 노마드
            </span>
          </Link>

          {/* Center Navigation - Desktop only */}
          <div className="hidden lg:flex items-center gap-8 ml-8 flex-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons - Always visible */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => router.push('/auth/login')}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors border border-gray-300 rounded-lg hover:border-gray-400 whitespace-nowrap"
            >
              로그인
            </button>
            <button
              onClick={() => router.push('/auth/signup')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors whitespace-nowrap"
            >
              회원가입
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
