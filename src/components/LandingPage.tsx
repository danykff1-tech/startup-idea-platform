import Link from 'next/link'
import IdeaCard from '@/components/IdeaCard'
import SubscribeForm from '@/components/SubscribeForm'
import { Lock, Search, Filter, BookmarkIcon, Bell, Sparkles, TrendingUp, Shuffle } from 'lucide-react'

interface Idea {
  id: string
  title: string
  summary: string
  tags: string[]
  source_platform: string
  ai_score: number | null
  created_at: string
}

interface Props {
  previewIdea: Idea | null
}

/* ── Locked placeholder card ── */
function LockedCard() {
  return (
    <Link href="/auth/login" className="block h-full">
      <div className="relative h-full rounded-2xl border border-border bg-card p-5 overflow-hidden min-h-[200px] flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/40 transition-colors">
        <div className="absolute inset-0 p-5 opacity-20 select-none pointer-events-none">
          <div className="h-3 bg-zinc-400 rounded w-3/4 mb-2" />
          <div className="h-3 bg-zinc-400 rounded w-1/2 mb-6" />
          <div className="h-2 bg-zinc-300 rounded w-full mb-1.5" />
          <div className="h-2 bg-zinc-300 rounded w-5/6 mb-1.5" />
          <div className="h-2 bg-zinc-300 rounded w-4/6" />
        </div>
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

export default function LandingPage({ previewIdea }: Props) {
  return (
    <>
      {/* ═══════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-4 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-6">
          <Sparkles size={12} className="text-amber-500" />
          AI가 매일 검증하는 사업 아이디어
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight tracking-tight">
          스타트업 아이디어를
          <br />
          자동 정제, 바로 검토하세요
        </h1>

        <p className="text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto mb-8 leading-relaxed">
          인터넷 곳곳의 아이디어를 크롤링하여 중복 제거하고 수요 신호로 점수화합니다.
          <br className="hidden sm:block" />
          창업 리서치에 쓰는 시간을 절반으로 줄이세요.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-10">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-85 transition-opacity"
          >
            무료로 시작하기 →
          </Link>
          <a
            href="#subscribe"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-border bg-card text-foreground font-medium text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
          >
            주간 리포트 받기
          </a>
        </div>

        {/* Hero preview (1 real + 2 locked) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto mt-12">
          {previewIdea && <IdeaCard idea={previewIdea} />}
          <LockedCard />
          <LockedCard />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PROBLEM
          ═══════════════════════════════════════════ */}
      <section className="border-t border-border bg-zinc-50 dark:bg-zinc-900/40">
        <div className="max-w-5xl mx-auto px-4 py-20">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-amber-600 dark:text-amber-500 mb-3 uppercase tracking-wider">
              Problem
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              아이디어 찾기는 왜 이렇게 어려울까요?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Shuffle size={22} />,
                title: '흩어져 있음',
                desc: 'Reddit, HN, Product Hunt, Indie Hackers… 하루 종일 탭을 넘나들어도 전체 그림이 안 보입니다.',
              },
              {
                icon: <TrendingUp size={22} />,
                title: '중복이 너무 많음',
                desc: '같은 아이디어가 여러 플랫폼에 반복 등장합니다. 진짜 새로운 것을 골라내기 어렵습니다.',
              },
              {
                icon: <Search size={22} />,
                title: '검증이 안 됨',
                desc: '수요가 있는지, 이미 유사 제품이 있는지, 누가 돈을 낼지 직접 조사해야 합니다.',
              },
            ].map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="w-11 h-11 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                  {p.icon}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{p.title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SOLUTION FLOW
          ═══════════════════════════════════════════ */}
      <section className="border-t border-border">
        <div className="max-w-5xl mx-auto px-4 py-20">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-500 mb-3 uppercase tracking-wider">
              Solution
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              idealike가 대신 해드립니다
            </h2>
            <p className="text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto">
              수집부터 점수화까지 전 과정을 자동화해, 당신은 검토와 실행에만 집중하세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {[
              { step: '01', title: '크롤링', desc: 'HN, Product Hunt, Indie Hackers 등에서 매일 수집' },
              { step: '02', title: '정제', desc: 'GPT-4o가 핵심 아이디어만 추출하고 구조화' },
              { step: '03', title: '분류', desc: 'SaaS · AI · DevTools 등 카테고리로 자동 태깅' },
              { step: '04', title: '점수화', desc: '수요 신호와 시장성으로 AI Score 산정' },
            ].map((s, i) => (
              <div key={s.step} className="relative">
                <div className="rounded-2xl border border-border bg-card p-6 h-full">
                  <div className="text-xs font-mono text-blue-500 mb-3">{s.step}</div>
                  <h3 className="font-semibold text-foreground mb-2">{s.title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
                {i < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 -translate-y-1/2 text-zinc-300 dark:text-zinc-700 z-10">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURES
          ═══════════════════════════════════════════ */}
      <section className="border-t border-border bg-zinc-50 dark:bg-zinc-900/40">
        <div className="max-w-5xl mx-auto px-4 py-20">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-500 mb-3 uppercase tracking-wider">
              Features
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              창업자에게 꼭 필요한 4가지
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                icon: <Shuffle size={20} />,
                title: '중복 제거',
                desc: '여러 플랫폼에 걸친 동일 아이디어를 URL·제목 기반으로 자동 병합합니다.',
                color: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30',
              },
              {
                icon: <TrendingUp size={20} />,
                title: '트렌드 점수',
                desc: '조회수, 추천수, 검색량 시그널을 종합해 0~100점의 AI Score로 환산합니다.',
                color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
              },
              {
                icon: <Filter size={20} />,
                title: '카테고리 필터',
                desc: 'SaaS, AI, DevTools, FinTech 등 16개 태그로 관심 분야만 빠르게 탐색.',
                color: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30',
              },
              {
                icon: <Bell size={20} />,
                title: '저장 & 알림',
                desc: '북마크하고 매일 이메일로 정제된 아이디어를 받아보세요. 놓치지 않습니다.',
                color: 'text-amber-500 bg-amber-100 dark:bg-amber-900/30',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-border bg-card p-6 flex gap-4 items-start"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${f.color}`}>
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1.5">{f.title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          EMAIL SUBSCRIBE
          ═══════════════════════════════════════════ */}
      <section id="subscribe" className="border-t border-border">
        <div className="max-w-3xl mx-auto px-4 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-xs font-medium text-amber-700 dark:text-amber-400 mb-6">
            <BookmarkIcon size={12} />
            매일 아이디어 이메일
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            하루 하나, AI가 고른 아이디어
          </h2>
          <p className="text-zinc-600 dark:text-zinc-300 mb-8 leading-relaxed">
            구독하면 매일 아침 가장 흥미로운 아이디어 한 건을 이메일로 보내드립니다.
            <br />
            같은 아이디어는 두 번 보내지 않습니다.
          </p>

          <SubscribeForm />

          <p className="text-xs text-muted-foreground mt-4">
            언제든 구독 취소 가능 · 스팸 없음
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FAQ
          ═══════════════════════════════════════════ */}
      <section className="border-t border-border bg-zinc-50 dark:bg-zinc-900/40">
        <div className="max-w-3xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              자주 묻는 질문
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: '어떤 데이터를 사용하나요?',
                a: 'Hacker News, Product Hunt, Indie Hackers의 공개 피드와 RSS를 수집합니다. GPT-4o로 정제한 뒤 원본 URL을 항상 함께 제공하므로 직접 검증할 수 있습니다.',
              },
              {
                q: '무료 플랜에서는 무엇을 할 수 있나요?',
                a: '매일 AI가 골라주는 3개의 아이디어를 제한 없이 열람할 수 있습니다. 그 외 추가 아이디어는 하루 3건까지 무료 분석이 가능합니다.',
              },
              {
                q: '결제는 어떻게 되나요?',
                a: 'Pro 플랜은 월 $15이며 LemonSqueezy로 안전하게 결제됩니다. 언제든 취소할 수 있고, 기존 결제일까지 계속 이용 가능합니다.',
              },
              {
                q: '보안은 어떻게 관리하나요?',
                a: '모든 통신은 HTTPS로 암호화되며, 인증은 Supabase OAuth(Google)로 처리됩니다. 결제 정보는 LemonSqueezy에서만 관리하고 저희 서버에는 저장되지 않습니다.',
              },
            ].map((item) => (
              <details
                key={item.q}
                className="group rounded-xl border border-border bg-card p-5 cursor-pointer"
              >
                <summary className="flex items-center justify-between font-medium text-foreground list-none">
                  <span>{item.q}</span>
                  <span className="text-zinc-400 group-open:rotate-45 transition-transform text-xl leading-none">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FINAL CTA
          ═══════════════════════════════════════════ */}
      <section className="border-t border-border">
        <div className="max-w-3xl mx-auto px-4 py-24 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            지금 시작하세요
          </h2>
          <p className="text-zinc-600 dark:text-zinc-300 mb-8">
            무료 계정으로 매일 3개의 정제된 아이디어를 받아볼 수 있습니다.
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-85 transition-opacity"
          >
            무료로 시작하기 →
          </Link>
        </div>
      </section>
    </>
  )
}
