# 노션 견적서 웹 뷰어 - MVP PRD

## 📋 프로젝트 개요

**프로젝트명**: 노션 견적서 웹 뷰어 (Notion Quote Viewer)

**목표**: 노션에서 작성한 견적서를 클라이언트가 웹으로 확인하고 PDF로 다운로드 받을 수 있는 서비스

**개발 범위**: 1인 개발자 MVP (최소 기능 제품)

**예상 개발 기간**: 2-3일

---

## 🎯 핵심 가치 제안

1. **노션 기반 견적서 관리**: 별도 관리 시스템 없이 노션에서 직접 견적서 작성/관리
2. **간편한 공유**: UUID 기반 비공개 링크로 클라이언트에게 견적서 공유
3. **전문적인 견적서 뷰어**: 깔끔한 웹 페이지로 견적서 확인
4. **PDF 다운로드**: 클라이언트가 직접 PDF로 저장 가능

---

## 👥 사용자 정의

### 1. 관리자 (견적서 발행자)

- **사용 환경**: 노션 (웹/앱)
- **주요 행동**: 견적서 작성, 수정, 링크 공유
- **특징**: 이 서비스의 웹 어드민 페이지 없음 (노션에서 직접 관리)

### 2. 클라이언트 (견적서 수신자)

- **사용 환경**: 웹 브라우저 (데스크톱/모바일)
- **주요 행동**: 링크로 견적서 확인, PDF 다운로드
- **특징**: 로그인 불필요, 링크만으로 접근

---

## 🛠️ 기술 스택

### 필수 기술

| 분류            | 기술                                   |
| --------------- | -------------------------------------- |
| **Framework**   | Next.js 15.5.3 (App Router)            |
| **Runtime**     | React 19 + TypeScript 5                |
| **Styling**     | TailwindCSS v4 + shadcn/ui (new-york)  |
| **API 연동**    | Notion API (`@notionhq/client`)        |
| **PDF 생성**    | html2pdf.js (클라이언트 사이드)        |
| **아이콘**      | Lucide React                           |
| **개발 도구**   | ESLint + Prettier + Husky + lint-staged |

### 환경 변수

```env
# Notion API
NOTION_API_KEY=secret_xxx
NOTION_QUOTES_DB_ID=xxx          # 견적서 데이터베이스 ID
NOTION_QUOTE_ITEMS_DB_ID=xxx     # 견적 항목 데이터베이스 ID

# 앱 설정
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

---

## 📊 데이터 구조

### Notion 데이터베이스 스키마

#### 견적서 (Quotes) 테이블

| 속성명             | 노션 타입    | 설명                                      |
| ------------------ | ------------ | ----------------------------------------- |
| `Quote Number`     | title        | 견적서 번호 (예: Q-2024-001)              |
| `UUID`             | rich_text    | 공개 링크용 고유 식별자                   |
| `Customer Name`    | rich_text    | 고객명/회사명                             |
| `Customer Email`   | email        | 고객 이메일                               |
| `Issue Date`       | date         | 발행일                                    |
| `Valid Until`      | date         | 유효기간                                  |
| `Status`           | select       | 상태 (작성중/발송완료/승인/거절)          |
| `Total Amount`     | rollup       | 총 금액 (Items의 Amount 합계)             |
| `Items`            | relation     | 견적 항목 (Quote Items 테이블 연결)       |
| `Notes`            | rich_text    | 비고/특이사항                             |
| `Company Name`     | rich_text    | 발행 회사명                               |
| `Company Address`  | rich_text    | 발행 회사 주소                            |
| `Company Contact`  | rich_text    | 발행 회사 연락처                          |

#### 견적 항목 (Quote Items) 테이블

| 속성명          | 노션 타입    | 설명                          |
| --------------- | ------------ | ----------------------------- |
| `Item Name`     | title        | 항목명                        |
| `Description`   | rich_text    | 항목 설명                     |
| `Unit Price`    | number       | 단가                          |
| `Quantity`      | number       | 수량                          |
| `Amount`        | formula      | 금액 (단가 × 수량)            |
| `Quote`         | relation     | 연결된 견적서                 |

### TypeScript 타입 정의

```typescript
// src/lib/types/quote.ts

// 견적서 상태
type QuoteStatus = '작성중' | '발송완료' | '승인' | '거절';

// 견적 항목
interface IQuoteItem {
  id: string;
  itemName: string;
  description: string;
  unitPrice: number;
  quantity: number;
  amount: number;
}

