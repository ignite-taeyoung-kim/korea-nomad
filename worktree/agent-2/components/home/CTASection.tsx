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
    <div className="bg-cyber-dark cyber-grid border-y-2 border-neon-pink shadow-neon-pink py-16 lg:py-20 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-neon-pink/10 via-neon-purple/10 to-neon-blue/10 animate-pulse-neon"></div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Title */}
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 neon-text-pink animate-glow">
            🌟 한국 노마드 커뮤니티 참여하기 🌟
          </h2>
          <p className="text-lg text-neon-blue">
            리뷰를 남기고, 도시를 비교하고, 다른 노마드들과 연결되세요
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-cyber-gray rounded-xl border-2 border-neon-purple shadow-neon-purple p-8 max-w-md mx-auto">
          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-neon-blue mb-2">
              이메일
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 pl-11 bg-cyber-gray-light border-2 border-neon-purple/50 rounded-lg focus:outline-none focus:border-neon-purple focus:shadow-neon-purple text-white placeholder-gray-500 transition-all"
              />
              <Mail className="absolute left-4 top-3.5 text-neon-purple" size={18} />
            </div>
          </div>

          {/* Gender Select */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-neon-blue mb-2">
              성별
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-3 bg-cyber-gray-light border-2 border-neon-purple/50 rounded-lg focus:outline-none focus:border-neon-purple focus:shadow-neon-purple text-white transition-all"
            >
              <option value="" className="bg-cyber-gray">선택해주세요</option>
              <option value="male" className="bg-cyber-gray">남성</option>
              <option value="female" className="bg-cyber-gray">여성</option>
              <option value="other" className="bg-cyber-gray">기타</option>
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
              className="w-4 h-4 mt-1 accent-neon-pink"
            />
            <label htmlFor="agree" className="text-sm text-gray-400">
              <span className="font-medium text-white">이용약관</span>
              {' '}및{' '}
              <span className="font-medium text-white">개인정보처리방침</span>
              에 동의합니다
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!email || !gender || !agreed}
            className="w-full py-3 bg-gradient-to-r from-neon-pink to-neon-purple text-white rounded-lg font-bold hover:shadow-neon-pink transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Rocket size={18} />
            <span>🚀 지금 시작하기</span>
          </button>

          {/* Helper Text */}
          <p className="mt-4 text-sm text-gray-400">
            이미 계정이 있다면 자동으로 로그인됩니다
          </p>
        </form>

        {/* Trust Badge */}
        <div className="mt-8 flex items-center justify-center gap-8 text-neon-green text-sm">
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
