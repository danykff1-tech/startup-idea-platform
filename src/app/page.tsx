import { createClient } from '@/lib/supabase/server'
import IdeaCard from '@/components/IdeaCard'
import Link from 'next/link'
import { Sparkles, Lock } from 'lucide-react'

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

  /* ── Not logged in → show CTA ── */
  if (!user) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-24">
        <div className="text-center">
          <div className="text-6xl mb-6">✦</div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 leading-tight">
            AI-Curated<br />Business Ideas
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto mb-8">
            Discover validated startup ideas analyzed by AI every day.<br />
            Find your next big opportunity.
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-foreground text-background font-medium hover:opacity-80 transition-opacity text-lg"
          >
            <Sparkles size={20} />
            Get Started Free
          </Link>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-4">
            3 free idea analyses per day · No credit card required
          </p>
        </div>
      </main>
    )
  }

  /* ── Logged in → fetch & show 3 random ideas ── */
  const { data: ideas } = await supabase
    .from('ideas')
    .select('id, title, summary, tags, source_platform, ai_score, created_at')
    .eq('is_published', true)

  const today = new Date().toISOString().split('T')[0]
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
                  Upgrade to Pro and get full access to all ideas with detailed analysis, business viability reports, and keyword trends.
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
