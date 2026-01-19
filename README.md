# 노션 견적서 웹 뷰어 (Notion Quote Viewer)

노션에서 작성한 견적서를 클라이언트가 웹으로 확인하고 PDF로 다운로드 받을 수 있는 서비스입니다.

## 프로젝트 개요

**목적**: 노션 기반 견적서 관리 시스템으로 별도 관리 도구 없이 노션에서 직접 견적서 작성/관리

**범위**: 1인 개발자 MVP (최소 기능 제품)

**사용자**:

- **관리자**: 노션에서 견적서 작성 및 관리 (웹 어드민 없음)
- **클라이언트**: 웹 브라우저에서 견적서 확인 및 PDF 다운로드 (로그인 불필요)

## 주요 페이지

| 경로             | 설명                  |
| ---------------- | --------------------- |
| `/`              | 서비스 안내 홈페이지  |
| `/quotes/[uuid]` | UUID 기반 견적서 뷰어 |

## 핵심 기능

- **견적서 웹 뷰어**: UUID 기반 비공개 링크로 견적서 확인
- **반응형 디자인**: 모바일/데스크톱 모두 지원
- **견적서 상태 표시**: 작성중/발송완료/승인/거절/만료 배지
- **PDF 다운로드**: 브라우저에서 직접 PDF 생성 및 다운로드
- **노션 실시간 연동**: Notion API를 통한 데이터 조회

## 기술 스택

| 분류          | 기술                                    |
| ------------- | --------------------------------------- |
| **Framework** | Next.js 15.5.3 (App Router + Turbopack) |
| **Runtime**   | React 19 + TypeScript 5                 |
| **Styling**   | TailwindCSS v4 + shadcn/ui (new-york)   |
| **API 연동**  | Notion API (`@notionhq/client`)         |
| **PDF 생성**  | html2pdf.js (클라이언트 사이드)         |
| **아이콘**    | Lucide React                            |
| **개발 도구** | ESLint + Prettier + Husky + lint-staged |

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

`.env.local` 파일을 생성하고 다음 환경변수를 설정하세요:

```env
# Notion API
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_QUOTES_DB_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_QUOTE_ITEMS_DB_ID=yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy

# 앱 설정
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 3. Notion 데이터베이스 설정

#### 견적서 (Quotes) 테이블

| 속성명            | 노션 타입 | 설명                             |
| ----------------- | --------- | -------------------------------- |
| `Quote Number`    | title     | 견적서 번호 (예: Q-2024-001)     |
| `UUID`            | rich_text | 공개 링크용 고유 식별자          |
| `Customer Name`   | rich_text | 고객명/회사명                    |
| `Customer Email`  | email     | 고객 이메일                      |
| `Issue Date`      | date      | 발행일                           |
| `Valid Until`     | date      | 유효기간                         |
| `Status`          | select    | 상태 (작성중/발송완료/승인/거절) |
| `Total Amount`    | rollup    | 총 금액 (Items의 Amount 합계)    |
| `Items`           | relation  | 견적 항목 (Quote Items 연결)     |
| `Notes`           | rich_text | 비고/특이사항                    |
| `Company Name`    | rich_text | 발행 회사명                      |
| `Company Address` | rich_text | 발행 회사 주소                   |
| `Company Contact` | rich_text | 발행 회사 연락처                 |

#### 견적 항목 (Quote Items) 테이블

| 속성명        | 노션 타입 | 설명               |
| ------------- | --------- | ------------------ |
| `Item Name`   | title     | 항목명             |
| `Description` | rich_text | 항목 설명          |
| `Unit Price`  | number    | 단가               |
| `Quantity`    | number    | 수량               |
| `Amount`      | formula   | 금액 (단가 × 수량) |
| `Quote`       | relation  | 연결된 견적서      |

### 4. Notion Integration 연결

1. [Notion Integrations](https://www.notion.so/my-integrations)에서 새 Integration 생성
2. 견적서 데이터베이스에 Integration 연결 (데이터베이스 → ... → Connections → Connect to)
3. API 키를 `.env.local`에 추가

### 5. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인하세요.

## 프로젝트 구조

```
src/
├── app/
│   ├── layout.tsx              # 루트 레이아웃
│   ├── page.tsx                # 홈페이지
│   ├── globals.css             # 전역 스타일
│   └── quotes/
│       └── [uuid]/
│           ├── page.tsx        # 견적서 뷰어 페이지
│           ├── loading.tsx     # 로딩 UI
│           └── not-found.tsx   # 404 UI
├── components/
│   ├── ui/                     # shadcn/ui 컴포넌트
│   ├── quote/                  # 견적서 관련 컴포넌트
│   │   ├── quote-header.tsx    # 견적서 헤더
│   │   ├── quote-parties.tsx   # 발행자/고객 정보
│   │   ├── quote-items.tsx     # 항목 테이블
│   │   ├── quote-summary.tsx   # 합계 및 비고
│   │   └── quote-actions.tsx   # PDF 다운로드 버튼
│   └── layout/
│       └── container.tsx       # 레이아웃 컨테이너
├── lib/
│   ├── notion/
│   │   ├── client.ts           # Notion API 클라이언트
│   │   ├── queries.ts          # 데이터 조회 함수
│   │   └── transforms.ts       # 데이터 변환 함수
│   ├── pdf/
│   │   └── generator.ts        # PDF 생성 유틸리티
│   ├── types/
│   │   └── quote.ts            # 타입 정의
│   ├── utils.ts                # 공통 유틸리티
│   └── env.ts                  # 환경 변수 검증
└── hooks/
    └── use-pdf-download.ts     # PDF 다운로드 훅
```

## 스크립트

```bash
npm run dev         # 개발 서버 실행 (Turbopack)
npm run build       # 프로덕션 빌드
npm run start       # 프로덕션 서버 실행
npm run lint        # ESLint 검사
npm run check-all   # 모든 검사 통합 실행 (권장)
```

## 개발 상태

- [x] 기본 프로젝트 구조 설정
- [x] 타입 정의 완료
- [x] 홈페이지 구현
- [ ] Notion API 연동
- [ ] 견적서 뷰어 페이지 구현
- [ ] PDF 다운로드 기능 구현

## 문서

- [PRD 문서](./docs/PRD.md) - 상세 요구사항
- [개발 로드맵](./docs/ROADMAP.md) - 개발 계획
- [개발 가이드](./CLAUDE.md) - 개발 지침

## 라이선스

MIT License
