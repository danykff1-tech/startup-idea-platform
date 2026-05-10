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
  <h1>You've been unsubscribed</h1>
  <p>You will no longer receive daily emails from idealike.</p>
  <p><a href="https://idealike.xyz">Back to idealike.xyz</a></p>
</body></html>`,
    { headers: { 'Content-Type': 'text/html' } }
  )
}
