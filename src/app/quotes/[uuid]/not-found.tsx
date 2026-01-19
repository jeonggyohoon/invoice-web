import Link from 'next/link';
import { FileQuestion } from 'lucide-react';

import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <Container size="sm" className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <FileQuestion className="mb-6 h-16 w-16 text-muted-foreground" />

      <h1 className="mb-2 text-2xl font-bold">
        견적서를 찾을 수 없습니다
      </h1>

      <p className="mb-8 text-muted-foreground">
        요청하신 견적서가 존재하지 않거나 삭제되었습니다.
        <br />
        링크가 올바른지 확인해 주세요.
      </p>

      <Button asChild>
        <Link href="/">홈으로 돌아가기</Link>
      </Button>
    </Container>
  );
}