// 견적서
interface IQuote {
  id: string;
  uuid: string;
  quoteNumber: string;
  customerName: string;
  customerEmail: string;
  issueDate: string;
  validUntil: string;
  status: QuoteStatus;
  totalAmount: number;
  items: IQuoteItem[];
  notes: string;
  companyName: string;
  companyAddress: string;
  companyContact: string;
}
```

---

## 📱 MVP 기능 명세

### 1. 견적서 웹 뷰어 페이지

**경로**: `/quotes/[uuid]`

**기능**:

- UUID 기반 견적서 조회
- 견적서 정보 표시 (발행자 정보, 고객 정보, 항목 목록, 합계)
- 반응형 디자인 (모바일/데스크톱)
- 견적서 상태 표시 (배지)
- PDF 다운로드 버튼

**UI 구성**:

```
┌─────────────────────────────────────────┐
│  [회사 로고]            견적서          │
│                                         │
│  견적서 번호: Q-2024-001                │
│  발행일: 2024-01-15                     │
│  유효기간: 2024-02-15                   │
│  상태: [발송완료]                       │
├─────────────────────────────────────────┤
│  발행자 정보          │  고객 정보      │
│  회사명: ABC Corp     │  고객명: 홍길동 │
│  주소: 서울시...      │  이메일: ...    │
│  연락처: 02-xxx       │                 │
├─────────────────────────────────────────┤
│  항목    │ 설명   │ 단가  │ 수량 │ 금액 │
│  ────────┼────────┼───────┼──────┼───── │
│  상품A   │ 설명1  │ 10000 │  2   │20000 │
│  상품B   │ 설명2  │ 5000  │  3   │15000 │
├─────────────────────────────────────────┤
│                        합계: ₩35,000    │
├─────────────────────────────────────────┤
│  비고: 배송비 별도                      │
├─────────────────────────────────────────┤
│         [PDF 다운로드 버튼]             │
└─────────────────────────────────────────┘
```

### 2. PDF 다운로드 기능

**구현 방식**: html2pdf.js (클라이언트 사이드)

**기능**:

- 현재 페이지를 PDF로 변환
- 파일명: `견적서_Q-2024-001.pdf` 형식
- A4 크기, 세로 방향
- 다운로드 버튼 클릭 시 즉시 생성/다운로드

### 3. 에러 페이지

**404 페이지** (`/quotes/[uuid]` 존재하지 않는 경우):

- "견적서를 찾을 수 없습니다" 메시지
- 홈으로 돌아가기 링크

**만료된 견적서**:

- 유효기간이 지난 경우 "만료됨" 배지 표시
- 내용은 계속 표시 (다운로드 가능)

### 4. 홈페이지 (선택적)

**경로**: `/`

**기능**:

- 서비스 간단 소개
- "견적서 링크를 받으셨나요?" 안내 문구
- 또는 빈 페이지로 리다이렉트 처리

---

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── layout.tsx              # 루트 레이아웃
│   ├── page.tsx                # 홈페이지
│   ├── globals.css             # 전역 스타일
│   ├── quotes/
│   │   └── [uuid]/
│   │       ├── page.tsx        # 견적서 뷰어 페이지
│   │       ├── loading.tsx     # 로딩 UI
│   │       └── not-found.tsx   # 404 UI
│   └── api/                    # (필요시) API Routes
│       └── quotes/
│           └── [uuid]/
│               └── route.ts
├── components/
│   ├── ui/                     # shadcn/ui 컴포넌트
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── separator.tsx
│   │   └── table.tsx
│   ├── quote/                  # 견적서 관련 컴포넌트
│   │   ├── quote-header.tsx    # 견적서 헤더 (번호, 날짜, 상태)
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
│   └── constants.ts            # 상수 정의
└── hooks/
    └── use-pdf-download.ts     # PDF 다운로드 훅
```

---

## 🔄 데이터 흐름

### 견적서 조회 플로우

```
1. 클라이언트 → /quotes/[uuid] 접속
2. Next.js Server Component
   ├── Notion API 호출 (UUID로 견적서 조회)
   ├── 관련 항목 조회 (Relation)
   └── 데이터 변환 (Notion → TypeScript 타입)
3. 렌더링 → 클라이언트에 HTML 전송
4. 클라이언트 → PDF 다운로드 버튼 클릭
5. html2pdf.js → PDF 생성 및 다운로드
```

### Notion API 호출 구현

