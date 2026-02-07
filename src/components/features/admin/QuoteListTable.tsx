'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { FileText } from 'lucide-react'
import { CopyLinkButton } from './CopyLinkButton'
import type { IQuoteSummary } from '@/lib/types/quote'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import { getStatusVariant, isExpired } from '@/lib/utils/quote'

interface QuoteListTableProps {
  quotes: IQuoteSummary[]
}

export function QuoteListTable({ quotes }: QuoteListTableProps) {
  if (quotes.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="text-muted-foreground mb-4 h-12 w-12" />
          <p className="text-muted-foreground text-lg font-medium">
            견적서가 없습니다
          </p>
          <p className="text-muted-foreground mt-1 text-sm">
            노션에서 새 견적서를 작성해보세요.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      {/* 데스크톱 테이블 */}
      <div className="hidden md:block">
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>견적서 번호</TableHead>
                <TableHead>고객명</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="text-right">총 금액</TableHead>
                <TableHead>발행일</TableHead>
                <TableHead>유효기간</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotes.map(quote => {
                const expired = isExpired(quote.validUntil)
                const variant = getStatusVariant(quote.status, expired)

                return (
                  <TableRow key={quote.id}>
                    <TableCell>
                      <Link
                        href={`/quotes/${quote.uuid}`}
                        className="text-primary hover:underline"
                      >
                        {quote.quoteNumber}
                      </Link>
                    </TableCell>
                    <TableCell>{quote.customerName}</TableCell>
                    <TableCell>
                      <Badge variant={variant}>
                        {expired ? '만료' : quote.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(quote.totalAmount)}
                    </TableCell>
                    <TableCell>{formatDate(quote.issueDate)}</TableCell>
                    <TableCell>{formatDate(quote.validUntil)}</TableCell>
                    <TableCell>
                      <CopyLinkButton uuid={quote.uuid} />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* 모바일 카드 */}
      <div className="space-y-3 md:hidden">
        {quotes.map(quote => {
          const expired = isExpired(quote.validUntil)
          const variant = getStatusVariant(quote.status, expired)

          return (
            <Card key={quote.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <Link
                      href={`/quotes/${quote.uuid}`}
                      className="text-primary text-sm font-medium hover:underline"
                    >
                      {quote.quoteNumber}
                    </Link>
                    <p className="mt-1 text-sm font-medium">
                      {quote.customerName}
                    </p>
                  </div>
                  <Badge variant={variant}>
                    {expired ? '만료' : quote.status}
                  </Badge>
                </div>
                <div className="text-muted-foreground mt-3 flex items-center justify-between text-sm">
                  <span>{formatDate(quote.issueDate)}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-medium">
                      {formatCurrency(quote.totalAmount)}
                    </span>
                    <CopyLinkButton uuid={quote.uuid} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </>
  )
}
