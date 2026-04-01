// Free user daily idea detail view limit
export const FREE_VIEWS_PER_DAY = 3

// Pro plan price
export const PRO_PRICE = 15

// Supported data source platforms
export const PLATFORMS = ['reddit', 'indiehackers', 'producthunt', 'hackernews'] as const
export type Platform = typeof PLATFORMS[number]

// Approved tag list (keep in sync with AI prompt)
export const APPROVED_TAGS = [
  'SaaS',
  'AI',
  'Commerce',
  'Marketplace',
  'Productivity',
  'Developer Tools',
  'FinTech',
  'HealthTech',
  'EdTech',
  'B2B',
  'B2C',
  'Mobile',
  'No-Code',
  'API',
  'Community',
  'Analytics',
] as const
export type Tag = typeof APPROVED_TAGS[number]

// Lemon Squeezy active subscription statuses
export const ACTIVE_SUBSCRIPTION_STATUSES = ['active', 'on_trial'] as const
