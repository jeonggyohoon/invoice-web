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
