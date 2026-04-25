import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname, searchParams, origin } = request.nextUrl

  // 루트 URL에 ?code= 파라미터가 있으면 /auth/callback으로 전달
  if (pathname === '/' && searchParams.has('code')) {
    const code = searchParams.get('code')!
    const url = new URL('/auth/callback', origin)
    url.searchParams.set('code', code)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/',
}
