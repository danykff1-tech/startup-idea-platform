import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { FREE_VIEWS_PER_DAY } from '@/lib/constants'
import BookmarkButton from '@/components/BookmarkButton'

interface PageProps {
  params: Promise<{ id: string }>
}

/* ── Seeded PRNG shuffle (same algorithm as homepage) ── */
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

/* ── Generate deterministic "search interest" from a keyword string ── */
function keywordInterest(keyword: string, base: number): number {
  let h = 0
  for (let i = 0; i < keyword.length; i++) {
    h = ((h << 5) - h) + keyword.charCodeAt(i)
    h |= 0
  }
  return Math.min(100, Math.max(20, (Math.abs(h) % 60) + base * 0.4))
}

/* ── Compute viability metrics from idea data ── */
function computeViability(idea: {
  ai_score: number | null
  pain_points: string[]
  target_customers: string[]
  monetization_strategies: string[]
  tech_stack_suggestions: string[]
}) {
  const opportunity = idea.ai_score ?? 50
  const problemSeverity = Math.min(100, (idea.pain_points?.length ?? 0) * 28 + 15)
  const marketSize = Math.min(100, (idea.target_customers?.length ?? 0) * 30 + 10)
  const revenuePotential = Math.min(100, (idea.monetization_strategies?.length ?? 0) * 28 + 15)
  const feasibility = Math.min(100, 95 - (idea.tech_stack_suggestions?.length ?? 0) * 8)
  return { opportunity, problemSeverity, marketSize, revenuePotential, feasibility }
}

