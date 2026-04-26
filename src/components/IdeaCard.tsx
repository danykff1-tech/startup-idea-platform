'use client'

import Link from 'next/link'
import BookmarkButton from '@/components/BookmarkButton'
import { TiltCard } from '@/components/ui/tilt-card'

interface Idea {
  id: string
  title: string
  summary: string
  tags: string[]
  source_platform?: string
  ai_score: number | null
  created_at: string
}

interface Props {
  idea: Idea
  isPro?: boolean
  isBookmarked?: boolean
  bookmarkCount?: number
  isLoggedIn?: boolean
}

const TAG_GRADIENTS: Record<string, string> = {
  'AI':            'from-violet-400 via-purple-500 to-purple-600',
  'SaaS':          'from-blue-400 via-blue-500 to-indigo-600',
  'DevTools':      'from-cyan-400 via-cyan-500 to-blue-600',
  'FinTech':       'from-emerald-400 via-emerald-500 to-green-600',
  'HealthTech':    'from-teal-400 via-teal-500 to-emerald-600',
  'EdTech':        'from-orange-300 via-orange-400 to-amber-500',
  'Marketplace':   'from-amber-400 via-amber-500 to-orange-600',
  'Productivity':  'from-pink-400 via-pink-500 to-rose-500',
  'API':           'from-slate-400 via-slate-500 to-zinc-600',
  'B2B':           'from-blue-500 via-blue-600 to-indigo-700',
  'Automation':    'from-violet-500 via-violet-600 to-fuchsia-600',
  'Mobile':        'from-rose-400 via-rose-500 to-pink-600',
  'Enterprise':    'from-zinc-500 via-zinc-600 to-slate-700',
  'DataAnalytics': 'from-sky-400 via-sky-500 to-blue-600',
  'E-commerce':    'from-green-400 via-green-500 to-teal-600',
  'NoCode':        'from-yellow-300 via-yellow-400 to-amber-500',
  'Consumer':      'from-pink-300 via-pink-400 to-rose-400',
}

function getGradient(tags: string[]): string {
  for (const tag of tags) {
    if (TAG_GRADIENTS[tag]) return TAG_GRADIENTS[tag]
  }
  return 'from-zinc-400 via-zinc-500 to-slate-600'
}

export default function IdeaCard({
  idea,
  isPro = false,
  isBookmarked = false,
  bookmarkCount = 0,
  isLoggedIn = false,
}: Props) {
  const gradient = getGradient(idea.tags)

  return (
    <TiltCard className="relative h-full group rounded-2xl">
      <Link href={`/ideas/${idea.id}`} className="block h-full">
        <div className="h-full flex flex-col rounded-2xl bg-card border border-border overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">

          {/* ── Gradient thumbnail ── */}
          <div className={`relative h-36 bg-gradient-to-br ${gradient} shrink-0`}>

            {/* Noise texture overlay */}
            <div className="absolute inset-0 opacity-20 mix-blend-overlay"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")' }}
            />

            {/* Score badge — top right */}
            {idea.ai_score != null && (
              <div className="absolute top-3 right-3">
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-black/25 text-white backdrop-blur-sm">
                  ✦ {idea.ai_score}
                </span>
              </div>
            )}

            {/* Gradient fade to card bg at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-card/30 to-transparent" />
          </div>

          {/* ── Content ── */}
          <div className="flex flex-col flex-1 p-5 gap-3">

            {/* Tags row */}
            <div className="flex flex-wrap gap-1.5">
              {idea.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h3 className="font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
              {idea.title}
            </h3>

            {/* Summary */}
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-grow">
              {idea.summary}
            </p>
          </div>
        </div>
      </Link>

      {/* Bookmark button */}
      {isLoggedIn && (
        <div className="absolute top-[124px] right-3 z-10 -translate-y-1/2">
          <BookmarkButton
            ideaId={idea.id}
            initialBookmarked={isBookmarked}
            isPro={isPro}
            bookmarkCount={bookmarkCount}
            size="sm"
          />
        </div>
      )}
    </TiltCard>
  )
}
