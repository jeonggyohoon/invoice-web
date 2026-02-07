import { NextRequest, NextResponse } from 'next/server'

const SESSION_COOKIE_NAME = 'admin-session'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)

  // 로그인 페이지: 이미 인증된 경우 /admin으로 리다이렉트
  if (pathname === '/admin/login') {
    if (sessionCookie?.value) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    return NextResponse.next()
  }

  // /admin/* 경로: 미인증 시 /admin/login으로 리다이렉트
  if (!sessionCookie?.value) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
