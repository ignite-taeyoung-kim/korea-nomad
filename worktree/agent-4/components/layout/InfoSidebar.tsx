import { stats, meetups, newMembers } from '@/lib/data'
import { MessageSquare, Users, Calendar, Crown, Sparkles } from 'lucide-react'

export default function InfoSidebar() {
  return (
    <aside className="hidden lg:block w-80 space-y-8">
      {/* Advertising Section */}
      <div className="bg-gradient-to-br from-luxury-purple-700/20 to-luxury-gold-500/20 rounded-xl p-8 border-2 border-luxury-gold-500/30 backdrop-blur-sm shadow-luxury relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10">
          <Crown size={80} className="text-luxury-gold-500" />
        </div>
        <div className="text-center relative z-10">
          <div className="text-5xl mb-4">🍹</div>
          <h3 className="font-luxury font-bold text-luxury-white-cream mb-3 text-xl">프리미엄 여행 보험</h3>
          <p className="text-base text-luxury-gold-300 mb-6 leading-relaxed">
            해외 여행 중 안심할 수 있는 최고급 보험 상품
          </p>
          <button className="w-full px-5 py-3 bg-gradient-to-r from-luxury-gold-500 to-luxury-gold-600 text-luxury-black rounded-lg hover:shadow-luxury-lg transition-all text-base font-bold hover:scale-105">
            더 알아보기
          </button>
        </div>
      </div>

      {/* Meetups */}
      <div className="bg-luxury-black-light rounded-xl border-2 border-luxury-gold-500/20 p-8 backdrop-blur-sm shadow-luxury">
        <div className="flex items-center gap-3 mb-6">
          <Calendar size={22} className="text-luxury-gold-500" />
          <h3 className="font-luxury font-bold text-luxury-white-cream text-lg">
            다음 밋업 <span className="text-luxury-gold-500">({stats.monthly_meetups}개/월)</span>
          </h3>
        </div>
        <div className="space-y-4">
          {meetups.map((meetup) => (
            <div key={meetup.id} className="pb-4 border-b border-luxury-gold-500/10 last:border-0 last:pb-0">
              <p className="text-base font-medium text-luxury-white-cream">{meetup.title}</p>
              <p className="text-sm text-luxury-gold-300 mt-2">
                {meetup.date} · {meetup.location}
              </p>
            </div>
          ))}
        </div>
        <button className="w-full mt-6 px-5 py-3 bg-luxury-gold-500/10 text-luxury-gold-500 rounded-lg hover:bg-luxury-gold-500/20 border border-luxury-gold-500/30 transition-all text-base font-semibold">
          모든 밋업 보기 →
        </button>
      </div>

      {/* New Members */}
      <div className="bg-luxury-black-light rounded-xl border-2 border-luxury-gold-500/20 p-8 backdrop-blur-sm shadow-luxury">
        <div className="flex items-center gap-3 mb-6">
          <Users size={22} className="text-luxury-gold-500" />
          <h3 className="font-luxury font-bold text-luxury-white-cream text-lg">
            새로운 멤버 <span className="text-luxury-gold-500">({stats.monthly_new_members}/월)</span>
          </h3>
        </div>
        <div className="space-y-4">
          {newMembers.map((member) => (
            <div key={member.id} className="flex items-center gap-4 pb-4 border-b border-luxury-gold-500/10 last:border-0 last:pb-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-luxury-gold-400 to-luxury-gold-600 flex items-center justify-center text-luxury-black text-base font-bold shadow-luxury">
                {member.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-base font-medium text-luxury-white-cream">{member.username}</p>
                <p className="text-sm text-luxury-gold-300">{new Date(member.joined_date).toLocaleDateString('ko-KR')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Community */}
      <div className="bg-gradient-to-br from-luxury-purple-700/30 to-luxury-purple-800/30 rounded-xl p-8 border-2 border-luxury-purple-700/40 backdrop-blur-sm shadow-luxury-lg relative overflow-hidden">
        <div className="absolute bottom-0 right-0 opacity-10">
          <Sparkles size={80} className="text-luxury-purple-500" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare size={22} className="text-luxury-purple-400" />
            <h3 className="font-luxury font-bold text-luxury-white-cream text-lg">VIP 채팅 커뮤니티</h3>
          </div>
          <div className="mb-6">
            <p className="text-base text-luxury-white-cream mb-3">
              <span className="font-bold text-luxury-purple-400 text-xl">15K+</span> 메시지/월
            </p>
            <p className="text-sm text-luxury-gold-300 leading-relaxed">
              실시간으로 엘리트 노마드들과 소통하세요
            </p>
          </div>
          <button className="w-full px-5 py-3 bg-gradient-to-r from-luxury-purple-600 to-luxury-purple-700 text-white rounded-lg hover:shadow-luxury-lg transition-all text-base font-bold hover:scale-105">
            채팅 참여 →
          </button>
        </div>
      </div>
    </aside>
  )
}
