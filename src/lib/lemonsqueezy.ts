import {
  lemonSqueezySetup,
  getSubscription,
  type Subscription,
} from '@lemonsqueezy/lemonsqueezy.js'

/**
 * Lemon Squeezy SDK 초기화.
 * 서버 사이드에서만 호출해야 합니다.
 */
export function initLemonSqueezy() {
  lemonSqueezySetup({
    apiKey: process.env.LEMONSQUEEZY_API_KEY!,
    onError(error) {
      console.error('[LemonSqueezy]', error)
    },
  })
}

export { getSubscription }
export type { Subscription }

/**
 * 체크아웃 URL 생성 (파라미터 주입).
 * Lemon Squeezy는 서버-사이드 세션 생성 없이 URL에 파라미터를 붙여서 사용합니다.
 *
 * @param userEmail  - 결제 폼에 미리 채울 이메일
 * @param userId     - 결제 완료 후 webhook에서 식별할 내부 사용자 ID (custom data)
 */
export function buildCheckoutUrl(userEmail: string, userId: string): string {
  const base = process.env.NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL!
  const url = new URL(base)

  // 이메일 자동 입력
  url.searchParams.set('checkout[email]', userEmail)
  // 내부 userId를 custom data로 전달 → webhook에서 수신
  url.searchParams.set('checkout[custom][user_id]', userId)

  return url.toString()
}
