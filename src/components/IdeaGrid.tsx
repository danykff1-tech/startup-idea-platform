'use client'

import { useState, useMemo } from 'react'
import IdeaCard from './IdeaCard'

interface Idea {
  id: string
  title: string
  summary: string
  tags: string[]
  source_platform: string
  ai_score: number | null
  created_at: string
}

interface Props {
  todayIdeas: Idea[]
  recentIdeas: Idea[]
  isPro: boolean
  bookmarkedIds: string[]
}

export default function IdeaGrid({ todayIdeas, recentIdeas, isPro, bookmarkedIds }: Props) {
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const bookmarked = useMemo(() => new Set(bookmarkedIds), [bookmarkedIds])

  /* ── Collect all unique tags ── */
  const allTags = useMemo(() => {
    const tagCount: Record<string, number> = {}
    ;[...todayIdeas, ...recentIdeas].forEach((idea) => {
      idea.tags?.forEach((tag) => {
        tagCount[tag] = (tagCount[tag] ?? 0) + 1
      })
    })
    return Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag]) => tag)
  }, [todayIdeas, recentIdeas])

  function filterIdeas(ideas: Idea[]) {
    if (!activeTag) return ideas
    return ideas.filter((i) => i.tags?.includes(activeTag))
  }

  const filteredToday = filterIdeas(todayIdeas)
  const filteredRecent = filterIdeas(recentIdeas)

  return (
    <div className="space-y-10">
      {/* ── Category Filter Bar ── */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTag(null)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeTag === null
                ? 'bg-foreground text-background'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeTag === tag
                  ? 'bg-foreground text-background'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* ── Today's New Ideas ── */}
      {filteredToday.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500 text-white uppercase tracking-wide">
              New Today
            </span>
            <h2 className="text-lg font-semibold text-foreground">Today&apos;s New Ideas</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredToday.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                isPro={isPro}
                isBookmarked={bookmarked.has(idea.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Recent Ideas ── */}
      {filteredRecent.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-6">Recent Ideas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecent.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                isPro={isPro}
                isBookmarked={bookmarked.has(idea.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Empty state for filter ── */}
      {filteredToday.length === 0 && filteredRecent.length === 0 && (
        <div className="text-center py-20">
          <p className="text-zinc-500 dark:text-zinc-400">No ideas found for &quot;{activeTag}&quot;.</p>
          <button
            onClick={() => setActiveTag(null)}
            className="mt-4 text-sm underline text-muted-foreground hover:text-foreground"
          >
            Clear filter
          </button>
        </div>
      )}
    </div>
  )
}
