// 무료 사용자 일일 아이디어 상세 조회 제한
export const FREE_VIEWS_PER_DAY = 3

// 지원 데이터 소스 플랫폼
export const PLATFORMS = ['reddit', 'indiehackers', 'producthunt'] as const
export type Platform = typeof PLATFORMS[number]

// 승인된 태그 목록 (AI 프롬프트와 동일하게 유지)
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

// Lemon Squeezy 구독 활성 상태
export const ACTIVE_SUBSCRIPTION_STATUSES = ['active', 'on_trial'] as const
