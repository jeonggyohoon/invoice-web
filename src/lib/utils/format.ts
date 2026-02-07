/**
 * 금액을 한국 원화 형식으로 포맷팅
 * @param amount - 포맷팅할 금액
 * @returns 포맷팅된 금액 문자열 (예: ₩1,500,000)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount);
}

/**
 * ISO 날짜 문자열을 한국 날짜 형식으로 포맷팅
 * @param dateString - ISO 형식 날짜 문자열 (예: '2024-01-15')
 * @returns 포맷팅된 날짜 문자열 (예: '2024년 1월 15일')
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}
