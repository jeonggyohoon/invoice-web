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
// 견적서 (Quotes) 데이터베이스 Properties
// ============================================

export interface INotionQuoteProperties {
  'Quote Number': INotionTitleProperty;
  UUID: INotionRichTextProperty;
  'Customer Name': INotionRichTextProperty;
  'Customer Email': INotionEmailProperty;
  'Issue Date': INotionDateProperty;
  'Valid Until': INotionDateProperty;
  Status: INotionSelectProperty;
  'Total Amount': INotionRollupProperty;
  Items: INotionRelationProperty;
  Notes: INotionRichTextProperty;
  'Company Name': INotionRichTextProperty;
  'Company Address': INotionRichTextProperty;
  'Company Contact': INotionRichTextProperty;
}

// ============================================
// 견적 항목 (Quote Items) 데이터베이스 Properties
// ============================================

export interface INotionQuoteItemProperties {
  'Item Name': INotionTitleProperty;
  Description: INotionRichTextProperty;
  'Unit Price': INotionNumberProperty;
  Quantity: INotionNumberProperty;
  Amount: INotionFormulaProperty;
  Quote: INotionRelationProperty;
}

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
export type TNotionQuotePage = INotionPage<INotionQuoteProperties>;

// 견적 항목 페이지 타입
export type TNotionQuoteItemPage = INotionPage<INotionQuoteItemProperties>;

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
export type TNotionQuoteQueryResponse =
  INotionDatabaseQueryResponse<INotionQuoteProperties>;

// 견적 항목 쿼리 응답 타입
export type TNotionQuoteItemQueryResponse =
  INotionDatabaseQueryResponse<INotionQuoteItemProperties>;

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
