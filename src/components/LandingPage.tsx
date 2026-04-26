import Link from 'next/link'
import IdeaCard from '@/components/IdeaCard'
import SubscribeForm from '@/components/SubscribeForm'
import { FallingPattern } from '@/components/ui/falling-pattern'
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
      {/* ── HERO ── */}
      <section className="relative max-w-5xl mx-auto px-4 pt-16 pb-20 text-center overflow-hidden">
        {/* Falling pattern background */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <FallingPattern
            color="var(--foreground)"
            className="opacity-[0.07] [mask-image:radial-gradient(ellipse_at_50%_30%,black_20%,transparent_70%)]"
            density={1.5}
          />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-6">
          <Sparkles size={12} className="text-amber-500" />
          AI-curated startup ideas, delivered daily
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight tracking-tight">
          Startup ideas, refined
          <br />
          by AI. Ready to review.
        </h1>

        <p className="text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto mb-8 leading-relaxed">
          We crawl the internet for startup ideas, remove duplicates, and score them by demand signals.
          <br className="hidden sm:block" />
          Spend less time on research. More time on building.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-10">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-85 transition-opacity"
          >
            Get started free →
          </Link>
          <a
            href="#subscribe"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-border bg-card text-foreground font-medium text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
          >
            Get weekly digest
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto mt-12">
          {previewIdea && <IdeaCard idea={previewIdea} />}
          <LockedCard />
          <LockedCard />
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section className="border-t border-border bg-zinc-50 dark:bg-zinc-900/40">
        <div className="max-w-5xl mx-auto px-4 py-20">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-amber-600 dark:text-amber-500 mb-3 uppercase tracking-wider">
              Problem
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Finding good ideas is painful
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Shuffle size={22} />,
                title: 'Scattered everywhere',
                desc: 'Reddit, HN, Product Hunt, Indie Hackers… You spend hours tab-switching without seeing the full picture.',
              },
              {
                icon: <TrendingUp size={22} />,
                title: 'Too much duplication',
                desc: 'The same idea shows up across multiple platforms. Picking out what\'s genuinely new is exhausting.',
              },
              {
                icon: <Search size={22} />,
                title: 'Hard to validate',
                desc: 'Is there real demand? Are there existing competitors? Who will pay? You have to research everything yourself.',
              },
            ].map((p) => (
              <div key={p.title} className="rounded-2xl border border-border bg-card p-6">
                <div className="w-11 h-11 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                  {p.icon}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{p.title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLUTION ── */}
      <section className="border-t border-border">
        <div className="max-w-5xl mx-auto px-4 py-20">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-500 mb-3 uppercase tracking-wider">
              Solution
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              idealike does it for you
            </h2>
            <p className="text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto">
              The entire pipeline — collection to scoring — is automated. You just review and act.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: '01', title: 'Crawl', desc: 'Collects ideas daily from HN, Product Hunt, Indie Hackers and more.' },
              { step: '02', title: 'Refine', desc: 'GPT-4o extracts and structures the core business idea from raw posts.' },
              { step: '03', title: 'Tag', desc: 'Auto-categorized into SaaS, AI, DevTools, FinTech and 12 more tags.' },
              { step: '04', title: 'Score', desc: 'Demand signals and market potential are combined into an AI Score (0–100).' },
            ].map((s, i) => (
              <div key={s.step} className="relative">
                <div className="rounded-2xl border border-border bg-card p-6 h-full">
                  <div className="text-xs font-mono text-blue-500 mb-3">{s.step}</div>
                  <h3 className="font-semibold text-foreground mb-2">{s.title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{s.desc}</p>
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

      {/* ── FEATURES ── */}
      <section className="border-t border-border bg-zinc-50 dark:bg-zinc-900/40">
        <div className="max-w-5xl mx-auto px-4 py-20">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-500 mb-3 uppercase tracking-wider">
              Features
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything founders actually need
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                icon: <Shuffle size={20} />,
                title: 'Deduplication',
                desc: 'Same ideas appearing across multiple platforms are automatically merged by URL and title.',
                color: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30',
              },
              {
                icon: <TrendingUp size={20} />,
                title: 'Trend Score',
                desc: 'Upvotes, views, and search signals are combined into a 0–100 AI Score for every idea.',
                color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
              },
              {
                icon: <Filter size={20} />,
                title: 'Category Filter',
                desc: 'Browse by SaaS, AI, DevTools, FinTech and 12 other tags to find what fits your skillset.',
                color: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30',
              },
              {
                icon: <Bell size={20} />,
                title: 'Save & Alerts',
                desc: 'Bookmark ideas and get one fresh idea emailed to you every morning. Never miss a good one.',
                color: 'text-amber-500 bg-amber-100 dark:bg-amber-900/30',
              },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-border bg-card p-6 flex gap-4 items-start">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${f.color}`}>
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1.5">{f.title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EMAIL SUBSCRIBE ── */}
      <section id="subscribe" className="border-t border-border">
        <div className="max-w-3xl mx-auto px-4 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-xs font-medium text-amber-700 dark:text-amber-400 mb-6">
            <BookmarkIcon size={12} />
            One idea a day
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Get one AI-picked idea every morning
          </h2>
          <p className="text-zinc-600 dark:text-zinc-300 mb-8 leading-relaxed">
            Subscribe and we&apos;ll send you the most interesting idea of the day — straight to your inbox.
            <br />
            No repeats. Ever.
          </p>

          <SubscribeForm />

          <p className="text-xs text-muted-foreground mt-4">
            Unsubscribe anytime · No spam
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="border-t border-border bg-zinc-50 dark:bg-zinc-900/40">
        <div className="max-w-3xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'Where does the data come from?',
                a: 'We collect from public feeds on Hacker News, Product Hunt, and Indie Hackers. Every idea includes the original URL so you can verify the source yourself.',
              },
              {
                q: 'What can I do on the free plan?',
                a: 'Free users get 3 AI-curated ideas per day. You can read full analysis for each — no credit card required.',
              },
              {
                q: 'How does billing work?',
                a: 'Pro is $15/month, billed via LemonSqueezy. Cancel any time and you keep access until the end of your billing period.',
              },
              {
                q: 'How is my data handled?',
                a: 'All traffic is encrypted over HTTPS. Authentication uses Google OAuth via Supabase. Payment info is handled entirely by LemonSqueezy — we never store card details.',
              },
            ].map((item) => (
              <details key={item.q} className="group rounded-xl border border-border bg-card p-5 cursor-pointer">
                <summary className="flex items-center justify-between font-medium text-foreground list-none">
                  <span>{item.q}</span>
                  <span className="text-zinc-400 group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                </summary>
                <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="border-t border-border">
        <div className="max-w-3xl mx-auto px-4 py-24 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Start for free today
          </h2>
          <p className="text-zinc-600 dark:text-zinc-300 mb-8">
            3 curated ideas a day, no credit card required.
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-85 transition-opacity"
          >
            Get started free →
          </Link>
        </div>
      </section>
    </>
  )
}
