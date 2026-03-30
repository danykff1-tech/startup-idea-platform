import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Check, Flame } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ShineBorder } from '@/components/ui/shine-border'
import CheckoutButton from '@/components/CheckoutButton'

const freePlanFeatures = [
  '아이디어 목록 무제한 열람',
  '하루 3개 상세 조회',
  '기본 필터 기능',
]

const proPlanFeatures = [
  '아이디어 목록 무제한 열람',
  '상세 조회 무제한',
  '모든 필터 기능',
  '신규 아이디어 알림',
  '우선 고객 지원',
]

export default async function PricingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let isPro = false
  if (user) {
    const { data: profile } = await supabase
      .from('users')
      .select('is_pro')
      .eq('id', user.id)
      .single()
    isPro = profile?.is_pro ?? false
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          플랜 선택
        </h1>
        <p className="text-lg text-muted-foreground">
          더 많은 아이디어를 탐색하고 싶다면 Pro로 업그레이드하세요
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto items-stretch">
        {/* Free 플랜 */}
        <Card className="relative h-full rounded-2xl p-8 gap-6 border border-border">
          <CardHeader className="p-0">
            <CardTitle className="text-2xl font-medium text-foreground">Free</CardTitle>
            <CardDescription className="text-base">
              시작하기에 충분한 플랜
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col flex-1 gap-6 p-0">
            <div className="flex items-baseline gap-1">
              <span className="text-foreground text-5xl font-medium">$0</span>
              <span className="text-muted-foreground text-base"> /월</span>
            </div>
            <Separator />
            <ul className="flex flex-col gap-4 flex-1">
              {freePlanFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Check className="size-4 text-primary shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <div className="w-full h-12 rounded-md flex items-center justify-center text-sm text-muted-foreground border border-border">
              {isPro ? '이전 플랜' : '현재 플랜'}
            </div>
          </CardContent>
        </Card>

        {/* Pro 플랜 - ShineBorder */}
        <ShineBorder borderWidth={2} duration={4} className="h-full">
          <Card className="relative h-full rounded-2xl p-8 gap-6 border-0 ring-0">
            <CardHeader className="p-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-medium text-primary">Pro</CardTitle>
                <Badge className="py-1 px-3 text-sm font-medium h-7 flex items-center gap-1.5">
                  <Flame size={16} /> 추천
                </Badge>
              </div>
              <CardDescription className="text-base">
                무제한으로 아이디어를 탐색하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 gap-6 p-0">
              <div className="flex items-baseline gap-1">
                <span className="text-foreground text-5xl font-medium">$9.99</span>
                <span className="text-muted-foreground text-base"> /월</span>
              </div>
              <Separator />
              <ul className="flex flex-col gap-4 flex-1">
                {proPlanFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Check className="size-4 text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              {isPro ? (
                <div className="w-full h-12 rounded-md flex items-center justify-center text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                  ✓ 현재 이용 중
                </div>
              ) : user ? (
                <CheckoutButton />
              ) : (
                <Link
                  href="/auth/login"
                  className="w-full h-12 rounded-md flex items-center justify-center text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  로그인 후 업그레이드
                </Link>
              )}
            </CardContent>
          </Card>
        </ShineBorder>
      </div>
    </main>
  )
}
