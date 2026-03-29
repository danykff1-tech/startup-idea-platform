import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

/**
 * POST /api/webhooks/lemonsqueezy
 * Lemon Squeezy에서 발송하는 구독 관련 Webhook 수신.
 *
 * 처리 이벤트:
 *  - subscription_created
 *  - subscription_updated
 *  - subscription_cancelled
 *  - subscription_resumed
 *  - subscription_expired
 *  - subscription_paused
 *  - subscription_unpaused
 */
export async function POST(req: NextRequest) {
  // ── 1. 서명 검증 ────────────────────────────────────────────
  const rawBody = await req.text()
  const signature = req.headers.get('x-signature') ?? ''
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!

  const hmac = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex')

  if (!crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(signature))) {
    console.error('[LemonSqueezy Webhook] 서명 불일치')
    return NextResponse.json({ error: '서명 불일치' }, { status: 401 })
  }

  // ── 2. 이벤트 파싱 ──────────────────────────────────────────
  const payload = JSON.parse(rawBody)
  const eventName: string = payload.meta?.event_name ?? ''
  const attrs = payload.data?.attributes ?? {}
  const customData = payload.meta?.custom_data ?? {}

  // custom data로 전달한 내부 userId
  const userId: string | undefined = customData.user_id

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // ── 3. 이벤트별 처리 ────────────────────────────────────────
  const subscriptionEvents = [
    'subscription_created',
    'subscription_updated',
    'subscription_resumed',
    'subscription_unpaused',
    'subscription_cancelled',
    'subscription_expired',
    'subscription_paused',
  ]

  if (!subscriptionEvents.includes(eventName)) {
    // 알 수 없는 이벤트는 200으로 응답(재시도 방지)
    return NextResponse.json({ received: true })
  }

  if (!userId) {
    console.error('[LemonSqueezy Webhook] custom_data.user_id 누락')
    return NextResponse.json({ error: 'user_id 누락' }, { status: 400 })
  }

  const lemonSubscriptionId = String(payload.data?.id)
  const lemonCustomerId = String(attrs.customer_id)
  const lemonOrderId = String(attrs.order_id)
  const lemonProductId = String(attrs.product_id)
  const lemonVariantId = String(attrs.variant_id)
  const status: string = attrs.status          // active | paused | cancelled | ...
  const currentPeriodStart: string = attrs.created_at
  const currentPeriodEnd: string = attrs.renews_at ?? attrs.ends_at
  const trialEndsAt: string | null = attrs.trial_ends_at ?? null
  const renewsAt: string | null = attrs.renews_at ?? null
  const endsAt: string | null = attrs.ends_at ?? null

  // subscriptions 테이블 upsert
  const { error: upsertError } = await supabase
    .from('subscriptions')
    .upsert(
      {
        user_id: userId,
        lemon_subscription_id: lemonSubscriptionId,
        lemon_customer_id: lemonCustomerId,
        lemon_order_id: lemonOrderId,
        lemon_product_id: lemonProductId,
        lemon_variant_id: lemonVariantId,
        status,
        current_period_start: currentPeriodStart,
        current_period_end: currentPeriodEnd,
        trial_ends_at: trialEndsAt,
        renews_at: renewsAt,
        ends_at: endsAt,
      },
      { onConflict: 'lemon_subscription_id' }
    )

  if (upsertError) {
    console.error('[LemonSqueezy Webhook] subscriptions upsert 실패', upsertError)
    return NextResponse.json({ error: 'DB 오류' }, { status: 500 })
  }

  // users.is_pro 및 lemon_customer_id 동기화
  const isPro = ['active', 'on_trial'].includes(status)

  const { error: updateError } = await supabase
    .from('users')
    .update({
      is_pro: isPro,
      lemon_customer_id: lemonCustomerId,
    })
    .eq('id', userId)

  if (updateError) {
    console.error('[LemonSqueezy Webhook] users 업데이트 실패', updateError)
    return NextResponse.json({ error: 'DB 오류' }, { status: 500 })
  }

  console.log(`[LemonSqueezy Webhook] ${eventName} 처리 완료 | userId=${userId} | status=${status}`)
  return NextResponse.json({ received: true })
}
