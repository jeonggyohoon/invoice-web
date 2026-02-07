import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Container } from '@/components/layout/container'
import {
  QuoteHeader,
  QuoteParties,
  QuoteItems,
  QuoteSummary,
  QuoteActions,
} from '@/components/features/quote'
import { getQuoteByUUID } from '@/lib/notion'
import { ThemeToggle } from '@/components/common/ThemeToggle'

interface QuotePageProps {
  params: Promise<{ uuid: string }>
}

/**
 * 견적서 페이지 동적 메타데이터
 */
export async function generateMetadata({
  params,
}: QuotePageProps): Promise<Metadata> {
  const { uuid } = await params
  const quote = await getQuoteByUUID(uuid)

  if (!quote) {
    return {
      title: '견적서를 찾을 수 없습니다',
    }
  }

  return {
    title: `견적서 ${quote.quoteNumber} | 노션 견적서 웹 뷰어`,
    description: `${quote.customerName}님을 위한 견적서입니다. 발행일: ${quote.issueDate}`,
    robots: {
      index: false, // 개인 정보 보호를 위해 검색 엔진 색인 방지
      follow: false,
    },
  }
}

export default async function QuotePage({ params }: QuotePageProps) {
  const { uuid } = await params

  // Notion API로 견적서 조회
  const quote = await getQuoteByUUID(uuid)

  if (!quote) {
    notFound()
  }

  return (
    <Container size="md" className="py-8">
      {/* 테마 토글 (PDF 영역 밖) */}
      <div className="mb-4 flex justify-end print:hidden">
        <ThemeToggle />
      </div>

      {/* PDF 변환 대상 영역 */}
      <div id="quote-content">
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
      </div>

      {/* 액션 버튼 (인쇄/PDF 다운로드) - PDF에 포함되지 않음 */}
      <QuoteActions quoteNumber={quote.quoteNumber} />
    </Container>
  )
}
