import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const maxDuration = 60

interface Idea {
  id: string
  title: string
  summary: string
  tags: string[]
  ai_score: number | null
  competitive_edge: string | null
  why_now: string | null
}

interface Subscriber {
  id: string
  email: string
  unsubscribe_token: string
}

function renderEmailHtml(idea: Idea, subscriber: Subscriber, baseUrl: string): string {
  const unsubUrl = `${baseUrl}/api/unsubscribe?token=${subscriber.unsubscribe_token}`
  const ideaUrl = `${baseUrl}/ideas/${idea.id}`
  const tags = (idea.tags ?? []).slice(0, 3).join(' · ')

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${idea.title}</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1a1a1a">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 20px">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;max-width:600px">

          <!-- Header -->
          <tr>
            <td style="background:#1a1a1a;padding:24px;text-align:left">
              <div style="color:#fff;font-size:20px;font-weight:700">idealike</div>
              <div style="color:#999;font-size:12px;margin-top:4px">오늘의 아이디어 · Daily pick</div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 28px">
              ${idea.ai_score != null ? `
              <div style="display:inline-block;background:#fef3c7;color:#92400e;font-size:12px;font-weight:600;padding:4px 12px;border-radius:999px;margin-bottom:16px">
                ✦ AI Score ${idea.ai_score}/100${tags ? ` · ${tags}` : ''}
              </div>` : ''}

              <h1 style="font-size:24px;line-height:1.3;margin:0 0 16px;color:#111">
                ${escapeHtml(idea.title)}
              </h1>
              <p style="font-size:15px;line-height:1.65;color:#444;margin:0 0 24px">
                ${escapeHtml(idea.summary)}
              </p>

              ${idea.competitive_edge ? `
              <div style="background:#f9fafb;border-left:3px solid #3b82f6;padding:14px 16px;border-radius:6px;margin-bottom:16px">
                <div style="font-size:12px;font-weight:600;color:#3b82f6;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.05em">Competitive Edge</div>
                <div style="font-size:14px;line-height:1.6;color:#333">${escapeHtml(idea.competitive_edge)}</div>
              </div>` : ''}

              ${idea.why_now ? `
              <div style="background:#f9fafb;border-left:3px solid #10b981;padding:14px 16px;border-radius:6px;margin-bottom:24px">
                <div style="font-size:12px;font-weight:600;color:#10b981;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.05em">Why Now?</div>
                <div style="font-size:14px;line-height:1.6;color:#333">${escapeHtml(idea.why_now)}</div>
              </div>` : ''}

              <!-- CTA -->
              <div style="text-align:center;margin:24px 0 8px">
                <a href="${ideaUrl}" style="display:inline-block;background:#111;color:#fff;font-size:14px;font-weight:600;padding:13px 28px;border-radius:10px;text-decoration:none">
                  전체 분석 보기 →
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#fafafa;padding:20px 28px;text-align:center;border-top:1px solid #eee">
              <p style="font-size:12px;color:#888;margin:0 0 8px">
                매일 아침, AI가 고른 사업 아이디어 한 건.
              </p>
              <p style="font-size:11px;color:#aaa;margin:0">
                <a href="${unsubUrl}" style="color:#888;text-decoration:underline">구독 취소</a>
                &nbsp;·&nbsp;
                <a href="${baseUrl}" style="color:#888;text-decoration:underline">idealike.xyz</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

async function sendEmailViaResend(to: string, subject: string, html: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL ?? 'idealike <noreply@idealike.xyz>',
      to,
      subject,
      html,
    }),
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`Resend API 오류: ${res.status} ${errorText}`)
  }
  return res.json()
}

// Vercel Cron은 GET으로 호출 → POST를 재사용
export async function GET(req: NextRequest) {
  return POST(req)
}

export async function POST(req: NextRequest) {
  // 인증 — CRON_SECRET 일치 체크
  // Vercel Cron: Authorization: Bearer <CRON_SECRET>
  // 수동 테스트: 동일한 헤더 사용
  const auth = req.headers.get('authorization') ?? ''
  const headerToken = auth.replace('Bearer ', '').trim()
  const queryToken = new URL(req.url).searchParams.get('secret') ?? ''
  const token = headerToken || queryToken

  if (token !== process.env.CRON_SECRET) {
    return NextResponse.json({
      error: '인증 실패',
      received: token || '(없음)',
      expected_length: process.env.CRON_SECRET?.length ?? 0,
    }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://idealike.xyz'

  // 1) 활성 구독자 조회
  const { data: subscribers, error: subError } = await supabase
    .from('email_subscribers')
    .select('id, email, unsubscribe_token')
    .eq('is_active', true)

  if (subError) {
    return NextResponse.json({ error: '구독자 조회 실패', detail: subError.message }, { status: 500 })
  }
  if (!subscribers || subscribers.length === 0) {
    return NextResponse.json({ success: true, sent: 0, message: '활성 구독자 없음' })
  }

  // 2) 발행된 아이디어 전체 조회 (최신 200개)
  const { data: allIdeas, error: ideasError } = await supabase
    .from('ideas')
    .select('id, title, summary, tags, ai_score, competitive_edge, why_now, created_at')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(200)

  if (ideasError || !allIdeas || allIdeas.length === 0) {
    return NextResponse.json({ error: '아이디어 없음' }, { status: 500 })
  }

  let sentCount = 0
  const failures: { email: string; error: string }[] = []

  // 3) 구독자별로 아직 안 보낸 아이디어 중 1건 선택 → 전송 → 기록
  for (const sub of subscribers) {
    try {
      // 해당 구독자가 이미 받은 idea_id 목록
      const { data: sentRows } = await supabase
        .from('email_sent_ideas')
        .select('idea_id')
        .eq('subscriber_id', sub.id)

      const sentIds = new Set((sentRows ?? []).map((r: { idea_id: string }) => r.idea_id))

      // 미전송 아이디어 중 AI Score 가장 높은 것 하나 선택
      const unsent = allIdeas
        .filter((i) => !sentIds.has(i.id))
        .sort((a, b) => (b.ai_score ?? 0) - (a.ai_score ?? 0))

      if (unsent.length === 0) {
        // 모든 아이디어를 다 받은 구독자 → 건너뜀
        continue
      }

      const picked = unsent[0]
      const html = renderEmailHtml(picked, sub, baseUrl)
      const subject = `✦ ${picked.title}`

      await sendEmailViaResend(sub.email, subject, html)

      // 전송 기록 저장
      await supabase.from('email_sent_ideas').insert({
        subscriber_id: sub.id,
        idea_id: picked.id,
      })

      sentCount++
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : String(e)
      failures.push({ email: sub.email, error: errMsg })
      console.error(`[send-daily-email] ${sub.email} 전송 실패:`, errMsg)
    }
  }

  return NextResponse.json({
    success: true,
    sent: sentCount,
    total: subscribers.length,
    failures,
  })
}
