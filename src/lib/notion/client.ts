import { Client } from '@notionhq/client'
import { validateNotionEnv } from '@/lib/env'

// 싱글톤 인스턴스
let notionClient: Client | null = null
let dbIds: { quotesDbId: string; quoteItemsDbId: string } | null = null

/**
 * Notion 클라이언트 인스턴스를 반환합니다.
 * 싱글톤 패턴으로 구현되어 있어 항상 동일한 인스턴스를 반환합니다.
 */
export function getNotionClient(): Client {
  if (!notionClient) {
    const { apiKey } = validateNotionEnv()
    notionClient = new Client({ auth: apiKey })
  }
  return notionClient
}

/**
 * Notion 데이터베이스 ID들을 반환합니다.
 */
export function getDbIds(): { quotesDbId: string; quoteItemsDbId: string } {
  if (!dbIds) {
    const { quotesDbId, quoteItemsDbId } = validateNotionEnv()
    dbIds = { quotesDbId, quoteItemsDbId }
  }
  return dbIds
}
