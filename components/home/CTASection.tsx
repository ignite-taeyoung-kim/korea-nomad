'use client'

import { useState } from 'react'
import { Mail, Rocket } from 'lucide-react'

export default function CTASection() {
  const [email, setEmail] = useState('')
  const [gender, setGender] = useState('')
  const [agreed, setAgreed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log({ email, gender, agreed })
  }

  return (
    <div className="bg-gradient-to-r from-primary-600 to-blue-600 py-16 lg:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Title */}
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            🌟 한국 노마드 커뮤니티 참여하기 🌟
          </h2>
          <p className="text-lg text-primary-100">
            리뷰를 남기고, 도시를 비교하고, 다른 노마드들과 연결되세요
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl p-8 max-w-md mx-auto">
          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이메일
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <Mail className="absolute left-4 top-3.5 text-gray-400" size={18} />
            </div>
          </div>

          {/* Gender Select */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              성별
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            >
              <option value="">선택해주세요</option>
              <option value="male">남성</option>
              <option value="female">여성</option>
              <option value="other">기타</option>
            </select>
          </div>

          {/* Checkbox */}
          <div className="mb-6 flex items-start gap-2">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              required
              className="w-4 h-4 mt-1 accent-primary-600"
            />
            <label htmlFor="agree" className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">이용약관</span>
              {' '}및{' '}
              <span className="font-medium text-gray-900">개인정보처리방침</span>
              에 동의합니다
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!email || !gender || !agreed}
            className="w-full py-3 bg-gradient-to-r from-primary-600 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Rocket size={18} />
            <span>🚀 지금 시작하기</span>
          </button>

          {/* Helper Text */}
          <p className="mt-4 text-sm text-gray-600">
            이미 계정이 있다면 자동으로 로그인됩니다
          </p>
        </form>

        {/* Trust Badge */}
        <div className="mt-8 flex items-center justify-center gap-8 text-white text-sm">
          <div className="flex items-center gap-2">
            <span className="text-xl">✅</span>
            <span>가입은 무료입니다</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🔒</span>
            <span>데이터는 안전하게 보호됩니다</span>
          </div>
        </div>
      </div>
    </div>
  )
}
