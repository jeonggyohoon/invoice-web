import { NextRequest, NextResponse } from 'next/server'
import {
  validatePassword,
  generateSessionToken,
  SESSION_COOKIE_NAME,
  COOKIE_OPTIONS,
} from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { password } = (await request.json()) as { password: string }

    if (!password || !validatePassword(password)) {
      return NextResponse.json(
        { error: '비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      )
    }

    const token = generateSessionToken()
    const response = NextResponse.json({ success: true })

    response.cookies.set(SESSION_COOKIE_NAME, token, COOKIE_OPTIONS)

    return response
  } catch {
    return NextResponse.json(
      { error: '로그인 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
