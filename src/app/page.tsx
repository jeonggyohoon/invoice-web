import { FileText } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
            <FileText className="text-primary h-8 w-8" />
          </div>
          <CardTitle className="text-2xl">노션 견적서 웹 뷰어</CardTitle>
          <CardDescription className="text-base">
            노션에서 작성한 견적서를 웹에서 확인하고
            <br />
            PDF로 다운로드 받을 수 있는 서비스입니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-muted-foreground text-sm">
              견적서 링크를 받으셨나요?
              <br />
              받으신 링크로 직접 접속하시면 견적서를 확인할 수 있습니다.
            </p>
          </div>
          <div className="text-muted-foreground text-xs">
            예시: {process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com'}
            /quotes/[uuid]
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
