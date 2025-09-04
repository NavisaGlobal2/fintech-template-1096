import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface DocumentGenerationOptions {
  filename?: string;
  format?: 'a4' | 'letter';
  orientation?: 'portrait' | 'landscape';
  quality?: number;
}

export class PDFGenerator {
  private static async captureElement(element: HTMLElement, options: DocumentGenerationOptions = {}) {
    const canvas = await html2canvas(element, {
      scale: options.quality || 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    });

    return canvas;
  }

  static async generateFromElement(
    element: HTMLElement, 
    options: DocumentGenerationOptions = {}
  ): Promise<jsPDF> {
    const canvas = await this.captureElement(element, options);
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: options.orientation || 'portrait',
      unit: 'mm',
      format: options.format || 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 0;

    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    
    return pdf;
  }

  static async downloadFromElement(
    element: HTMLElement, 
    options: DocumentGenerationOptions = {}
  ): Promise<void> {
    const pdf = await this.generateFromElement(element, options);
    const filename = options.filename || `document-${Date.now()}.pdf`;
    pdf.save(filename);
  }

  static async generateOfferDocument(
    element: HTMLElement,
    offerData: {
      loanAmount: number;
      offerType: string;
      borrowerName?: string;
      offerId: string;
    },
    options: DocumentGenerationOptions = {}
  ): Promise<void> {
    const filename = options.filename || 
      `loan-offer-${offerData.offerType}-${offerData.offerId.slice(0, 8)}.pdf`;
    
    await this.downloadFromElement(element, {
      ...options,
      filename,
      format: 'a4',
      orientation: 'portrait'
    });
  }
}