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

/* ── Simple metric pill ── */
function MetricPill({
  label,
  value,
}: {
  label: string
  value: number | null
}) {
  const score = value ?? 50
  const level = score >= 70 ? 'High' : score >= 40 ? 'Medium' : 'Low'
  const colors =
    level === 'High'
      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
      : level === 'Medium'
      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'

  return (
    <div className="flex flex-col gap-1 min-w-[90px]">
      <span className="text-xs text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full w-fit ${colors}`}>
        {level}
      </span>
    </div>
  )
}

/* ── Prose section with icon ── */
function AnalysisSection({
  icon,
  title,
  children,
}: {
  icon: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">{icon}</span>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
      </div>
      <div className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed pl-6">
        {children}
      </div>
    </section>
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

  /* ── Mark idea as seen ── */
  await supabase
    .from('user_seen_ideas')
    .upsert({ user_id: user.id, idea_id: id }, { onConflict: 'user_id,idea_id' })

  /* ── Bookmark state ── */
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

  /* ── Derived viability signals (simple scores, no bars) ── */
  const opportunity = idea.ai_score ?? 50
  const problemSeverity = Math.min(100, (idea.pain_points?.length ?? 0) * 28 + 15)
  const marketSize = Math.min(100, (idea.target_customers?.length ?? 0) * 30 + 10)
  const revenuePotential = Math.min(100, (idea.monetization_strategies?.length ?? 0) * 28 + 15)
  const feasibility = Math.min(100, 95 - (idea.tech_stack_suggestions?.length ?? 0) * 8)
  const overallScore = Math.round(
    (opportunity + problemSeverity + marketSize + revenuePotential + feasibility) / 5
  )

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      {/* ── Back ── */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400 hover:text-foreground transition-colors mb-10"
      >
        ← Back to Ideas
      </Link>

      {/* ── Tags + Score + Bookmark ── */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          {idea.ai_score != null && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-medium">
              ✦ AI Score {idea.ai_score}/100
            </span>
          )}
          {idea.tags?.slice(0, 3).map((tag: string) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
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

      {/* ── Title ── */}
      <h1 className="text-3xl font-bold text-foreground mb-4 leading-snug">
        {idea.title}
      </h1>

      {/* ── Summary ── */}
      <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed mb-8">
        {idea.summary}
      </p>

      {/* ── Viability snapshot (pills only, no bars) ── */}
      <div className="rounded-2xl border border-border bg-card p-5 mb-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-foreground">Viability Snapshot</span>
          <span className={`text-xl font-bold ${
            overallScore >= 70 ? 'text-emerald-500' :
            overallScore >= 45 ? 'text-amber-500' : 'text-red-500'
          }`}>
            {overallScore}<span className="text-sm font-normal text-zinc-400">/100</span>
          </span>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          <MetricPill label="Opportunity" value={opportunity} />
          <MetricPill label="Problem Severity" value={problemSeverity} />
          <MetricPill label="Market Size" value={marketSize} />
          <MetricPill label="Revenue Potential" value={revenuePotential} />
          <MetricPill label="Feasibility" value={feasibility} />
        </div>
      </div>

      {/* ── Deep-dive analysis sections ── */}
      <div className="space-y-8">

        {/* Competitive Edge */}
        {idea.competitive_edge && (
          <AnalysisSection icon="⚔️" title="Competitive Edge">
            {idea.competitive_edge}
          </AnalysisSection>
        )}

        {/* Why Now */}
        {idea.why_now && (
          <AnalysisSection icon="⏱️" title="Why Now?">
            {idea.why_now}
          </AnalysisSection>
        )}

        {/* Market Gap */}
        {idea.market_gap && (
          <AnalysisSection icon="🔍" title="Market Gap">
            {idea.market_gap}
          </AnalysisSection>
        )}

        {/* Divider */}
        {(idea.competitive_edge || idea.why_now || idea.market_gap) &&
          (idea.pain_points?.length > 0 || idea.target_customers?.length > 0) && (
          <hr className="border-border" />
        )}

        {/* Problems solved */}
        {idea.pain_points?.length > 0 && (
          <AnalysisSection icon="!" title="Problems This Solves">
            <ul className="space-y-2 mt-1">
              {idea.pain_points.map((point: string, i: number) => (
                <li key={i} className="flex gap-2">
                  <span className="text-red-400 shrink-0">•</span>
                  {point}
                </li>
              ))}
            </ul>
          </AnalysisSection>
        )}

        {/* Target customers */}
        {idea.target_customers?.length > 0 && (
          <AnalysisSection icon="👥" title="Who It's For">
            <ul className="space-y-2 mt-1">
              {idea.target_customers.map((customer: string, i: number) => (
                <li key={i} className="flex gap-2">
                  <span className="text-blue-400 shrink-0">→</span>
                  {customer}
                </li>
              ))}
            </ul>
          </AnalysisSection>
        )}

        {/* Monetization */}
        {idea.monetization_strategies?.length > 0 && (
          <AnalysisSection icon="💰" title="How to Make Money">
            <ul className="space-y-2 mt-1">
              {idea.monetization_strategies.map((strategy: string, i: number) => (
                <li key={i} className="flex gap-2">
                  <span className="text-emerald-400 shrink-0">$</span>
                  {strategy}
                </li>
              ))}
            </ul>
          </AnalysisSection>
        )}

        {/* Tech stack */}
        {idea.tech_stack_suggestions?.length > 0 && (
          <AnalysisSection icon="🛠️" title="Tech Stack">
            <div className="flex flex-wrap gap-2 mt-1">
              {idea.tech_stack_suggestions.map((tech: string, i: number) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </AnalysisSection>
        )}

        {/* Source */}
        {idea.source_platform && (
          <p className="text-xs text-zinc-400 dark:text-zinc-500 pt-2">
            Source: {idea.source_platform}
            {idea.source_url && (
              <>
                {' · '}
                <a
                  href={idea.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                >
                  View original
                </a>
              </>
            )}
          </p>
        )}

        {/* ── Pro upgrade CTA (free users only) ── */}
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
