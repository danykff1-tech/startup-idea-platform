'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

interface Props {
  variant?: 'text' | 'icon'
}

export default function LogoutButton({ variant = 'text' }: Props) {
  const supabase = createClient()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleLogout}
        className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        aria-label="Sign out"
      >
        <LogOut size={15} />
      </button>
    )
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-foreground transition-colors cursor-pointer"
    >
      Sign Out
    </button>
  )
}
