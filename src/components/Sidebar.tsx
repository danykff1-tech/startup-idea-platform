'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Home, Bookmark, User, Zap, Crown } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import LogoutButton from './LogoutButton'

interface SidebarUser {
  email: string
  full_name: string | null
  avatar_url: string | null
  is_pro: boolean
}

interface Props {
  user: SidebarUser | null
}

const NAV_ITEMS = [
  { href: '/',           icon: Home,     label: 'Ideas'   },
  { href: '/bookmarks',  icon: Bookmark, label: 'Saved'   },
  { href: '/profile',    icon: User,     label: 'Account' },
]

export default function Sidebar({ user }: Props) {
  const pathname = usePathname()

  return (
    <aside className="w-56 shrink-0 h-screen flex flex-col border-r border-border bg-background sticky top-0 z-40">

      {/* ── Logo ── */}
      <div className="px-4 h-14 flex items-center border-b border-border shrink-0">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <Image src="/logo.png" alt="Idealike" width={28} height={28} className="rounded-lg" />
          <span className="font-bold text-base text-foreground">idealike</span>
        </Link>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-foreground'
                  : 'text-muted-foreground hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-foreground'
              }`}
            >
              <Icon size={17} strokeWidth={isActive ? 2.5 : 2} />
              {label}
            </Link>
          )
        })}

        {/* Upgrade CTA — free users only */}
        {user && !user.is_pro && (
          <Link
            href="/pricing"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors mt-2"
          >
            <Zap size={17} strokeWidth={2} />
            Upgrade to Pro
          </Link>
        )}
      </nav>

      {/* ── Bottom: user + controls ── */}
      <div className="px-2 py-3 border-t border-border shrink-0 space-y-1">

        {/* Theme toggle row */}
        <div className="flex items-center justify-between px-1 py-1">
          <ThemeToggle />
          {user?.is_pro && (
            <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
              <Crown size={10} />Pro
            </span>
          )}
        </div>

        {/* User info row */}
        {user && (
          <div className="flex items-center gap-2 px-1 py-1.5">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt=""
                className="w-7 h-7 rounded-full shrink-0 object-cover"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-600 dark:text-zinc-300 shrink-0">
                {(user.full_name?.[0] ?? user.email[0] ?? '?').toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate leading-tight">
                {user.full_name ?? user.email}
              </p>
              {user.full_name && (
                <p className="text-xs text-muted-foreground truncate leading-tight">
                  {user.email}
                </p>
              )}
            </div>
            <LogoutButton variant="icon" />
          </div>
        )}
      </div>
    </aside>
  )
}
