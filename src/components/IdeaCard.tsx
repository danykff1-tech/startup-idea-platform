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

// ── Graphic header designs ───────────────────────────────────────────────────

type GfxProps = { fid: string; gid: string; pid: string }

/* Design 0 — Coral → Yellow  +  Teal */
const D0 = ({ fid, gid, pid }: GfxProps) => (
  <svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF6B6B"/>
        <stop offset="100%" stopColor="#FFD93D"/>
      </linearGradient>
      <filter id={fid}><feTurbulence type="fractalNoise" baseFrequency="0.62" numOctaves="3" stitchTiles="stitch" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 9 -5.5" result="s"/><feComposite in="s" in2="SourceGraphic" operator="in"/></filter>
      <pattern id={pid} width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0L0 0 0 20" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.5"/></pattern>
    </defs>
    <rect width="400" height="180" fill={`url(#${gid})`}/>
    <rect width="400" height="180" fill={`url(#${pid})`}/>
    <circle cx="330" cy="70" r="105" fill="#4ECDC4" opacity="0.88"/>
    <circle cx="330" cy="70" r="105" fill="#38BDF8" opacity="0.3" filter={`url(#${fid})`}/>
    <rect x="-15" y="30" width="130" height="115" rx="8" fill="#FBBF24" opacity="0.85" transform="rotate(22 50 87)"/>
    <path d="M-10 120 C90 70 200 145 330 85 S400 50 430 70" stroke="#fff" strokeWidth="22" fill="none" opacity="0.28" strokeLinecap="round"/>
    {[0,1,2,3,4].map(i=><circle key={i} cx={28+i*32} cy={167} r="4.5" fill="#FFD93D" opacity="0.8"/>)}
    <rect width="400" height="180" fill="white" opacity="0.13" filter={`url(#${fid})`}/>
  </svg>
)

/* Design 1 — Purple → Cyan  +  Yellow */
const D1 = ({ fid, gid, pid }: GfxProps) => (
  <svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id={gid} x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#7C3AED"/>
        <stop offset="100%" stopColor="#22D3EE"/>
      </linearGradient>
      <radialGradient id={`rg-${gid}`} cx="70%" cy="30%" r="60%">
        <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.7"/>
        <stop offset="100%" stopColor="transparent"/>
      </radialGradient>
      <filter id={fid}><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch" seed="5" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 8 -5" result="s"/><feComposite in="s" in2="SourceGraphic" operator="in"/></filter>
      <pattern id={pid} width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0L0 0 0 20" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"/></pattern>
    </defs>
    <rect width="400" height="180" fill={`url(#${gid})`}/>
    <rect width="400" height="180" fill={`url(#rg-${gid})`}/>
    <rect width="400" height="180" fill={`url(#${pid})`}/>
    <polygon points="30,180 210,-20 390,180" fill="#FDE047" opacity="0.8"/>
    <circle cx="310" cy="40" r="70" fill="#FB7185" opacity="0.9"/>
    <circle cx="310" cy="40" r="70" fill="#F472B6" opacity="0.3" filter={`url(#${fid})`}/>
    <path d="M-10 45 C100 5 220 90 360 30 S420 0 440 20" stroke="#fff" strokeWidth="20" fill="none" opacity="0.3" strokeLinecap="round"/>
    {[0,1,2,3,4,5].map(i=><rect key={i} x={20+i*45} y={155} width="12" height="12" rx="3" fill="#FDE047" opacity="0.65"/>)}
    <rect width="400" height="180" fill="white" opacity="0.12" filter={`url(#${fid})`}/>
  </svg>
)

