import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { User, Mail, Crown, Calendar, Shield, Bell } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import SubscribeToggle from '@/components/SubscribeToggle'

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

  // 이메일 구독 상태 확인
  const { data: emailSub } = await supabase
    .from('email_subscribers')
    .select('is_active')
    .eq('email', user.email!)
    .maybeSingle()
  const isEmailSubscribed = emailSub?.is_active ?? false

  const joinDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : ''

  const renewDate = subscription?.renews_at
    ? new Date(subscription.renews_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-foreground mb-8">My Profile</h1>

      <div className="space-y-6">
        <Card className="rounded-2xl border border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="size-5" />
              Account Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Profile"
                  className="w-16 h-16 rounded-full border border-border"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-2xl font-bold text-muted-foreground">
                  {(profile?.full_name?.[0] ?? user.email?.[0] ?? '?').toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-lg font-semibold text-foreground">
                  {profile?.full_name ?? 'User'}
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

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="size-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">Email</span>
                <span className="ml-auto text-foreground">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="size-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">Joined</span>
                <span className="ml-auto text-foreground">{joinDate}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="size-5" />
              Plan Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-foreground">
                  {isPro ? 'Pro Plan' : 'Free Plan'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {isPro
                    ? 'Unlimited access to all ideas'
                    : '3 idea analyses per day'}
                </p>
              </div>
              {isPro ? (
                <div className="text-right">
                  <span className="text-2xl font-bold text-foreground">$15</span>
                  <span className="text-sm text-muted-foreground"> /mo</span>
                </div>
              ) : (
                <div className="text-right">
                  <span className="text-2xl font-bold text-foreground">$0</span>
                  <span className="text-sm text-muted-foreground"> /mo</span>
                </div>
              )}
            </div>

            <Separator />

            {isPro && subscription ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subscription Status</span>
                  <Badge
                    variant={subscription.status === 'active' ? 'default' : 'secondary'}
                  >
                    {subscription.status === 'active' ? 'Active' :
                     subscription.status === 'on_trial' ? 'Trial' :
                     subscription.status === 'cancelled' ? 'Cancelled' :
                     subscription.status === 'paused' ? 'Paused' :
                     subscription.status}
                  </Badge>
                </div>
                {renewDate && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Next Billing Date</span>
                    <span className="text-foreground">{renewDate}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-2">
                <p className="text-sm text-muted-foreground mb-4">
                  Upgrade to Pro for unlimited access to all features.
                </p>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center h-10 px-6 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Upgrade to Pro
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
        {/* Email subscription */}
        <Card className="rounded-2xl border border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="size-5" />
              Daily Idea Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SubscribeToggle
              email={user.email!}
              initialSubscribed={isEmailSubscribed}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
