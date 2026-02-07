import { formatCurrency } from '@/lib/utils'

interface QuoteSummaryProps {
  totalAmount: number
  notes?: string
}

/**
 * 견적서 요약 컴포넌트
 * 총합계와 비고를 표시합니다.
 */
export function QuoteSummary({ totalAmount, notes }: QuoteSummaryProps) {
  return (
    <div className="space-y-8">
      {/* 총 합계 */}
      <div className="flex justify-end">
        <div className="w-full max-w-md">
          <div className="flex justify-between border-t-2 py-4 text-lg font-bold">
            <span>총 합계</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* 비고 (있을 때만 표시) */}
      {notes && (
        <div className="bg-muted rounded-lg p-4">
          <h2 className="mb-2 font-semibold">비고</h2>
          <p className="text-muted-foreground text-sm">{notes}</p>
        </div>
      )}
    </div>
  )
}
