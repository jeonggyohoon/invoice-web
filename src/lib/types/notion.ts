/**
 * Notion API 응답 타입 정의
 * @see https://developers.notion.com/reference/property-value-object
 */

// ============================================
// 기본 Notion Property 타입들
// ============================================

// Rich Text 객체
export interface INotionRichText {
  type: 'text';
  text: {
    content: string;
    link: { url: string } | null;
  };
  plain_text: string;
  href: string | null;
}

// Title Property
export interface INotionTitleProperty {
  id: string;
  type: 'title';
  title: INotionRichText[];
}

// Rich Text Property
export interface INotionRichTextProperty {
  id: string;
  type: 'rich_text';
  rich_text: INotionRichText[];
}

// Number Property
export interface INotionNumberProperty {
  id: string;
  type: 'number';
  number: number | null;
}

// Select Option
export interface INotionSelectOption {
  id: string;
  name: string;
  color: string;
}

// Select Property
export interface INotionSelectProperty {
  id: string;
  type: 'select';
  select: INotionSelectOption | null;
}

// Date Property
export interface INotionDateProperty {
  id: string;
  type: 'date';
  date: {
    start: string;
    end: string | null;
    time_zone: string | null;
  } | null;
}

// Email Property
export interface INotionEmailProperty {
  id: string;
  type: 'email';
  email: string | null;
}

// Relation Property
export interface INotionRelationProperty {
  id: string;
  type: 'relation';
  relation: Array<{ id: string }>;
  has_more: boolean;
}

// Rollup Property
export interface INotionRollupProperty {
  id: string;
  type: 'rollup';
  rollup: {
    type: 'number' | 'date' | 'array';
    number: number | null;
    function: string;
  };
}

// Formula Property
export interface INotionFormulaProperty {
  id: string;
  type: 'formula';
  formula: {
    type: 'string' | 'number' | 'boolean' | 'date';
    string?: string | null;
    number?: number | null;
    boolean?: boolean | null;
    date?: { start: string; end: string | null } | null;
  };
}

// ============================================
// 견적서 (Invoices) 데이터베이스 Properties
// 실제 노션 데이터베이스 필드명과 일치
// ============================================

export interface INotionInvoiceProperties {
  '견적서 번호': INotionTitleProperty;
  '발행일': INotionDateProperty;
  '상태': INotionSelectProperty;
  '유효기간': INotionDateProperty;
  '총금액': INotionFormulaProperty | INotionRollupProperty;
  '클라이언트명': INotionRichTextProperty | INotionSelectProperty;
  '항목': INotionRelationProperty;
}

// ============================================
// 견적 항목 (Items) 데이터베이스 Properties
// 실제 노션 데이터베이스 필드명과 일치
// ============================================

export interface INotionItemProperties {
  '항목명': INotionTitleProperty;
  'invoices': INotionRelationProperty;
  '금액': INotionFormulaProperty;
  '단가': INotionNumberProperty;
  '수량': INotionNumberProperty;
}

// ============================================
// 레거시 호환용 별칭 (기존 코드 호환)
// ============================================

/** @deprecated INotionInvoiceProperties 사용 권장 */
export type INotionQuoteProperties = INotionInvoiceProperties;

/** @deprecated INotionItemProperties 사용 권장 */
export type INotionQuoteItemProperties = INotionItemProperties;

// ============================================
// Notion Page 응답 타입
// ============================================

export interface INotionPage<T> {
  object: 'page';
  id: string;
  created_time: string;
  last_edited_time: string;
  archived: boolean;
  properties: T;
  url: string;
}

// 견적서 페이지 타입
export type TNotionInvoicePage = INotionPage<INotionInvoiceProperties>;

// 견적 항목 페이지 타입
export type TNotionItemPage = INotionPage<INotionItemProperties>;

// 레거시 호환용 별칭
/** @deprecated TNotionInvoicePage 사용 권장 */
export type TNotionQuotePage = TNotionInvoicePage;

/** @deprecated TNotionItemPage 사용 권장 */
export type TNotionQuoteItemPage = TNotionItemPage;

// ============================================
// Notion Database Query 응답 타입
// ============================================

export interface INotionDatabaseQueryResponse<T> {
  object: 'list';
  results: INotionPage<T>[];
  next_cursor: string | null;
  has_more: boolean;
}

// 견적서 쿼리 응답 타입
export type TNotionInvoiceQueryResponse =
  INotionDatabaseQueryResponse<INotionInvoiceProperties>;

// 견적 항목 쿼리 응답 타입
export type TNotionItemQueryResponse =
  INotionDatabaseQueryResponse<INotionItemProperties>;

// 레거시 호환용 별칭
/** @deprecated TNotionInvoiceQueryResponse 사용 권장 */
export type TNotionQuoteQueryResponse = TNotionInvoiceQueryResponse;

/** @deprecated TNotionItemQueryResponse 사용 권장 */
export type TNotionQuoteItemQueryResponse = TNotionItemQueryResponse;

// ============================================
// 유틸리티 타입
// ============================================

// Rich Text에서 plain text 추출 헬퍼
export type TExtractPlainText<T extends INotionRichText[]> = string;

// Property 값 추출 유틸리티
export type TNotionPropertyValue =
  | INotionTitleProperty
  | INotionRichTextProperty
  | INotionNumberProperty
  | INotionSelectProperty
  | INotionDateProperty
  | INotionEmailProperty
  | INotionRelationProperty
  | INotionRollupProperty
  | INotionFormulaProperty;

// ============================================
// 도메인 모델 타입 (애플리케이션 레벨)
// Notion 응답을 정제하여 사용하는 타입
// ============================================

// 견적서 상태
export type TInvoiceStatus = '대기' | '승인' | '거절' | '만료';

// 견적 항목 (정제된 타입)
export interface IInvoiceItem {
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;
  amount: number;
}

// 견적서 (정제된 타입)
export interface IInvoice {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  validUntil: string;
  status: TInvoiceStatus;
  totalAmount: number;
  clientName: string;
  items: IInvoiceItem[];
}

// 견적서 요약 (목록용)
export interface IInvoiceSummary {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  status: TInvoiceStatus;
  totalAmount: number;
  clientName: string;
}

// ============================================
// API 응답 타입
// ============================================

// 견적서 상세 조회 응답
export interface IInvoiceDetailResponse {
  invoice: IInvoice;
}

// 견적서 목록 조회 응답
export interface IInvoiceListResponse {
  invoices: IInvoiceSummary[];
  hasMore: boolean;
  nextCursor: string | null;
}
