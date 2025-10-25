'use client'

import Link from 'next/link'
import { Home, Search, Users, Zap, HelpCircle, BookOpen, LogIn, UserPlus } from 'lucide-react'

export default function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-3 font-semibold text-lg text-black tracking-tight">
            <span className="text-2xl">🇰🇷</span>
            <span className="hidden sm:inline">한국 노마드</span>
          </Link>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink href="/" icon={<Home size={16} />} label="홈" />
            <NavLink href="/cities" icon={<Search size={16} />} label="검색" />
            <NavLink href="/community" icon={<Users size={16} />} label="커뮤니티" />
            <NavLink href="/events" icon={<Zap size={16} />} label="이벤트" />
            <NavLink href="/qa" icon={<HelpCircle size={16} />} label="Q&A" />
            <NavLink href="/guide" icon={<BookOpen size={16} />} label="가이드" />
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.location.href = '/auth/login'}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors border border-gray-300 rounded-lg hover:border-gray-400 whitespace-nowrap"
            >
              로그인
            </button>
            <button
              onClick={() => window.location.href = '/auth/signup'}
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

interface NavLinkProps {
  href: string
  icon: React.ReactNode
  label: string
}

function NavLink({ href, icon, label }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-black transition-colors text-sm"
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}
