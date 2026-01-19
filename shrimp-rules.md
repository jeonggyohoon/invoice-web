# Development Guidelines

## 프로젝트 개요

### 기술 스택

| 분류 | 기술 | 버전 |
|------|------|------|
| Framework | Next.js (App Router + Turbopack) | 15.5.3 |
| Runtime | React + TypeScript | 19.1.0 / 5 |
| Styling | TailwindCSS v4 + shadcn/ui (new-york) | v4 |
| API | Notion API (@notionhq/client) | ^2.3.0 |
| PDF | html2pdf.js (클라이언트 사이드) | ^0.10.2 |
| 품질 도구 | ESLint + Prettier + Husky + lint-staged | - |

### 핵심 기능

- UUID 기반 견적서 웹 뷰어 (`/quotes/[uuid]`)
- Notion 데이터베이스에서 견적서 데이터 조회
- 클라이언트 사이드 PDF 다운로드
- 반응형 디자인 (모바일/태블릿/데스크톱)

---

## 프로젝트 아키텍처

### 디렉토리 구조

```
src/
├── app/                    # App Router 페이지
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 홈페이지
│   ├── globals.css        # 전역 스타일
│   └── quotes/[uuid]/     # 견적서 뷰어 (핵심 경로)
│       ├── page.tsx
│       ├── loading.tsx
│       └── not-found.tsx
├── components/
│   ├── ui/                # shadcn/ui 기본 컴포넌트
│   ├── layout/            # 레이아웃 컴포넌트
│   ├── providers/         # Context 프로바이더
│   └── quote/             # 견적서 도메인 컴포넌트
│       ├── quote-header.tsx
│       ├── quote-parties.tsx
│       ├── quote-items.tsx
│       ├── quote-summary.tsx
│       └── quote-actions.tsx
└── lib/
    ├── notion/            # Notion API 연동
    │   ├── client.ts      # API 클라이언트
    │   ├── queries.ts     # 데이터 조회 함수
    │   └── transforms.ts  # 데이터 변환 함수
    ├── pdf/
    │   └── generator.ts   # PDF 생성 유틸리티
    ├── types/
    │   └── quote.ts       # 도메인 타입 정의
    ├── utils.ts           # 공통 유틸리티 (cn 함수)
    └── env.ts             # 환경변수 검증 (Zod)
```

### 모듈 분류 규칙

| 위치 | 용도 | 예시 |
|------|------|------|
| `src/app/` | 라우트 페이지만 | page.tsx, layout.tsx |
| `src/components/ui/` | shadcn/ui 컴포넌트 | button.tsx, card.tsx |
| `src/components/quote/` | 견적서 도메인 컴포넌트 | quote-header.tsx |
| `src/lib/notion/` | Notion API 관련 | client.ts, queries.ts |
| `src/lib/types/` | TypeScript 타입 정의 | quote.ts |

---

## 코드 규칙

### 네이밍 컨벤션

| 대상 | 규칙 | 예시 |
|------|------|------|
| 변수/함수 | camelCase | `userName`, `getQuoteByUUID` |
| 상수 | UPPER_SNAKE_CASE | `MAX_ITEMS`, `API_URL` |
| 인터페이스 | PascalCase + I 접두사 | `IQuote`, `IQuoteItem` |
| 타입 별칭 | PascalCase + T 접두사 | `TQuoteStatus`, `TResponse` |
| 컴포넌트 | PascalCase | `QuoteHeader`, `PDFButton` |
| 폴더 | kebab-case | `quote-items/`, `pdf-generator/` |
| 컴포넌트 파일 | kebab-case.tsx | `quote-header.tsx` |
| 유틸리티 파일 | camelCase.ts | `utils.ts`, `queries.ts` |

### 포맷팅 규칙

- **들여쓰기**: 2칸 스페이스
- **세미콜론**: 필수 사용
- **따옴표**: 작은따옴표 (`'`) 사용
- **후행 쉼표**: 필수 사용
- **최대 줄 길이**: 100자 권장

### 타입 시스템 규칙

