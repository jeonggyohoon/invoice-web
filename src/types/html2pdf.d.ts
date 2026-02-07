/**
 * html2pdf.js 타입 선언
 * @see https://github.com/eKoopmans/html2pdf.js
 */
declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | number[];
    filename?: string;
    image?: { type?: string; quality?: number };
    html2canvas?: {
      scale?: number;
      useCORS?: boolean;
      logging?: boolean;
      letterRendering?: boolean;
      backgroundColor?: string;
    };
    jsPDF?: {
      unit?: string;
      format?: string | number[];
      orientation?: 'portrait' | 'landscape';
    };
    pagebreak?: { mode?: string | string[] };
  }

  interface Html2Pdf {
    set: (options: Html2PdfOptions) => Html2Pdf;
    from: (element: HTMLElement) => Html2Pdf;
    save: () => Promise<void>;
    outputPdf: (type: 'blob' | 'dataurlstring') => Promise<Blob | string>;
  }

  type Html2PdfFactory = () => Html2Pdf;

  const html2pdf: Html2PdfFactory;
  export default html2pdf;
}
