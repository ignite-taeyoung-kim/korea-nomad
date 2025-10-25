import { stats, meetups, newMembers } from '@/lib/data'
import { MessageSquare, Users, Calendar } from 'lucide-react'

export default function InfoSidebar() {
  return (
    <aside className="hidden lg:block w-80 space-y-8">
      {/* Advertising Section */}
      <div className="bg-gray-50 border border-gray-200 p-8">
        <div className="text-center">
          <div className="text-4xl mb-3">🍹</div>
          <h3 className="font-semibold text-black mb-3">여행 보험</h3>
          <p className="text-sm text-gray-600 mb-5">
            해외 여행 중 안심할 수 있는 보험 상품
          </p>
          <button className="w-full px-4 py-3 bg-black text-white hover:bg-gray-800 transition-colors text-sm">
            더 알아보기
          </button>
        </div>
      </div>

      {/* Meetups */}
      <div className="bg-white border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-200">
          <Calendar size={18} className="text-black" />
          <h3 className="font-semibold text-black">
            다음 밋업 <span className="text-gray-500">({stats.monthly_meetups}개/월)</span>
          </h3>
        </div>
        <div className="space-y-4">
          {meetups.map((meetup) => (
            <div key={meetup.id} className="pb-4 border-b border-gray-200 last:border-0 last:pb-0">
              <p className="text-sm font-medium text-black mb-1">{meetup.title}</p>
              <p className="text-xs text-gray-500">
                {meetup.date} · {meetup.location}
              </p>
            </div>
          ))}
        </div>
        <button className="w-full mt-5 px-4 py-2 border border-gray-300 text-black hover:border-black transition-colors text-sm">
          모든 밋업 보기 →
        </button>
      </div>

      {/* New Members */}
      <div className="bg-white border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-200">
          <Users size={18} className="text-black" />
          <h3 className="font-semibold text-black">
            새로운 멤버 <span className="text-gray-500">({stats.monthly_new_members}/월)</span>
          </h3>
        </div>
        <div className="space-y-4">
          {newMembers.map((member) => (
            <div key={member.id} className="flex items-center gap-3 pb-4 border-b border-gray-200 last:border-0 last:pb-0">
              <div className="w-9 h-9 bg-black flex items-center justify-center text-white text-xs font-semibold">
                {member.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-black">{member.username}</p>
                <p className="text-xs text-gray-500">{new Date(member.joined_date).toLocaleDateString('ko-KR')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Community */}
      <div className="bg-gray-50 border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
          <MessageSquare size={18} className="text-black" />
          <h3 className="font-semibold text-black">채팅 커뮤니티</h3>
        </div>
        <div className="mb-5">
          <p className="text-sm text-black mb-2">
            <span className="font-semibold">15K+</span> 메시지/월
          </p>
          <p className="text-xs text-gray-500">
            실시간으로 다른 노마드들과 소통하세요
          </p>
        </div>
        <button className="w-full px-4 py-3 bg-black text-white hover:bg-gray-800 transition-colors text-sm">
          채팅 참여 →
        </button>
      </div>
    </aside>
  )
}