```typescript
// ✅ 올바른 타입 정의
interface IQuote {
  id: string;
  uuid: string;
  quoteNumber: string;
  items: IQuoteItem[];
}

type TQuoteStatus = '작성중' | '발송완료' | '승인' | '거절';

// ❌ 금지
const data: any = fetchData(); // any 사용 금지
interface Quote {} // I 접두사 누락
```

### Import 순서

```typescript
// 1. 외부 라이브러리
import React from 'react';
import { Client } from '@notionhq/client';

// 2. 내부 모듈 (@/ 경로)
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { IQuote } from '@/lib/types/quote';

// 3. 상대 경로 (같은 폴더 내에서만)
import './styles.css';
```

---

## 기능 구현 규칙

### Notion API 연동

```typescript
// ✅ 서버 컴포넌트에서만 Notion API 호출
// src/app/quotes/[uuid]/page.tsx
export default async function QuotePage({ params }: Props) {
  const quote = await getQuoteByUUID(params.uuid);
  return <QuoteViewer quote={quote} />;
}

// ✅ 환경변수는 서버에서만 접근
// src/lib/notion/client.ts
const notion = new Client({ auth: process.env.NOTION_API_KEY });

// ❌ 클라이언트 컴포넌트에서 Notion API 직접 호출 금지
```

### PDF 생성

```typescript
// ✅ 클라이언트 컴포넌트에서 PDF 생성
'use client';

import html2pdf from 'html2pdf.js';

export function usePdfDownload() {
  const downloadPdf = (element: HTMLElement, filename: string) => {
    html2pdf().set({
      margin: 10,
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    }).from(element).save();
  };
  return { downloadPdf };
}
```

### 컴포넌트 패턴

```typescript
// ✅ 서버 컴포넌트 (기본)
export function QuoteHeader({ quote }: { quote: IQuote }) {
  return <div>{quote.quoteNumber}</div>;
}

// ✅ 클라이언트 컴포넌트 (상호작용 필요시)
'use client';

export function PDFDownloadButton({ quoteNumber }: Props) {
  const { downloadPdf } = usePdfDownload();
  return <Button onClick={() => downloadPdf(...)}>PDF 다운로드</Button>;
}
```

---

## UI/UX 규칙

### shadcn/ui 사용

```bash
# 새 컴포넌트 추가
npx shadcn@latest add button card table badge separator
```

```typescript
// ✅ shadcn/ui 컴포넌트 import
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

// ❌ 직접 Radix UI import 금지 (shadcn/ui 래퍼 사용)
import * as Dialog from '@radix-ui/react-dialog';
```

### TailwindCSS 스타일링

```typescript
// ✅ 유틸리티 클래스 사용
<div className="flex items-center gap-4 p-6 rounded-lg bg-card">

// ✅ cn() 함수로 조건부 스타일
<div className={cn('p-4', isActive && 'bg-primary', className)}>

// ❌ 인라인 스타일 금지
<div style={{ padding: '16px' }}>
```

### 반응형 브레이크포인트

| 크기 | 범위 | TailwindCSS |
|------|------|-------------|
| 모바일 | < 640px | 기본 (접두사 없음) |
| 태블릿 | 640px - 1024px | `sm:`, `md:` |
| 데스크톱 | > 1024px | `lg:`, `xl:` |

```typescript
// ✅ 모바일 우선 반응형
<div className="flex flex-col gap-4 md:flex-row md:gap-6 lg:gap-8">
```

### 상태 배지 색상

| 상태 | 색상 | variant |
|------|------|---------|
| 작성중 | gray | `secondary` |
| 발송완료 | blue | `default` |
| 승인 | green | `success` |
| 거절 | red | `destructive` |
| 만료 | orange | `warning` |

---

## 핵심 파일 상호작용 규칙

### 타입 수정 시

| 수정 파일 | 연관 파일 (동시 수정 필수) |
|-----------|---------------------------|
| `src/lib/types/quote.ts` | `src/lib/notion/transforms.ts` |
| `src/lib/types/quote.ts` | `src/components/quote/*.tsx` |
| `src/lib/env.ts` | `.env.local`, `.env.example` |