/* Design 2 — Mint → Blue  +  Coral */
const D2 = ({ fid, gid, pid }: GfxProps) => (
  <svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#34D399"/>
        <stop offset="100%" stopColor="#60A5FA"/>
      </linearGradient>
      <filter id={fid}><feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch" seed="9" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 9 -5.5" result="s"/><feComposite in="s" in2="SourceGraphic" operator="in"/></filter>
      <pattern id={pid} width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0L0 0 0 20" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.5"/></pattern>
    </defs>
    <rect width="400" height="180" fill={`url(#${gid})`}/>
    <rect width="400" height="180" fill={`url(#${pid})`}/>
    <rect x="180" y="-30" width="170" height="170" rx="8" fill="#FF6B6B" opacity="0.9" transform="rotate(20 265 55)"/>
    <rect x="180" y="-30" width="170" height="170" rx="8" fill="#FB7185" opacity="0.4" filter={`url(#${fid})`} transform="rotate(20 265 55)"/>
    <circle cx="70" cy="100" r="80" fill="#FDE047" opacity="0.85"/>
    <path d="M180 180 C230 130 290 150 400 80" stroke="#fff" strokeWidth="26" fill="none" opacity="0.3" strokeLinecap="round"/>
    <path d="M0 30 C60 10 130 60 180 30" stroke="#fff" strokeWidth="14" fill="none" opacity="0.4" strokeLinecap="round"/>
    {[0,1,2,3].map(i=><circle key={i} cx={300+i*25} cy={155} r="6" fill="#fff" opacity="0.5"/>)}
    <rect width="400" height="180" fill="white" opacity="0.12" filter={`url(#${fid})`}/>
  </svg>
)

/* Design 3 — Yellow → Lime  +  Purple */
const D3 = ({ fid, gid, pid }: GfxProps) => (
  <svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id={gid} x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FDE047"/>
        <stop offset="100%" stopColor="#86EFAC"/>
      </linearGradient>
      <filter id={fid}><feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" seed="13" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 8 -5" result="s"/><feComposite in="s" in2="SourceGraphic" operator="in"/></filter>
      <pattern id={pid} width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0L0 0 0 20" fill="none" stroke="rgba(100,0,150,0.12)" strokeWidth="0.5"/></pattern>
    </defs>
    <rect width="400" height="180" fill={`url(#${gid})`}/>
    <rect width="400" height="180" fill={`url(#${pid})`}/>
    <circle cx="60" cy="90" r="90" fill="#818CF8" opacity="0.88"/>
    <circle cx="60" cy="90" r="90" fill="#7C3AED" opacity="0.35" filter={`url(#${fid})`}/>
    <polygon points="300,10 390,160 210,160" fill="#FB7185" opacity="0.9"/>
    <circle cx="200" cy="20" r="35" fill="#FDE047" opacity="0.7"/>
    <path d="M-10 150 C100 110 220 170 350 120 S420 90 440 110" stroke="#fff" strokeWidth="20" fill="none" opacity="0.3" strokeLinecap="round"/>
    {[0,1,2,3,4,5,6].map(i=><circle key={i} cx={160+i*24} cy={10} r="4" fill="#818CF8" opacity="0.6"/>)}
    <rect width="400" height="180" fill="white" opacity="0.13" filter={`url(#${fid})`}/>
  </svg>
)

/* Design 4 — Rose → Violet  +  Yellow */
const D4 = ({ fid, gid, pid }: GfxProps) => (
  <svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FB7185"/>
        <stop offset="100%" stopColor="#C084FC"/>
      </linearGradient>
      <radialGradient id={`rg-${gid}`} cx="30%" cy="70%" r="55%">
        <stop offset="0%" stopColor="#F472B6" stopOpacity="0.6"/>
        <stop offset="100%" stopColor="transparent"/>
      </radialGradient>
      <filter id={fid}><feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="3" stitchTiles="stitch" seed="19" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 9 -5.5" result="s"/><feComposite in="s" in2="SourceGraphic" operator="in"/></filter>
      <pattern id={pid} width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0L0 0 0 20" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.5"/></pattern>
    </defs>
    <rect width="400" height="180" fill={`url(#${gid})`}/>
    <rect width="400" height="180" fill={`url(#rg-${gid})`}/>
    <rect width="400" height="180" fill={`url(#${pid})`}/>
    <circle cx="50" cy="180" r="130" fill="#FDE047" opacity="0.85"/>
    <rect x="240" y="-20" width="160" height="160" rx="80" fill="#34D399" opacity="0.8" transform="rotate(15 320 60)"/>
    <rect x="240" y="-20" width="160" height="160" rx="80" fill="#10B981" opacity="0.35" filter={`url(#${fid})`} transform="rotate(15 320 60)"/>
    <path d="M0 55 C80 20 180 90 300 40 S390 10 430 30" stroke="#fff" strokeWidth="18" fill="none" opacity="0.3" strokeLinecap="round"/>
    {[0,1,2,3,4].map(i=><polygon key={i} points={`${30+i*50},165 ${38+i*50},150 ${46+i*50},165`} fill="#FDE047" opacity="0.65"/>)}
    <rect width="400" height="180" fill="white" opacity="0.13" filter={`url(#${fid})`}/>
  </svg>
)