```typescript
// src/lib/notion/queries.ts
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

// UUID로 견적서 조회
export async function getQuoteByUUID(uuid: string): Promise<IQuote | null> {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_QUOTES_DB_ID!,
    filter: {
      property: 'UUID',
      rich_text: {
        equals: uuid,
      },
    },
  });

  if (response.results.length === 0) return null;

  const page = response.results[0];
  // 데이터 변환 로직...

  return transformedQuote;
}
```

---

## 🎨 UI/UX 가이드라인

### 디자인 원칙

1. **깔끔하고 전문적인 느낌**: 비즈니스 문서답게 심플한 디자인
2. **가독성 우선**: 명확한 정보 계층 구조
3. **인쇄 친화적**: PDF 출력 시에도 깔끔하게 보이도록

### 색상 팔레트

- **Primary**: slate (문서 느낌)
- **Accent**: blue (버튼, 링크)
- **Status 배지**:
  - 작성중: gray
  - 발송완료: blue
  - 승인: green
  - 거절: red
  - 만료: orange

### 반응형 브레이크포인트

- **모바일**: < 640px (세로 스택 레이아웃)
- **태블릿**: 640px ~ 1024px
- **데스크톱**: > 1024px (2컬럼 레이아웃)

---

## 🚀 개발 단계

### Phase 1: 기본 설정 (0.5일)

- [ ] 프로젝트 초기 설정 확인
- [ ] 필요한 패키지 설치 (`@notionhq/client`, `html2pdf.js`)
- [ ] 환경 변수 설정
- [ ] Notion 데이터베이스 생성 및 설정
- [ ] 타입 정의

### Phase 2: Notion API 연동 (0.5일)

- [ ] Notion 클라이언트 설정
- [ ] 견적서 조회 함수 구현
- [ ] 견적 항목 조회 함수 구현
- [ ] 데이터 변환 함수 구현

### Phase 3: UI 구현 (1일)

- [ ] shadcn/ui 컴포넌트 추가 (card, table, badge, separator)
- [ ] 견적서 뷰어 컴포넌트 구현
- [ ] 페이지 레이아웃 구현
- [ ] 반응형 디자인 적용
- [ ] 로딩/에러 상태 처리

### Phase 4: PDF 기능 (0.5일)

- [ ] html2pdf.js 연동
- [ ] PDF 다운로드 훅 구현
- [ ] 인쇄용 스타일 최적화

### Phase 5: 테스트 및 배포 (0.5일)

- [ ] 전체 플로우 테스트
- [ ] 모바일 테스트
- [ ] 배포 (Vercel)

---

## ⚠️ MVP 제약 사항

### 포함하지 않는 기능

1. **인증/로그인**: 링크 기반 접근만 지원
2. **관리자 페이지**: 노션에서 직접 관리
3. **견적서 생성/수정**: 노션에서만 가능
4. **이메일 발송**: 수동으로 링크 공유
5. **서명/승인 기능**: MVP에서 제외
6. **다국어 지원**: 한국어만 지원
7. **분석/통계**: MVP에서 제외

### 보안 고려사항

1. **UUID 기반 접근**: 추측 불가능한 UUID 사용
2. **Rate Limiting**: Notion API 제한 고려 (3 requests/second)
3. **환경 변수**: API 키 서버 사이드에서만 사용

---

## 📈 향후 확장 가능성

### v2.0 고려 기능

- 견적서 승인/거절 기능 (클라이언트 액션)
- 이메일 자동 발송
- 견적서 템플릿 다양화
- 조회 통계/분석
- 비밀번호 보호 옵션
- 다국어 지원

---

## ✅ 성공 기준

### MVP 완료 조건

1. UUID 링크로 견적서 페이지 접근 가능
2. 견적서 정보가 올바르게 표시됨
3. PDF 다운로드 기능 정상 동작
4. 모바일/데스크톱에서 정상 표시
5. 존재하지 않는 견적서 접근 시 404 표시

### 성능 목표

- 페이지 로딩: 3초 이내
- PDF 생성: 5초 이내
- Lighthouse 점수: 80점 이상

---

## 📝 참고 자료

- [Notion API 공식 문서](https://developers.notion.com/)
- [html2pdf.js 문서](https://github.com/eKoopmans/html2pdf.js)
- [Next.js 15 App Router 문서](https://nextjs.org/docs)
- [shadcn/ui 컴포넌트](https://ui.shadcn.com/)
