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
    <nav className="border-b border-border bg-card sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-foreground hover:opacity-80 transition-opacity">
          Idealike
        </Link>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {isPro ? (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                  Pro ✦
                </span>
              ) : (
                <Link
                  href="/pricing"
                  className="text-sm font-medium px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Pro 업그레이드
                </Link>
              )}
              <Link
                href="/profile"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                내 프로필
              </Link>
              <LogoutButton />
            </>
          ) : (
            <Link
              href="/auth/login"
              className="text-sm font-medium px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