/* Design 5 — Sky → Teal  +  Coral */
const D5 = ({ fid, gid, pid }: GfxProps) => (
  <svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id={gid} x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#2DD4BF"/>
        <stop offset="100%" stopColor="#38BDF8"/>
      </linearGradient>
      <filter id={fid}><feTurbulence type="fractalNoise" baseFrequency="0.67" numOctaves="3" stitchTiles="stitch" seed="29" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 9 -5.5" result="s"/><feComposite in="s" in2="SourceGraphic" operator="in"/></filter>
      <pattern id={pid} width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0L0 0 0 20" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"/></pattern>
    </defs>
    <rect width="400" height="180" fill={`url(#${gid})`}/>
    <rect width="400" height="180" fill={`url(#${pid})`}/>
    <rect x="220" y="-10" width="200" height="200" fill="#FF6B6B" opacity="0.85" transform="rotate(30 320 90)"/>
    <rect x="220" y="-10" width="200" height="200" fill="#FB7185" opacity="0.35" filter={`url(#${fid})`} transform="rotate(30 320 90)"/>
    <circle cx="90" cy="90" r="85" fill="#FDE047" opacity="0.88"/>
    <circle cx="90" cy="90" r="85" fill="#FCD34D" opacity="0.3" filter={`url(#${fid})`}/>
    <path d="M0 150 C90 105 190 165 330 110 S400 75 440 95" stroke="#fff" strokeWidth="22" fill="none" opacity="0.28" strokeLinecap="round"/>
    <path d="M200 0 C230 30 210 60 240 90" stroke="#fff" strokeWidth="10" fill="none" opacity="0.35" strokeLinecap="round"/>
    {[0,1,2,3,4,5].map(i=><circle key={i} cx={230+i*22} cy={15} r="5" fill="#fff" opacity="0.5"/>)}
    <rect width="400" height="180" fill="white" opacity="0.12" filter={`url(#${fid})`}/>
  </svg>
)

const DESIGNS = [D0, D1, D2, D3, D4, D5]

function CardGraphic({ id, tags }: { id: string; tags: string[] }) {
  const hash = [...id].reduce((a, c) => (a * 31 + c.charCodeAt(0)) & 0xffff, 0)
  const idx = hash % DESIGNS.length
  const Design = DESIGNS[idx]
  const s = id.replace(/[^a-z0-9]/gi, '_')
  return (
    <div className="w-full h-full">
      <Design fid={`f_${s}`} gid={`g_${s}`} pid={`p_${s}`} />
    </div>
  )
}

// ── Main card ────────────────────────────────────────────────────────────────

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

          {/* Graphic header */}
          <div className="relative h-44 shrink-0 overflow-hidden">
            <CardGraphic id={idea.id} tags={idea.tags} />

            {/* Score badge — top right */}
            {idea.ai_score != null && (
              <div className="absolute top-3 right-3 z-10">
                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-zinc-800 shadow-sm">
                  ✦ {idea.ai_score}
                </span>
              </div>
            )}
          </div>

          {/* Text content */}
          <div className="flex flex-col flex-1 p-5 gap-2.5 bg-card">
            <div className="flex flex-wrap gap-1.5">
              {idea.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-medium">
                  {tag}
                </span>
              ))}
            </div>
            <h3 className="font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors text-[15px]">
              {idea.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-grow">
              {idea.summary}
            </p>
          </div>
        </div>
      </Link>

      {/* Bookmark — top left of graphic */}
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
