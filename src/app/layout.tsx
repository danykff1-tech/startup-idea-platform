import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'idealike – 정제된 스타트업 아이디어',
  description:
    '인터넷 곳곳의 아이디어를 AI가 매일 크롤링·정제·점수화합니다. 예비 창업자와 1인 개발자를 위한 사업 아이디어 큐레이션.',
  keywords: ['스타트업 아이디어', 'SaaS', '사업 아이디어', '예비창업자', '1인개발자', 'AI 큐레이션'],
  openGraph: {
    title: 'idealike – 정제된 스타트업 아이디어',
    description: '매일 AI가 골라주는 사업 아이디어. 창업 리서치 시간을 절반으로 줄이세요.',
    url: 'https://idealike.xyz',
    siteName: 'idealike',
    locale: 'ko_KR',
    type: 'website',
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  )
}
