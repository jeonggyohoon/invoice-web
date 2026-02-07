import { z } from 'zod'

// 노션 견적서 웹 뷰어 환경 변수 스키마
// 빌드 시에는 optional로 처리하고, 런타임에서 필요한 경우에만 검증
const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  // Notion API 설정 (서버 사이드 전용)
  NOTION_API_KEY: z.string().optional(),
  NOTION_QUOTES_DB_ID: z.string().optional(),
  NOTION_QUOTE_ITEMS_DB_ID: z.string().optional(),

  // 앱 설정
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  VERCEL_URL: z.string().optional(),

  // 관리자 인증
  ADMIN_PASSWORD: z.string().optional(),
})

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NOTION_API_KEY: process.env.NOTION_API_KEY,
  NOTION_QUOTES_DB_ID: process.env.NOTION_QUOTES_DB_ID,
  NOTION_QUOTE_ITEMS_DB_ID: process.env.NOTION_QUOTE_ITEMS_DB_ID,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  VERCEL_URL: process.env.VERCEL_URL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
})

export type Env = z.infer<typeof envSchema>

// 관리자 환경 변수 검증 헬퍼 (런타임에서 사용)
export function validateAdminEnv() {
  if (!env.ADMIN_PASSWORD) {
    throw new Error('ADMIN_PASSWORD 환경 변수가 설정되지 않았습니다.')
  }
  return {
    adminPassword: env.ADMIN_PASSWORD,
  }
}

// Notion API 환경 변수 검증 헬퍼 (런타임에서 사용)
export function validateNotionEnv() {
  if (!env.NOTION_API_KEY) {
    throw new Error('NOTION_API_KEY 환경 변수가 설정되지 않았습니다.')
  }
  if (!env.NOTION_QUOTES_DB_ID) {
    throw new Error('NOTION_QUOTES_DB_ID 환경 변수가 설정되지 않았습니다.')
  }
  if (!env.NOTION_QUOTE_ITEMS_DB_ID) {
    throw new Error('NOTION_QUOTE_ITEMS_DB_ID 환경 변수가 설정되지 않았습니다.')
  }
  return {
    apiKey: env.NOTION_API_KEY,
    quotesDbId: env.NOTION_QUOTES_DB_ID,
    quoteItemsDbId: env.NOTION_QUOTE_ITEMS_DB_ID,
  }
}
