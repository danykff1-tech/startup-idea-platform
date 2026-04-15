import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  // 1. 인증 확인
  const auth = req.headers.get('authorization') ?? ''
  const token = auth.replace('Bearer ', '')

  if (token !== process.env.INGEST_SECRET) {
    return NextResponse.json({ error: '인증 실패' }, { status: 401 })
  }

  // 2. 요청 데이터 파싱
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: '잘못된 JSON' }, { status: 400 })
  }

  const {
    title,
    summary,
    source_platform,
    source_url,
    ai_score,
    pain_points,
    target_customers,
    monetization_strategies,
    tech_stack_suggestions,
    tags,
    competitive_edge,
    why_now,
    market_gap,
  } = body

  // 3. 필수 필드 확인
  if (!title || !summary || !source_platform || !source_url) {
    return NextResponse.json({ error: '필수 필드 누락' }, { status: 400 })
  }

  // 4. Supabase에 저장
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 중복 URL 체크
  const { data: existing } = await supabase
    .from('ideas')
    .select('id')
    .eq('source_url', source_url)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ message: '이미 존재하는 아이디어', id: existing.id })
  }

  // 새 아이디어 저장
  const { data, error } = await supabase
    .from('ideas')
    .insert({
      title,
      summary,
      source_platform,
      source_url,
      ai_score: ai_score ?? 50,
      pain_points: pain_points ?? [],
      target_customers: target_customers ?? [],
      monetization_strategies: monetization_strategies ?? [],
      tech_stack_suggestions: tech_stack_suggestions ?? [],
      tags: tags ?? [],
      competitive_edge: competitive_edge ?? null,
      why_now: why_now ?? null,
      market_gap: market_gap ?? null,
      is_published: true,
    })
    .select('id')
    .single()

  if (error) {
    console.error('[Ingest] DB 저장 실패', error)
    return NextResponse.json({ error: 'DB 오류' }, { status: 500 })
  }

  return NextResponse.json({ success: true, id: data.id }, { status: 201 })
}
