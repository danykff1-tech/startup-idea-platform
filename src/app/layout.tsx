import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'
import { PlanProvider } from '@/lib/plan-context'
import { createClient } from '@/lib/supabase/server'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'idealike – AI-curated startup ideas, daily',
  description:
    'idealike crawls the internet for startup ideas, removes duplicates, and scores them by demand signals. Curated daily for founders and indie hackers.',
  keywords: ['startup ideas', 'SaaS ideas', 'business ideas', 'indie hacker', 'AI curation', 'side project ideas'],
  openGraph: {
    title: 'idealike – AI-curated startup ideas, daily',
    description: 'Spend less time on research. More time on building. Fresh startup ideas scored by AI, every day.',
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let sidebarUser = null
  if (user) {
    const { data: profile } = await supabase
      .from('users')
      .select('is_pro, full_name, avatar_url')
      .eq('id', user.id)
      .single()

    sidebarUser = {
      email: user.email!,
      full_name: profile?.full_name ?? null,
      avatar_url: profile?.avatar_url ?? null,
      is_pro: profile?.is_pro ?? false,
    }
  }

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      {user ? (
        /* ── Logged-in: sidebar + scrollable content ── */
        <body className="h-screen overflow-hidden bg-background text-foreground flex">
          <PlanProvider isPro={sidebarUser?.is_pro ?? false}>
            <Sidebar user={sidebarUser} />
            <div className="flex-1 overflow-y-auto pb-16 md:pb-0">
              {children}
            </div>
            <MobileNav isPro={sidebarUser?.is_pro ?? false} />
          </PlanProvider>
        </body>
      ) : (
        /* ── Guest: top navbar + footer ── */
        <body className="min-h-full flex flex-col bg-background text-foreground">
          <Navbar />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </body>
      )}
    </html>
  )
}
