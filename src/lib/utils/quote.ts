import type { QuoteStatus } from '@/lib/types/quote';

/**
 * 견적서가 유효기간이 만료되었는지 확인
 * @param validUntil - 유효기간 날짜 문자열 (ISO 형식)
 * @returns 만료 여부
 */
export function isExpired(validUntil: string): boolean {
  const expiryDate = new Date(validUntil);
  const today = new Date();
  // 시간 부분을 제거하고 날짜만 비교
  today.setHours(0, 0, 0, 0);
  expiryDate.setHours(0, 0, 0, 0);
  return today > expiryDate;
}

/**
 * 견적서 상태와 만료 여부에 따라 Badge variant를 반환
 * @param status - 견적서 상태
 * @param expired - 만료 여부
 * @returns Badge variant ('pending' | 'approved' | 'rejected' | 'expired')
 */
export function getStatusVariant(
  status: QuoteStatus,
  expired: boolean
): 'pending' | 'approved' | 'rejected' | 'expired' {
  // 만료된 경우 최우선
  if (expired) {
    return 'expired';
  }

  // 상태별 variant 매핑
  switch (status) {
    case '작성중':
    case '발송완료':
      return 'pending';
    case '승인':
      return 'approved';
    case '거절':
      return 'rejected';
    default:
      return 'pending';
  }
}
