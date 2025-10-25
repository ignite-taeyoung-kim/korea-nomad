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
    <div className="bg-gray-50 py-20 lg:py-32 border-t border-gray-200">
      <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        {/* Title */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold text-black mb-6 tracking-tight">
            한국 노마드 커뮤니티 참여하기
          </h2>
          <p className="text-lg text-gray-600 font-light">
            리뷰를 남기고, 도시를 비교하고, 다른 노마드들과 연결되세요
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-10 max-w-md mx-auto">
          {/* Email Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-black mb-3 text-left">
              이메일
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 pl-11 border border-gray-300 focus:outline-none focus:border-black transition-colors"
              />
              <Mail className="absolute left-4 top-3.5 text-gray-400" size={18} />
            </div>
          </div>

          {/* Gender Select */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-black mb-3 text-left">
              성별
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors bg-white"
            >
              <option value="">선택해주세요</option>
              <option value="male">남성</option>
              <option value="female">여성</option>
              <option value="other">기타</option>
            </select>
          </div>

          {/* Checkbox */}
          <div className="mb-8 flex items-start gap-3">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              required
              className="w-4 h-4 mt-1 accent-black"
            />
            <label htmlFor="agree" className="text-sm text-gray-600 text-left">
              <span className="font-medium text-black">이용약관</span>
              {' '}및{' '}
              <span className="font-medium text-black">개인정보처리방침</span>
              에 동의합니다
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!email || !gender || !agreed}
            className="w-full py-4 bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
          >
            <Rocket size={18} />
            <span>지금 시작하기</span>
          </button>

          {/* Helper Text */}
          <p className="mt-5 text-sm text-gray-500">
            이미 계정이 있다면 자동으로 로그인됩니다
          </p>
        </form>

        {/* Trust Badge */}
        <div className="mt-10 flex items-center justify-center gap-8 text-gray-600 text-sm">
          <div className="flex items-center gap-2">
            <span>가입은 무료입니다</span>
          </div>
          <div className="flex items-center gap-2">
            <span>데이터는 안전하게 보호됩니다</span>
          </div>
        </div>
      </div>
    </div>
  )
}
