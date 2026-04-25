'use client'

import { useState } from 'react'
import { Bookmark, Lock } from 'lucide-react'
import Link from 'next/link'

interface Props {
  ideaId: string
  initialBookmarked: boolean
  isPro: boolean
  bookmarkCount?: number
  size?: 'sm' | 'md'
}

const FREE_LIMIT = 3

export default function BookmarkButton({
  ideaId,
  initialBookmarked,
  isPro,
  bookmarkCount = 0,
  size = 'md',
}: Props) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked)
  const [loading, setLoading] = useState(false)

  const iconSize = size === 'sm' ? 14 : 18
  const btnClass = `flex items-center justify-center rounded-lg transition-colors disabled:opacity-50 ${
    size === 'sm' ? 'w-7 h-7' : 'w-9 h-9'
  }`

  // 무료 유저이고, 아직 북마크 안 했고, 한도에 달했으면 → 잠금 표시
  const atLimit = !isPro && !bookmarked && bookmarkCount >= FREE_LIMIT

  if (atLimit) {
    return (
      <Link
        href="/pricing"
        onClick={(e) => e.stopPropagation()}
        title={`Free plan: ${FREE_LIMIT} saves max — Upgrade to Pro`}
        className={`${btnClass} bg-zinc-100 dark:bg-zinc-800 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20`}
      >
        <Lock size={iconSize} />
      </Link>
    )
  }

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (loading) return

    setLoading(true)
    try {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ideaId }),
      })
      const data = await res.json()

      if (res.ok) {
        setBookmarked(data.bookmarked)
      } else if (data.error === 'limit_reached') {
        alert(`Free plan allows up to ${FREE_LIMIT} saved ideas.\nUpgrade to Pro for unlimited bookmarks.`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      title={bookmarked ? 'Remove bookmark' : 'Save idea'}
      className={`${btnClass} ${
        bookmarked
          ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/60'
          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700'
      }`}
    >
      <Bookmark size={iconSize} className={bookmarked ? 'fill-current' : ''} />
    </button>
  )
}
