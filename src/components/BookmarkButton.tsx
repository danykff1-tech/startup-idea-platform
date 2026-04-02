'use client'

import { useState } from 'react'
import { Bookmark } from 'lucide-react'

interface Props {
  ideaId: string
  initialBookmarked: boolean
  isPro: boolean
  size?: 'sm' | 'md'
}

export default function BookmarkButton({ ideaId, initialBookmarked, isPro, size = 'md' }: Props) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked)
  const [loading, setLoading] = useState(false)

  if (!isPro) return null

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
      if (res.ok) setBookmarked(data.bookmarked)
    } finally {
      setLoading(false)
    }
  }

  const iconSize = size === 'sm' ? 14 : 18

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      title={bookmarked ? 'Remove bookmark' : 'Save idea'}
      className={`
        flex items-center justify-center rounded-lg transition-colors disabled:opacity-50
        ${size === 'sm'
          ? 'w-7 h-7'
          : 'w-9 h-9'
        }
        ${bookmarked
          ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/60'
          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700'
        }
      `}
    >
      <Bookmark
        size={iconSize}
        className={bookmarked ? 'fill-current' : ''}
      />
    </button>
  )
}
