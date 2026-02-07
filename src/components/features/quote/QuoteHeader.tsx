import { Badge } from '@/components/ui/badge';
import { formatDate, isExpired, getStatusVariant } from '@/lib/utils';
import type { QuoteStatus } from '@/lib/types/quote';

interface QuoteHeaderProps {
  quoteNumber: string;
  issueDate: string;
  validUntil: string;
  status: QuoteStatus;
}

/**
 * 견적서 헤더 컴포넌트
 * 견적번호, 발행일, 유효기간, 상태 배지를 표시합니다.
 */
export function QuoteHeader({
  quoteNumber,
  issueDate,
  validUntil,
  status,
}: QuoteHeaderProps) {
  const expired = isExpired(validUntil);
  const variant = getStatusVariant(status, expired);

  // 상태 표시 텍스트 결정
  const statusText = expired ? '기간만료' : status;

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">견적서</h1>
          <p className="text-muted-foreground">견적번호: {quoteNumber}</p>
        </div>
        <Badge variant={variant}>{statusText}</Badge>
      </div>

      <div className="flex flex-col gap-1 text-sm text-muted-foreground md:flex-row md:gap-4">
        <span>발행일: {formatDate(issueDate)}</span>
        <span>유효기간: {formatDate(validUntil)}</span>
      </div>
    </div>
  );
}