### 컴포넌트 추가 시

| 추가 위치 | 필수 작업 |
|-----------|-----------|
| `src/components/ui/` | `npx shadcn@latest add` 사용 |
| `src/components/quote/` | 타입 import 확인 |
| `src/app/quotes/[uuid]/` | loading.tsx, not-found.tsx 확인 |

### Notion 스키마 변경 시

1. `src/lib/types/quote.ts` 타입 수정
2. `src/lib/notion/transforms.ts` 변환 로직 수정
3. `src/lib/notion/queries.ts` 쿼리 필터 확인
4. 관련 컴포넌트 props 수정

---

## AI 의사결정 기준

### 컴포넌트 위치 결정

```
Q: 새 컴포넌트를 어디에 배치할까?
├── 견적서 관련? → src/components/quote/
├── 범용 UI? → src/components/ui/ (shadcn 추가)
├── 레이아웃? → src/components/layout/
└── 특정 페이지 전용? → 해당 페이지 폴더 내
```

### 서버 vs 클라이언트 컴포넌트

```
Q: 'use client' 필요한가?
├── Notion API 호출? → 서버 컴포넌트
├── useState/useEffect? → 클라이언트 컴포넌트
├── onClick/onChange? → 클라이언트 컴포넌트
├── PDF 생성? → 클라이언트 컴포넌트
└── 데이터 표시만? → 서버 컴포넌트 (기본)
```

### 에러 처리 방식

```
Q: 에러 처리 방식?
├── Notion API 실패? → notFound() 호출
├── 환경변수 누락? → 빌드 타임 에러 (Zod)
├── PDF 생성 실패? → toast 알림
└── 유효기간 만료? → 만료 배지 표시 (콘텐츠는 유지)
```

---

## 금지 사항

### 절대 금지

- **`any` 타입 사용 금지** - `unknown` 사용 후 타입 가드 적용
- **상대 경로 import 금지** - `@/` 경로 별칭 필수 사용
- **Notion API 키 클라이언트 노출 금지** - 서버 사이드에서만 사용
- **인라인 스타일 금지** - TailwindCSS 유틸리티 클래스 사용
- **console.log 커밋 금지** - 디버깅 후 제거

### 코드 품질 위반

- **`npm run check-all` 실패 상태로 커밋 금지**
- **300줄 초과 파일 생성 금지** - 분할 필요
- **I/T 접두사 없는 타입 정의 금지**
- **영어 주석/문서 작성 금지** - 한국어 필수

### 아키텍처 위반

- **클라이언트 컴포넌트에서 Notion API 직접 호출 금지**
- **`src/components/ui/` 직접 수정 금지** - shadcn CLI 사용
- **환경변수 하드코딩 금지** - `.env.local` 사용
- **node_modules 직접 수정 금지**

---

## 워크플로우 체크리스트

### 개발 시작 전

- [ ] `npm install` 의존성 설치
- [ ] `.env.local` 환경변수 설정
- [ ] `npm run dev` 개발 서버 실행

### 코드 작성 후

- [ ] `npm run typecheck` 타입 검사
- [ ] `npm run lint:fix` 린트 수정
- [ ] `npm run format` 코드 포맷팅

### 커밋 전

- [ ] `npm run check-all` 모든 검사 통과
- [ ] `npm run build` 빌드 성공 확인
- [ ] 한국어 커밋 메시지 작성

---

## 환경변수 목록

| 변수명 | 용도 | 필수 | 클라이언트 |
|--------|------|------|-----------|
| `NOTION_API_KEY` | Notion API 인증 키 | ✅ | ❌ |
| `NOTION_QUOTES_DB_ID` | 견적서 데이터베이스 ID | ✅ | ❌ |
| `NOTION_QUOTE_ITEMS_DB_ID` | 견적 항목 데이터베이스 ID | ✅ | ❌ |
| `NEXT_PUBLIC_APP_URL` | 앱 공개 URL | ❌ | ✅ |
