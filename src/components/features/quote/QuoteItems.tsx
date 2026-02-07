import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency } from '@/lib/utils'
import type { IQuoteItem } from '@/lib/types/quote'

interface QuoteItemsProps {
  items: IQuoteItem[]
}

/**
 * 견적 항목 목록 컴포넌트
 * shadcn Table로 견적 항목들을 표시합니다.
 */
export function QuoteItems({ items }: QuoteItemsProps) {
  return (
    <div className="mb-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">항목</TableHead>
            <TableHead className="text-right">단가</TableHead>
            <TableHead className="text-right">수량</TableHead>
            <TableHead className="text-right">금액</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map(item => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="space-y-1">
                  <p className="font-medium">{item.itemName}</p>
                  <p className="text-muted-foreground text-sm">
                    {item.description}
                  </p>
                </div>
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(item.unitPrice)}
              </TableCell>
              <TableCell className="text-right">{item.quantity}</TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(item.amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
