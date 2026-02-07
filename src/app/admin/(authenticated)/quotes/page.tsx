import { Suspense } from 'react'
import { QuoteListTable, QuoteFilters } from '@/components/features/admin'
import { getAllQuotes } from '@/lib/notion'
import type {
  IQuoteFilter,
  IQuoteSummary,
  QuoteStatus,
} from '@/lib/types/quote'
import { Skeleton } from '@/components/ui/skeleton'

// 60초마다 데이터 갱신
export const revalidate = 60

interface AdminQuotesPageProps {
  searchParams: Promise<{
    status?: string
    sortBy?: string
    sortOrder?: string
  }>
}

export default async function AdminQuotesPage({
  searchParams,
}: AdminQuotesPageProps) {
  const params = await searchParams

  const filter: IQuoteFilter = {
    status: (params.status as QuoteStatus | 'all') ?? 'all',
    sortBy: (params.sortBy as IQuoteFilter['sortBy']) ?? 'issueDate',
    sortOrder: (params.sortOrder as IQuoteFilter['sortOrder']) ?? 'desc',
  }

  let quotes: IQuoteSummary[]
  try {
    quotes = await getAllQuotes(filter)
  } catch (error) {
    console.error('견적서 목록 조회 실패:', error)
    quotes = []
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">견적서 관리</h1>
        <p className="text-muted-foreground mt-1">
          전체 견적서 목록을 관리하세요.
        </p>
      </div>

      <Suspense fallback={<Skeleton className="h-10 w-full" />}>
        <QuoteFilters />
      </Suspense>

      <QuoteListTable quotes={quotes} />
    </div>
  )
}
