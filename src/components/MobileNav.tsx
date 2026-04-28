'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Bookmark, User, Zap } from 'lucide-react'

interface Props {
  isPro: boolean
}

const NAV_ITEMS = [
  { href: '/',          icon: Home,     label: 'Ideas'   },
  { href: '/bookmarks', icon: Bookmark, label: 'Saved'   },
  { href: '/profile',   icon: User,     label: 'Account' },
]

export default function MobileNav({ isPro }: Props) {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <div className={`grid ${!isPro ? 'grid-cols-4' : 'grid-cols-3'} h-16`}>
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors ${
                isActive
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {label}
            </Link>
          )
        })}
        {!isPro && (
          <Link
            href="/pricing"
            className="flex flex-col items-center justify-center gap-1 text-[10px] font-medium text-amber-500"
          >
            <Zap size={20} strokeWidth={2} />
            Upgrade
          </Link>
        )}
      </div>
    </nav>
  )
}
