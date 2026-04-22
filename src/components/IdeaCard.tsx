'use client'

import Link from 'next/link'
import BookmarkButton from '@/components/BookmarkButton'

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
  idea: Idea
  isPro?: boolean
  isBookmarked?: boolean
}

const TAG_GRADIENTS: Record<string, string> = {
  'AI':            'from-violet-500 to-purple-600',
  'SaaS':          'from-blue-500 to-indigo-600',
  'DevTools':      'from-cyan-500 to-blue-600',
  'FinTech':       'from-emerald-500 to-green-600',
  'HealthTech':    'from-teal-500 to-emerald-600',
  'EdTech':        'from-orange-400 to-amber-500',
  'Marketplace':   'from-amber-500 to-orange-600',
  'Productivity':  'from-pink-500 to-rose-500',
  'API':           'from-slate-500 to-zinc-600',
  'B2B':           'from-blue-600 to-indigo-700',
  'Automation':    'from-violet-600 to-fuchsia-600',
  'Mobile':        'from-rose-500 to-pink-600',
  'Enterprise':    'from-zinc-600 to-slate-700',
  'DataAnalytics': 'from-sky-500 to-blue-600',
  'E-commerce':    'from-green-500 to-teal-600',
  'NoCode':        'from-yellow-400 to-amber-500',
  'Consumer':      'from-pink-400 to-rose-400',
}

function getGradient(tags: string[]): string {
  for (const tag of tags) {
    if (TAG_GRADIENTS[tag]) return TAG_GRADIENTS[tag]
  }
  return 'from-zinc-500 to-slate-600'
}

export default function IdeaCard({ idea, isPro = false, isBookmarked = false }: Props) {
  const gradient = getGradient(idea.tags)
  const dateStr = new Date(idea.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  return (
    <div className="relative h-full group">
      <Link href={`/ideas/${idea.id}`} className="block h-full">
        <div className="h-full flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-lg transition-all duration-200">

          {/* Gradient header */}
          <div className={`h-24 bg-gradient-to-br ${gradient} flex items-end p-4 shrink-0`}>
            {idea.ai_score != null && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-black/20 text-white backdrop-blur-sm">
                ✦ {idea.ai_score}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col flex-1 p-5">
            <p className="text-xs text-muted-foreground mb-2">{dateStr}</p>

            <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-zinc-600 dark:group-hover:text-zinc-200 transition-colors leading-snug">
              {idea.title}
            </h3>

            <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-grow leading-relaxed">
              {idea.summary}
            </p>

            <div className="flex flex-wrap gap-1.5 mt-auto">
              {idea.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>

      {isPro && (
        <div className="absolute top-[88px] right-3 z-10 -translate-y-1/2">
          <BookmarkButton
            ideaId={idea.id}
            initialBookmarked={isBookmarked}
            isPro={isPro}
            size="sm"
          />
        </div>
      )}
    </div>
  )
}
