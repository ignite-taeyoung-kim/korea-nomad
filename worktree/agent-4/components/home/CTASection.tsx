'use client'

import { useState } from 'react'
import { Mail, Rocket, Crown, Shield, Gift } from 'lucide-react'

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
    <div className="relative bg-luxury-radial py-20 lg:py-28 overflow-hidden border-t border-luxury-gold-500/20">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <Crown className="absolute top-20 left-20 text-luxury-gold-500" size={100} />
        <Crown className="absolute bottom-20 right-20 text-luxury-gold-500" size={120} />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Title */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Crown className="text-luxury-gold-500" size={36} />
            <h2 className="text-4xl sm:text-5xl font-luxury font-bold text-luxury-white-cream tracking-wide">
              프리미엄 커뮤니티 참여하기
            </h2>
            <Crown className="text-luxury-gold-500" size={36} />
          </div>
          <p className="text-xl text-luxury-gold-300 font-light tracking-wide">
            리뷰를 남기고, 도시를 비교하고, 엘리트 노마드들과 연결되세요
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-luxury-black-light border-2 border-luxury-gold-500/30 rounded-2xl shadow-luxury-xl p-10 max-w-lg mx-auto backdrop-blur-sm">
          {/* Email Input */}
          <div className="mb-6">
            <label className="block text-base font-medium text-luxury-gold-400 mb-3 text-left">
              이메일
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-5 py-4 pl-12 bg-luxury-black border-2 border-luxury-gold-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold-500 focus:border-luxury-gold-500 text-luxury-white-cream placeholder-luxury-gold-300/40 text-base"
              />
              <Mail className="absolute left-4 top-4 text-luxury-gold-500" size={20} />
            </div>
          </div>

          {/* Gender Select */}
          <div className="mb-6">
            <label className="block text-base font-medium text-luxury-gold-400 mb-3 text-left">
              성별
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-5 py-4 bg-luxury-black border-2 border-luxury-gold-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold-500 focus:border-luxury-gold-500 text-luxury-white-cream text-base"
            >
              <option value="">선택해주세요</option>
              <option value="male">남성</option>
              <option value="female">여성</option>
              <option value="other">기타</option>
            </select>
          </div>

          {/* Checkbox */}
          <div className="mb-8 flex items-start gap-3 text-left">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              required
              className="w-5 h-5 mt-0.5 accent-luxury-gold-500 cursor-pointer"
            />
            <label htmlFor="agree" className="text-base text-luxury-white-cream cursor-pointer">
              <span className="font-semibold text-luxury-gold-400">이용약관</span>
              {' '}및{' '}
              <span className="font-semibold text-luxury-gold-400">개인정보처리방침</span>
              에 동의합니다
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!email || !gender || !agreed}
            className="w-full py-4 bg-gradient-to-r from-luxury-gold-500 to-luxury-gold-600 text-luxury-black rounded-xl font-bold hover:shadow-luxury-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg hover:scale-105"
          >
            <Rocket size={22} />
            <span>지금 시작하기</span>
          </button>

          {/* Helper Text */}
          <p className="mt-5 text-base text-luxury-gold-300 font-light">
            이미 계정이 있다면 자동으로 로그인됩니다
          </p>
        </form>

        {/* Trust Badge */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-luxury-white-cream text-base">
          <div className="flex items-center gap-3">
            <Gift className="text-luxury-gold-500" size={24} />
            <span className="font-light">가입은 무료입니다</span>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="text-luxury-gold-500" size={24} />
            <span className="font-light">데이터는 안전하게 보호됩니다</span>
          </div>
        </div>
      </div>
    </div>
  )
}
