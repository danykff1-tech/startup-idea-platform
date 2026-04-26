import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 간단한 이메일 형식 검증
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: NextRequest) {
  let body: { email?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: '잘못된 요청' }, { status: 400 })
  }

  const email = (body.email ?? '').trim().toLowerCase()

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: '올바른 이메일을 입력해주세요.' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 기존 구독자 확인
  const { data: existing } = await supabase
    .from('email_subscribers')
    .select('id, is_active')
    .eq('email', email)
    .maybeSingle()

  if (existing) {
    if (existing.is_active) {
      return NextResponse.json({ success: true, already: true })
    }
    // 비활성화된 구독자 재활성화
    const { error } = await supabase
      .from('email_subscribers')
      .update({ is_active: true, unsubscribed_at: null })
      .eq('id', existing.id)

    if (error) {
      console.error('[Subscribe] 재활성화 실패', error)
      return NextResponse.json({ error: '구독 처리 중 오류' }, { status: 500 })
    }
    return NextResponse.json({ success: true, resubscribed: true })
  }

  // 신규 구독
  const { error } = await supabase
    .from('email_subscribers')
    .insert({ email })

  if (error) {
    console.error('[Subscribe] DB 저장 실패', error)
    return NextResponse.json({ error: '구독 처리 중 오류' }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 201 })
}

// DELETE /api/subscribe — 로그인된 유저가 직접 구독 취소
export async function DELETE(req: NextRequest) {
  let body: { email?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: '잘못된 요청' }, { status: 400 })
  }

  const email = (body.email ?? '').trim().toLowerCase()
  if (!email) return NextResponse.json({ error: '이메일 필요' }, { status: 400 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  await supabase
    .from('email_subscribers')
    .update({ is_active: false })
    .eq('email', email)

  return NextResponse.json({ success: true })
}
