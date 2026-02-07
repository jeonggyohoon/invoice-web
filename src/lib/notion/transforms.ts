import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import type { IQuote, IQuoteItem, QuoteStatus } from '@/lib/types/quote';
import type {
  INotionRichText,
  INotionInvoiceProperties,
  INotionItemProperties,
} from '@/lib/types/notion';

/**
 * Rich Text 배열에서 plain text를 추출합니다.
 */
export function extractPlainText(richText: INotionRichText[]): string {
  return richText.map((rt) => rt.plain_text).join('');
}

/**
 * Notion Property에서 문자열 값을 추출합니다.
 */
export function extractText(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  property: any
): string {
  if (!property) return '';

  switch (property.type) {
    case 'title':
      return extractPlainText(property.title || []);
    case 'rich_text':
      return extractPlainText(property.rich_text || []);
    case 'select':
      return property.select?.name || '';
    case 'email':
      return property.email || '';
    default:
      return '';
  }
}

/**
 * Notion Property에서 숫자 값을 추출합니다.
 */
export function extractNumber(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  property: any
): number {
  if (!property) return 0;

  switch (property.type) {
    case 'number':
      return property.number ?? 0;
    case 'formula':
      return property.formula?.number ?? 0;
    case 'rollup':
      return property.rollup?.number ?? 0;
    default:
      return 0;
  }
}

/**
 * Notion Property에서 날짜 값을 추출합니다.
 */
export function extractDate(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  property: any
): string {
  if (!property || property.type !== 'date' || !property.date) return '';
  return property.date.start || '';
}

/**
 * Notion Property에서 Select 값을 추출합니다.
 */
export function extractSelect(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  property: any
): string {
  if (!property || property.type !== 'select' || !property.select) return '';
  return property.select.name || '';
}

/**
 * Notion Property에서 Relation ID 배열을 추출합니다.
 */
export function extractRelationIds(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  property: any
): string[] {
  if (!property || property.type !== 'relation') return [];
  return property.relation.map((r: { id: string }) => r.id);
}

/**
 * Notion 상태를 앱 상태로 매핑합니다.
 */
function mapStatus(notionStatus: string): QuoteStatus {
  const statusMap: Record<string, QuoteStatus> = {
    작성중: '작성중',
    발송완료: '발송완료',
    승인: '승인',
    거절: '거절',
  };
  return statusMap[notionStatus] || '작성중';
}

/**
 * Notion 견적서 페이지를 IQuote로 변환합니다.
 */
export function transformQuotePage(
  page: PageObjectResponse,
  items: IQuoteItem[] = []
): IQuote {
  const props = page.properties as unknown as INotionInvoiceProperties;

  // UUID는 페이지 ID를 사용 (하이픈 포함된 형태로 변환)
  const uuid = page.id;

  return {
    id: page.id,
    uuid,
    quoteNumber: extractText(props['견적서 번호']),
    customerName: extractText(props['클라이언트명']),
    customerEmail: '', // Notion DB에 없는 필드, 필요시 추가
    issueDate: extractDate(props['발행일']),
    validUntil: extractDate(props['유효기간']),
    status: mapStatus(extractSelect(props['상태'])),
    totalAmount: extractNumber(props['총금액']),
    items,
    notes: '', // Notion DB에 없는 필드, 필요시 추가
    companyName: '', // 환경설정 또는 고정값으로 처리
    companyAddress: '',
    companyContact: '',
  };
}

/**
 * Notion 견적 항목 페이지를 IQuoteItem으로 변환합니다.
 */
export function transformQuoteItemPage(
  page: PageObjectResponse
): IQuoteItem {
  const props = page.properties as unknown as INotionItemProperties;

  const unitPrice = extractNumber(props['단가']);
  const quantity = extractNumber(props['수량']);
  const amount = extractNumber(props['금액']) || unitPrice * quantity;

  return {
    id: page.id,
    itemName: extractText(props['항목명']),
    description: '', // Notion DB에 없는 필드
    unitPrice,
    quantity,
    amount,
  };
}
