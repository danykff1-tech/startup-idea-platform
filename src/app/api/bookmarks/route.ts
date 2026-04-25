import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const FREE_LIMIT = 3

// POST /api/bookmarks — toggle bookmark (add or remove)
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('users')
    .select('is_pro')
    .eq('id', user.id)
    .single()

  const isPro = profile?.is_pro ?? false

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
    // Remove bookmark — always allowed
    await supabase.from('bookmarks').delete().eq('id', existing.id)
    return NextResponse.json({ bookmarked: false })
  } else {
    // Adding bookmark — check free limit
    if (!isPro) {
      const { count } = await supabase
        .from('bookmarks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      if ((count ?? 0) >= FREE_LIMIT) {
        return NextResponse.json(
          { error: 'limit_reached', limit: FREE_LIMIT },
          { status: 403 }
        )
      }
    }

    await supabase.from('bookmarks').insert({ user_id: user.id, idea_id: ideaId })
    return NextResponse.json({ bookmarked: true })
  }
}
