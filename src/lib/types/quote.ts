// 견적서 상태
export type QuoteStatus = '작성중' | '발송완료' | '승인' | '거절'

// 견적 항목
export interface IQuoteItem {
  id: string
  itemName: string
  description: string
  unitPrice: number
  quantity: number
  amount: number
}

// 견적서
export interface IQuote {
  id: string
  uuid: string
  quoteNumber: string
  customerName: string
  customerEmail: string
  issueDate: string
  validUntil: string
  status: QuoteStatus
  totalAmount: number
  items: IQuoteItem[]
  notes: string
  companyName: string
  companyAddress: string
  companyContact: string
}

// 견적서 목록용 경량 타입 (items, notes, companyAddress, companyContact 제외)
export interface IQuoteSummary {
  id: string
  uuid: string
  quoteNumber: string
  customerName: string
  customerEmail: string
  status: QuoteStatus
  totalAmount: number
  issueDate: string
  validUntil: string
  companyName: string
}

// 견적서 목록 필터 옵션
export interface IQuoteFilter {
  status?: QuoteStatus | 'all'
  sortBy?: 'issueDate' | 'totalAmount' | 'customerName'
  sortOrder?: 'asc' | 'desc'
}

// 견적서 목록 API 응답
export interface IQuoteListResponse {
  quotes: IQuoteSummary[]
  total: number
  hasMore: boolean
}
