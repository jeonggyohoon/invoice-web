import { notFound } from 'next/navigation';

import { Container } from '@/components/layout/container';
import {
  QuoteHeader,
  QuoteParties,
  QuoteItems,
  QuoteSummary,
  QuoteActions,
} from '@/components/features/quote';
import { getQuoteByUUID } from '@/lib/notion';

interface QuotePageProps {
  params: Promise<{ uuid: string }>;
}

export default async function QuotePage({ params }: QuotePageProps) {
  const { uuid } = await params;

  // Notion API로 견적서 조회
  const quote = await getQuoteByUUID(uuid);

  if (!quote) {
    notFound();
  }

  return (
    <Container size="md" className="py-8">
      {/* 견적서 헤더 */}
      <QuoteHeader
        quoteNumber={quote.quoteNumber}
        issueDate={quote.issueDate}
        validUntil={quote.validUntil}
        status={quote.status}
      />

      {/* 발행자 / 고객 정보 */}
      <QuoteParties
        companyName={quote.companyName}
        companyAddress={quote.companyAddress}
        companyContact={quote.companyContact}
        customerName={quote.customerName}
        customerEmail={quote.customerEmail}
      />

      {/* 견적 항목 테이블 */}
      <QuoteItems items={quote.items} />

      {/* 합계 */}
      <QuoteSummary totalAmount={quote.totalAmount} notes={quote.notes} />

      {/* 액션 버튼 (인쇄/PDF 다운로드) */}
      <QuoteActions quoteNumber={quote.quoteNumber} />
    </Container>
  );
}
