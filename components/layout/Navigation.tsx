import Link from 'next/link'
import { Home, Search, Users, Zap, HelpCircle, BookOpen, LogIn, UserPlus } from 'lucide-react'

export default function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary-600">
            <span className="text-2xl">🇰🇷</span>
            <span className="hidden sm:inline">한국 노마드</span>
          </Link>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink href="/" icon={<Home size={16} />} label="홈" />
            <NavLink href="/cities" icon={<Search size={16} />} label="검색" />
            <NavLink href="/community" icon={<Users size={16} />} label="커뮤니티" />
            <NavLink href="/events" icon={<Zap size={16} />} label="이벤트" />
            <NavLink href="/qa" icon={<HelpCircle size={16} />} label="Q&A" />
            <NavLink href="/guide" icon={<BookOpen size={16} />} label="가이드" />
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-2">
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors">
              <LogIn size={16} />
              <span className="text-sm">로그인</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm">
              <UserPlus size={16} />
              <span className="hidden sm:inline">가입</span>
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
      className="flex items-center gap-1.5 px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors text-sm"
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}
