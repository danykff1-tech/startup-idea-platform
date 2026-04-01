import { createClient } from '@/lib/supabase/server'
import IdeaCard from '@/components/IdeaCard'
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

/* ── Locked placeholder card ── */
function LockedCard() {
  return (
    <Link href="/auth/login" className="block h-full">
      <div className="relative h-full rounded-2xl border border-border bg-card p-5 overflow-hidden min-h-[200px] flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/40 transition-colors">
        {/* blurred fake content */}
        <div className="absolute inset-0 p-5 opacity-20 select-none pointer-events-none">
          <div className="h-3 bg-zinc-400 rounded w-3/4 mb-2" />
          <div className="h-3 bg-zinc-400 rounded w-1/2 mb-6" />
          <div className="h-2 bg-zinc-300 rounded w-full mb-1.5" />
          <div className="h-2 bg-zinc-300 rounded w-5/6 mb-1.5" />
          <div className="h-2 bg-zinc-300 rounded w-4/6" />
        </div>
        {/* lock overlay */}
        <div className="relative z-10 text-center">
          <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-2">
            <Lock size={18} className="text-zinc-500" />
          </div>
          <p className="text-sm font-medium text-foreground">Sign in to view</p>
          <p className="text-xs text-muted-foreground mt-0.5">Free · No credit card</p>
        </div>
      </div>
    </Link>
  )
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

  /* ── Guest: show 1 preview card + 2 locked ── */
  if (!user) {
    const seed = hashCode(today)
    const shuffled = ideas ? seededShuffle(ideas, seed) : []
    const preview = shuffled[0] ?? null

    return (
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 leading-tight">
            AI-Curated<br />Business Ideas
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
            Discover validated startup ideas analyzed by AI every day.
          </p>
        </div>

        {/* 1 visible + 2 locked */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {preview && <IdeaCard idea={preview} />}
          <LockedCard />
          <LockedCard />
        </div>

        {/* Pro upgrade card */}
        <div className="mt-8">
          <Link href="/auth/login" className="block group">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 p-8 text-center hover:border-amber-500/40 transition-colors">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Lock size={20} className="text-amber-500" />
                <span className="text-lg font-bold text-foreground">
                  Unlock All Ideas
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Sign in free to explore 3 ideas per day. Upgrade to Pro for unlimited access, full analysis, and keyword trends.
              </p>
              <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-medium text-sm group-hover:opacity-80 transition-opacity">
                Get Started Free →
              </span>
            </div>
          </Link>
        </div>
      </main>
    )
  }

  /* ── Logged in → fetch & show 3 random ideas ── */
  const seed = hashCode(user.id + today)
  const shuffled = ideas ? seededShuffle(ideas, seed) : []
  const displayed = shuffled.slice(0, 3)

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 leading-tight">
          Today&apos;s Ideas<br />Curated for You
        </h1>
        <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
          Fresh startup ideas analyzed by AI · Updated daily
        </p>
      </div>

      {/* Idea cards */}
      {displayed.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-5xl mb-4">✦</div>
          <p className="text-lg text-zinc-500 dark:text-zinc-400">No ideas available yet.</p>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-2">
            Our AI pipeline will add new ideas soon!
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayed.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>

          {/* Pro upgrade card */}
          <div className="mt-8">
            <Link href="/pricing" className="block group">
              <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 p-8 text-center hover:border-amber-500/40 transition-colors">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Lock size={20} className="text-amber-500" />
                  <span className="text-lg font-bold text-foreground">
                    Unlock Unlimited Ideas
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Upgrade to Pro for full access to all ideas with detailed analysis, business viability reports, and keyword trends.
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
