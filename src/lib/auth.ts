import { timingSafeEqual } from 'crypto'
import { validateAdminEnv } from '@/lib/env'

// 세션 쿠키 설정
export const SESSION_COOKIE_NAME = 'admin-session'
export const SESSION_MAX_AGE = 60 * 60 * 24 // 24시간 (초)

// 쿠키 옵션
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: SESSION_MAX_AGE,
}

// 세션 토큰 생성
export function generateSessionToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('')
}

// 비밀번호 검증 (타이밍 공격 방지)
export function validatePassword(input: string): boolean {
  const { adminPassword } = validateAdminEnv()

  const inputBuffer = Buffer.from(input)
  const passwordBuffer = Buffer.from(adminPassword)

  if (inputBuffer.length !== passwordBuffer.length) {
    return false
  }

  return timingSafeEqual(inputBuffer, passwordBuffer)
}
