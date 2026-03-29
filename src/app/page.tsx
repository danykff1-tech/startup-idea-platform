import { createClient } from '@/lib/supabase/server'
import IdeaCard from '@/components/IdeaCard'

export default async function HomePage() {
  const supabase = await createClient()

  const { data: ideas } = await supabase
    .from('ideas')
    .select('id, title, summary, tags, source_platform, ai_score, created_at')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      {/* 히어로 섹션 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 leading-tight">
          AI가 발굴한<br />사업 아이디어
        </h1>
        <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
          Reddit, IndieHackers, ProductHunt에서 매일 수집 · 분석된<br />
          검증된 창업 아이디어를 탐색하세요
        </p>
      </div>

      {/* 아이디어 목록 */}
      {!ideas || ideas.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-5xl mb-4">✦</div>
          <p className="text-lg text-zinc-500 dark:text-zinc-400">아직 등록된 아이디어가 없습니다.</p>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-2">
            AI 파이프라인이 곧 새로운 아이디어를 추가합니다!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      )}
    </main>
  )
}
