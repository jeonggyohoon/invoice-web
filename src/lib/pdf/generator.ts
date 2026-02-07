/**
 * PDF 생성 유틸리티
 * html2pdf.js를 사용하여 HTML 요소를 PDF로 변환합니다.
 */

// html2pdf.js 타입 정의
interface Html2PdfOptions {
  margin?: number | number[]
  filename?: string
  image?: { type?: string; quality?: number }
  html2canvas?: {
    scale?: number
    useCORS?: boolean
    logging?: boolean
    letterRendering?: boolean
    backgroundColor?: string
  }
  jsPDF?: {
    unit?: string
    format?: string | number[]
    orientation?: 'portrait' | 'landscape'
  }
  pagebreak?: { mode?: string | string[] }
}

interface Html2Pdf {
  set: (options: Html2PdfOptions) => Html2Pdf
  from: (element: HTMLElement) => Html2Pdf
  save: () => Promise<void>
  outputPdf: (type: 'blob' | 'dataurlstring') => Promise<Blob | string>
}

type Html2PdfFactory = () => Html2Pdf

// PDF용 색상 오버라이드 CSS
// TailwindCSS v4의 oklch/lab 색상을 hex로 대체
const PDF_COLOR_OVERRIDE_CSS = `
  :root {
    --background: #ffffff !important;
    --foreground: #1a1a1a !important;
    --card: #ffffff !important;
    --card-foreground: #1a1a1a !important;
    --popover: #ffffff !important;
    --popover-foreground: #1a1a1a !important;
    --primary: #333333 !important;
    --primary-foreground: #fafafa !important;
    --secondary: #f5f5f5 !important;
    --secondary-foreground: #333333 !important;
    --muted: #f5f5f5 !important;
    --muted-foreground: #737373 !important;
    --accent: #f5f5f5 !important;
    --accent-foreground: #333333 !important;
    --destructive: #dc2626 !important;
    --border: #e5e5e5 !important;
    --input: #e5e5e5 !important;
    --ring: #a3a3a3 !important;
    --chart-1: #f97316 !important;
    --chart-2: #14b8a6 !important;
    --chart-3: #3b82f6 !important;
    --chart-4: #eab308 !important;
    --chart-5: #f59e0b !important;
    --sidebar: #fafafa !important;
    --sidebar-foreground: #1a1a1a !important;
    --sidebar-primary: #333333 !important;
    --sidebar-primary-foreground: #fafafa !important;
    --sidebar-accent: #f5f5f5 !important;
    --sidebar-accent-foreground: #333333 !important;
    --sidebar-border: #e5e5e5 !important;
    --sidebar-ring: #a3a3a3 !important;
  }

  /* 모든 요소의 색상을 명시적으로 지정 */
  * {
    color: #1a1a1a !important;
    background-color: transparent !important;
    border-color: #e5e5e5 !important;
  }

  body, html {
    background-color: #ffffff !important;
  }

  table, th, td {
    border-color: #e5e5e5 !important;
  }

  th {
    background-color: #f5f5f5 !important;
  }
`

/**
 * PDF 생성을 위한 임시 스타일 태그를 추가합니다.
 * oklch/lab 색상 함수를 hex로 오버라이드합니다.
 */
function injectPdfStyles(): () => void {
  const styleElement = document.createElement('style')
  styleElement.id = 'pdf-color-override'
  styleElement.textContent = PDF_COLOR_OVERRIDE_CSS
  document.head.appendChild(styleElement)

  // 복원 함수 반환
  return () => {
    const element = document.getElementById('pdf-color-override')
    if (element) {
      element.remove()
    }
  }
}

// PDF 생성 기본 옵션
const DEFAULT_PDF_OPTIONS: Html2PdfOptions = {
  margin: 10,
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: {
    scale: 2, // 고품질 렌더링
    useCORS: true,
    logging: false,
    letterRendering: true,
    backgroundColor: '#ffffff',
  },
  jsPDF: {
    unit: 'mm',
    format: 'a4',
    orientation: 'portrait',
  },
  pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
}

/**
 * HTML 요소를 PDF로 변환하여 다운로드합니다.
 * @param element PDF로 변환할 HTML 요소
 * @param filename 저장할 파일명 (확장자 포함)
 * @param options 추가 PDF 옵션
 */
export async function generatePdf(
  element: HTMLElement,
  filename: string,
  options: Partial<Html2PdfOptions> = {}
): Promise<void> {
  // 클라이언트 사이드에서만 동작
  if (typeof window === 'undefined') {
    throw new Error('PDF 생성은 클라이언트에서만 가능합니다.')
  }

  // 다크모드인 경우 라이트모드로 임시 전환
  const htmlElement = document.documentElement
  const wasDark = htmlElement.classList.contains('dark')
  if (wasDark) {
    htmlElement.classList.remove('dark')
  }

  // oklch/lab 색상을 hex로 오버라이드하는 스타일 주입
  const removeStyles = injectPdfStyles()

  try {
    // 스타일 적용을 위한 짧은 대기
    await new Promise(resolve => setTimeout(resolve, 100))

    // html2pdf.js 동적 임포트
    const html2pdf = (await import('html2pdf.js')).default as Html2PdfFactory

    // 옵션 병합
    const mergedOptions: Html2PdfOptions = {
      ...DEFAULT_PDF_OPTIONS,
      ...options,
      filename,
      html2canvas: {
        ...DEFAULT_PDF_OPTIONS.html2canvas,
        ...options.html2canvas,
      },
      jsPDF: {
        ...DEFAULT_PDF_OPTIONS.jsPDF,
        ...options.jsPDF,
      },
    }

    // PDF 생성 및 저장
    await html2pdf().set(mergedOptions).from(element).save()
  } finally {
    // 스타일 제거
    removeStyles()

    // 다크모드 복원
    if (wasDark) {
      htmlElement.classList.add('dark')
    }
  }
}

/**
 * 견적서 PDF 파일명을 생성합니다.
 * @param quoteNumber 견적서 번호
 * @returns 파일명 (예: "견적서_QT-2024-001.pdf")
 */
export function generateQuotePdfFilename(quoteNumber: string): string {
  return `견적서_${quoteNumber}.pdf`
}
