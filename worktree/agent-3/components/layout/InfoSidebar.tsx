import { stats, meetups, newMembers } from '@/lib/data'
import { MessageSquare, Users, Calendar } from 'lucide-react'

export default function InfoSidebar() {
  return (
    <aside className="hidden lg:block w-80 space-y-6">
      {/* Advertising Section */}
      <div className="bg-gradient-to-br from-earth-100 to-primary-100 rounded-2xl p-6 border border-earth-200 leaf-shadow">
        <div className="text-center">
          <div className="text-4xl mb-2">🌿</div>
          <h3 className="font-semibold text-nature-900 mb-2">자연 친화적 여행</h3>
          <p className="text-sm text-earth-600 mb-4">
            친환경 여행으로 지구를 지키며 노마드 생활하기
          </p>
          <button className="w-full px-4 py-2 bg-gradient-to-r from-primary-600 to-nature-600 text-white rounded-xl hover:from-primary-700 hover:to-nature-700 transition-all text-sm font-medium">
            더 알아보기
          </button>
        </div>
      </div>

      {/* Meetups */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-earth-200 p-6 leaf-shadow">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={20} className="text-primary-700" />
          <h3 className="font-semibold text-nature-900">
            다음 밋업 <span className="text-primary-700">({stats.monthly_meetups}개/월)</span>
          </h3>
        </div>
        <div className="space-y-3">
          {meetups.map((meetup) => (
            <div key={meetup.id} className="pb-3 border-b border-earth-100 last:border-0 last:pb-0">
              <p className="text-sm font-medium text-nature-900">{meetup.title}</p>
              <p className="text-xs text-earth-600 mt-1">
                {meetup.date} · {meetup.location}
              </p>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 px-4 py-2 bg-primary-50 text-primary-700 rounded-xl hover:bg-primary-100 transition-colors text-sm font-medium">
          모든 밋업 보기 →
        </button>
      </div>

      {/* New Members */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-earth-200 p-6 leaf-shadow">
        <div className="flex items-center gap-2 mb-4">
          <Users size={20} className="text-primary-700" />
          <h3 className="font-semibold text-nature-900">
            새로운 멤버 <span className="text-primary-700">({stats.monthly_new_members}/월)</span>
          </h3>
        </div>
        <div className="space-y-3">
          {newMembers.map((member) => (
            <div key={member.id} className="flex items-center gap-3 pb-3 border-b border-earth-100 last:border-0 last:pb-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-nature-600 flex items-center justify-center text-white text-xs font-semibold">
                {member.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-nature-900">{member.username}</p>
                <p className="text-xs text-earth-600">{new Date(member.joined_date).toLocaleDateString('ko-KR')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Community */}
      <div className="bg-gradient-to-br from-earth-100 via-primary-100 to-nature-100 rounded-2xl p-6 border border-earth-200 leaf-shadow">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare size={20} className="text-nature-700" />
          <h3 className="font-semibold text-nature-900">채팅 커뮤니티</h3>
        </div>
        <div className="mb-4">
          <p className="text-sm text-earth-700 mb-2">
            <span className="font-semibold text-nature-700">15K+</span> 메시지/월
          </p>
          <p className="text-xs text-earth-600">
            실시간으로 다른 노마드들과 소통하세요
          </p>
        </div>
        <button className="w-full px-4 py-2 bg-gradient-to-r from-nature-600 to-primary-600 text-white rounded-xl hover:from-nature-700 hover:to-primary-700 transition-all text-sm font-medium">
          채팅 참여 →
        </button>
      </div>
    </aside>
  )
}
