'use client'

import Link from 'next/link'
import BookmarkButton from '@/components/BookmarkButton'
import { TiltCard } from '@/components/ui/tilt-card'

interface Idea {
  id: string
  title: string
  summary: string
  tags: string[]
  source_platform?: string
  ai_score: number | null
  created_at: string
}

interface Props {
  idea: Idea
  isPro?: boolean
  isBookmarked?: boolean
  bookmarkCount?: number
  isLoggedIn?: boolean
}

// ── Abstract graphic header ──────────────────────────────────────────────────

type GfxProps = { fid: string; pid: string }

const Design0 = ({ fid, pid }: GfxProps) => (
  <svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
    <defs>
      <filter id={fid} x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" seed="3" result="n"/>
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -7 6.5" result="m"/>
        <feComposite in="SourceGraphic" in2="m" operator="in"/>
      </filter>
      <pattern id={pid} width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M20 0L0 0 0 20" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"/>
      </pattern>
    </defs>
    <rect width="400" height="180" fill="#E63946"/>
    <rect width="400" height="180" fill={`url(#${pid})`}/>
    <circle cx="340" cy="80" r="110" fill="#1D4ED8"/>
    <rect x="-20" y="20" width="130" height="120" rx="4" fill="#FBBF24" transform="rotate(22 45 80)"/>
    <circle cx="180" cy="155" r="40" fill="#E63946" filter={`url(#${fid})`}/>
    <path d="M-10 100 C80 60 160 140 280 90 S380 50 420 80" stroke="#fff" strokeWidth="22" fill="none" opacity="0.25"/>
    {[35, 75, 115, 155, 195].map((x, i) => <circle key={i} cx={x} cy={168} r="3.5" fill="#FBBF24" opacity="0.7"/>)}
    <rect width="400" height="180" fill="rgba(30,0,0,0.18)" filter={`url(#${fid})`}/>
  </svg>
)

const Design1 = ({ fid, pid }: GfxProps) => (
  <svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
    <defs>
      <filter id={fid} x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" seed="7" result="n"/>
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -6 5.5" result="m"/>
        <feComposite in="SourceGraphic" in2="m" operator="in"/>
      </filter>
      <pattern id={pid} width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M20 0L0 0 0 20" fill="none" stroke="rgba(0,0,80,0.15)" strokeWidth="0.5"/>
      </pattern>
    </defs>
    <rect width="400" height="180" fill="#FBBF24"/>
    <rect width="400" height="180" fill={`url(#${pid})`}/>
    <polygon points="50,170 200,-20 350,170" fill="#7C3AED"/>
    <rect x="260" y="10" width="100" height="90" rx="6" fill="#EC4899" transform="rotate(-12 310 55)"/>
    <circle cx="30" cy="30" r="45" fill="#FBBF24" filter={`url(#${fid})`}/>
    <circle cx="370" cy="160" r="50" fill="#1D4ED8" opacity="0.7"/>
    <path d="M0 130 C100 90 200 160 400 110" stroke="#fff" strokeWidth="18" fill="none" opacity="0.3"/>
    {[0,1,2,3,4,5].map(i => <circle key={i} cx={60 + i*40} cy={20} r="5" fill="#fff" opacity="0.5"/>)}
    <rect width="400" height="180" fill="rgba(30,10,0,0.15)" filter={`url(#${fid})`}/>
  </svg>
)

const Design2 = ({ fid, pid }: GfxProps) => (
  <svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
    <defs>
      <filter id={fid} x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="4" seed="11" result="n"/>
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -7 6" result="m"/>
        <feComposite in="SourceGraphic" in2="m" operator="in"/>
      </filter>
      <pattern id={pid} width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M20 0L0 0 0 20" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5"/>
      </pattern>
    </defs>
    <rect width="400" height="180" fill="#1D4ED8"/>
    <rect width="400" height="180" fill={`url(#${pid})`}/>
    <rect x="-30" y="40" width="220" height="100" rx="6" fill="#E63946" transform="rotate(-20 80 90)"/>
    <circle cx="300" cy="50" r="65" fill="#FBBF24"/>
    <circle cx="300" cy="50" r="65" fill="#1D4ED8" filter={`url(#${fid})`} opacity="0.6"/>
    <path d="M200 180 C250 120 300 140 400 70" stroke="#EC4899" strokeWidth="28" fill="none" strokeLinecap="round"/>
    {[0,1,2,3].map(i => <circle key={i} cx={320 + i*18} cy={140 + (i%2)*12} r="6" fill="#fff" opacity="0.55"/>)}
    <rect x="10" y="10" width="70" height="14" rx="7" fill="#FBBF24" transform="rotate(10 45 17)"/>
    <rect width="400" height="180" fill="rgba(0,0,30,0.2)" filter={`url(#${fid})`}/>
  </svg>
)

const Design3 = ({ fid, pid }: GfxProps) => (
  <svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
    <defs>
      <filter id={fid} x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="4" seed="17" result="n"/>
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -6 5.8" result="m"/>
        <feComposite in="SourceGraphic" in2="m" operator="in"/>
      </filter>
      <pattern id={pid} width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M20 0L0 0 0 20" fill="none" stroke="rgba(100,0,150,0.15)" strokeWidth="0.5"/>
      </pattern>
    </defs>
    <rect width="400" height="180" fill="#F9A8D4"/>
    <rect width="400" height="180" fill={`url(#${pid})`}/>
    <circle cx="80" cy="80" r="90" fill="#7C3AED" opacity="0.9"/>
    <rect x="200" y="-20" width="140" height="140" rx="6" fill="#16A34A" transform="rotate(15 270 50)"/>
    <circle cx="350" cy="150" r="55" fill="#EC4899" filter={`url(#${fid})`}/>
    <path d="M-10 50 C100 10 200 80 400 30" stroke="#FBBF24" strokeWidth="20" fill="none" strokeLinecap="round"/>
    {[0,1,2,3,4,5,6].map(i => <rect key={i} x={20+i*50} y={155} width="10" height="10" rx="2" fill="#7C3AED" opacity="0.5"/>)}
    <rect width="400" height="180" fill="rgba(60,0,30,0.15)" filter={`url(#${fid})`}/>
  </svg>
)

