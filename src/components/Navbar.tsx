import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Bookmark } from 'lucide-react'
import LogoutButton from './LogoutButton'
import ThemeToggle from './ThemeToggle'

export default async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let isPro = false
  if (user) {
    const { data: profile } = await supabase
      .from('users')
      .select('is_pro')
      .eq('id', user.id)
      .single()
    isPro = profile?.is_pro ?? false
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10" style={{ backgroundColor: '#1a1a1a' }}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <Image src="/logo.png" alt="Idealike" width={36} height={36} className="rounded-lg" />
          <span className="text-lg font-bold text-white">Idealike</span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <>
              {isPro ? (
                <>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400">
                    Pro ✦
                  </span>
                  <Link
                    href="/bookmarks"
                    className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors"
                  >
                    <Bookmark size={15} />
                    Saved
                  </Link>
                </>
              ) : (
                <Link
                  href="/pricing"
                  className="text-sm font-medium px-3 py-1.5 rounded-lg bg-amber-500 text-white hover:bg-amber-400 transition-colors"
                >
                  Upgrade to Pro
                </Link>
              )}
              <Link
                href="/profile"
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Profile
              </Link>
              <LogoutButton />
            </>
          ) : (
            <Link
              href="/auth/login"
              className="text-sm font-medium px-4 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-400 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
