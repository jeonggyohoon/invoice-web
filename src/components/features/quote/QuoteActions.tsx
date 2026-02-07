'use client';

import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { usePdfDownload } from '@/hooks/usePdfDownload';

/** PDF 변환 대상 요소 ID */
const QUOTE_CONTENT_ID = 'quote-content';

interface QuoteActionsProps {
  quoteNumber?: string;
}

/**
 * 견적서 액션 컴포넌트
 * PDF 다운로드 버튼을 표시합니다.
 */
export function QuoteActions({ quoteNumber }: QuoteActionsProps) {
  const { isLoading, error, downloadPdf } = usePdfDownload();

  // 에러 발생 시 토스트 표시
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleDownload = async () => {
    if (!quoteNumber) {
      toast.error('견적서 번호를 찾을 수 없습니다.');
      return;
    }

    await downloadPdf(QUOTE_CONTENT_ID, quoteNumber);
  };

  return (
    <div className="flex justify-end print:hidden">
      <Button onClick={handleDownload} disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            PDF 생성 중...
          </>
        ) : (
          <>
            <Download className="mr-2 h-4 w-4" />
            PDF 다운로드
          </>
        )}
      </Button>
    </div>
  );
}
