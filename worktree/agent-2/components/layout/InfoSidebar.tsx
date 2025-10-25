import { stats, meetups, newMembers } from '@/lib/data'
import { MessageSquare, Users, Calendar } from 'lucide-react'

export default function InfoSidebar() {
  return (
    <aside className="hidden lg:block w-80 space-y-6">
      {/* Advertising Section */}
      <div className="bg-cyber-gray rounded-lg p-6 border-2 border-neon-blue shadow-neon-blue">
        <div className="text-center">
          <div className="text-4xl mb-2">🍹</div>
          <h3 className="font-semibold text-neon-blue mb-2">여행 보험</h3>
          <p className="text-sm text-gray-400 mb-4">
            해외 여행 중 안심할 수 있는 보험 상품
          </p>
          <button className="w-full px-4 py-2 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-lg hover:shadow-neon-blue transition-all text-sm font-medium">
            더 알아보기
          </button>
        </div>
      </div>

      {/* Meetups */}
      <div className="bg-cyber-gray rounded-lg border-2 border-neon-green shadow-neon-green p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={20} className="text-neon-pink" />
          <h3 className="font-semibold text-white">
            다음 밋업 <span className="text-neon-green">({stats.monthly_meetups}개/월)</span>
          </h3>
        </div>
        <div className="space-y-3">
          {meetups.map((meetup) => (
            <div key={meetup.id} className="pb-3 border-b-2 border-neon-purple/20 last:border-0 last:pb-0">
              <p className="text-sm font-medium text-white">{meetup.title}</p>
              <p className="text-xs text-gray-400 mt-1">
                {meetup.date} · {meetup.location}
              </p>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 px-4 py-2 bg-cyber-gray-light border-2 border-neon-green/50 text-neon-green rounded-lg hover:border-neon-green hover:shadow-neon-green transition-all text-sm font-medium">
          모든 밋업 보기 →
        </button>
      </div>

      {/* New Members */}
      <div className="bg-cyber-gray rounded-lg border-2 border-neon-purple shadow-neon-purple p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users size={20} className="text-neon-pink" />
          <h3 className="font-semibold text-white">
            새로운 멤버 <span className="text-neon-purple">({stats.monthly_new_members}/월)</span>
          </h3>
        </div>
        <div className="space-y-3">
          {newMembers.map((member) => (
            <div key={member.id} className="flex items-center gap-3 pb-3 border-b-2 border-neon-blue/20 last:border-0 last:pb-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-pink to-neon-purple flex items-center justify-center text-white text-xs font-semibold shadow-neon-pink">
                {member.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{member.username}</p>
                <p className="text-xs text-gray-400">{new Date(member.joined_date).toLocaleDateString('ko-KR')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Community */}
      <div className="bg-cyber-gray rounded-lg p-6 border-2 border-neon-pink shadow-neon-pink">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare size={20} className="text-neon-purple" />
          <h3 className="font-semibold text-white">채팅 커뮤니티</h3>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-300 mb-2">
            <span className="font-semibold text-neon-pink">15K+</span> 메시지/월
          </p>
          <p className="text-xs text-gray-400">
            실시간으로 다른 노마드들과 소통하세요
          </p>
        </div>
        <button className="w-full px-4 py-2 bg-gradient-to-r from-neon-pink to-neon-purple text-white rounded-lg hover:shadow-neon-pink transition-all text-sm font-medium">
          채팅 참여 →
        </button>
      </div>
    </aside>
  )
}
