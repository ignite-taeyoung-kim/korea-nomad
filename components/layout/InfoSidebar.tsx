import { stats, meetups, newMembers } from '@/lib/data'
import { MessageSquare, Users, Calendar } from 'lucide-react'

export default function InfoSidebar() {
  return (
    <aside className="hidden lg:block w-80 space-y-6">
      {/* Advertising Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
        <div className="text-center">
          <div className="text-4xl mb-2">🍹</div>
          <h3 className="font-semibold text-gray-900 mb-2">여행 보험</h3>
          <p className="text-sm text-gray-600 mb-4">
            해외 여행 중 안심할 수 있는 보험 상품
          </p>
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            더 알아보기
          </button>
        </div>
      </div>

      {/* Meetups */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={20} className="text-primary-600" />
          <h3 className="font-semibold text-gray-900">
            다음 밋업 <span className="text-primary-600">({stats.monthly_meetups}개/월)</span>
          </h3>
        </div>
        <div className="space-y-3">
          {meetups.map((meetup) => (
            <div key={meetup.id} className="pb-3 border-b border-gray-100 last:border-0 last:pb-0">
              <p className="text-sm font-medium text-gray-900">{meetup.title}</p>
              <p className="text-xs text-gray-500 mt-1">
                {meetup.date} · {meetup.location}
              </p>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors text-sm font-medium">
          모든 밋업 보기 →
        </button>
      </div>

      {/* New Members */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users size={20} className="text-primary-600" />
          <h3 className="font-semibold text-gray-900">
            새로운 멤버 <span className="text-primary-600">({stats.monthly_new_members}/월)</span>
          </h3>
        </div>
        <div className="space-y-3">
          {newMembers.map((member) => (
            <div key={member.id} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-300 to-primary-600 flex items-center justify-center text-white text-xs font-semibold">
                {member.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{member.username}</p>
                <p className="text-xs text-gray-500">{new Date(member.joined_date).toLocaleDateString('ko-KR')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Community */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-100">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare size={20} className="text-purple-600" />
          <h3 className="font-semibold text-gray-900">채팅 커뮤니티</h3>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-semibold text-purple-600">15K+</span> 메시지/월
          </p>
          <p className="text-xs text-gray-500">
            실시간으로 다른 노마드들과 소통하세요
          </p>
        </div>
        <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
          채팅 참여 →
        </button>
      </div>
    </aside>
  )
}
