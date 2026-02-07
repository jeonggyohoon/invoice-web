import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface QuotePartiesProps {
  companyName: string
  companyAddress: string
  companyContact: string
  customerName: string
  customerEmail: string
}

/**
 * 견적서 당사자 정보 컴포넌트
 * 발행자(회사)와 고객 정보를 Card로 표시합니다.
 */
export function QuoteParties({
  companyName,
  companyAddress,
  companyContact,
  customerName,
  customerEmail,
}: QuotePartiesProps) {
  return (
    <div className="mb-8 grid gap-6 md:grid-cols-2">
      {/* 발행자 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">발행자</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <p className="font-medium">{companyName}</p>
          <p className="text-muted-foreground text-sm">{companyAddress}</p>
          <p className="text-muted-foreground text-sm">{companyContact}</p>
        </CardContent>
      </Card>

      {/* 고객 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">고객</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <p className="font-medium">{customerName}</p>
          <p className="text-muted-foreground text-sm">{customerEmail}</p>
        </CardContent>
      </Card>
    </div>
  )
}
