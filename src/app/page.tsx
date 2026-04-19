import { createClient } from '@/lib/supabase/server'
import IdeaCard from '@/components/IdeaCard'
import IdeaGrid from '@/components/IdeaGrid'
import LandingPage from '@/components/LandingPage'
import Link from 'next/link'
import { Lock } from 'lucide-react'

/* ── deterministic shuffle using a seeded PRNG ── */
function seededShuffle<T>(array: T[], seed: number): T[] {
  const out = [...array]
  let s = seed
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 16807) % 2147483647
    const j = s % (i + 1)
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash) || 1
}

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const today = new Date().toISOString().split('T')[0]

  /* ── Fetch ideas (needed for both logged-in and guest) ── */
  const { data: ideas } = await supabase
    .from('ideas')
    .select('id, title, summary, tags, source_platform, ai_score, created_at')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(100)

  /* ── Guest: full landing page ── */
  if (!user) {
    const seed = hashCode(today)
    const shuffled = ideas ? seededShuffle(ideas, seed) : []
    const preview = shuffled[0] ?? null

    return <LandingPage previewIdea={preview} />
  }

  /* ── Logged in → fetch Pro status + bookmarks + seen ideas ── */
  const { data: profile } = await supabase
    .from('users')
    .select('is_pro')
    .eq('id', user.id)
    .single()
  const isPro = profile?.is_pro ?? false

  const { data: bookmarkRows } = isPro
    ? await supabase.from('bookmarks').select('idea_id').eq('user_id', user.id)
    : { data: [] }
  const bookmarkedIds = new Set((bookmarkRows ?? []).map((b: { idea_id: string }) => b.idea_id))

  const { data: seenRows } = await supabase
    .from('user_seen_ideas')
    .select('idea_id')
    .eq('user_id', user.id)
  const seenIds = new Set((seenRows ?? []).map((r: { idea_id: string }) => r.idea_id))

  const allIdeasList = ideas ?? []
  const unseenIdeas = allIdeasList.filter((i) => !seenIds.has(i.id))

  /* ── Free: 3 random unseen ideas ── */
  const seed = hashCode(user.id + today)
  const pool = unseenIdeas.length >= 3 ? unseenIdeas : allIdeasList
  const shuffled = seededShuffle(pool, seed)

  if (!isPro) {
    const displayed = shuffled.slice(0, 3)
    return (
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 leading-tight">
            Today&apos;s Ideas<br />Curated for You
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
            Fresh startup ideas analyzed by AI · Updated daily
          </p>
        </div>

        {displayed.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">✦</div>
            <p className="text-lg text-zinc-500 dark:text-zinc-400">No ideas available yet.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayed.map((idea) => (
                <IdeaCard key={idea.id} idea={idea} isPro={false} isBookmarked={false} />
              ))}
            </div>
            <div className="mt-8">
              <Link href="/pricing" className="block group">
                <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 p-8 text-center hover:border-amber-500/40 transition-colors">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <Lock size={20} className="text-amber-500" />
                    <span className="text-lg font-bold text-foreground">Unlock More Ideas</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upgrade to Pro to see today&apos;s new ideas first, full analysis, and keyword trends.
                  </p>
                  <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-medium text-sm group-hover:opacity-80 transition-opacity">
                    Upgrade to Pro · $15/mo
                  </span>
                </div>
              </Link>
            </div>
          </>
        )}
      </main>
    )
  }

  /* ── Pro: unseen ideas first, then seen ── */
  const todayIdeas = unseenIdeas.filter((i) => i.created_at.startsWith(today))
  const recentIdeas = unseenIdeas.filter((i) => !i.created_at.startsWith(today))

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 leading-tight">
          Today&apos;s Ideas<br />Curated for You
        </h1>
        <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
          Fresh startup ideas analyzed by AI · Updated daily
        </p>
      </div>

      {allIdeasList.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-5xl mb-4">✦</div>
          <p className="text-lg text-zinc-500 dark:text-zinc-400">No ideas available yet.</p>
        </div>
      ) : (
        <IdeaGrid
          todayIdeas={todayIdeas}
          recentIdeas={recentIdeas}
          isPro={true}
          bookmarkedIds={Array.from(bookmarkedIds)}
        />
      )}
    </main>
  )
}
