import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { User, Mail, Crown, Calendar, Shield } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const isPro = profile?.is_pro ?? false
  const joinDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
    : ''

  const renewDate = subscription?.renews_at
    ? new Date(subscription.renews_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-foreground mb-8">내 프로필</h1>

      <div className="space-y-6">
        {/* 프로필 정보 */}
        <Card className="rounded-2xl border border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="size-5" />
              계정 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 아바타 & 이름 */}
            <div className="flex items-center gap-4">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="프로필"
                  className="w-16 h-16 rounded-full border border-border"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-2xl font-bold text-muted-foreground">
                  {(profile?.full_name?.[0] ?? user.email?.[0] ?? '?').toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-lg font-semibold text-foreground">
                  {profile?.full_name ?? '사용자'}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {isPro ? (
                    <Badge className="gap-1">
                      <Crown size={12} /> Pro
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Free</Badge>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* 상세 정보 */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="size-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">이메일</span>
                <span className="ml-auto text-foreground">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="size-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">가입일</span>
                <span className="ml-auto text-foreground">{joinDate}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 플랜 정보 */}
        <Card className="rounded-2xl border border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="size-5" />
              플랜 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-foreground">
                  {isPro ? 'Pro 플랜' : 'Free 플랜'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {isPro
                    ? '무제한 아이디어 열람 가능'
                    : '하루 3개 아이디어 상세 조회 가능'}
                </p>
              </div>
              {isPro ? (
                <div className="text-right">
                  <span className="text-2xl font-bold text-foreground">$9.99</span>
                  <span className="text-sm text-muted-foreground"> /월</span>
                </div>
              ) : (
                <div className="text-right">
                  <span className="text-2xl font-bold text-foreground">$0</span>
                  <span className="text-sm text-muted-foreground"> /월</span>
                </div>
              )}
            </div>

            <Separator />

            {isPro && subscription ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">구독 상태</span>
                  <Badge
                    variant={subscription.status === 'active' ? 'default' : 'secondary'}
                  >
                    {subscription.status === 'active' ? '활성' :
                     subscription.status === 'on_trial' ? '체험 중' :
                     subscription.status === 'cancelled' ? '해지 예정' :
                     subscription.status === 'paused' ? '일시정지' :
                     subscription.status}
                  </Badge>
                </div>
                {renewDate && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">다음 결제일</span>
                    <span className="text-foreground">{renewDate}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-2">
                <p className="text-sm text-muted-foreground mb-4">
                  Pro로 업그레이드하면 모든 기능을 이용할 수 있습니다.
                </p>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center h-10 px-6 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Pro 업그레이드
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
