import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { FREE_VIEWS_PER_DAY } from '@/lib/constants'

interface PageProps {
  params: Promise<{ id: string }>
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

  if (!profile?.is_pro) {
    const today = new Date().toISOString().split('T')[0]
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
            <h2 className="text-2xl font-bold mb-2">일일 조회 한도 도달</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
              무료 플랜은 하루 {FREE_VIEWS_PER_DAY}개의 아이디어를 상세 조회할 수 있습니다.
              <br />
              Pro로 업그레이드하면 모든 아이디어를 무제한으로 열람할 수 있습니다.
            </p>
            <Link
              href="/pricing"
              className="inline-block px-6 py-3 rounded-xl bg-foreground text-background font-medium hover:opacity-80 transition-opacity"
            >
              Pro 업그레이드 ($9.99/월)
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

  const { data: idea } = await supabase
    .from('ideas')
    .select('*')
    .eq('id', id)
    .eq('is_published', true)
    .single()

  if (!idea) {
    notFound()
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400 hover:text-foreground transition-colors mb-8"
      >
        ← 목록으로
      </Link>

      <div className="mb-6 flex items-center gap-3 flex-wrap">
        <span className="text-sm px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
          {idea.source_platform}
        </span>
        {idea.ai_score != null && (
          <span className="text-sm text-zinc-400 dark:text-zinc-500">
            ✦ AI 점수 {idea.ai_score}/10
          </span>
        )}
      </div>

      <h1 className="text-3xl font-bold text-foreground mb-4 leading-snug">
        {idea.title}
      </h1>
      <p className="text-lg text-zinc-600 dark:text-zinc-300 mb-10 leading-relaxed">
        {idea.summary}
      </p>

      <div className="space-y-8">
        {idea.pain_points?.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3">🎯 해결하는 문제</h2>
            <ul className="space-y-2">
              {idea.pain_points.map((point: string, i: number) => (
                <li key={i} className="flex gap-3 text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">
                  <span className="text-zinc-300 dark:text-zinc-600 shrink-0 mt-0.5">•</span>
                  {point}
                </li>
              ))}
            </ul>
          </section>
        )}

        {idea.target_customers?.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3">👥 타겟 고객</h2>
            <ul className="space-y-2">
              {idea.target_customers.map((customer: string, i: number) => (
                <li key={i} className="flex gap-3 text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">
                  <span className="text-zinc-300 dark:text-zinc-600 shrink-0 mt-0.5">•</span>
                  {customer}
                </li>
              ))}
            </ul>
          </section>
        )}

        {idea.monetization_strategies?.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3">💰 수익화 전략</h2>
            <ul className="space-y-2">
              {idea.monetization_strategies.map((strategy: string, i: number) => (
                <li key={i} className="flex gap-3 text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">
                  <span className="text-zinc-300 dark:text-zinc-600 shrink-0 mt-0.5">•</span>
                  {strategy}
                </li>
              ))}
            </ul>
          </section>
        )}

        {idea.tech_stack_suggestions?.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3">🛠 기술 스택 제안</h2>
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

        {idea.tags?.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3">🏷 카테고리</h2>
            <div className="flex flex-wrap gap-2">
              {idea.tags.map((tag: string, i: number) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        )}

        {idea.source_url && (
          <div className="pt-4 border-t border-black/10 dark:border-white/10">
            <a
              href={idea.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-foreground transition-colors"
            >
              원본 소스 보기 →
            </a>
          </div>
        )}
      </div>
    </main>
  )
}
