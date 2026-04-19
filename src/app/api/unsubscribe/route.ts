import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')

  if (!token) {
    return new NextResponse('Invalid unsubscribe link.', { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await supabase
    .from('email_subscribers')
    .update({ is_active: false, unsubscribed_at: new Date().toISOString() })
    .eq('unsubscribe_token', token)

  if (error) {
    return new NextResponse('Unsubscribe failed. Please try again later.', { status: 500 })
  }

  return new NextResponse(
    `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Unsubscribed — idealike</title>
<style>body{font-family:-apple-system,sans-serif;max-width:480px;margin:80px auto;padding:0 20px;text-align:center;color:#333}h1{color:#111}a{color:#0070f3}</style></head>
<body>
  <h1>구독이 취소되었습니다</h1>
  <p>더 이상 idealike 일일 이메일을 받지 않습니다.</p>
  <p><a href="https://idealike.xyz">idealike.xyz로 돌아가기</a></p>
</body></html>`,
    { headers: { 'Content-Type': 'text/html' } }
  )
}
