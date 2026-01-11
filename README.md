# 노션 견적서 웹 뷰어

노션에서 작성한 견적서를 클라이언트가 웹으로 확인하고 PDF로 다운로드 받을 수 있는 서비스입니다.

## 주요 기능

- **견적서 웹 뷰어**: UUID 기반 고유 링크로 견적서 확인
- **PDF 다운로드**: 브라우저에서 직접 PDF 생성 및 다운로드
- **노션 연동**: Notion API를 통한 실시간 데이터 조회
- **반응형 디자인**: 모바일/데스크톱 모두 지원

## 기술 스택

- **Framework**: Next.js 15.5.3 (App Router + Turbopack)
- **Runtime**: React 19 + TypeScript 5
- **Styling**: TailwindCSS v4 + shadcn/ui
- **API**: Notion API (`@notionhq/client`)
- **PDF**: html2pdf.js (클라이언트 사이드)

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

`.env.local` 파일을 생성하고 다음 환경변수를 설정하세요:

```env
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_QUOTES_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_ITEMS_DATABASE_ID=yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
```

### 3. Notion Integration 설정

1. [Notion Integrations](https://www.notion.so/my-integrations)에서 새 Integration 생성
2. 견적서 데이터베이스에 Integration 연결 (데이터베이스 → ... → Connections → Connect to)
3. API 키를 `.env.local`에 추가

### 4. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인하세요.

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── quotes/[uuid]/     # 견적서 뷰어 페이지
│   └── api/               # API Routes
├── components/            # React 컴포넌트
│   ├── ui/               # shadcn/ui 컴포넌트
│   └── quotes/           # 견적서 관련 컴포넌트
└── lib/                   # 유틸리티
    ├── notion/           # Notion API 클라이언트
    └── pdf/              # PDF 생성 유틸리티
```

## 스크립트

```bash
npm run dev         # 개발 서버 실행
npm run build       # 프로덕션 빌드
npm run start       # 프로덕션 서버 실행
npm run lint        # ESLint 검사
npm run check-all   # 모든 검사 실행
```

## 라이선스

MIT License
