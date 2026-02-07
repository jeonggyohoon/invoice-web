import { DashboardStats } from '@/components/features/admin/DashboardStats'
import { RecentQuotesList } from '@/components/features/admin/RecentQuotesList'
import { getAllQuotes, getQuotesStats } from '@/lib/notion'
import type { IQuoteSummary } from '@/lib/types/quote'

// 60초마다 데이터 갱신
export const revalidate = 60

export default async function AdminDashboardPage() {
  let quotes: IQuoteSummary[]
  try {
    quotes = await getAllQuotes()
  } catch (error) {
    console.error('대시보드 데이터 조회 실패:', error)
    quotes = []
  }

  const stats = getQuotesStats(quotes)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">대시보드</h1>
        <p className="text-muted-foreground mt-1">
          견적서 현황을 한눈에 확인하세요.
        </p>
      </div>

      <DashboardStats stats={stats} />
      <RecentQuotesList quotes={quotes} />
    </div>
  )
}
