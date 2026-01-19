import { notFound } from 'next/navigation';

import { Container } from '@/components/layout/container';
import type { IQuote, IQuoteItem } from '@/lib/types/quote';

interface QuotePageProps {
  params: Promise<{ uuid: string }>;
}

// 더미 데이터 (추후 Notion API로 교체 예정)
const getDummyQuote = (uuid: string): IQuote | null => {
  // 테스트용 더미 데이터
  if (uuid === 'not-found') {
    return null;
  }

  const dummyItems: IQuoteItem[] = [
    {
      id: '1',
      itemName: '웹사이트 디자인',
      description: '반응형 웹사이트 UI/UX 디자인',
      unitPrice: 1500000,
      quantity: 1,
      amount: 1500000,
    },
    {
      id: '2',
      itemName: '프론트엔드 개발',
      description: 'Next.js 기반 웹 애플리케이션 개발',
      unitPrice: 3000000,
      quantity: 1,
      amount: 3000000,
    },
  ];

  return {
    id: '1',
    uuid,
    quoteNumber: 'Q-2024-001',
    customerName: '홍길동',
    customerEmail: 'hong@example.com',
    issueDate: '2024-01-15',
    validUntil: '2024-02-15',
    status: '발송완료',
    totalAmount: 4500000,
    items: dummyItems,
    notes: '본 견적서는 발행일로부터 30일간 유효합니다.',
    companyName: '테크 스튜디오',
    companyAddress: '서울특별시 강남구 테헤란로 123',
    companyContact: 'contact@techstudio.kr',
  };
};

// 금액 포맷팅
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount);
};

export default async function QuotePage({ params }: QuotePageProps) {
  const { uuid } = await params;

  // 견적서 조회 (추후 Notion API로 교체)
  const quote = getDummyQuote(uuid);

  if (!quote) {
    notFound();
  }

  return (
    <Container size="md" className="py-8">
      {/* 견적서 헤더 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">견적서</h1>
        <p className="text-muted-foreground">
          견적번호: {quote.quoteNumber}
        </p>
      </div>

      {/* 발행자 / 고객 정보 */}
      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="mb-2 font-semibold">발행자</h2>
          <p>{quote.companyName}</p>
          <p className="text-sm text-muted-foreground">{quote.companyAddress}</p>
          <p className="text-sm text-muted-foreground">{quote.companyContact}</p>
        </div>
        <div>
          <h2 className="mb-2 font-semibold">고객</h2>
          <p>{quote.customerName}</p>
          <p className="text-sm text-muted-foreground">{quote.customerEmail}</p>
        </div>
      </div>

      {/* 견적 항목 테이블 */}
      <div className="mb-8 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">항목</th>
              <th className="py-2 text-right">단가</th>
              <th className="py-2 text-right">수량</th>
              <th className="py-2 text-right">금액</th>
            </tr>
          </thead>
          <tbody>
            {quote.items.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-3">
                  <p className="font-medium">{item.itemName}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </td>
                <td className="py-3 text-right">
                  {formatCurrency(item.unitPrice)}
                </td>
                <td className="py-3 text-right">{item.quantity}</td>
                <td className="py-3 text-right font-medium">
                  {formatCurrency(item.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 합계 */}
      <div className="mb-8 flex justify-end">
        <div className="w-64">
          <div className="flex justify-between border-t-2 py-2 text-lg font-bold">
            <span>총 합계</span>
            <span>{formatCurrency(quote.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* 비고 */}
      {quote.notes && (
        <div className="rounded-lg bg-muted p-4">
          <h2 className="mb-2 font-semibold">비고</h2>
          <p className="text-sm text-muted-foreground">{quote.notes}</p>
        </div>
      )}
    </Container>
  );
}
