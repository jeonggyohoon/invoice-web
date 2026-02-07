import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { IQuoteSummary } from '@/lib/types/quote'
import { formatCurrency } from '@/lib/utils/format'
import { getStatusVariant, isExpired } from '@/lib/utils/quote'

interface RecentQuotesListProps {
  quotes: IQuoteSummary[]
}

export function RecentQuotesList({ quotes }: RecentQuotesListProps) {
  const recentQuotes = quotes.slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>최근 견적서</CardTitle>
      </CardHeader>
      <CardContent>
        {recentQuotes.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            아직 견적서가 없습니다.
          </p>
        ) : (
          <div className="space-y-3">
            {recentQuotes.map(quote => {
              const expired = isExpired(quote.validUntil)
              const variant = getStatusVariant(quote.status, expired)

              return (
                <div
                  key={quote.id}
                  className="flex items-center justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/quotes/${quote.uuid}`}
                      className="text-primary text-sm font-medium hover:underline"
                    >
                      {quote.quoteNumber}
                    </Link>
                    <p className="text-muted-foreground truncate text-sm">
                      {quote.customerName}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={variant}>
                      {expired ? '만료' : quote.status}
                    </Badge>
                    <span className="text-sm font-medium">
                      {formatCurrency(quote.totalAmount)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
