import { createClient } from '@/utils/supabase/server'
import { logout } from '@/app/auth/login/actions'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">이메일</p>
                <p className="mt-1 text-lg text-gray-900">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">사용자 ID</p>
                <p className="mt-1 text-lg text-gray-900">{user?.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">계정 생성 날짜</p>
                <p className="mt-1 text-lg text-gray-900">
                  {user?.created_at && new Date(user.created_at).toLocaleDateString('ko-KR')}
                </p>
              </div>
            </div>
            <div className="mt-8">
              <form action={logout}>
                <button
                  type="submit"
                  className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  로그아웃
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