const Design4 = ({ fid, pid }: GfxProps) => (
  <svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
    <defs>
      <filter id={fid} x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="4" seed="23" result="n"/>
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -6 5.5" result="m"/>
        <feComposite in="SourceGraphic" in2="m" operator="in"/>
      </filter>
      <pattern id={pid} width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M20 0L0 0 0 20" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"/>
      </pattern>
    </defs>
    <rect width="400" height="180" fill="#7C3AED"/>
    <rect width="400" height="180" fill={`url(#${pid})`}/>
    <circle cx="50" cy="180" r="120" fill="#EC4899" opacity="0.85"/>
    <polygon points="240,0 400,0 400,140 320,180 200,100" fill="#FBBF24"/>
    <rect x="140" y="60" width="120" height="120" rx="60" fill="#7C3AED" filter={`url(#${fid})`}/>
    <path d="M0 60 C80 30 160 90 280 40 S380 0 420 30" stroke="#fff" strokeWidth="16" fill="none" opacity="0.25" strokeLinecap="round"/>
    {[0,1,2,3,4].map(i => <circle key={i} cx={30+i*24} cy={15} r="5" fill="#FBBF24" opacity="0.6"/>)}
    <rect width="400" height="180" fill="rgba(20,0,40,0.18)" filter={`url(#${fid})`}/>
  </svg>
)

const Design5 = ({ fid, pid }: GfxProps) => (
  <svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
    <defs>
      <filter id={fid} x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" seed="31" result="n"/>
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -6 5.5" result="m"/>
        <feComposite in="SourceGraphic" in2="m" operator="in"/>
      </filter>
      <pattern id={pid} width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M20 0L0 0 0 20" fill="none" stroke="rgba(255,255,200,0.12)" strokeWidth="0.5"/>
      </pattern>
    </defs>
    <rect width="400" height="180" fill="#0891B2"/>
    <rect width="400" height="180" fill={`url(#${pid})`}/>
    <rect x="240" y="-30" width="200" height="200" fill="#E63946" transform="rotate(30 340 70)"/>
    <circle cx="100" cy="100" r="80" fill="#FBBF24"/>
    <circle cx="100" cy="100" r="80" fill="#0891B2" filter={`url(#${fid})`} opacity="0.55"/>
    <path d="M0 150 C80 100 180 170 320 100 S390 60 420 90" stroke="#7C3AED" strokeWidth="24" fill="none" strokeLinecap="round"/>
    {[0,1,2,3,4,5].map(i => <circle key={i} cx={260+i*22} cy={160} r="4.5" fill="#fff" opacity="0.5"/>)}
    <rect width="400" height="180" fill="rgba(0,30,40,0.18)" filter={`url(#${fid})`}/>
  </svg>
)

const DESIGNS = [Design0, Design1, Design2, Design3, Design4, Design5]

function CardGraphic({ id, tags }: { id: string; tags: string[] }) {
  const hash = [...id].reduce((a, c) => (a * 31 + c.charCodeAt(0)) & 0xffff, 0)
  const idx = hash % DESIGNS.length
  const Design = DESIGNS[idx]
  const safeId = id.replace(/[^a-z0-9]/gi, '_')
  return (
    <div className="w-full h-full">
      <Design fid={`fid_${safeId}`} pid={`pid_${safeId}`} />
    </div>
  )
}

// ── Main card component ──────────────────────────────────────────────────────

export default function IdeaCard({
  idea,
  isPro = false,
  isBookmarked = false,
  bookmarkCount = 0,
  isLoggedIn = false,
}: Props) {
  return (
    <TiltCard className="relative h-full group rounded-2xl" tiltLimit={8} scale={1.02}>
      <Link href={`/ideas/${idea.id}`} className="block h-full">
        <div className="h-full flex flex-col rounded-2xl bg-card border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">

          {/* ── Graphic header ── */}
          <div className="relative h-44 shrink-0 overflow-hidden">
            <CardGraphic id={idea.id} tags={idea.tags} />

            {/* Score badge — top right, like price tag */}
            {idea.ai_score != null && (
              <div className="absolute top-3 right-3 z-10">
                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-white text-zinc-900 shadow-sm">
                  ✦ {idea.ai_score}
                </span>
              </div>
            )}
          </div>

          {/* ── Text content ── */}
          <div className="flex flex-col flex-1 p-5 gap-2.5 bg-card">

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {idea.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h3 className="font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors text-[15px]">
              {idea.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-grow">
              {idea.summary}
            </p>
          </div>
        </div>
      </Link>

      {/* Bookmark — overlaid on graphic area, top-left */}
      {isLoggedIn && (
        <div className="absolute top-3 left-3 z-10">
          <BookmarkButton
            ideaId={idea.id}
            initialBookmarked={isBookmarked}
            isPro={isPro}
            bookmarkCount={bookmarkCount}
            size="sm"
          />
        </div>
      )}
    </TiltCard>
  )
}