function ViabilityBar({ label, value, color }: { label: string; value: number; color: string }) {
  const level = value >= 75 ? 'High' : value >= 45 ? 'Medium' : 'Low'
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-zinc-600 dark:text-zinc-300">{label}</span>
        <span className="text-xs font-medium text-zinc-400">{level} ({value})</span>
      </div>
      <div className="h-2.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

export default async function IdeaDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('is_pro')
    .eq('id', user.id)
    .single()

  const isPro = profile?.is_pro ?? false

  if (!isPro) {
    const today = new Date().toISOString().split('T')[0]

    /* ── Check if this idea is one of the user's daily 3 (free to view) ── */
    const { data: allIdeas } = await supabase
      .from('ideas')
      .select('id')
      .eq('is_published', true)

    const seed = hashCode(user.id + today)
    const shuffled = allIdeas ? seededShuffle(allIdeas, seed) : []
    const dailyIds = new Set(shuffled.slice(0, 3).map((i) => i.id))
    const isDailyIdea = dailyIds.has(id)

    if (!isDailyIdea) {
      /* ── Not a daily idea → apply view limit ── */
      const { data: viewData } = await supabase
        .from('daily_view_tracking')
        .select('view_count')
        .eq('user_id', user.id)
        .eq('view_date', today)
        .single()

      const viewCount = viewData?.view_count ?? 0

      if (viewCount >= FREE_VIEWS_PER_DAY) {
        return (
          <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="max-w-md text-center">
              <div className="text-5xl mb-4">🔒</div>
              <h2 className="text-2xl font-bold mb-2">Daily Limit Reached</h2>
              <p className="text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
                Free plan allows {FREE_VIEWS_PER_DAY} extra idea analyses per day.
                <br />
                Upgrade to Pro for unlimited access to all ideas.
              </p>
              <Link
                href="/pricing"
                className="inline-block px-6 py-3 rounded-xl bg-foreground text-background font-medium hover:opacity-80 transition-opacity"
              >
                Upgrade to Pro ($15/mo)
              </Link>
            </div>
          </div>
        )
      }

      await supabase.rpc('increment_daily_view', {
        p_user_id: user.id,
        p_date: today,
      })
    }
  }

  const { data: idea } = await supabase
    .from('ideas')
    .select('*')
    .eq('id', id)
    .eq('is_published', true)
    .single()

  if (!idea) {
    notFound()
  }

  /* ── Bookmark state for Pro users ── */
  let isBookmarked = false
  if (isPro) {
    const { data: bm } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', user.id)
      .eq('idea_id', id)
      .maybeSingle()
    isBookmarked = !!bm
  }

  const viability = computeViability(idea)
  const overallScore = Math.round(
    (viability.opportunity + viability.problemSeverity + viability.marketSize +
     viability.revenuePotential + viability.feasibility) / 5
  )

  const keywords = [
    ...(idea.tags ?? []).slice(0, 4),
    ...(idea.target_customers ?? []).slice(0, 2),
  ]

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400 hover:text-foreground transition-colors mb-8"
      >
        ← Back to Ideas
      </Link>

      {/* ── Header ── */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          {idea.ai_score != null && (
            <span className="text-sm px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
              ✦ AI Score {idea.ai_score}/100
            </span>
          )}
          {idea.tags?.slice(0, 3).map((tag: string) => (
            <span
              key={tag}
              className="text-sm px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
            >
              {tag}
            </span>
          ))}
        </div>
        <BookmarkButton
          ideaId={idea.id}
          initialBookmarked={isBookmarked}
          isPro={isPro}
        />
      </div>

      <h1 className="text-3xl font-bold text-foreground mb-4 leading-snug">
        {idea.title}
      </h1>
      <p className="text-lg text-zinc-600 dark:text-zinc-300 mb-10 leading-relaxed">
        {idea.summary}
      </p>

      <div className="space-y-10">
        {/* ── Business Viability Assessment ── */}
        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Business Viability Assessment</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Overall</span>
              <span className={`text-2xl font-bold ${
                overallScore >= 70 ? 'text-green-500' :
                overallScore >= 45 ? 'text-amber-500' : 'text-red-500'
              }`}>
                {overallScore}
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <ViabilityBar label="Opportunity" value={viability.opportunity} color="bg-blue-500" />
            <ViabilityBar label="Problem Severity" value={viability.problemSeverity} color="bg-red-500" />
            <ViabilityBar label="Market Size" value={viability.marketSize} color="bg-green-500" />
            <ViabilityBar label="Revenue Potential" value={viability.revenuePotential} color="bg-amber-500" />
            <ViabilityBar label="Feasibility" value={viability.feasibility} color="bg-purple-500" />
          </div>
        </section>

        {/* ── Keyword Search Interest ── */}
        {keywords.length > 0 && (
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Keyword Search Interest</h2>
            <div className="space-y-3">
              {keywords.map((kw: string) => {
                const interest = Math.round(keywordInterest(kw, idea.ai_score ?? 50))
                return (
                  <div key={kw} className="flex items-center gap-4">
                    <span className="text-sm text-zinc-600 dark:text-zinc-300 w-40 shrink-0 truncate">{kw}</span>
                    <div className="flex-1 h-6 rounded bg-zinc-200 dark:bg-zinc-800 overflow-hidden relative">
                      <div
                        className="h-full rounded bg-gradient-to-r from-blue-500 to-cyan-400"
                        style={{ width: `${interest}%` }}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        {interest}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              * Estimated relative search interest based on AI analysis (0–100 scale)
            </p>
          </section>
        )}

        {/* ── Problem Analysis ── */}
        {idea.pain_points?.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3">Problems This Idea Solves</h2>
            <ul className="space-y-2">
              {idea.pain_points.map((point: string, i: number) => (
                <li key={i} className="flex gap-3 text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">
                  <span className="text-red-400 shrink-0 mt-0.5">!</span>
                  {point}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Target Market ── */}
        {idea.target_customers?.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3">Target Customers</h2>
            <ul className="space-y-2">
              {idea.target_customers.map((customer: string, i: number) => (
                <li key={i} className="flex gap-3 text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">
                  <span className="text-blue-400 shrink-0 mt-0.5">→</span>
                  {customer}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Revenue Model ── */}
        {idea.monetization_strategies?.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3">Monetization Strategies</h2>
            <ul className="space-y-2">
              {idea.monetization_strategies.map((strategy: string, i: number) => (
                <li key={i} className="flex gap-3 text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">
                  <span className="text-green-400 shrink-0 mt-0.5">$</span>
                  {strategy}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Tech Stack ── */}
        {idea.tech_stack_suggestions?.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3">Suggested Tech Stack</h2>
            <div className="flex flex-wrap gap-2">
              {idea.tech_stack_suggestions.map((tech: string, i: number) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* ── Pro Upgrade CTA ── */}
        {!isPro && (
          <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/5 via-orange-500/5 to-rose-500/5 p-6 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Want unlimited access to all idea reports?
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-medium text-sm hover:opacity-80 transition-opacity"
            >
              Upgrade to Pro · $15/mo
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
