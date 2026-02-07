'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import type { QuoteStatus } from '@/lib/types/quote'

const statusOptions: { label: string; value: QuoteStatus | 'all' }[] = [
  { label: '전체', value: 'all' },
  { label: '작성중', value: '작성중' },
  { label: '발송완료', value: '발송완료' },
  { label: '승인', value: '승인' },
  { label: '거절', value: '거절' },
]

const sortOptions: { label: string; value: string }[] = [
  { label: '발행일순', value: 'issueDate' },
  { label: '금액순', value: 'totalAmount' },
]

export function QuoteFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentStatus = searchParams.get('status') ?? 'all'
  const currentSort = searchParams.get('sortBy') ?? 'issueDate'

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all' && key === 'status') {
      params.delete('status')
    } else {
      params.set(key, value)
    }
    router.push(`/admin/quotes?${params.toString()}`)
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* 상태 필터 */}
      <div className="flex flex-wrap gap-1">
        {statusOptions.map(option => (
          <Button
            key={option.value}
            variant={currentStatus === option.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateParams('status', option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>

      {/* 정렬 */}
      <div className="flex gap-1">
        {sortOptions.map(option => (
          <Button
            key={option.value}
            variant={currentSort === option.value ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => updateParams('sortBy', option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
