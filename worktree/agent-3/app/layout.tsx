import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: '한국 노마드 라이프 | 한국에서 디지털 노마드로 생활하기',
  description: '한국의 모든 도시에서 노마드 생활을 위한 정보를 한곳에서 찾으세요. 인터넷 속도, 생활비, 카페, 커뮤니티 정보를 비교하고 다른 노마드들과 연결되세요.',
  keywords: ['노마드', '디지털노마드', '한국', '원격근무', '도시비교'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="bg-gradient-to-br from-primary-50 via-earth-50 to-nature-50">
        <Navigation />
        <main className="flex-1 min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
