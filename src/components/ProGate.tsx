'use client'

import Link from 'next/link'
import { Lock } from 'lucide-react'
import { usePlan } from '@/hooks/usePlan'
import type { FeatureKey } from '@/lib/features'

interface ProGateProps {
  feature: FeatureKey
  children: React.ReactNode
  /**
   * banner — amber callout strip below (default)
   * blur   — children shown blurred with a "Pro" pill overlay
   * hidden — renders nothing when locked
   */
  mode?: 'banner' | 'blur' | 'hidden'
  hint?: string
}

/** Client-side feature gate. Wrap any UI section that requires Pro. */
export function ProGate({ feature, children, mode = 'banner', hint }: ProGateProps) {
  const { can } = usePlan()
  if (can(feature)) return <>{children}</>

  if (mode === 'hidden') return null

  if (mode === 'blur') {
    return (
      <div className="relative">
        <div className="pointer-events-none select-none blur-sm opacity-50">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Link
            href="/pricing"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background/90 border border-border shadow-sm text-xs font-medium text-foreground hover:bg-accent transition-colors"
          >
            <Lock size={12} className="text-amber-500" />
            Pro feature
          </Link>
        </div>
      </div>
    )
  }

  // banner (default)
  return <ProBanner hint={hint} />
}

/** Standalone upgrade banner — use in server components too (no hook needed). */
export function ProBanner({ hint }: { hint?: string }) {
  return (
    <div className="rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-900/10 px-4 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2.5 min-w-0">
        <Lock size={14} className="text-amber-500 shrink-0" />
        <p className="text-sm text-muted-foreground">
          {hint ?? 'Available on Pro'}
        </p>
      </div>
      <Link
        href="/pricing"
        className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline whitespace-nowrap shrink-0"
      >
        Upgrade →
      </Link>
    </div>
  )
}
