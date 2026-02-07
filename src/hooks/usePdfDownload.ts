'use client';

import { useCallback, useState } from 'react';
import { generatePdf, generateQuotePdfFilename } from '@/lib/pdf/generator';

interface UsePdfDownloadReturn {
  /** PDF 다운로드 진행 중 여부 */
  isLoading: boolean;
  /** 에러 메시지 */
  error: string | null;
  /** PDF 다운로드 실행 함수 */
  downloadPdf: (elementId: string, quoteNumber: string) => Promise<void>;
}

/**
 * PDF 다운로드를 위한 커스텀 훅
 * 로딩 상태와 에러 처리를 관리합니다.
 */
export function usePdfDownload(): UsePdfDownloadReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadPdf = useCallback(
    async (elementId: string, quoteNumber: string) => {
      setIsLoading(true);
      setError(null);

      try {
        // PDF 변환 대상 요소 찾기
        const element = document.getElementById(elementId);
        if (!element) {
          throw new Error(`PDF 변환 대상 요소를 찾을 수 없습니다: #${elementId}`);
        }

        // 파일명 생성
        const filename = generateQuotePdfFilename(quoteNumber);

        // PDF 생성 및 다운로드
        await generatePdf(element, filename);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'PDF 다운로드 중 오류가 발생했습니다.';
        setError(errorMessage);
        console.error('PDF 다운로드 오류:', err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { isLoading, error, downloadPdf };
}
