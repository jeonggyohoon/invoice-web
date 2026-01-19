import { Container } from '@/components/layout/container';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <Container size="md" className="py-8">
      {/* 견적서 헤더 스켈레톤 */}
      <div className="mb-8">
        <Skeleton className="mb-2 h-8 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* 발행자 / 고객 정보 스켈레톤 */}
      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-36" />
        </div>
      </div>

      {/* 견적 항목 테이블 스켈레톤 */}
      <div className="mb-8">
        {/* 테이블 헤더 */}
        <div className="flex border-b py-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="ml-auto h-4 w-16" />
          <Skeleton className="ml-4 h-4 w-12" />
          <Skeleton className="ml-4 h-4 w-20" />
        </div>
        {/* 테이블 행들 */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center border-b py-3">
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-4 w-20" />
            <Skeleton className="ml-4 h-4 w-8" />
            <Skeleton className="ml-4 h-4 w-24" />
          </div>
        ))}
      </div>

      {/* 합계 스켈레톤 */}
      <div className="mb-8 flex justify-end">
        <div className="w-64">
          <div className="flex justify-between border-t-2 py-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-28" />
          </div>
        </div>
      </div>

      {/* 비고 스켈레톤 */}
      <div className="rounded-lg bg-muted p-4">
        <Skeleton className="mb-2 h-5 w-12" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mt-1 h-4 w-3/4" />
      </div>
    </Container>
  );
}
