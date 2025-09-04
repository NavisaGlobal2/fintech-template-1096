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
    // Temporarily set print styles for better PDF rendering
    const originalStyles = element.style.cssText;
    element.style.fontFamily = 'serif';
    element.style.fontSize = '12px';
    element.style.lineHeight = '1.6';
    element.style.color = '#000000';
    element.style.background = '#ffffff';

    const canvas = await html2canvas(element, {
      scale: options.quality || 3, // Higher quality for legal documents
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      logging: false
    });

    // Restore original styles
    element.style.cssText = originalStyles;

    return canvas;
  }

  static async generateFromElement(
    element: HTMLElement, 
    options: DocumentGenerationOptions = {}
  ): Promise<jsPDF> {
    const canvas = await this.captureElement(element, options);
    
    const imgData = canvas.toDataURL('image/png', 1.0); // Full quality
    const pdf = new jsPDF({
      orientation: options.orientation || 'portrait',
      unit: 'mm',
      format: options.format || 'a4',
      compress: false // Don't compress for legal documents
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    // Calculate scaling to fit on pages with proper margins
    const margin = 10; // 10mm margin
    const availableWidth = pdfWidth - (2 * margin);
    const availableHeight = pdfHeight - (2 * margin);
    
    const widthRatio = availableWidth / (imgWidth * 0.264583); // Convert pixels to mm
    const heightRatio = availableHeight / (imgHeight * 0.264583);
    const ratio = Math.min(widthRatio, heightRatio);
    
    const finalWidth = (imgWidth * 0.264583) * ratio;
    const finalHeight = (imgHeight * 0.264583) * ratio;
    
    const imgX = (pdfWidth - finalWidth) / 2;
    const imgY = margin;

    // Handle multi-page documents
    const pageHeight = pdfHeight - (2 * margin);
    let currentY = imgY;
    let remainingHeight = finalHeight;
    let sourceY = 0;

    while (remainingHeight > 0) {
      const currentPageHeight = Math.min(remainingHeight, pageHeight);
      const sourceHeight = (currentPageHeight / finalHeight) * imgHeight;
      
      // Create a temporary canvas for this page section
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = imgWidth;
      pageCanvas.height = sourceHeight;
      const pageCtx = pageCanvas.getContext('2d');
      
      if (pageCtx) {
        pageCtx.drawImage(canvas, 0, sourceY, imgWidth, sourceHeight, 0, 0, imgWidth, sourceHeight);
        const pageImgData = pageCanvas.toDataURL('image/png', 1.0);
        
        if (sourceY > 0) {
          pdf.addPage();
        }
        
        pdf.addImage(pageImgData, 'PNG', imgX, currentY, finalWidth, currentPageHeight);
      }
      
      sourceY += sourceHeight;
      remainingHeight -= currentPageHeight;
      currentY = margin; // Reset Y for new pages
    }
    
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

  static async generateLegalContract(
    element: HTMLElement,
    contractData: {
      contractId: string;
      contractType: string;
      borrowerName?: string;
      loanAmount: number;
    },
    options: DocumentGenerationOptions = {}
  ): Promise<void> {
    const filename = options.filename || 
      `legal-contract-${contractData.contractType}-${contractData.contractId.slice(0, 8)}.pdf`;
    
    await this.downloadFromElement(element, {
      ...options,
      filename,
      format: 'a4',
      orientation: 'portrait',
      quality: 3 // Maximum quality for legal documents
    });
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