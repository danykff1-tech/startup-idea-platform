import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Bookmark } from 'lucide-react'
import BookmarkButton from '@/components/BookmarkButton'
import CsvExportButton from '@/components/CsvExportButton'

const FREE_LIMIT = 3

export default async function BookmarksPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('users')
    .select('is_pro')
    .eq('id', user.id)
    .single()

  const isPro = profile?.is_pro ?? false

  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select(`
      id,
      idea_id,
      created_at,
      ideas (
        id, title, summary, tags, ai_score
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const count = bookmarks?.length ?? 0

  // CSV용 데이터 준비
  const csvIdeas = (bookmarks ?? []).flatMap((bm) => {
    const raw = bm.ideas
    const idea = (Array.isArray(raw) ? raw[0] : raw) as {
      id: string; title: string; summary: string; tags: string[]; ai_score: number | null
    } | null
    if (!idea) return []
    return [{ ...idea, savedAt: bm.created_at }]
  })

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">

      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-8">
        <div className="flex items-center gap-3">
          <Bookmark size={24} className="text-amber-500 fill-current" />
          <h1 className="text-2xl font-bold text-foreground">Saved Ideas</h1>
          <span className="text-sm text-muted-foreground">
            {isPro ? `${count} saved` : `${count} / ${FREE_LIMIT} saved`}
          </span>
        </div>

        {/* CSV export — Pro only */}
        {isPro && count > 0 && (
          <CsvExportButton ideas={csvIdeas} />
        )}
      </div>

      {/* 무료 유저 한도 안내 */}
      {!isPro && (
        <div className="mb-6 flex items-center justify-between gap-4 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-2 text-sm text-amber-800 dark:text-amber-300">
            <Bookmark size={15} className="shrink-0" />
            <span>Free plan: up to <strong>{FREE_LIMIT} saved ideas</strong></span>
          </div>
          <Link
            href="/pricing"
            className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors"
          >
            Upgrade for unlimited
          </Link>
        </div>
      )}

      {/* 빈 상태 */}
      {count === 0 ? (
        <div className="text-center py-24 border border-dashed border-border rounded-2xl">
          <Bookmark size={40} className="mx-auto mb-4 text-muted-foreground opacity-40" />
          <p className="text-muted-foreground">No saved ideas yet.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Click the bookmark icon on any idea to save it here.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Browse Ideas
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {(bookmarks ?? []).map((bm) => {
            const raw = bm.ideas
            const idea = (Array.isArray(raw) ? raw[0] : raw) as {
              id: string; title: string; summary: string; tags: string[]; ai_score: number | null
            } | null
            if (!idea) return null
            return (
              <div
                key={bm.id}
                className="flex items-start gap-4 p-5 rounded-2xl border border-border bg-card hover:border-primary/30 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <Link href={`/ideas/${idea.id}`} className="group">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-1">
                      {idea.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {idea.summary}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {idea.tags?.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                      >
                        {tag}
                      </span>
                    ))}
                    {idea.ai_score != null && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                        ✦ {idea.ai_score}
                      </span>
                    )}
                  </div>
                </div>
                <BookmarkButton
                  ideaId={idea.id}
                  initialBookmarked={true}
                  isPro={isPro}
                  bookmarkCount={count}
                  size="sm"
                />
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}
