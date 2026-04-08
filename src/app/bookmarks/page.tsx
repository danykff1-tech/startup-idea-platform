import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Bookmark, Lock } from 'lucide-react'
import BookmarkButton from '@/components/BookmarkButton'

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

  /* ── Not Pro → show upgrade prompt ── */
  if (!isPro) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-6">
          <Bookmark size={28} className="text-amber-600 dark:text-amber-400" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-3">Saved Ideas</h1>
        <p className="text-muted-foreground mb-2">
          Bookmark your favorite ideas and access them anytime.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          This feature is available on the <span className="font-semibold text-foreground">Pro plan</span>.
        </p>
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/5 via-orange-500/5 to-rose-500/5 p-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Lock size={18} className="text-amber-500" />
            <span className="font-semibold text-foreground">Upgrade to unlock Bookmarks</span>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Save unlimited ideas, access them anytime, and never lose track of your best opportunities.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-medium text-sm hover:opacity-80 transition-opacity"
          >
            Upgrade to Pro · $15/mo
          </Link>
        </div>
      </main>
    )
  }

  /* ── Pro → show bookmarks ── */
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

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <Bookmark size={24} className="text-amber-500 fill-current" />
        <h1 className="text-2xl font-bold text-foreground">Saved Ideas</h1>
        <span className="text-sm text-muted-foreground">
          {bookmarks?.length ?? 0} saved
        </span>
      </div>

      {!bookmarks || bookmarks.length === 0 ? (
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
          {bookmarks.map((bm) => {
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
                  isPro={true}
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
