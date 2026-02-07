'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuoteActionsProps {
  quoteNumber?: string;
}

/**
 * 견적서 액션 컴포넌트
 * PDF 다운로드 버튼을 표시합니다.
 */
export function QuoteActions({ quoteNumber }: QuoteActionsProps) {
  return (
    <div className="flex justify-end">
      <Button
        onClick={() => {
          // TODO: PDF 다운로드 로직 구현 필요
          console.log('PDF 다운로드:', quoteNumber);
        }}
      >
        <Download className="mr-2 h-4 w-4" />
        PDF 다운로드
      </Button>
    </div>
  );
}
