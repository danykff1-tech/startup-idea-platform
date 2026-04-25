/**
 * Central feature configuration.
 * - true  = free users CAN use
 * - false = Pro only
 *
 * Add/remove features here — never scatter plan checks in components.
 */
export const FEATURES = {
  // Detail page
  deep_analysis: false,      // competitive_edge, why_now, market_gap, monetization, tech_stack
  score_breakdown: false,    // per-dimension score grid

  // Feed
  sort_by_score: false,      // sort ideas by AI score
  advanced_filter: false,    // min-score filter + platform filter

  // Actions
  bookmarks_unlimited: false, // bookmark without limit
  export_csv: false,          // CSV export of ideas

  // Coming soon (Pro)
  weekly_changes: false,      // weekly change archive
  email_alerts: false,        // keyword email alerts
  comparison: false,          // side-by-side compare
} as const satisfies Record<string, boolean>

export type FeatureKey = keyof typeof FEATURES

/** Numeric plan limits */
export const LIMITS = {
  bookmarks: { free: 3, pro: Infinity },
  daily_views: { free: 3, pro: Infinity },
} as const

/**
 * Check whether a plan can use a feature.
 * Use in server components directly; client components use `usePlan()`.
 */
export function can(feature: FeatureKey, isPro: boolean): boolean {
  return isPro || FEATURES[feature]
}
