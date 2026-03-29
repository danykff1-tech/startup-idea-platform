import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buildCheckoutUrl } from '@/lib/lemonsqueezy'

/**
 * POST /api/checkout
 * 로그인한 사용자의 Lemon Squeezy 체크아웃 URL을 반환합니다.
 *
 * Response: { checkoutUrl: string }
 */
export async function POST() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  // 이미 Pro인 경우 체크아웃 불필요
  const { data: profile } = await supabase
    .from('users')
    .select('is_pro')
    .eq('id', user.id)
    .single()

  if (profile?.is_pro) {
    return NextResponse.json({ error: '이미 Pro 플랜입니다.' }, { status: 400 })
  }

  const checkoutUrl = buildCheckoutUrl(user.email!, user.id)

  return NextResponse.json({ checkoutUrl })
}
