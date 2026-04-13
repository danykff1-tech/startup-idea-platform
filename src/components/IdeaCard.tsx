'use client'

import Link from 'next/link'
import { GlowCard } from '@/components/ui/spotlight-card'
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

export default function IdeaCard({ idea, isPro = false, isBookmarked = false }: Props) {
  return (
    <div className="relative h-full">
      <Link href={`/ideas/${idea.id}`} className="block group h-full">
        <GlowCard
          glowColor="purple"
          className="h-full flex flex-col"
        >
          <div className="flex items-start justify-between gap-4 mb-3">
            {idea.ai_score != null && (
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 shrink-0">
                ✦ Score {idea.ai_score}
              </span>
            )}
          </div>

          <h3 className="font-semibold text-foreground mb-2 group-hover:text-zinc-600 dark:group-hover:text-zinc-200 transition-colors line-clamp-2">
            {idea.title}
          </h3>

          <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 mb-4 flex-grow">
            {idea.summary}
          </p>

          <div className="flex flex-wrap gap-1.5 mt-auto">
            {idea.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </GlowCard>
      </Link>

      {/* Bookmark button overlaid on top-right */}
      {isPro && (
        <div className="absolute top-3 right-3 z-10">
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
