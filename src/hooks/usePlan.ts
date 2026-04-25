'use client'

import { usePlanContext } from '@/lib/plan-context'
import { can, LIMITS, type FeatureKey } from '@/lib/features'

export function usePlan() {
  const { isPro } = usePlanContext()

  return {
    isPro,
    plan: isPro ? ('pro' as const) : ('free' as const),
    /** Check if the current user can access a feature */
    can: (feature: FeatureKey) => can(feature, isPro),
    /** Get the numeric limit for the current plan */
    limit: (key: keyof typeof LIMITS) =>
      isPro ? LIMITS[key].pro : LIMITS[key].free,
  }
}
