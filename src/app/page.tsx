import { FileText, Globe, Download, Sparkles } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-4xl space-y-12 text-center">
        {/* 히어로 섹션 */}
        <section className="space-y-6">
          <div className="bg-primary/10 mx-auto flex h-20 w-20 items-center justify-center rounded-full">
            <Sparkles className="text-primary h-10 w-10" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              노션 견적서 웹 뷰어
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg md:text-xl">
              노션에서 작성한 견적서를 클라이언트가 웹에서 확인하고
              <br className="hidden md:block" />
              PDF로 다운로드 받을 수 있는 서비스입니다.
            </p>
          </div>
        </section>

        {/* 기능 소개 섹션 */}
        <section className="grid gap-6 md:grid-cols-3">
          <Card className="text-center">
            <CardHeader className="space-y-4">
              <div className="bg-primary/10 mx-auto flex h-14 w-14 items-center justify-center rounded-full">
                <FileText className="text-primary h-7 w-7" />
              </div>
              <CardTitle className="text-xl">노션 연동</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                노션 데이터베이스와 연동하여
                <br />
                견적서 정보를 자동으로 가져옵니다.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="space-y-4">
              <div className="bg-primary/10 mx-auto flex h-14 w-14 items-center justify-center rounded-full">
                <Globe className="text-primary h-7 w-7" />
              </div>
              <CardTitle className="text-xl">웹 뷰어</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                고유 링크로 접속하여
                <br />
                깔끔한 웹 인터페이스로 견적서를 확인할 수 있습니다.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="space-y-4">
              <div className="bg-primary/10 mx-auto flex h-14 w-14 items-center justify-center rounded-full">
                <Download className="text-primary h-7 w-7" />
              </div>
              <CardTitle className="text-xl">PDF 다운로드</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                버튼 클릭 한 번으로
                <br />
                견적서를 PDF 파일로 저장할 수 있습니다.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* 안내 메시지 */}
        <section className="bg-muted mx-auto max-w-2xl rounded-lg p-6">
          <p className="text-muted-foreground text-sm">
            견적서 링크를 받으셨나요?
            <br />
            받으신 링크로 직접 접속하시면 견적서를 확인할 수 있습니다.
          </p>
          <p className="text-muted-foreground mt-3 text-xs">
            예시: {process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com'}
            /quotes/[uuid]
          </p>
        </section>
      </div>
    </div>
  )
}
