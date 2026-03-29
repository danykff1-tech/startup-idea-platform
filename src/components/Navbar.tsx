import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import LogoutButton from './LogoutButton'

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
    <nav className="border-b border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-foreground hover:opacity-80 transition-opacity">
          IdeaFlow ✦
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {isPro ? (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                  Pro ✦
                </span>
              ) : (
                <Link
                  href="/pricing"
                  className="text-sm font-medium px-3 py-1.5 rounded-lg bg-foreground text-background hover:opacity-80 transition-opacity"
                >
                  Pro 업그레이드
                </Link>
              )}
              <LogoutButton />
            </>
          ) : (
            <Link
              href="/auth/login"
              className="text-sm font-medium px-4 py-2 rounded-lg bg-foreground text-background hover:opacity-80 transition-opacity"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
