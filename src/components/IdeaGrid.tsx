'use client'

import { useState, useMemo } from 'react'
import { ChevronDown, Lock } from 'lucide-react'
import Link from 'next/link'
import IdeaCard from './IdeaCard'
import { usePlan } from '@/hooks/usePlan'

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
  isLoggedIn?: boolean
}

type SortKey = 'newest' | 'score'

export default function IdeaGrid({ todayIdeas, recentIdeas, isPro, bookmarkedIds, isLoggedIn = false }: Props) {
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [sort, setSort] = useState<SortKey>('newest')
  const { can } = usePlan()
  const bookmarked = useMemo(() => new Set(bookmarkedIds), [bookmarkedIds])

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
    let list = activeTag ? ideas.filter((i) => i.tags?.includes(activeTag)) : ideas
    if (sort === 'score') {
      list = [...list].sort((a, b) => (b.ai_score ?? 0) - (a.ai_score ?? 0))
    }
    return list
  }

  const filteredToday = filterIdeas(todayIdeas)
  const filteredRecent = filterIdeas(recentIdeas)
  const canSortByScore = can('sort_by_score')

  const pillBase = 'px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-150'
  const pillActive = 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm'
  const pillInactive = 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-700 dark:hover:text-zinc-200'

  return (
    <div className="space-y-10">

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Tag pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTag(null)}
            className={`${pillBase} ${activeTag === null ? pillActive : pillInactive}`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`${pillBase} ${activeTag === tag ? pillActive : pillInactive}`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="relative shrink-0">
          {canSortByScore ? (
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="appearance-none pl-3.5 pr-8 py-1.5 rounded-full text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-0 focus:ring-1 focus:ring-zinc-300 dark:focus:ring-zinc-600 cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="score">Highest Score</option>
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          ) : (
            <Link
              href="/pricing"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm bg-zinc-100 dark:bg-zinc-800 text-muted-foreground hover:text-foreground transition-colors"
              title="Sort by score — Pro feature"
            >
              <Lock size={12} className="text-amber-500 shrink-0" />
              Sort by Score
            </Link>
          )}
        </div>
      </div>

      {/* ── Today's ideas ── */}
      {filteredToday.length > 0 && (
        <section>
          <div className="flex items-center gap-2.5 mb-6">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500 text-white uppercase tracking-wider">
              Today
            </span>
            <span className="text-sm text-muted-foreground">{filteredToday.length} new ideas</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredToday.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                isPro={isPro}
                isBookmarked={bookmarked.has(idea.id)}
                bookmarkCount={bookmarkedIds.length}
                isLoggedIn={isLoggedIn}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Recent ideas ── */}
      {filteredRecent.length > 0 && (
        <section>
          {filteredToday.length > 0 && (
            <h2 className="text-sm font-medium text-muted-foreground mb-6 uppercase tracking-wider">Earlier</h2>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRecent.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                isPro={isPro}
                isBookmarked={bookmarked.has(idea.id)}
                bookmarkCount={bookmarkedIds.length}
                isLoggedIn={isLoggedIn}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Empty state ── */}
      {filteredToday.length === 0 && filteredRecent.length === 0 && (
        <div className="text-center py-20">
          <p className="text-zinc-400 dark:text-zinc-500 text-sm">
            No ideas found{activeTag ? ` for "${activeTag}"` : ''}.
          </p>
          {activeTag && (
            <button
              onClick={() => setActiveTag(null)}
              className="mt-3 text-sm underline text-muted-foreground hover:text-foreground"
            >
              Clear filter
            </button>
          )}
        </div>
      )}
    </div>
  )
}
