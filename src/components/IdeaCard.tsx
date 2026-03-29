import Link from 'next/link'

interface Idea {
  id: string
  title: string
  summary: string
  tags: string[]
  source_platform: string
  ai_score: number | null
  created_at: string
}

const platformStyles: Record<string, string> = {
  reddit: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
  indiehackers: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  producthunt: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400',
}

export default function IdeaCard({ idea }: { idea: Idea }) {
  return (
    <Link href={`/ideas/${idea.id}`} className="block group h-full">
      <div className="p-6 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 hover:border-black/20 dark:hover:border-white/20 hover:shadow-md transition-all h-full flex flex-col">
        <div className="flex items-start justify-between gap-4 mb-3">
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${platformStyles[idea.source_platform] ?? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'}`}>
            {idea.source_platform}
          </span>
          {idea.ai_score != null && (
            <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 shrink-0">
              ✦ {idea.ai_score}
            </span>
          )}
        </div>

        <h3 className="font-semibold text-foreground mb-2 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors line-clamp-2 flex-grow">
          {idea.title}
        </h3>

        <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3 mb-4">
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
    </Link>
  )
}
