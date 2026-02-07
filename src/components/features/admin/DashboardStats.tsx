import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Send, CheckCircle, XCircle, DollarSign } from 'lucide-react'
import type { IQuotesStats } from '@/lib/notion'
import { formatCurrency } from '@/lib/utils/format'

interface DashboardStatsProps {
  stats: IQuotesStats
}

const statCards = [
  {
    key: 'total',
    label: '전체 견적서',
    icon: FileText,
    color: 'text-blue-600',
  },
  { key: '작성중', label: '작성중', icon: FileText, color: 'text-amber-600' },
  { key: '발송완료', label: '발송완료', icon: Send, color: 'text-sky-600' },
  { key: '승인', label: '승인', icon: CheckCircle, color: 'text-green-600' },
  { key: '거절', label: '거절', icon: XCircle, color: 'text-red-600' },
] as const

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {statCards.map(card => {
        const value =
          card.key === 'total' ? stats.total : stats.byStatus[card.key]
        const Icon = card.icon

        return (
          <Card key={card.key}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {card.label}
              </CardTitle>
              <Icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}건</div>
            </CardContent>
          </Card>
        )
      })}

      {/* 총 금액 카드 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">총 금액</CardTitle>
          <DollarSign className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(stats.totalAmount)}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
