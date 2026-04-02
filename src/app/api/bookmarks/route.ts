import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/bookmarks — toggle bookmark (add or remove)
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Pro check
  const { data: profile } = await supabase
    .from('users')
    .select('is_pro')
    .eq('id', user.id)
    .single()

  if (!profile?.is_pro) {
    return NextResponse.json({ error: 'Pro plan required' }, { status: 403 })
  }

  const { ideaId } = await req.json()
  if (!ideaId) {
    return NextResponse.json({ error: 'ideaId required' }, { status: 400 })
  }

  // Check if already bookmarked
  const { data: existing } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', user.id)
    .eq('idea_id', ideaId)
    .maybeSingle()

  if (existing) {
    // Remove bookmark
    await supabase.from('bookmarks').delete().eq('id', existing.id)
    return NextResponse.json({ bookmarked: false })
  } else {
    // Add bookmark
    await supabase.from('bookmarks').insert({ user_id: user.id, idea_id: ideaId })
    return NextResponse.json({ bookmarked: true })
  }
}
